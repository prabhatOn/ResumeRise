import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { analyzeResume } from "@/lib/resume-analyzer"
import { extractTextFromFile } from "@/lib/file-parser"
import { validateFileUpload, schemas } from "@/lib/security"
import { log } from "@/lib/logger"
import { globalRateLimiter } from "@/lib/monitoring"
import type { Session } from "next-auth"

export async function POST(request: Request) {
  const startTime = Date.now()
  
  // Declare session with explicit type
  let session: Session | null = null
  
  try {
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const isRateLimited = globalRateLimiter.isRateLimited(clientIP)
    if (isRateLimited) {
      log.warn('Resume upload rate limited', {
        clientIP,
        error: 'Rate limit exceeded'
      })
      return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
    }

    session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      log.warn('Resume upload unauthorized', {
        error: 'No valid session'
      })
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)
    const formData = await request.formData()

    const title = formData.get("title") as string
    const resumeFile = formData.get("resumeFile") as File
    const jobDescription = formData.get("jobDescription") as string

    // Input validation using schema
    const validationResult = schemas.resumeUpload.safeParse({
      title,
      resumeFile,
      jobDescription: jobDescription || undefined,
    })

    if (!validationResult.success) {
      log.warn('Resume upload validation failed', {
        userId: userId.toString(),
        error: 'Invalid input data',
        errors: validationResult.error?.errors
      })
      return NextResponse.json(
        { message: "Invalid input data", errors: validationResult.error?.errors },
        { status: 400 }
      )
    }

    if (!resumeFile) {
      log.warn('Resume upload failed - no file provided', {
        userId: userId.toString(),
        error: 'No file provided'
      })
      return NextResponse.json({ message: "Resume file is required" }, { status: 400 })
    }

    // File security validation
    const fileValidation = await validateFileUpload(resumeFile)
    if (!fileValidation.valid) {
      log.warn('Resume upload failed - invalid file', {
        userId: userId.toString(),
        error: fileValidation.error,
        fileName: resumeFile.name,
        fileType: resumeFile.type,
        fileSize: resumeFile.size
      })
      return NextResponse.json({ message: fileValidation.error }, { status: 400 })
    }

    log.info('Resume upload started', {
      userId: userId.toString(),
      action: 'resume_upload_started',
      fileName: resumeFile.name,
      fileType: resumeFile.type,
      fileSize: resumeFile.size,
      title
    })

    // Extract text from file using our advanced parser
    const extractionStartTime = Date.now()
    const resumeContent = await extractTextFromFile(resumeFile)
    log.performance('text_extraction', Date.now() - extractionStartTime, {
      fileName: resumeFile.name,
      fileType: resumeFile.type,
      contentLength: resumeContent.length
    })

    // Create resume in database
    const resume = await prisma.resume.create({
      data: {
        userId,
        title,
        content: resumeContent,
        fileName: resumeFile.name,
        fileType: resumeFile.type,
      },
    })

    // TODO: Log file upload to audit trail after Prisma client regeneration
    // await prisma.fileUpload.create({
    //   data: {
    //     userId,
    //     fileName: resumeFile.name,
    //     fileType: resumeFile.type,
    //     fileSize: resumeFile.size,
    //     status: 'processed',
    //     resumeId: resume.id
    //   }
    // })

    log.databaseOperation('resume_created', 'resume', {
      resumeId: resume.id,
      userId,
      title
    })

    // Create job description if provided
    let jobDescriptionId: number | undefined
    if (jobDescription) {
      const jobDescObj = await prisma.jobDescription.create({
        data: {
          userId,
          title: `Job Description for ${title}`,
          content: jobDescription,
        },
      })
      jobDescriptionId = jobDescObj.id
    }

    // Analyze resume with our enhanced analyzer, passing file type and name
    const analysisStartTime = Date.now()
    const analysisResult = await analyzeResume(resumeContent, jobDescription, resumeFile.type, resumeFile.name)
    const analysisTime = Date.now() - analysisStartTime
    
    log.performance('resume_analysis', analysisTime, {
      resumeId: resume.id,
      atsScore: analysisResult.atsScore,
      totalScore: analysisResult.totalScore,
      contentLength: resumeContent.length
    })

    // Create analysis in database with new industry fields
    const analysis = await prisma.analysis.create({
      data: {
        resumeId: resume.id,
        jobDescriptionId,
        atsScore: analysisResult.atsScore,
        keywordScore: analysisResult.keywordScore,
        grammarScore: analysisResult.grammarScore,
        formattingScore: analysisResult.formattingScore,
        sectionScore: analysisResult.sectionScore,
        actionVerbScore: analysisResult.actionVerbScore,
        relevanceScore: analysisResult.relevanceScore,
        bulletPointScore: analysisResult.bulletPointScore,
        languageToneScore: analysisResult.languageToneScore,
        lengthScore: analysisResult.lengthScore,
        totalScore: analysisResult.totalScore,
        // Store industry data, ATS details, and comprehensive analysis as JSON in suggestions field
        // In a real implementation, you would add these fields to the database schema
        suggestions: JSON.stringify({
          general: analysisResult.suggestions,
          suggestionList: analysisResult.suggestionList,
          aiSuggestions: analysisResult.aiSuggestions,
          aiScore: analysisResult.aiScore,
          industry: analysisResult.industry,
          industryScore: analysisResult.industryScore,
          industryRecommendations: analysisResult.industryRecommendations,
          atsDetails: analysisResult.atsDetails,
          comprehensiveAnalysis: analysisResult.comprehensiveAnalysis,
        }),
      },
    })

    // Create keywords using the enhanced processor
    if (analysisResult.keywords && analysisResult.keywords.length > 0) {
      await prisma.keyword.createMany({
        data: analysisResult.keywords.map((keyword) => ({
          analysisId: analysis.id,
          keyword: keyword.text,
          normalizedKeyword: keyword.text.toLowerCase().trim(),
          count: keyword.count,
          isFromJobDescription: keyword.isFromJobDescription,
          isMatch: keyword.isMatch,
          category: keyword.category || 'general',
          importance: keyword.importance || 1,
          source: keyword.source || 'resume',
        })),
        skipDuplicates: true, // Skip duplicates instead of failing
      })
    }

    // Create sections
    if (analysisResult.sections && analysisResult.sections.length > 0) {
      await prisma.section.createMany({
        data: analysisResult.sections.map((section) => ({
          analysisId: analysis.id,
          name: section.name,
          content: section.content,
          score: section.score,
          suggestions: section.suggestions,
        })),
      })
    }

    // Create issues
    if (analysisResult.issues && analysisResult.issues.length > 0) {
      await prisma.issue.createMany({
        data: analysisResult.issues.map((issue) => ({
          analysisId: analysis.id,
          category: issue.category,
          severity: issue.severity,
          description: issue.description,
          lineNumber: issue.lineNumber,
          suggestion: issue.suggestion,
        })),
      })
    }

    const totalTime = Date.now() - startTime
    
    log.info('Resume upload completed', {
      userId: userId.toString(),
      action: 'resume_upload_completed',
      resumeId: resume.id,
      analysisId: analysis.id,
      atsScore: analysisResult.atsScore,
      totalScore: analysisResult.totalScore,
      processingTime: totalTime
    })

    log.performance('total_upload_process', totalTime, {
      resumeId: resume.id,
      userId
    })

    return NextResponse.json(
      {
        resumeId: resume.id,
        analysisId: analysis.id,
        message: "Resume uploaded and analyzed successfully"
      },
      { status: 201 },
    )
  } catch (error) {
    const totalTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    log.error('Resume upload failed', {
      message: errorMessage,
      userId: session?.user?.id || 'unknown',
      processingTime: totalTime,
      stack: error instanceof Error ? error.stack : undefined
    })

    // Log error to database if we have a user session
    if (session?.user?.id) {
      // TODO: Add this after Prisma client regeneration
      // try {
      //   await prisma.errorLog.create({
      //     data: {
      //       userId: Number.parseInt(session.user.id),
      //       errorType: 'resume_upload_error',
      //       errorMessage,
      //       errorDetails: JSON.stringify({
      //         processingTime: totalTime,
      //         stack: error instanceof Error ? error.stack : undefined
      //       }),
      //       severity: 'high'
      //     }
      //   })
      // } catch (dbError) {
      //   log.error('Failed to log error to database', {
      //     message: 'Database error logging failed',
      //     originalError: errorMessage,
      //     dbError: dbError instanceof Error ? dbError.message : 'Unknown DB error'
      //   })
      // }
    }

    return NextResponse.json(
      { 
        message: "Failed to process resume upload",
        error: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
      }, 
      { status: 500 }
    )
  }
}

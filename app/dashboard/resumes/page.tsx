import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import ResumesPageClient from "./client"

export default async function ResumesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  try {
    // Fetch resumes with basic data first
    const rawResumes = await prisma.resume.findMany({
      where: {
        userId: Number.parseInt(session.user.id),
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Fetch analyses separately to avoid type issues
    const resumesWithAnalyses = await Promise.all(
      rawResumes.map(async (resume) => {
        const analyses = await prisma.analysis.findMany({
          where: {
            resumeId: resume.id
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        })

        return {
          id: resume.id,
          title: resume.title,
          fileType: resume.fileType,
          content: resume.content, // Include content for AI analysis
          createdAt: resume.createdAt,
          analyses: analyses.map(analysis => ({
            totalScore: analysis.totalScore || 0,
            atsScore: analysis.atsScore,
            keywordScore: analysis.keywordScore,
            formattingScore: analysis.formattingScore,
            sectionScore: analysis.sectionScore,
            suggestions: analysis.suggestions,
            createdAt: analysis.createdAt
          }))
        }
      })
    )

    return <ResumesPageClient resumes={resumesWithAnalyses} />
  } catch {
    // Return client component with empty data if there's an error
    return <ResumesPageClient resumes={[]} />
  }
}

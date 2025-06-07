import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { log } from "@/lib/logger"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d'
    
    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get user's resume analytics
    const [
      totalResumes,
      totalAnalyses,
      averageAtsScore,
      recentUploads,
      scoreDistribution,
      industryBreakdown,
      improvementTrends
    ] = await Promise.all([
      // Total resumes count
      prisma.resume.count({
        where: { userId, createdAt: { gte: startDate } }
      }),
      
      // Total analyses count
      prisma.analysis.count({
        where: { 
          resume: { userId },
          createdAt: { gte: startDate }
        }
      }),
      
      // Average ATS score
      prisma.analysis.aggregate({
        where: { 
          resume: { userId },
          createdAt: { gte: startDate }
        },
        _avg: { atsScore: true, totalScore: true }
      }),
      
      // Recent uploads with analysis
      prisma.resume.findMany({
        where: { userId, createdAt: { gte: startDate } },
        include: {
          analyses: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      
      // Score distribution
      prisma.analysis.groupBy({
        by: ['atsScore'],
        where: { 
          resume: { userId },
          createdAt: { gte: startDate }
        },
        _count: true
      }),
      
      // Industry breakdown
      prisma.analysis.groupBy({
        by: ['suggestions'],
        where: { 
          resume: { userId },
          createdAt: { gte: startDate }
        },
        _count: true
      }),
      
      // Improvement trends (comparing first vs last analysis for each resume)
      prisma.resume.findMany({
        where: { 
          userId,
          createdAt: { gte: startDate },
          analyses: { some: {} }
        },
        include: {
          analyses: {
            orderBy: { createdAt: 'asc' },
            select: {
              atsScore: true,
              totalScore: true,
              createdAt: true
            }
          }
        }
      })
    ])    // Process improvement trends
    const improvements = improvementTrends.map(resume => {
      const analyses = resume.analyses
      if (analyses.length < 2) return null
      
      const first = analyses[0]
      const last = analyses[analyses.length - 1]
      
      return {
        resumeId: resume.id,
        title: resume.title,
        atsImprovement: (last.atsScore || 0) - (first.atsScore || 0),
        totalImprovement: (last.totalScore || 0) - (first.totalScore || 0),
        analysisCount: analyses.length
      }
    }).filter(Boolean)

    // Process score distribution for chart data
    const scoreRanges = [
      { label: '0-20', min: 0, max: 20, count: 0 },
      { label: '21-40', min: 21, max: 40, count: 0 },
      { label: '41-60', min: 41, max: 60, count: 0 },
      { label: '61-80', min: 61, max: 80, count: 0 },
      { label: '81-100', min: 81, max: 100, count: 0 }
    ]

    scoreDistribution.forEach(item => {
      const score = item.atsScore || 0
      const range = scoreRanges.find(r => score >= r.min && score <= r.max)
      if (range) {
        range.count += item._count
      }
    })

    // Extract industry data from suggestions JSON
    const industries: { [key: string]: number } = {}
    industryBreakdown.forEach(item => {
      try {
        const suggestions = JSON.parse(item.suggestions || '{}')
        const industry = suggestions.industry || 'Unknown'
        industries[industry] = (industries[industry] || 0) + item._count
      } catch (error) {
        industries['Unknown'] = (industries['Unknown'] || 0) + item._count
      }
    })

    const analytics = {
      summary: {
        totalResumes,
        totalAnalyses,
        averageAtsScore: Math.round(averageAtsScore._avg.atsScore || 0),
        averageTotalScore: Math.round(averageAtsScore._avg.totalScore || 0),
        timeframe
      },
      recentActivity: recentUploads.map(resume => ({
        id: resume.id,
        title: resume.title,
        fileName: resume.fileName,
        uploadedAt: resume.createdAt,
        atsScore: resume.analyses[0]?.atsScore || null,
        totalScore: resume.analyses[0]?.totalScore || null
      })),
      charts: {
        scoreDistribution: scoreRanges,
        industryBreakdown: Object.entries(industries).map(([industry, count]) => ({
          industry,
          count
        })),
        improvements: improvements.slice(0, 10) // Top 10 improvements
      },      insights: {
        bestPerformingResume: recentUploads.length > 0 
          ? recentUploads.reduce((best, current) => {
              const currentScore = current.analyses[0]?.atsScore || 0
              const bestScore = best?.analyses[0]?.atsScore || 0
              return currentScore > bestScore ? current : best
            })
          : null,
        averageImprovementPerIteration: improvements.length > 0 
          ? Math.round(improvements.reduce((sum, imp) => sum + (imp?.atsImprovement || 0), 0) / improvements.length)
          : 0,
        mostCommonIssues: [] // TODO: Extract from issues when available
      }
    }    // Log user activity using the correct logger method
    log.info('User viewed analytics', {
      userId: userId.toString(),
      action: 'analytics_viewed',
      timeframe,
      totalResumes,
      totalAnalyses
    })

    return NextResponse.json(analytics)  } catch (error) {
    const session = await getServerSession(authOptions)
    log.error('Failed to fetch analytics', {
      message: error instanceof Error ? error.message : 'Unknown error',
      userId: session?.user?.id || 'unknown'
    })
    
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}

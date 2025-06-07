import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ModernDashboardOverview } from "@/components/modern-dashboard-overview"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const userId = Number.parseInt(session.user.id)

  // Get resume count
  const resumeCount = await prisma.resume.count({
    where: {
      userId,
    },
  })

  // Get analysis count
  const analysisCount = await prisma.analysis.count({
    where: {
      resume: {
        userId,
      },
    },
  })

  // Get latest resumes
  const latestResumes = await prisma.resume.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      analyses: {
        select: {
          totalScore: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  })

  // Calculate average score
  const totalScores = latestResumes
    .filter(resume => resume.analyses.length > 0 && resume.analyses[0].totalScore)
    .map(resume => resume.analyses[0].totalScore as number)
  
  const averageScore = totalScores.length > 0 
    ? Math.round(totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length)
    : 0

  const dashboardData = {
    user: {
      name: session.user.name || "User",
      email: session.user.email || "",
    },
    stats: {
      resumeCount,
      analysisCount,
      averageScore,
      lastUpload: latestResumes.length > 0 ? latestResumes[0].createdAt : null,
    },
    recentResumes: latestResumes.map(resume => ({
      id: resume.id,
      title: resume.title,
      createdAt: resume.createdAt,
      score: resume.analyses.length > 0 ? resume.analyses[0].totalScore : null,
    })),
  }

  return <ModernDashboardOverview data={dashboardData} />
}

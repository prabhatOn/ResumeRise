import type { Metadata } from "next"
import { prisma } from "@/lib/db"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // This is a protected route, so we don't need to worry about SEO
  // But we'll still set proper metadata for browser tabs
  try {
    const resumeId = Number.parseInt(params.id)
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      select: { title: true },
    })

    return {
      title: resume ? `${resume.title} - Resume Analysis` : "Resume Analysis",
      description: "Detailed analysis of your resume with ATS compatibility score and improvement suggestions.",
      robots: {
        index: false,
        follow: false,
      },
    }
  } catch (error) {
    return {
      title: "Resume Analysis",
      description: "Detailed analysis of your resume with ATS compatibility score and improvement suggestions.",
      robots: {
        index: false,
        follow: false,
      },
    }
  }
}

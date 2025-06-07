import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)
    const resolvedParams = await context.params
    const resumeId = Number.parseInt(resolvedParams.id)

    // Check if the resume ID is valid
    if (isNaN(resumeId)) {
      return NextResponse.json({ message: "Invalid resume ID" }, { status: 400 })
    }

    // Get resume with its analyses and related data
    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
        userId, // Ensure user can only access their own resumes
      },
      include: {
        analyses: {
          include: {
            keywords: true,
            sections: true,
            issues: true,
            jobDescription: {
              select: {
                content: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!resume) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 })
    }    return NextResponse.json(resume, { status: 200 })
  } catch {
    // Log error for debugging purposes
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)
    const resolvedParams = await context.params
    const resumeId = Number.parseInt(resolvedParams.id)

    // Check if the resume ID is valid
    if (isNaN(resumeId)) {
      return NextResponse.json({ message: "Invalid resume ID" }, { status: 400 })
    }

    // Check if resume exists and belongs to user
    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
        userId,
      },
    })

    if (!resume) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 })
    }

    // Delete resume (cascade will delete analyses, keywords, sections, issues)
    await prisma.resume.delete({
      where: {
        id: resumeId,
      },
    })

    return NextResponse.json({ message: "Resume deleted successfully" }, { status: 200 })  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Resume deletion error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

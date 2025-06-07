import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)
    const resolvedParams = await params
    const resumeId = Number.parseInt(resolvedParams.id)

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

    return NextResponse.json({ message: "Resume deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Resume deletion error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

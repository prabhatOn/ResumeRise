import { NextResponse } from "next/server"
import { analyzeResumeWithPuterAI } from "@/lib/puter-ai-analyzer"
import { analyzeResume } from "@/lib/resume-analyzer"

export async function POST(request: Request) {
  try {
    const { resumeContent, jobDescription, analysisType } = await request.json()
    if (!resumeContent) {
      return NextResponse.json({ error: "Missing resume content" }, { status: 400 })
    }

    // If only AI suggestions are needed
    if (analysisType === "ai" || analysisType === "realtime") {
      const aiResult = await analyzeResumeWithPuterAI(resumeContent, jobDescription)
      return NextResponse.json({ result: aiResult })
    }

    // Full analysis (includes AI-powered fields)
    const result = await analyzeResume(resumeContent, jobDescription)
    return NextResponse.json({ result })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Unknown error" }, { status: 500 })
  }
}

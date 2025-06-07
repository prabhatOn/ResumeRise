"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertCircle, FileText, BarChart2, Briefcase, Target, CheckCircle, XCircle, Sparkles } from "lucide-react"
import { ModernResumeCharts } from "@/components/modern-resume-charts"
import { ModernResumeHeatmap } from "@/components/modern-resume-heatmap"
import { AISuggestions } from "@/components/ai-suggestions"
import { motion } from "framer-motion"

interface ResumeData {
  id: number
  title: string
  content: string
  analyses: Array<{
    id: number
    totalScore: number | null
    atsScore: number | null
    keywordScore: number | null
    grammarScore: number | null
    formattingScore: number | null
    sectionScore: number | null
    actionVerbScore: number | null
    relevanceScore: number | null
    bulletPointScore: number | null
    languageToneScore: number | null
    lengthScore: number | null
    suggestions: string | null
    createdAt: string
    keywords: Array<{
      id: number
      keyword: string
      count: number
      isMatch: boolean
      isFromJobDescription: boolean
    }>
    sections: Array<{
      id: number
      name: string
      score: number | null
      suggestions: string | null
    }>
    issues: Array<{
      id: number
      description: string
      severity: "high" | "medium" | "low"
      suggestion: string | null
    }>
    jobDescription: {
      content: string
    } | null
  }>
}

export default function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    // Resolve the params promise
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (!resolvedParams?.id) return

    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resumes/${resolvedParams.id}`)
        if (!response.ok) {
          throw new Error('Resume not found')
        }
        const data = await response.json()
        setResume(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchResume()
  }, [resolvedParams?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading resume analysis...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Resume Not Found</h1>
          <p className="text-slate-300 mb-4">{error || 'The requested resume could not be found.'}</p>
          <Link href="/dashboard/resumes">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Back to Resumes</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const analysis = resume.analyses[0]

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex flex-col gap-6 py-6 px-4 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Link href="/dashboard/resumes">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800/50">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              {resume.title}
            </h1>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8"
          >
            <div className="flex h-[300px] flex-col items-center justify-center">
              <AlertCircle className="h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No analysis available for this resume</h3>
              <p className="text-slate-300 mb-6 text-center">Upload and analyze your resume to get comprehensive insights and recommendations.</p>
              <Link href="/dashboard/upload">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Analyze Resume
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Parse industry data from suggestions JSON
  let industryData = {
    industry: "general",
    industryScore: 0,
    industryRecommendations: [] as string[],
    atsDetails: null as Record<string, unknown> | null,
    comprehensiveAnalysis: null as Record<string, unknown> | null,
  }

  try {
    if (analysis.suggestions && analysis.suggestions.startsWith("{")) {
      const parsedData = JSON.parse(analysis.suggestions)
      industryData = {
        industry: parsedData.industry || "general",
        industryScore: parsedData.industryScore || 0,
        industryRecommendations: parsedData.industryRecommendations || [],
        atsDetails: parsedData.atsDetails || null,
        comprehensiveAnalysis: parsedData.comprehensiveAnalysis || null,
      }
    }
  } catch {
    // Error parsing industry data - use defaults
  }

  // Group keywords by match status
  const matchedKeywords = analysis.keywords.filter((k) => k.isMatch)
  const missingKeywords = analysis.keywords.filter((k) => k.isFromJobDescription && !k.isMatch)
  const otherKeywords = analysis.keywords.filter((k) => !k.isFromJobDescription && !k.isMatch)

  // Group issues by severity
  const highIssues = analysis.issues.filter((i) => i.severity === "high")
  const mediumIssues = analysis.issues.filter((i) => i.severity === "medium")
  const lowIssues = analysis.issues.filter((i) => i.severity === "low")

  // Create section heatmap data
  const sectionHeatmap = analysis.sections.map((section) => ({
    name: section.name,
    score: section.score || 0,
    weight:
      industryData.industry === "tech" && (section.name === "skills" || section.name === "projects")
        ? 2
        : industryData.industry === "finance" && (section.name === "experience" || section.name === "education")
          ? 2
          : industryData.industry === "healthcare" &&
              (section.name === "education" || section.name === "certifications")
            ? 2
            : 1,
  }))

  // Render AI suggestions above the rest of the analysis
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/resumes">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{resume.title}</h1>
              <p className="text-blue-300">AI-Powered Resume Analysis</p>
            </div>
          </div>
          <Link href="/dashboard/upload">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Upload New Resume
            </Button>
          </Link>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-2xl">
          <Tabs defaultValue="ai-suggestions" className="w-full">
            <TabsList className="flex flex-wrap gap-2 justify-center mb-6 bg-gray-900/80 p-2 rounded-lg border border-gray-700">
              <TabsTrigger value="ai-suggestions" className="text-gray-300 hover:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" /> AI Suggestions
              </TabsTrigger>
              <TabsTrigger value="visualizations" className="text-gray-300 hover:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-4 py-2">
                <BarChart2 className="h-4 w-4 mr-2" /> Charts
              </TabsTrigger>
              <TabsTrigger value="keywords" className="text-gray-300 hover:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-4 py-2">
                <Target className="h-4 w-4 mr-2" /> Keywords
              </TabsTrigger>
              <TabsTrigger value="sections" className="text-gray-300 hover:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-4 py-2">
                <Briefcase className="h-4 w-4 mr-2" /> Sections
              </TabsTrigger>
              <TabsTrigger value="issues" className="text-gray-300 hover:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-4 py-2">
                <AlertCircle className="h-4 w-4 mr-2" /> Issues
              </TabsTrigger>
              <TabsTrigger value="content" className="text-gray-300 hover:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-4 py-2">
                <FileText className="h-4 w-4 mr-2" /> Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-suggestions" className="mt-4 space-y-6">
              <AISuggestions 
                analysis={{
                  totalScore: analysis.totalScore || 0,
                  atsScore: analysis.atsScore,
                  keywordScore: analysis.keywordScore,
                  grammarScore: analysis.grammarScore,
                  formattingScore: analysis.formattingScore,
                  sectionScore: analysis.sectionScore,
                  actionVerbScore: analysis.actionVerbScore,
                  bulletPointScore: analysis.bulletPointScore,
                  languageToneScore: analysis.languageToneScore,
                  suggestions: analysis.suggestions
                }}
                showDetailed={true}
              />
            </TabsContent>

            <TabsContent value="visualizations" className="mt-4 space-y-4">
              <ModernResumeCharts
                scores={{
                  atsScore: analysis.atsScore || 0,
                  keywordScore: analysis.keywordScore || 0,
                  grammarScore: analysis.grammarScore || 0,
                  formattingScore: analysis.formattingScore || 0,
                  sectionScore: analysis.sectionScore || 0,
                  actionVerbScore: analysis.actionVerbScore || 0,
                  relevanceScore: analysis.relevanceScore || 0,
                  bulletPointScore: analysis.bulletPointScore || 0,
                  languageToneScore: analysis.languageToneScore || 0,
                  lengthScore: analysis.lengthScore || 0,
                  industryScore: industryData.industryScore,
                }}
                industry={industryData.industry}
              />

              <ModernResumeHeatmap sections={sectionHeatmap} industry={industryData.industry} />
            </TabsContent>

            <TabsContent value="keywords" className="mt-4 space-y-6">
              <div className="bg-slate-800/60 rounded-lg p-6 border border-slate-600/50">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">Keyword Analysis</h3>
                  <p className="text-slate-300">Analysis of keywords in your resume compared to the job description</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      Matched Keywords
                    </h4>
                    <p className="text-sm text-slate-300 mb-4">
                      Keywords that appear in both your resume and the job description
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {matchedKeywords.length > 0 ? (
                        matchedKeywords.map((keyword) => (
                          <Badge key={keyword.id} className="bg-green-600 text-white border-0">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            {keyword.keyword} ({keyword.count})
                          </Badge>
                        ))
                      ) : (
                        <div className="text-sm text-slate-300 p-4 rounded-lg bg-slate-700/50 border border-slate-600/50">
                          No matched keywords found.
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-400" />
                      Missing Keywords
                    </h4>
                    <p className="text-sm text-slate-300 mb-4">
                      Keywords from the job description that are missing in your resume
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.length > 0 ? (
                        missingKeywords.map((keyword) => (
                          <Badge key={keyword.id} className="bg-red-600 text-white border-0">
                            <XCircle className="mr-1 h-3 w-3" />
                            {keyword.keyword}
                          </Badge>
                        ))
                      ) : (
                        <div className="text-sm text-slate-300 p-4 rounded-lg bg-slate-700/50 border border-slate-600/50">
                          No missing keywords found.
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-400" />
                      Other Keywords in Your Resume
                    </h4>
                    <p className="text-sm text-purple-300 mb-4">
                      Keywords in your resume that are not in the job description
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {otherKeywords.length > 0 ? (
                        otherKeywords.map((keyword) => (
                          <Badge key={keyword.id} className="bg-blue-600 text-white border-0">
                            {keyword.keyword} ({keyword.count})
                          </Badge>
                        ))
                      ) : (
                        <div className="text-sm text-purple-300 p-4 rounded-lg bg-purple-800/30 border border-purple-600/30">
                          No other keywords found.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sections" className="mt-4 space-y-6">
              <div className="bg-slate-800/60 rounded-lg p-6 border border-slate-600/50">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">Section Analysis</h3>
                  <p className="text-slate-300">Analysis of the different sections in your resume</p>
                </div>
                <div className="space-y-6">
                  {analysis.sections.length > 0 ? (
                    analysis.sections.map((section) => (
                      <div key={section.id} className="p-6 rounded-lg bg-slate-700/50 border border-slate-600/50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-white capitalize flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-slate-300" />
                            {section.name}
                          </h4>
                          <Badge 
                            className={`text-white border-0 ${
                              (section.score && section.score >= 80) 
                                ? "bg-green-600" 
                                : (section.score && section.score >= 60)
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                            }`}
                          >
                            {section.score || 0}/100
                          </Badge>
                        </div>
                        <Progress value={section.score || 0} className="mb-4 bg-slate-800/50" />
                        {section.suggestions && (
                          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/30">
                            <p className="font-medium text-slate-200 mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-blue-400" />
                              AI Suggestions:
                            </p>
                            <p className="text-slate-300 text-sm leading-relaxed">{section.suggestions}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-300">No section analysis available.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="issues" className="mt-4 space-y-6">
              <div className="bg-slate-800/60 rounded-lg p-6 border border-slate-600/50">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">Issues Found</h3>
                  <p className="text-slate-300">Problems identified in your resume with AI-powered solutions</p>
                </div>
                <div className="space-y-6">
                  {highIssues.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Badge className="bg-red-600 text-white border-0">High Priority</Badge>
                        Critical Issues
                      </h4>
                      <div className="space-y-3">
                        {highIssues.map((issue) => (
                          <div key={issue.id} className="p-4 rounded-lg bg-red-900/30 border border-red-600/30">
                            <p className="font-medium text-red-200 mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              {issue.description}
                            </p>
                            {issue.suggestion && (
                              <div className="p-3 rounded-lg bg-red-900/20 border border-red-600/20">
                                <p className="text-sm text-red-100 flex items-start gap-2">
                                  <Sparkles className="h-4 w-4 text-red-300 flex-shrink-0 mt-0.5" />
                                  <span><strong>AI Suggestion:</strong> {issue.suggestion}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mediumIssues.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Badge className="bg-yellow-600 text-white border-0">Medium Priority</Badge>
                        Important Issues
                      </h4>
                      <div className="space-y-3">
                        {mediumIssues.map((issue) => (
                          <div key={issue.id} className="p-4 rounded-lg bg-yellow-900/30 border border-yellow-600/30">
                            <p className="font-medium text-yellow-200 mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              {issue.description}
                            </p>
                            {issue.suggestion && (
                              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-600/20">
                                <p className="text-sm text-yellow-100 flex items-start gap-2">
                                  <Sparkles className="h-4 w-4 text-yellow-300 flex-shrink-0 mt-0.5" />
                                  <span><strong>AI Suggestion:</strong> {issue.suggestion}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lowIssues.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Badge className="bg-blue-600 text-white border-0">Low Priority</Badge>
                        Minor Issues
                      </h4>
                      <div className="space-y-3">
                        {lowIssues.map((issue) => (
                          <div key={issue.id} className="p-4 rounded-lg bg-blue-900/30 border border-blue-600/30">
                            <p className="font-medium text-blue-200 mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              {issue.description}
                            </p>
                            {issue.suggestion && (
                              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-600/20">
                                <p className="text-sm text-blue-100 flex items-start gap-2">
                                  <Sparkles className="h-4 w-4 text-blue-300 flex-shrink-0 mt-0.5" />
                                  <span><strong>AI Suggestion:</strong> {issue.suggestion}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.issues.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
                      <p className="text-green-200 text-lg font-medium">Great job! No issues found in your resume.</p>
                      <p className="text-slate-300 text-sm mt-2">Your resume meets all our quality standards.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="mt-4 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-slate-800/60 rounded-lg p-6 border border-slate-600/50">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-slate-300" />
                      Resume Content
                    </h3>
                    <p className="text-slate-300">The content of your uploaded resume</p>
                  </div>
                  <div className="max-h-[500px] overflow-y-auto rounded-lg bg-slate-900/50 p-4 border border-slate-600/30">
                    <pre className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed">{resume.content}</pre>
                  </div>
                </div>

                {analysis.jobDescription && (
                  <div className="bg-slate-800/60 rounded-lg p-6 border border-slate-600/50">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-slate-300" />
                        Job Description
                      </h3>
                      <p className="text-slate-300">The job description you provided for analysis</p>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto rounded-lg bg-slate-900/50 p-4 border border-slate-600/30">
                      <pre className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed">{analysis.jobDescription.content}</pre>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

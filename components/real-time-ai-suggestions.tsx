"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, Zap, Target, TrendingUp, AlertCircle, CheckCircle, 
  Lightbulb, Clock, ArrowRight, Sparkles, RefreshCw
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import type { Suggestion, KeywordOptimization, ATSReport } from "@/types/resume-analysis"

// Define the AI analysis result interface
export interface AIAnalysisResult {
  overall_score: number;
  ats_score: number;
  keyword_score: number;
  technical_skills: string[];
  soft_skills: string[];
  action_verbs: string[];
  missing_keywords: string[];
  strengths: string[];
  critical_issues: Array<{
    type: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    message: string;
    solution: string;
    category?: string;
  }>;
  improvement_suggestions: Suggestion[];
  insights: {
    readability_score: number;
    keyword_density: Record<string, number>;
    section_completeness: Record<string, boolean>;
    industry_alignment: number;
    experience_level: 'entry' | 'mid' | 'senior' | 'executive';
    estimated_ats_pass_rate: number;
  };
  suggestionList?: Suggestion[];
  // --- Added for AI-powered suggestions integration ---
  aiSuggestions?: string[];
  aiScore?: number;
}

interface RealTimeAISuggestionsProps {
  resume: {
    id: number
    title: string
    content: string
    createdAt: Date
  }
  jobDescription?: string
  showTabs?: boolean // NEW PROP
}

export function RealTimeAISuggestions({ 
  resume, 
  jobDescription,
  showTabs = true // default true
}: RealTimeAISuggestionsProps) {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [realTimeSuggestions, setRealTimeSuggestions] = useState<string[]>([])
  const [keywordOptimization, setKeywordOptimization] = useState<KeywordOptimization | null>(null)
  const [atsReport, setATSReport] = useState<ATSReport | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  // Perform initial AI analysis
  const performAIAnalysis = useCallback(async () => {
    if (!resume.content) return
    
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeContent: resume.content,
          jobDescription: jobDescription,
          analysisType: 'full'
        })
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const { result } = await response.json()
      setAnalysis(result)
      
      toast({
        title: "AI Analysis Complete",
        description: `Your resume scored ${result.overall_score}/100`,
      })
    } catch {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }, [resume.content, jobDescription, toast])

  // Get real-time suggestions
  const getRealTimeSuggestions = useCallback(async () => {
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeContent: resume.content,
          analysisType: 'realtime'
        })
      })

      if (!response.ok) throw new Error('Failed to get suggestions')
      
      const { result } = await response.json()
      setRealTimeSuggestions(Array.isArray(result) ? result : [])
    } catch {
      // error intentionally ignored
    }
  }, [resume.content])

  // Get keyword optimization
  const getKeywordOptimization = useCallback(async () => {
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeContent: resume.content,
          jobDescription: jobDescription,
          analysisType: 'keywords'
        })
      })

      if (!response.ok) throw new Error('Failed to get keyword optimization')
      
      const { result } = await response.json()
      setKeywordOptimization(result)
    } catch {
      // error intentionally ignored
    }
  }, [resume.content, jobDescription])

  // Generate ATS report
  const generateATSReport = useCallback(async () => {
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeContent: resume.content,
          analysisType: 'ats'
        })
      })

      if (!response.ok) throw new Error('Failed to generate ATS report')
      
      const { result } = await response.json()
      setATSReport(result)
    } catch {
      // error intentionally ignored
    }
  }, [resume.content])

  // Initial analysis on mount
  useEffect(() => {
    performAIAnalysis()
  }, [performAIAnalysis])

  // Load additional data when switching tabs
  useEffect(() => {
    switch (activeTab) {
      case "keywords":
        if (jobDescription && !keywordOptimization) {
          getKeywordOptimization()
        }
        break
      case "ats":
        if (!atsReport) {
          generateATSReport()
        }
        break
      case "realtime":
        if (realTimeSuggestions.length === 0) {
          getRealTimeSuggestions()
        }
        break
    }
  }, [activeTab, jobDescription, keywordOptimization, atsReport, realTimeSuggestions.length, getKeywordOptimization, generateATSReport, getRealTimeSuggestions])

  const priorityConfig = {
    critical: { color: "bg-red-500 text-white", icon: <AlertCircle className="h-3 w-3" /> },
    high: { color: "bg-orange-500 text-white", icon: <AlertCircle className="h-3 w-3" /> },
    medium: { color: "bg-yellow-500 text-black", icon: <Clock className="h-3 w-3" /> },
    low: { color: "bg-blue-500 text-white", icon: <Lightbulb className="h-3 w-3" /> }
  }

  // Add AI-powered suggestions and score from Puter AI if available
  const aiSuggestions = analysis?.aiSuggestions;
  const aiScore = analysis?.aiScore;

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="glass rounded-2xl border border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Real-Time AI Analysis
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </CardTitle>
                <CardDescription>
                  Powered by advanced AI for personalized resume optimization
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={performAIAnalysis} 
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {isAnalyzing ? "Analyzing..." : "Re-analyze"}
            </Button>
          </div>
        </CardHeader>

        {analysis && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {analysis.overall_score}
                </div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
                <Progress value={analysis.overall_score} className="mt-2" />
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {analysis.ats_score}
                </div>
                <div className="text-sm text-muted-foreground">ATS Score</div>
                <Progress value={analysis.ats_score} className="mt-2" />
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {analysis.keyword_score}
                </div>
                <div className="text-sm text-muted-foreground">Keyword Score</div>
                <Progress value={analysis.keyword_score} className="mt-2" />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Conditionally render tabs */}
      {showTabs && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="ats">ATS Report</TabsTrigger>
            <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {analysis && (
              <div className="grid gap-4">
                {/* Strengths */}
                {analysis.strengths && analysis.strengths.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Critical Issues */}
                {analysis.critical_issues && analysis.critical_issues.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="h-5 w-5" />
                        Critical Issues
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.critical_issues.map((issue, index) => (
                          <div key={index} className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                            <div className="flex items-start gap-3">
                              <Badge className={priorityConfig[issue.priority].color}>
                                {priorityConfig[issue.priority].icon}
                                {issue.priority}
                              </Badge>
                              <div className="flex-1">
                                <p className="font-medium text-sm mb-1">{issue.message}</p>
                                <p className="text-xs text-muted-foreground mb-2">{issue.solution}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            {/* Show all actionable suggestions from backend-provided array, fallback to improvement_suggestions if needed */}
            {(() => {
              // Prefer suggestionList if present, else fallback to improvement_suggestions
              const suggestionsArray: Suggestion[] =
                analysis && Array.isArray(analysis.suggestionList) && analysis.suggestionList.length > 0
                  ? analysis.suggestionList
                  : (analysis?.improvement_suggestions && analysis.improvement_suggestions.length > 0)
                    ? analysis.improvement_suggestions
                    : [];
              const hasAISuggestions = aiSuggestions && aiSuggestions.length > 0;
              return (
                <>
                  {hasAISuggestions && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-purple-400" />
                          AI-Powered Suggestions (Puter AI)
                        </CardTitle>
                        {typeof aiScore === 'number' && (
                          <CardDescription>
                            <span className="font-semibold text-purple-400">AI ATS Score:</span> {aiScore}/100
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {aiSuggestions.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                              <span className="text-sm">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  {suggestionsArray.length === 0 && !hasAISuggestions ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-400" />
                          AI-Powered Suggestions
                        </CardTitle>
                        <CardDescription>
                          No actionable suggestions found. Your resume is in great shape!
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ) : suggestionsArray.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-400" />
                          AI-Powered Suggestions
                        </CardTitle>
                        <CardDescription>
                          Personalized recommendations based on AI analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <AnimatePresence>
                            {suggestionsArray.map((suggestion, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 rounded-lg border border-border/50 bg-slate-800/30 hover:border-primary/30 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded-lg bg-primary/10">
                                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm mb-1">{typeof suggestion === 'string' ? suggestion : suggestion.suggestion || suggestion.message}</h4>
                                    {suggestion.impact && (
                                      <p className="text-xs text-muted-foreground mb-2">{suggestion.impact}</p>
                                    )}
                                    {suggestion.scoreImprovement && (
                                      <div className="flex items-center gap-2">
                                        <TrendingUp className="h-3 w-3 text-green-400" />
                                        <span className="text-xs text-green-400 font-medium">
                                          +{suggestion.scoreImprovement} points
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              );
            })()}
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="space-y-4">
            {keywordOptimization && (
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-400" />
                      Keyword Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {keywordOptimization.missing_keywords && keywordOptimization.missing_keywords.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-orange-400">Missing Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {keywordOptimization.missing_keywords.map((keyword: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-orange-400 border-orange-400">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {keywordOptimization.placement_recommendations && keywordOptimization.placement_recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-blue-400">Placement Recommendations</h4>
                        <div className="space-y-2">
                          {keywordOptimization.placement_recommendations.map((rec, index) => (
                            <div key={index} className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-blue-500 text-white">{rec.keyword}</Badge>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm font-medium">{rec.section}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{rec.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* ATS Report Tab */}
          <TabsContent value="ats" className="space-y-4">
            {atsReport && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-400" />
                    ATS Compatibility Report
                  </CardTitle>
                  <CardDescription>
                    Detailed analysis of how well your resume works with ATS systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="text-3xl font-bold text-green-400">
                      {atsReport.ats_score}%
                    </div>
                    <div>
                      <div className="font-medium text-green-400">ATS Compatibility</div>
                      <div className="text-sm text-muted-foreground">
                        {atsReport.ats_score >= 80 ? 'Excellent' : 
                         atsReport.ats_score >= 60 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>

                  {atsReport.compatibility_issues && atsReport.compatibility_issues.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-3">Compatibility Issues</h4>
                      <div className="space-y-3">
                        {atsReport.compatibility_issues.map((issue, index) => (
                          <div key={index} className="p-3 rounded-lg border border-border/50 bg-slate-800/30">
                            <div className="flex items-start gap-3">
                              <Badge className={priorityConfig[issue.severity as keyof typeof priorityConfig].color}>
                                {priorityConfig[issue.severity as keyof typeof priorityConfig].icon}
                                {issue.severity}
                              </Badge>
                              <div className="flex-1">
                                <p className="font-medium text-sm mb-1">{issue.issue}</p>
                                <p className="text-xs text-muted-foreground mb-1">{issue.solution}</p>
                                <p className="text-xs text-blue-400">{issue.impact}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Real-Time Tab */}
          <TabsContent value="realtime" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Real-Time Suggestions
                </CardTitle>
                <CardDescription>
                  Instant AI-powered recommendations as you work
                </CardDescription>
                <Button 
                  onClick={() => getRealTimeSuggestions()} 
                  size="sm" 
                  variant="outline"
                  className="self-start"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Get New Suggestions
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {realTimeSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20"
                    >
                      <Lightbulb className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <p className="text-sm">{suggestion}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      {/* If showTabs is false, show only the overview and suggestions content */}
      {!showTabs && analysis && (
        <div className="space-y-4">
          {/* Strengths */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Critical Issues */}
          {analysis.critical_issues && analysis.critical_issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  Critical Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.critical_issues.map((issue, index) => (
                    <div key={index} className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                      <div className="flex items-start gap-3">
                        <Badge className={priorityConfig[issue.priority].color}>
                          {priorityConfig[issue.priority].icon}
                          {issue.priority}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-1">{issue.message}</p>
                          <p className="text-xs text-muted-foreground mb-2">{issue.solution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Suggestions */}
          {aiSuggestions && aiSuggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  AI-Powered Suggestions (Puter AI)
                </CardTitle>
                {typeof aiScore === 'number' && (
                  <CardDescription>
                    <span className="font-semibold text-purple-400">AI ATS Score:</span> {aiScore}/100
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {aiSuggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span className="text-sm">{s}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

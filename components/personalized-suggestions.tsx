"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Clock, Target, TrendingUp, Lightbulb, Zap, Eye, ArrowRight, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useSuggestionActions } from "@/hooks/use-suggestion-actions"

interface PersonalizedSuggestion {
  id: string
  category: string
  priority: "high" | "medium" | "low"
  title: string
  description: string
  impact: string
  estimatedTime: string
  difficulty: "easy" | "medium" | "hard"
  scoreImprovement: number
  actionUrl?: string
  actionType?: "navigate" | "guide" | "template" | "ats-check" | "keyword-optimize" | "analytics"
  actionHandler?: () => void
}

interface ResumeAnalysis {
  totalScore: number
  atsScore?: number
  keywordScore?: number
  formattingScore?: number
  sectionScore?: number
  suggestions?: string
}

interface StoredAnalysisData {
  general?: string
  industry?: string
  industryScore?: number
  industryRecommendations?: string[]
  atsDetails?: {
    score: number
    passed: boolean
    issues: Array<{
      category: string
      severity: "critical" | "high" | "medium" | "low"
      issue: string
      description: string
      solution: string
      impact: string
    }>
  }
  comprehensiveAnalysis?: {
    overallScore: number
    industryFit: {
      score: number
      analysis: string
      strengths: string[]
      improvements: string[]
      keyWords: string[]
      missingElements: string[]
    }
    issues: Array<{
      id: string
      category: string
      severity: "critical" | "high" | "medium" | "low"
      title: string
      description: string
      impact: string
      solution: string
      examples?: string[]
      priority: number
    }>
    strengths: string[]
    quickWins: Array<{
      id: string
      category: string
      severity: string
      title: string
      description: string
      impact: string
      solution: string
    }>
    actionPlan: {
      immediate: string[]
      shortTerm: string[]
      longTerm: string[]
    }
  }
}

interface PersonalizedSuggestionsProps {
  resume: {
    id: number
    title: string
    createdAt: Date
    analyses: ResumeAnalysis[]
  }
}

const priorityConfig = {
  high: {
    color: "text-red-600 bg-red-50 border-red-200",
    icon: <AlertCircle className="h-4 w-4" />,
    label: "High Priority"
  },
  medium: {
    color: "text-amber-600 bg-amber-50 border-amber-200", 
    icon: <Clock className="h-4 w-4" />,
    label: "Medium Priority"
  },
  low: {
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: <Lightbulb className="h-4 w-4" />,
    label: "Enhancement"
  }
}

const difficultyConfig = {
  easy: {
    icon: <Zap className="h-4 w-4 text-green-500" />,
    label: "Quick Fix",
    color: "text-green-600"
  },
  medium: {
    icon: <Clock className="h-4 w-4 text-amber-500" />,
    label: "Moderate",
    color: "text-amber-600"
  },
  hard: {
    icon: <Target className="h-4 w-4 text-red-500" />,
    label: "Complex",
    color: "text-red-600"
  }
}

export function PersonalizedSuggestions({ resume }: PersonalizedSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "content" | "formatting" | "keywords" | "optimization">("all")
  const [selectedPriority, setSelectedPriority] = useState<"all" | "high" | "medium" | "low">("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all")
  const actions = useSuggestionActions()
  
  const latestAnalysis = resume.analyses[0]
  
  if (!latestAnalysis) {
    return (
      <Card className="glass rounded-2xl border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Personalized Suggestions
          </CardTitle>
          <CardDescription>AI-powered recommendations for your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No analysis available yet</p>
            <Link href={`/dashboard/resumes/${resume.id}`}>
              <Button>View Resume</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }  // Generate personalized suggestions based on scores
  const suggestions = generatePersonalizedSuggestions(latestAnalysis, resume.id, actions)
  
  const filteredSuggestions = suggestions.filter(s => {
    const categoryMatch = selectedCategory === "all" || s.category === selectedCategory
    const priorityMatch = selectedPriority === "all" || s.priority === selectedPriority
    const difficultyMatch = selectedDifficulty === "all" || s.difficulty === selectedDifficulty
    return categoryMatch && priorityMatch && difficultyMatch
  })

  const categories = [
    { key: "all", label: "All Suggestions", count: suggestions.length },
    { key: "content", label: "Content", count: suggestions.filter(s => s.category === "content").length },
    { key: "formatting", label: "Formatting", count: suggestions.filter(s => s.category === "formatting").length },
    { key: "keywords", label: "Keywords", count: suggestions.filter(s => s.category === "keywords").length },
    { key: "optimization", label: "Optimization", count: suggestions.filter(s => s.category === "optimization").length }
  ]

  return (
    <Card className="glass rounded-2xl border border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Personalized Suggestions
            </CardTitle>
            <CardDescription>AI-powered recommendations based on your resume analysis</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{latestAnalysis.totalScore}/100</div>
            <p className="text-xs text-muted-foreground">Current Score</p>
          </div>
        </div>
      </CardHeader>      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium text-slate-200 mb-2">Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key as "all" | "content" | "formatting" | "keywords" | "optimization")}
                  className="text-xs"
                >
                  {category.label} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <h4 className="text-sm font-medium text-slate-200 mb-2">Priority</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Priorities", count: suggestions.length },
                { key: "high", label: "High Priority", count: suggestions.filter(s => s.priority === "high").length },
                { key: "medium", label: "Medium Priority", count: suggestions.filter(s => s.priority === "medium").length },
                { key: "low", label: "Low Priority", count: suggestions.filter(s => s.priority === "low").length }
              ].map((priority) => (
                <Button
                  key={priority.key}
                  variant={selectedPriority === priority.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPriority(priority.key as "all" | "high" | "medium" | "low")}
                  className="text-xs"
                >
                  {priority.label} ({priority.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h4 className="text-sm font-medium text-slate-200 mb-2">Difficulty</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Levels", count: suggestions.length },
                { key: "easy", label: "Quick Fixes", count: suggestions.filter(s => s.difficulty === "easy").length },
                { key: "medium", label: "Moderate", count: suggestions.filter(s => s.difficulty === "medium").length },
                { key: "hard", label: "Complex", count: suggestions.filter(s => s.difficulty === "hard").length }
              ].map((difficulty) => (
                <Button
                  key={difficulty.key}
                  variant={selectedDifficulty === difficulty.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty.key as "all" | "easy" | "medium" | "hard")}
                  className="text-xs"
                >
                  {difficulty.label} ({difficulty.count})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {filteredSuggestions.length > 0 && (
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{filteredSuggestions.length}</div>
                <div className="text-xs text-slate-400">Suggestions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  +{filteredSuggestions.reduce((sum, s) => sum + s.scoreImprovement, 0)}
                </div>
                <div className="text-xs text-slate-400">Potential Score Gain</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">
                  {filteredSuggestions.filter(s => s.priority === "high").length}
                </div>
                <div className="text-xs text-slate-400">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {filteredSuggestions.filter(s => s.difficulty === "easy").length}
                </div>
                <div className="text-xs text-slate-400">Quick Fixes</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="text-sm font-medium text-slate-200">ATS Score</div>
            <div className="text-xl font-bold text-primary">{latestAnalysis.atsScore || 0}</div>
            <Progress value={latestAnalysis.atsScore || 0} className="h-1 mt-1" />
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="text-sm font-medium text-slate-200">Keywords</div>
            <div className="text-xl font-bold text-primary">{latestAnalysis.keywordScore || 0}</div>
            <Progress value={latestAnalysis.keywordScore || 0} className="h-1 mt-1" />
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="text-sm font-medium text-slate-200">Formatting</div>
            <div className="text-xl font-bold text-primary">{latestAnalysis.formattingScore || 0}</div>
            <Progress value={latestAnalysis.formattingScore || 0} className="h-1 mt-1" />
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="text-sm font-medium text-slate-200">Sections</div>
            <div className="text-xl font-bold text-primary">{latestAnalysis.sectionScore || 0}</div>
            <Progress value={latestAnalysis.sectionScore || 0} className="h-1 mt-1" />
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/30 rounded-lg border border-slate-700 p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={priorityConfig[suggestion.priority].color}>
                          {priorityConfig[suggestion.priority].icon}
                          {priorityConfig[suggestion.priority].label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {difficultyConfig[suggestion.difficulty].icon}
                          {difficultyConfig[suggestion.difficulty].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {suggestion.estimatedTime}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-slate-200 mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-slate-300 mb-2">{suggestion.description}</p>
                      <p className="text-xs text-slate-400 mb-3">{suggestion.impact}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-500 font-medium">
                            +{suggestion.scoreImprovement} score improvement
                          </span>
                        </div>                        {(suggestion.actionUrl || suggestion.actionHandler) && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => {
                              if (suggestion.actionHandler) {
                                actions.trackSuggestionClick(suggestion.id, suggestion.actionType || "unknown")
                                suggestion.actionHandler()
                              } else if (suggestion.actionUrl) {
                                actions.trackSuggestionClick(suggestion.id, "navigate")
                                window.open(suggestion.actionUrl, '_self')
                              }
                            }}
                          >
                            Take Action
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-slate-300">No suggestions in this category!</p>
                <p className="text-sm text-slate-400">Your resume looks good in this area.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-700">
          <Link href={`/dashboard/resumes/${resume.id}`}>
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
              <Eye className="h-4 w-4 mr-2" />
              View Detailed Analysis
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function generatePersonalizedSuggestions(
  analysis: ResumeAnalysis, 
  resumeId: number,
  actions: ReturnType<typeof useSuggestionActions>
): PersonalizedSuggestion[] {
  const suggestions: PersonalizedSuggestion[] = []
  // Parse stored analysis data
  let storedData: StoredAnalysisData = {}
  if (analysis.suggestions) {
    try {
      storedData = JSON.parse(analysis.suggestions)
    } catch {
      // Log error silently and continue with fallback suggestions
    }
  }
  // Generate suggestions from comprehensive analysis issues
  if (storedData.comprehensiveAnalysis?.issues) {
    storedData.comprehensiveAnalysis.issues.forEach((issue) => {
      // Map severity to priority
      const priority = issue.severity === "critical" || issue.severity === "high" ? "high" : 
                      issue.severity === "medium" ? "medium" : "low"
      
      // Map category to our category system
      const category = mapAnalysisCategoryToSuggestionCategory(issue.category)
      
      // Map severity to difficulty (more severe = harder to fix)
      const difficulty = issue.severity === "critical" ? "hard" : 
                        issue.severity === "high" ? "medium" : "easy"
      
      // Calculate score improvement based on severity and priority
      const scoreImprovement = issue.severity === "critical" ? 20 : 
                              issue.severity === "high" ? 15 : 
                              issue.severity === "medium" ? 10 : 5
      
      // Determine estimated time based on difficulty
      const estimatedTime = difficulty === "hard" ? "2-4 hours" : 
                           difficulty === "medium" ? "30-60 min" : "10-20 min"

      suggestions.push({
        id: `analysis-${issue.id}`,
        category,
        priority,
        title: issue.title,
        description: issue.description,
        impact: issue.impact,
        estimatedTime,
        difficulty,
        scoreImprovement,
        actionType: getActionTypeForCategory(category),
        actionHandler: () => getActionHandlerForCategory(category, resumeId, actions)
      })
    })
  }
  // Generate suggestions from ATS details
  if (storedData.atsDetails?.issues) {
    storedData.atsDetails.issues.forEach((issue, index) => {
      const priority = issue.severity === "critical" || issue.severity === "high" ? "high" : "medium"
      const difficulty = issue.severity === "critical" ? "hard" : "medium"
      const scoreImprovement = issue.severity === "critical" ? 25 : 
                              issue.severity === "high" ? 15 : 10

      suggestions.push({
        id: `ats-${index}`,
        category: "formatting",
        priority,
        title: `ATS Issue: ${issue.issue}`,
        description: issue.description,
        impact: issue.impact,
        estimatedTime: difficulty === "hard" ? "1-2 hours" : "30-45 min",
        difficulty,
        scoreImprovement,
        actionType: "ats-check",
        actionHandler: () => actions.openATSChecker(resumeId.toString())
      })
    })
  }
  // Generate suggestions from quick wins
  if (storedData.comprehensiveAnalysis?.quickWins) {
    storedData.comprehensiveAnalysis.quickWins.forEach((quickWin) => {
      const category = mapAnalysisCategoryToSuggestionCategory(quickWin.category)
      
      suggestions.push({
        id: `quickwin-${quickWin.id}`,
        category,
        priority: "medium",
        title: `Quick Win: ${quickWin.title}`,
        description: quickWin.description,
        impact: quickWin.impact,
        estimatedTime: "5-15 min",
        difficulty: "easy",
        scoreImprovement: 8,
        actionType: getActionTypeForCategory(category),
        actionHandler: () => getActionHandlerForCategory(category, resumeId, actions)
      })
    })
  }

  // Generate suggestions from industry recommendations
  if (storedData.industryRecommendations && storedData.industryRecommendations.length > 0) {
    storedData.industryRecommendations.slice(0, 3).forEach((recommendation, index) => {
      suggestions.push({
        id: `industry-${index}`,
        category: "content",
        priority: "medium",
        title: `Industry Alignment: ${storedData.industry || 'Your Field'}`,
        description: recommendation,
        impact: "Better alignment with industry standards increases your chances of getting noticed by recruiters.",
        estimatedTime: "20-30 min",
        difficulty: "medium",
        scoreImprovement: 12,
        actionType: "guide",
        actionHandler: () => actions.showGuide("content-writing")
      })
    })
  }

  // Generate suggestions from action plan
  if (storedData.comprehensiveAnalysis?.actionPlan) {
    const actionPlan = storedData.comprehensiveAnalysis.actionPlan
    
    // Immediate actions (high priority)
    if (actionPlan.immediate && actionPlan.immediate.length > 0) {
      actionPlan.immediate.slice(0, 2).forEach((action, index) => {
        suggestions.push({
          id: `immediate-${index}`,
          category: "optimization",
          priority: "high",
          title: "Immediate Action Required",
          description: action,
          impact: "Quick fixes that can immediately improve your resume's effectiveness.",
          estimatedTime: "15-30 min",
          difficulty: "easy",
          scoreImprovement: 10,
          actionType: "navigate",
          actionHandler: () => actions.navigateToSection(resumeId.toString(), "overview")
        })
      })
    }

    // Short-term actions (medium priority)
    if (actionPlan.shortTerm && actionPlan.shortTerm.length > 0) {
      actionPlan.shortTerm.slice(0, 2).forEach((action, index) => {
        suggestions.push({
          id: `shortterm-${index}`,
          category: "content",
          priority: "medium",
          title: "Short-term Improvement",
          description: action,
          impact: "Strategic improvements that will enhance your resume's competitiveness.",
          estimatedTime: "30-60 min",
          difficulty: "medium",
          scoreImprovement: 15,
          actionType: "guide",
          actionHandler: () => actions.showGuide("content-writing")
        })
      })
    }
  }

  // Generate suggestions from strengths (to maintain/highlight)
  if (storedData.comprehensiveAnalysis?.strengths && storedData.comprehensiveAnalysis.strengths.length > 0) {
    const topStrengths = storedData.comprehensiveAnalysis.strengths.slice(0, 2)
    topStrengths.forEach((strength, index) => {
      suggestions.push({
        id: `strength-${index}`,
        category: "optimization",
        priority: "low",
        title: "Leverage Your Strength",
        description: `You excel in: ${strength}. Consider highlighting this more prominently.`,
        impact: "Emphasizing your strengths makes you more memorable to recruiters.",
        estimatedTime: "10-15 min",
        difficulty: "easy",
        scoreImprovement: 5,
        actionType: "guide",
        actionHandler: () => actions.openContentHelper("achievements")
      })
    })
  }

  // Fallback to basic suggestions if no comprehensive data available
  if (suggestions.length === 0) {
    return generateBasicSuggestions(analysis, resumeId, actions)
  }

  return suggestions.sort((a, b) => {
    // Sort by priority first, then by score improvement
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return b.scoreImprovement - a.scoreImprovement
  }).slice(0, 15) // Limit to 15 suggestions to avoid overwhelming the user
}

// Helper function to map analysis categories to suggestion categories
function mapAnalysisCategoryToSuggestionCategory(analysisCategory: string): string {
  const categoryMap: Record<string, string> = {
    'contact': 'content',
    'format': 'formatting',
    'formatting': 'formatting',
    'content_structure': 'content',
    'content': 'content',
    'skills': 'keywords',
    'keywords': 'keywords',
    'experience': 'content',
    'education': 'content',
    'achievements': 'content',
    'grammar': 'content',
    'ats': 'formatting',
    'sections': 'content',
    'length': 'formatting',
    'bullets': 'formatting',
    'action_verbs': 'content'
  }
  
  return categoryMap[analysisCategory] || 'optimization'
}

// Helper function to get action type for category
function getActionTypeForCategory(category: string): "navigate" | "guide" | "template" | "ats-check" | "keyword-optimize" | "analytics" {
  const actionTypeMap: Record<string, "navigate" | "guide" | "template" | "ats-check" | "keyword-optimize" | "analytics"> = {
    'content': 'guide',
    'formatting': 'ats-check',
    'keywords': 'keyword-optimize',
    'optimization': 'navigate'
  }
  
  return actionTypeMap[category] || 'navigate'
}

// Helper function to get action handler for category
function getActionHandlerForCategory(
  category: string, 
  resumeId: number, 
  actions: ReturnType<typeof useSuggestionActions>
): () => void {
  switch (category) {
    case 'content':
      return () => actions.showGuide("content-writing")
    case 'formatting':
      return () => actions.openATSChecker(resumeId.toString())
    case 'keywords':
      return () => actions.startKeywordOptimization(resumeId.toString())
    case 'optimization':
    default:
      return () => actions.navigateToSection(resumeId.toString(), "overview")
  }
}

// Fallback function for basic suggestions when no comprehensive data is available
function generateBasicSuggestions(
  analysis: ResumeAnalysis, 
  resumeId: number,
  actions: ReturnType<typeof useSuggestionActions>
): PersonalizedSuggestion[] {
  const suggestions: PersonalizedSuggestion[] = []

  // ATS Compatibility Suggestions
  if ((analysis.atsScore || 0) < 80) {
    suggestions.push({
      id: "ats-improvement",
      category: "formatting",
      priority: "high",
      title: "Improve ATS Compatibility",
      description: "Your resume may not pass through Applicant Tracking Systems effectively.",
      impact: "This could prevent your resume from reaching human recruiters.",
      estimatedTime: "15-30 min",
      difficulty: "medium",
      scoreImprovement: 15,
      actionType: "ats-check",
      actionHandler: () => actions.openATSChecker(resumeId.toString())
    })
  }

  // Keyword Optimization
  if ((analysis.keywordScore || 0) < 70) {
    suggestions.push({
      id: "keyword-optimization",
      category: "keywords",
      priority: "high",
      title: "Optimize Keywords",
      description: "Include more relevant keywords that match job descriptions in your field.",
      impact: "Better keyword matching increases your chances of getting interviews.",
      estimatedTime: "20-45 min",
      difficulty: "medium",
      scoreImprovement: 12,
      actionType: "keyword-optimize",
      actionHandler: () => actions.startKeywordOptimization(resumeId.toString())
    })
  }

  // Formatting Improvements
  if ((analysis.formattingScore || 0) < 80) {
    suggestions.push({
      id: "formatting-improvement",
      category: "formatting",
      priority: "medium",
      title: "Enhance Formatting",
      description: "Improve the visual structure and consistency of your resume.",
      impact: "Better formatting makes your resume more readable and professional.",
      estimatedTime: "10-20 min",
      difficulty: "easy",
      scoreImprovement: 8,
      actionType: "template",
      actionHandler: () => actions.downloadTemplate("ats-friendly")
    })
  }

  return suggestions
}

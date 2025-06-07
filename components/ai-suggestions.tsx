"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Brain, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Copy
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface AISuggestion {
  id: string
  category: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  suggestion: string
  impact?: string
  examples?: string[]
}

interface AnalysisData {
  totalScore: number
  atsScore?: number | null
  keywordScore?: number | null
  grammarScore?: number | null
  formattingScore?: number | null
  sectionScore?: number | null
  actionVerbScore?: number | null
  bulletPointScore?: number | null
  languageToneScore?: number | null
  suggestions?: string | null
}

interface AISuggestionsProps {
  analysis: AnalysisData
  showDetailed?: boolean
}

export function AISuggestions({ 
  analysis, 
  showDetailed = true 
}: AISuggestionsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [copiedSuggestion, setCopiedSuggestion] = useState<string | null>(null)
  const { toast } = useToast()  // Parse stored suggestions JSON and filter out error messages
  const parsedSuggestions = analysis.suggestions ? 
    (() => {
      try {
        const parsed = JSON.parse(analysis.suggestions)
        // Filter out error messages from AI suggestions
        const cleanAiSuggestions = (parsed.aiSuggestions || []).filter((suggestion: string) => 
          !suggestion.includes('AI analysis failed') && 
          !suggestion.includes('Puter AI API error') &&
          !suggestion.includes('error') &&
          !suggestion.includes('Error') &&
          !suggestion.includes('failed') &&
          suggestion.length > 10
        )
        // Filter out error messages from suggestion list
        const cleanSuggestionList = (parsed.suggestionList || []).filter((suggestion: string) => 
          !suggestion.includes('AI analysis failed') && 
          !suggestion.includes('Puter AI API error') &&
          !suggestion.includes('error') &&
          !suggestion.includes('Error') &&
          !suggestion.includes('failed') &&
          suggestion.length > 10
        )
        return { 
          ...parsed, 
          aiSuggestions: cleanAiSuggestions,
          suggestionList: cleanSuggestionList
        }
      } catch {
        return { suggestionList: [], aiSuggestions: [] }
      }
    })() : { suggestionList: [], aiSuggestions: [] }

  // Generate AI-powered suggestions based on scores
  const generateScoreBasedSuggestions = (): AISuggestion[] => {
    const suggestions: AISuggestion[] = []    // ATS Score Suggestions (more inclusive threshold)
    if (analysis.atsScore && analysis.atsScore < 90) {
      suggestions.push({
        id: 'ats-improvement',
        category: 'ATS Compatibility',
        priority: analysis.atsScore < 60 ? 'critical' : analysis.atsScore < 80 ? 'high' : 'medium',
        title: 'Improve ATS Compatibility',
        description: `Your ATS score is ${analysis.atsScore}/100. Optimizing for ATS can improve your chances of getting through automated screening.`,
        suggestion: 'Use standard fonts, avoid complex formatting, and ensure proper section headers.',
        impact: analysis.atsScore < 80 ? 'High - Could increase interview chances by 40%' : 'Medium - Maintains competitive advantage',
        examples: [
          'Use fonts like Arial, Calibri, or Times New Roman',
          'Remove tables, text boxes, and complex layouts',
          'Use standard section headers like "Experience", "Education", "Skills"'
        ]
      })
    }

    // Keyword Score Suggestions (more inclusive threshold)
    if (analysis.keywordScore && analysis.keywordScore < 85) {
      suggestions.push({
        id: 'keyword-optimization',
        category: 'Keyword Optimization',
        priority: analysis.keywordScore < 60 ? 'high' : 'medium',
        title: 'Optimize Keywords for Job Matching',
        description: `Your keyword score is ${analysis.keywordScore}/100. Adding relevant keywords can significantly improve your match rate.`,
        suggestion: 'Include more job-specific keywords from the job description throughout your resume.',
        impact: 'High - Could improve job matching by 35%',
        examples: [
          'Mirror technical skills mentioned in job postings',
          'Include industry-specific terminology',
          'Use variations of important keywords'
        ]
      })
    }    // Grammar Score Suggestions (more inclusive threshold)
    if (analysis.grammarScore && analysis.grammarScore < 90) {
      suggestions.push({
        id: 'grammar-improvement',
        category: 'Language Quality',
        priority: analysis.grammarScore < 70 ? 'high' : 'medium',
        title: 'Enhance Grammar and Language Quality',
        description: `Your grammar score is ${analysis.grammarScore}/100. Professional language use is crucial for making a good impression.`,
        suggestion: 'Review your resume for grammar errors, improve sentence structure, and maintain professional tone.',
        impact: 'Medium - Improves professional impression',
        examples: [
          'Use action verbs in past tense for previous roles',
          'Ensure consistent verb tenses throughout',
          'Proofread for spelling and punctuation errors'
        ]
      })
    }

    // Formatting Score Suggestions (more inclusive threshold)
    if (analysis.formattingScore && analysis.formattingScore < 95) {
      suggestions.push({
        id: 'formatting-enhancement',
        category: 'Visual Design',
        priority: analysis.formattingScore < 80 ? 'medium' : 'low',
        title: 'Improve Resume Formatting',
        description: `Your formatting score is ${analysis.formattingScore}/100. Better formatting improves readability and ATS compatibility.`,
        suggestion: 'Enhance your resume layout with consistent spacing, clear section breaks, and proper alignment.',
        impact: 'Medium - Improves readability by 25%',
        examples: [
          'Use consistent bullet points throughout',
          'Maintain uniform margins and spacing',
          'Ensure proper section hierarchy'
        ]
      })
    }

    // Action Verb Score Suggestions (more inclusive threshold)
    if (analysis.actionVerbScore && analysis.actionVerbScore < 80) {
      suggestions.push({
        id: 'action-verbs',
        category: 'Content Strength',
        priority: analysis.actionVerbScore < 60 ? 'high' : 'medium',
        title: 'Strengthen with Action Verbs',
        description: `Your action verb score is ${analysis.actionVerbScore}/100. Strong action verbs make your achievements more impactful.`,
        suggestion: 'Replace weak verbs with powerful action verbs that demonstrate leadership and achievement.',
        impact: 'High - Makes achievements 30% more compelling',
        examples: [
          'Replace "Responsible for" with "Led", "Managed", or "Oversaw"',
          'Use "Achieved", "Implemented", "Optimized" for results',
          'Start each bullet point with a strong action verb'
        ]
      })
    }

    // Bullet Point Score Suggestions (more inclusive threshold)
    if (analysis.bulletPointScore && analysis.bulletPointScore < 90) {
      suggestions.push({
        id: 'bullet-points',
        category: 'Content Structure',
        priority: analysis.bulletPointScore < 70 ? 'medium' : 'low',
        title: 'Optimize Bullet Point Usage',
        description: `Your bullet point score is ${analysis.bulletPointScore}/100. Well-structured bullet points improve readability.`,
        suggestion: 'Use bullet points effectively to highlight achievements and make content scannable.',
        impact: 'Medium - Improves scannability by 40%',
        examples: [
          'Convert long paragraphs into concise bullet points',
          'Include quantifiable results in bullet points',
          'Limit to 3-5 bullet points per role'
        ]
      })
    }    // Language Tone Score Suggestions (more inclusive threshold)
    if (analysis.languageToneScore && analysis.languageToneScore < 85) {
      suggestions.push({
        id: 'language-tone',
        category: 'Professional Tone',
        priority: analysis.languageToneScore < 70 ? 'medium' : 'low',
        title: 'Enhance Professional Language',
        description: `Your language tone score is ${analysis.languageToneScore}/100. Professional language creates a better impression.`,
        suggestion: 'Use more professional and confident language throughout your resume.',
        impact: 'Medium - Improves professional credibility',
        examples: [
          'Replace casual phrases with professional equivalents',
          'Use confident language to describe achievements',
          'Maintain consistent professional tone across all sections'
        ]
      })
    }

    // Add suggestions based on total score if specific categories don't trigger
    if (suggestions.length === 0 && analysis.totalScore < 85) {
      suggestions.push({
        id: 'general-optimization',
        category: 'Overall Improvement',
        priority: analysis.totalScore < 70 ? 'high' : 'medium',
        title: 'Enhance Overall Resume Quality',
        description: `Your overall score is ${analysis.totalScore}/100. Let's work on improving your resume's impact.`,
        suggestion: 'Focus on quantifying achievements, using industry keywords, and maintaining ATS compatibility.',
        impact: 'High - Comprehensive improvement across all areas',
        examples: [
          'Add specific numbers and percentages to achievements',
          'Include relevant industry certifications',
          'Update skills section with current technologies'
        ]
      })
    }

    // Always ensure at least one suggestion for engagement
    if (suggestions.length === 0) {
      suggestions.push({
        id: 'continuous-improvement',
        category: 'Excellence',
        priority: 'low',
        title: 'Maintain Resume Excellence',
        description: 'Your resume shows strong performance across all categories. Consider these advanced optimizations.',
        suggestion: 'Continue refining your resume with advanced strategies for maximum impact.',
        impact: 'Medium - Maintains competitive advantage',
        examples: [
          'Tailor keywords for specific job applications',
          'Add measurable outcomes to recent achievements',
          'Consider industry-specific formatting preferences'
        ]
      })
    }

    return suggestions
  }
  // Generate intelligent fallback AI suggestions when stored suggestions are not available
  const generateFallbackAISuggestions = (): string[] => {
    const fallbackSuggestions = []
    
    if (analysis.atsScore && analysis.atsScore < 85) {
      fallbackSuggestions.push("Consider using a simpler resume format to improve ATS compatibility. Avoid complex layouts, tables, and graphics that might confuse applicant tracking systems.")
    }
    
    if (analysis.keywordScore && analysis.keywordScore < 80) {
      fallbackSuggestions.push("Review the job description and incorporate more relevant keywords naturally throughout your resume, especially in your skills and experience sections.")
    }
    
    if (analysis.actionVerbScore && analysis.actionVerbScore < 75) {
      fallbackSuggestions.push("Start each bullet point with a strong action verb like 'Led,' 'Implemented,' 'Achieved,' or 'Optimized' to make your accomplishments more impactful.")
    }
    
    if (analysis.grammarScore && analysis.grammarScore < 90) {
      fallbackSuggestions.push("Proofread your resume carefully for grammar, spelling, and punctuation errors. Consider using tools like Grammarly or asking someone to review it.")
    }
    
    if (analysis.bulletPointScore && analysis.bulletPointScore < 85) {
      fallbackSuggestions.push("Structure your experience using bullet points rather than paragraphs, and aim for 3-5 bullet points per role to maintain readability.")
    }

    if (analysis.formattingScore && analysis.formattingScore < 90) {
      fallbackSuggestions.push("Ensure consistent formatting throughout your resume with uniform fonts, spacing, and alignment to create a professional appearance.")
    }

    if (analysis.languageToneScore && analysis.languageToneScore < 80) {
      fallbackSuggestions.push("Use confident, professional language throughout your resume. Replace passive phrases with active voice and showcase your achievements assertively.")
    }
    
    // Always include at least one general suggestion for engagement
    if (fallbackSuggestions.length === 0) {
      fallbackSuggestions.push("Consider tailoring your resume for each specific job application by emphasizing the most relevant skills and experiences for that position.")
      fallbackSuggestions.push("Add specific metrics and quantifiable results to your achievements to demonstrate your impact more effectively.")
    }
    
    return fallbackSuggestions
  }
  const scoreBasedSuggestions = generateScoreBasedSuggestions()
  
  // Only include parsed suggestions if they don't contain error messages
  const validParsedSuggestions = (parsedSuggestions.suggestionList || [])
    .filter((suggestion: string) => suggestion.length > 10)
    .map((suggestion: string, index: number) => ({
      id: `general-${index}`,
      category: 'General',
      priority: 'medium' as const,
      title: 'General Improvement',
      description: suggestion,
      suggestion: suggestion
    }))

  const allSuggestions = [
    ...scoreBasedSuggestions,
    ...validParsedSuggestions
  ]
  // Clean AI suggestions - prioritize valid suggestions, use fallback if needed
  const storedAISuggestions = (parsedSuggestions.aiSuggestions || []).filter((suggestion: string) => 
    suggestion && suggestion.length > 10
  )
  
  const fallbackAISuggestions = generateFallbackAISuggestions()
  const aiSuggestions = storedAISuggestions.length > 0 ? storedAISuggestions : fallbackAISuggestions

  const handleCopySuggestion = async (suggestion: string) => {
    try {
      await navigator.clipboard.writeText(suggestion)
      setCopiedSuggestion(suggestion)
      toast({
        title: "Copied to clipboard",
        description: "Suggestion copied successfully",
      })
      setTimeout(() => setCopiedSuggestion(null), 2000)
    } catch {
      toast({
        title: "Copy failed",
        description: "Please manually copy the suggestion",
        variant: "destructive"
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return AlertCircle
      case 'high': return Target
      case 'medium': return Lightbulb
      case 'low': return CheckCircle
      default: return Lightbulb
    }
  }

  if (!showDetailed) {
    // Simple view for dashboard
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allSuggestions.slice(0, 3).map((suggestion) => {
              const Icon = getPriorityIcon(suggestion.priority)
              return (
                <div key={suggestion.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Icon className="h-4 w-4 mt-0.5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{suggestion.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                  </div>
                  <Badge variant={getPriorityColor(suggestion.priority)} className="text-xs">
                    {suggestion.priority}
                  </Badge>
                </div>
              )
            })}
            {allSuggestions.length > 3 && (
              <Button variant="outline" size="sm" className="w-full">
                View All {allSuggestions.length} Suggestions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Detailed view
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-500" />
          AI-Powered Resume Analysis & Suggestions
        </CardTitle>
        <CardDescription>
          Comprehensive AI analysis with personalized improvement recommendations
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
            <TabsTrigger value="score-breakdown">Score Analysis</TabsTrigger>
            <TabsTrigger value="action-plan">Action Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Overall Score</p>
                      <p className="text-2xl font-bold">{analysis.totalScore}/100</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                  <Progress value={analysis.totalScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Critical Issues</p>
                      <p className="text-2xl font-bold text-red-500">
                        {allSuggestions.filter(s => s.priority === 'critical').length}
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">AI Suggestions</p>
                      <p className="text-2xl font-bold text-green-500">{aiSuggestions.length}</p>
                    </div>
                    <Brain className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Top Priority Improvements</h3>
              {allSuggestions
                .filter(s => s.priority === 'critical' || s.priority === 'high')
                .slice(0, 3)
                .map((suggestion) => {
                  const Icon = getPriorityIcon(suggestion.priority)
                  return (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border bg-card"
                    >                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5 text-blue-500" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                            <Badge variant={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {suggestion.description}
                          </p>
                          <p className="text-sm mb-3 text-foreground">{suggestion.suggestion}</p>
                          {suggestion.impact && (
                            <p className="text-xs text-green-700 font-medium">
                              💡 {suggestion.impact}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          </TabsContent>

          <TabsContent value="ai-suggestions" className="space-y-4">            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">AI-Generated Suggestions</h3>
              <Badge variant="secondary">{aiSuggestions.length} suggestions</Badge>
            </div>{aiSuggestions.length > 0 ? (
              <div className="space-y-3">
                {aiSuggestions.map((suggestion: string, index: number) => (                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                  >
                    <Brain className="h-5 w-5 mt-0.5 text-blue-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-800">{suggestion}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopySuggestion(suggestion)}
                      className="flex-shrink-0"
                    >
                      {copiedSuggestion === suggestion ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : allSuggestions.length > 0 ? (
              <div className="space-y-4">                <div className="text-center py-4">
                  <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2 text-foreground">Score-Based AI Analysis</p>
                  <p className="text-muted-foreground mb-4">
                    Based on your resume analysis, here are personalized improvement suggestions:
                  </p>
                </div>
                
                <div className="space-y-3">
                  {allSuggestions.slice(0, 5).map((suggestion, index) => {
                    const Icon = getPriorityIcon(suggestion.priority)
                    return (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}                        className="p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 mt-0.5 text-blue-500" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                              <Badge variant={getPriorityColor(suggestion.priority)}>
                                {suggestion.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {suggestion.description}
                            </p>
                            <p className="text-sm mb-3 text-foreground">{suggestion.suggestion}</p>
                            {suggestion.impact && (
                              <p className="text-xs text-green-700 font-medium">
                                💡 {suggestion.impact}
                              </p>
                            )}
                            {suggestion.examples && suggestion.examples.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Examples:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {suggestion.examples.slice(0, 2).map((example: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-1">
                                      <span className="text-blue-500 mt-1">•</span>
                                      <span>{example}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopySuggestion(suggestion.suggestion)}
                            className="flex-shrink-0"
                          >
                            {copiedSuggestion === suggestion.suggestion ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No AI suggestions available yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload and analyze your resume to get personalized AI-powered suggestions.
                </p>
              </div>
            )}
          </TabsContent>          <TabsContent value="score-breakdown" className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Detailed Score Breakdown</h3>
            
            <div className="grid gap-4">
              {[
                { label: 'ATS Compatibility', score: analysis.atsScore, description: 'How well your resume works with ATS systems' },
                { label: 'Keyword Optimization', score: analysis.keywordScore, description: 'Relevance to job requirements' },
                { label: 'Grammar Quality', score: analysis.grammarScore, description: 'Language quality and professionalism' },
                { label: 'Formatting', score: analysis.formattingScore, description: 'Visual structure and organization' },
                { label: 'Section Completeness', score: analysis.sectionScore, description: 'Essential resume sections coverage' },
                { label: 'Action Verbs', score: analysis.actionVerbScore, description: 'Use of impactful action verbs' },
                { label: 'Bullet Points', score: analysis.bulletPointScore, description: 'Effective use of bullet points' },
                { label: 'Language Tone', score: analysis.languageToneScore, description: 'Professional tone and style' }
              ].filter(item => item.score !== null && item.score !== undefined).map((item) => (                <div key={item.label} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{item.label}</h4>
                    <span className={`font-bold ${
                      (item.score || 0) >= 80 ? 'text-green-600' : 
                      (item.score || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.score}/100
                    </span>
                  </div>
                  <Progress value={item.score || 0} className="mb-2" />
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>          <TabsContent value="action-plan" className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Recommended Action Plan</h3>
            
            <div className="space-y-6">              <div>
                <h4 className="font-medium text-red-600 mb-3">🚨 Immediate Actions (Critical Priority)</h4>
                <div className="space-y-2">
                  {allSuggestions
                    .filter(s => s.priority === 'critical')
                    .map((suggestion) => (
                      <div key={suggestion.id} className="flex items-start gap-2 p-3 rounded bg-red-50 border border-red-200">
                        <AlertCircle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-900">{suggestion.suggestion}</p>
                      </div>
                    ))}
                  {allSuggestions.filter(s => s.priority === 'critical').length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No critical issues found! 🎉</p>
                  )}
                </div>
              </div>

              <Separator />              <div>
                <h4 className="font-medium text-orange-600 mb-3">⚡ High Impact Actions</h4>
                <div className="space-y-2">
                  {allSuggestions
                    .filter(s => s.priority === 'high')
                    .map((suggestion) => (
                      <div key={suggestion.id} className="flex items-start gap-2 p-3 rounded bg-orange-50 border border-orange-200">
                        <Target className="h-4 w-4 mt-0.5 text-orange-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-orange-900">{suggestion.suggestion}</p>
                          {suggestion.impact && (
                            <p className="text-xs text-green-700 mt-1 font-medium">💡 {suggestion.impact}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <Separator />              <div>
                <h4 className="font-medium text-blue-600 mb-3">🔧 Polish & Optimization</h4>
                <div className="space-y-2">
                  {allSuggestions
                    .filter(s => s.priority === 'medium')
                    .slice(0, 5)
                    .map((suggestion) => (
                      <div key={suggestion.id} className="flex items-start gap-2 p-3 rounded bg-blue-50 border border-blue-200">
                        <Lightbulb className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                        <p className="text-sm text-blue-900">{suggestion.suggestion}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Filter, ArrowRight, CheckCircle, Clock, AlertCircle, Lightbulb, Target, Zap, Eye } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSuggestionActions } from "@/hooks/use-suggestion-actions"

interface ResumeAnalysis {
  id: number
  atsScore: number
  keywordScore: number
  grammarScore: number
  formattingScore: number
  suggestions: string
  createdAt: Date
}

interface Resume {
  id: number
  title: string
  analyses: ResumeAnalysis[]
}

interface PersonalizedSuggestionsProps {
  resume: Resume
}

interface PersonalizedSuggestion {
  id: string
  category: "content" | "formatting" | "keywords" | "optimization"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  impact: string
  estimatedTime: string
  difficulty: "easy" | "medium" | "hard"
  scoreImprovement: number
  actionType: string
  actionHandler: () => void
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
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No analysis data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const suggestions = generatePersonalizedSuggestions(latestAnalysis, resume.id, actions)
  
  const filteredSuggestions = suggestions.filter(suggestion => {
    const categoryMatch = selectedCategory === "all" || suggestion.category === selectedCategory
    const priorityMatch = selectedPriority === "all" || suggestion.priority === selectedPriority
    const difficultyMatch = selectedDifficulty === "all" || suggestion.difficulty === selectedDifficulty
    
    return categoryMatch && priorityMatch && difficultyMatch
  })

  return (
    <Card className="glass rounded-2xl border border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Personalized Suggestions
        </CardTitle>
        <CardDescription>
          AI-powered recommendations tailored to your resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No suggestions available for the selected filters
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSuggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                actions={actions}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SuggestionCard({ suggestion, actions }: { suggestion: PersonalizedSuggestion, actions: any }) {
  return (
    <Card className="border border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium">{suggestion.title}</h4>
          <Badge variant="outline">{suggestion.priority}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span>Impact: {suggestion.impact}</span>
          <span>•</span>
          <span>Time: {suggestion.estimatedTime}</span>
          <span>•</span>
          <span>Difficulty: {suggestion.difficulty}</span>
        </div>
        <Button
          size="sm"
          onClick={suggestion.actionHandler}
          className="w-full"
        >
          Apply Suggestion
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
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

  // Basic suggestions based on scores
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

  if ((analysis.keywordScore || 0) < 70) {
    suggestions.push({
      id: "keyword-optimization",
      category: "keywords",
      priority: "high",
      title: "Optimize Keywords",
      description: "Your resume lacks important keywords for your industry.",
      impact: "Better keyword usage increases your chances of being found by recruiters.",
      estimatedTime: "20-45 min",
      difficulty: "medium",
      scoreImprovement: 20,
      actionType: "keyword-optimization",
      actionHandler: () => actions.startKeywordOptimization(resumeId.toString())
    })
  }

  return suggestions
}
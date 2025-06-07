import { useState, useCallback } from 'react'
import { toast } from '@/hooks/use-toast'

export function useSuggestionActions() {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set())
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set())
  const [savedSuggestions, setSavedSuggestions] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  const applySuggestion = useCallback(async (suggestionId: string, _content: string) => {
    setIsLoading(true)
    try {
      // Simulate API call to apply suggestion
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setAppliedSuggestions(prev => new Set([...Array.from(prev), suggestionId]))
      toast({
        title: "Suggestion Applied",
        description: "The suggestion has been applied to your resume.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to apply suggestion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const dismissSuggestion = useCallback(async (suggestionId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call to dismiss suggestion
      await new Promise(resolve => setTimeout(resolve, 200))
      
      setDismissedSuggestions(prev => new Set([...Array.from(prev), suggestionId]))
      toast({
        title: "Suggestion Dismissed",
        description: "The suggestion has been dismissed.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to dismiss suggestion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveSuggestion = useCallback(async (suggestionId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call to save suggestion
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setSavedSuggestions(prev => new Set([...Array.from(prev), suggestionId]))
      toast({
        title: "Suggestion Saved",
        description: "The suggestion has been saved for later.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to save suggestion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])
  // Additional methods expected by personalized-suggestions component
  const trackSuggestionClick = useCallback((suggestionId: string, actionType: string) => {
    // Track analytics for suggestion interactions
    // eslint-disable-next-line no-console
    console.log(`Suggestion clicked: ${suggestionId}, action: ${actionType}`)
  }, [])

  const openATSChecker = useCallback((resumeId: string) => {
    // Navigate to ATS checker
    window.location.href = `/dashboard/resumes/${resumeId}?tab=ats-analysis`
  }, [])

  const showGuide = useCallback((guideType: string) => {
    // Show help guide
    toast({
      title: "Guide",
      description: `Opening ${guideType} guide...`,
    })
  }, [])

  const navigateToSection = useCallback((resumeId: string, section: string) => {
    // Navigate to specific resume section
    window.location.href = `/dashboard/resumes/${resumeId}?section=${section}`
  }, [])

  const openContentHelper = useCallback((contentType: string) => {
    // Open content helper tool
    toast({
      title: "Content Helper",
      description: `Opening ${contentType} content helper...`,
    })
  }, [])

  const startKeywordOptimization = useCallback((resumeId: string) => {
    // Start keyword optimization flow
    window.location.href = `/dashboard/resumes/${resumeId}?tab=keywords`
  }, [])

  const downloadTemplate = useCallback((templateType: string) => {
    // Download resume template
    toast({
      title: "Download Template",
      description: `Downloading ${templateType} template...`,
    })
  }, [])

  const undoAction = useCallback((suggestionId: string, actionType: 'apply' | 'dismiss' | 'save') => {
    switch (actionType) {
      case 'apply':
        setAppliedSuggestions(prev => {
          const newSet = new Set(prev)
          newSet.delete(suggestionId)
          return newSet
        })
        break
      case 'dismiss':
        setDismissedSuggestions(prev => {
          const newSet = new Set(prev)
          newSet.delete(suggestionId)
          return newSet
        })
        break
      case 'save':
        setSavedSuggestions(prev => {
          const newSet = new Set(prev)
          newSet.delete(suggestionId)
          return newSet
        })
        break
    }
    
    toast({
      title: "Action Undone",
      description: "The previous action has been undone.",
    })
  }, [])

  const isSuggestionApplied = useCallback((suggestionId: string) => {
    return appliedSuggestions.has(suggestionId)
  }, [appliedSuggestions])

  const isSuggestionDismissed = useCallback((suggestionId: string) => {
    return dismissedSuggestions.has(suggestionId)
  }, [dismissedSuggestions])

  const isSuggestionSaved = useCallback((suggestionId: string) => {
    return savedSuggestions.has(suggestionId)
  }, [savedSuggestions])
  return {
    applySuggestion,
    dismissSuggestion,
    saveSuggestion,
    undoAction,
    isSuggestionApplied,
    isSuggestionDismissed,
    isSuggestionSaved,
    isLoading,
    appliedSuggestions: Array.from(appliedSuggestions),
    dismissedSuggestions: Array.from(dismissedSuggestions),
    savedSuggestions: Array.from(savedSuggestions),
    // Additional methods for personalized suggestions
    trackSuggestionClick,
    openATSChecker,
    showGuide,
    navigateToSection,
    openContentHelper,
    startKeywordOptimization,
    downloadTemplate,
  }
}
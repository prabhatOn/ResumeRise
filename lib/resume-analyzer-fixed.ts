import { detectIndustry, calculateIndustryScore, getIndustryRecommendations } from "./industry-analyzer"
import { extractSections } from "./file-parser"
import { checkATSCompatibility, type ATSCheckResult } from "./ats-checker"
import { performComprehensiveAnalysis } from "./comprehensive-analyzer"
import { keywordProcessor } from "./keyword-processor"
import { nlpAnalyzer, type NLPAnalysisResult } from "./nlp-analyzer"
import { log } from "./logger"

// This is a simplified implementation of the resume analyzer
// In a real application, you would use more sophisticated NLP libraries

interface AnalysisResult {
  atsScore: number
  atsDetails: ATSCheckResult
  keywordScore: number
  grammarScore: number
  formattingScore: number
  sectionScore: number
  actionVerbScore: number
  relevanceScore: number
  bulletPointScore: number
  languageToneScore: number
  lengthScore: number
  industryScore: number
  industry: string
  totalScore: number
  suggestions: string
  industryRecommendations: string[]
  keywords?: Keyword[]
  sections?: Section[]
  issues?: Issue[]
  sectionHeatmap?: SectionHeatmap[]
  // Enhanced NLP analysis
  nlpAnalysis?: NLPAnalysisResult
  // Enhanced analysis
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
      severity: string
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

interface Keyword {
  text: string
  count: number
  isFromJobDescription: boolean
  isMatch: boolean
  category?: string
  importance?: number
  source?: string
}

interface Section {
  name: string
  content: string
  score: number
  suggestions: string
}

interface Issue {
  category: string
  severity: string
  description: string
  lineNumber?: number
  suggestion?: string
}

interface SectionHeatmap {
  name: string
  score: number
  weight: number
}

// List of common action verbs
const actionVerbs = [
  "achieved",
  "improved",
  "trained",
  "maintained",
  "managed",
  "created",
  "resolved",
  "volunteered",
  "influenced",
  "increased",
  "decreased",
  "researched",
  "authored",
  "developed",
  "designed",
  "implemented",
  "launched",
  "spearheaded",
  "coordinated",
  "executed",
]

// Common resume sections
const resumeSections = [
  "summary",
  "objective",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "publications",
  "awards",
  "languages",
  "interests",
]

export async function analyzeResume(
  resumeContent: string,
  jobDescription?: string,
  fileType = "application/pdf",
  fileName = "resume.pdf",
): Promise<AnalysisResult> {
  // Convert to lowercase for easier analysis
  const resumeLower = resumeContent.toLowerCase()

  // Detect industry first
  const industry = detectIndustry(resumeContent)

  // Use enhanced keyword processor
  const processedKeywords = await keywordProcessor.processKeywordsForAnalysis(
    resumeContent,
    jobDescription,
    industry,
    {
      enableAnalytics: true,
      includeCategories: true,
      minKeywordLength: 3,
      maxKeywords: 150
    }
  )

  // Convert to legacy format for compatibility
  const keywords: Keyword[] = processedKeywords.map(pk => ({
    text: pk.text,
    count: pk.count,
    isFromJobDescription: pk.isFromJobDescription,
    isMatch: pk.isMatch,
    category: pk.category,
    importance: pk.importance,
    source: pk.source
  }))
  // Calculate keyword matching metrics
  const matchedKeywords = keywords.filter(k => k.isMatch)
  const jobKeywords = keywords.filter(k => k.isFromJobDescription)
  const keywordMatches = matchedKeywords.length

  // Detect sections
  const detectedSections = detectSections(resumeLower)

  // Extract structured sections
  const structuredSections = extractSections(resumeContent)

  // Perform detailed ATS compatibility check
  const atsDetails = checkATSCompatibility(resumeContent, fileType, fileName)
  const atsScore = atsDetails.score
  // Calculate other scores
  const keywordScore = calculateKeywordScore(keywordMatches, jobKeywords.length)
  
  // Perform NLP analysis for intelligent scoring
  const nlpAnalysis = await nlpAnalyzer.analyzeText(resumeContent)
  
  // AI-powered grammar score based on language metrics and formality
  const grammarScore = Math.round(
    (nlpAnalysis.languageMetrics.formalityScore * 0.6) + 
    (nlpAnalysis.readabilityScore * 0.4)
  )
  
  // AI-powered formatting score based on structure and readability
  const formattingScore = Math.round(
    (nlpAnalysis.readabilityScore * 0.5) + 
    (nlpAnalysis.complexityScore * 0.3) + 
    (calculateStructureScore(resumeContent) * 0.2)
  )
  
  const sectionScore = calculateSectionScore(detectedSections)
  const actionVerbScore = nlpAnalysis.actionVerbScore // Use NLP-calculated action verb score
  const relevanceScore = jobDescription ? calculateRelevanceScore(keywordMatches, jobKeywords.length) : 0
  
  // AI-powered bullet point score based on content analysis
  const bulletPointScore = calculateAIBulletPointScore(resumeContent, nlpAnalysis)
  
  // AI-powered language tone score based on sentiment analysis
  const languageToneScore = Math.round(
    (nlpAnalysis.sentimentScore * 0.7) + 
    (nlpAnalysis.languageMetrics.formalityScore * 0.3)
  )
  
  const lengthScore = calculateLengthScore(resumeContent)

  // Calculate section quality scores
  const sectionQualityScores: Record<string, number> = {}

  Object.keys(structuredSections).forEach((section) => {
    const normalizedSection = section.toLowerCase()
    sectionQualityScores[normalizedSection] = calculateSectionQualityScore(structuredSections[section])
  })

  // Add action verb score
  sectionQualityScores.actionVerbs = actionVerbScore

  // Add formatting score
  sectionQualityScores.formatting = formattingScore

  // Calculate industry-specific score
  const industryScore = calculateIndustryScore(industry, sectionQualityScores)

  // Get industry-specific recommendations
  const industryRecommendations = getIndustryRecommendations(industry)

  // Calculate total score with industry score included
  const totalScore = Math.round(
    atsScore * 0.15 +
      keywordScore * 0.15 +
      grammarScore * 0.1 +
      formattingScore * 0.1 +
      sectionScore * 0.1 +
      actionVerbScore * 0.1 +
      relevanceScore * 0.1 +
      bulletPointScore * 0.05 +
      languageToneScore * 0.05 +
      lengthScore * 0.05 +
      industryScore * 0.05,
  )
  // Generate suggestions
  const suggestions = generateSuggestions(
    atsScore,
    keywordScore,
    grammarScore,
    formattingScore,
    sectionScore,
    actionVerbScore,
    relevanceScore,
    bulletPointScore,
    languageToneScore,
    lengthScore,
    detectedSections,
  )
  
  // Update grammar score based on NLP analysis
  const enhancedGrammarScore = Math.round(
    (grammarScore + nlpAnalysis.languageMetrics.formalityScore) / 2
  )
  
  // Update language tone score based on sentiment analysis
  const enhancedLanguageToneScore = Math.round(
    (languageToneScore + nlpAnalysis.sentimentScore) / 2
  )

  log.info('resume_analysis_completed', {
    atsScore,
    totalScore,
    nlpSentiment: nlpAnalysis.sentimentLabel,
    actionVerbCount: nlpAnalysis.actionVerbCount,
    technicalSkillsCount: nlpAnalysis.technicalSkillsFound.length
  })

  // Perform comprehensive analysis
  const comprehensiveAnalysis = performComprehensiveAnalysis(
    resumeContent,
    jobDescription,
    sectionQualityScores,
    keywords
  )

  // Prepare sections for database
  const sections: Section[] = detectedSections.map((section) => {
    const sectionContent = extractSectionContent(resumeContent, section)
    return {
      name: section,
      content: sectionContent,
      score: calculateSectionQualityScore(sectionContent),
      suggestions: generateSectionSuggestions(section, sectionContent),
    }
  })

  // Convert ATS issues to our issue format
  const atsIssues = atsDetails.issues.map((issue) => ({
    category: "ats_compatibility",
    severity: issue.impact > 15 ? "high" : issue.impact > 8 ? "medium" : "low",
    description: issue.description,
    suggestion: issue.solution,
  }))

  // Prepare issues for database (including ATS issues)
  const issues: Issue[] = [
    ...atsIssues,
    // Example issues - in a real implementation, these would be detected programmatically
    {
      category: "formatting",
      severity: "medium",
      description: "Consider using more bullet points to highlight achievements",
      suggestion: "Convert paragraph text to bullet points for better readability",
    },
    {
      category: "content",
      severity: "high",
      description: "Missing quantifiable achievements",
      suggestion: "Add metrics and numbers to demonstrate impact",
    },
  ]

  // Prepare section heatmap data
  const sectionHeatmap: SectionHeatmap[] = []

  // Add detected sections to heatmap
  detectedSections.forEach((section) => {
    const sectionContent = extractSectionContent(resumeContent, section)
    const score = calculateSectionQualityScore(sectionContent)

    // Determine weight based on industry
    let weight = 1
    if (industry === "tech" && (section === "skills" || section === "projects")) {
      weight = 2
    } else if (industry === "finance" && (section === "experience" || section === "education")) {
      weight = 2
    } else if (industry === "healthcare" && (section === "education" || section === "certifications")) {
      weight = 2
    }

    sectionHeatmap.push({
      name: section,
      score,
      weight,
    })
  })

  return {
    atsScore,
    atsDetails,
    keywordScore,
    grammarScore: enhancedGrammarScore,
    formattingScore,
    sectionScore,
    actionVerbScore: Math.max(actionVerbScore, nlpAnalysis.actionVerbScore),
    relevanceScore,
    bulletPointScore,
    languageToneScore: enhancedLanguageToneScore,
    lengthScore,
    industryScore,
    industry,
    totalScore,
    suggestions,
    industryRecommendations,
    keywords,
    sections,
    issues,
    sectionHeatmap,
    nlpAnalysis,
    comprehensiveAnalysis,
  }
}

// Helper functions

// Helper functions

// Calculate structure score based on formatting and organization
function calculateStructureScore(resumeContent: string): number {
  let score = 50; // Base score
  
  // Check for proper section headers
  const sectionHeaders = (resumeContent.match(/^[A-Z][A-Z\s]+$/gm) || []).length;
  score += Math.min(sectionHeaders * 10, 30);
  
  // Check for consistent formatting
  const bulletPoints = (resumeContent.match(/^[\s]*[•\-\*]/gm) || []).length;
  if (bulletPoints > 0) score += 15;
  
  // Check for proper spacing and structure
  const lineBreaks = (resumeContent.match(/\n\s*\n/g) || []).length;
  if (lineBreaks > 2) score += 10;
  
  return Math.min(score, 100);
}

// AI-powered bullet point scoring
function calculateAIBulletPointScore(resumeContent: string, nlpAnalysis: NLPAnalysisResult): number {
  const bulletPoints = (resumeContent.match(/[\•\-\*]/g) || []).length;
  const sentences = resumeContent.split(/[.!?]+/).length;
  
  let score = 40; // Base score
  
  // Score based on bullet point usage
  const bulletRatio = bulletPoints / sentences;
  if (bulletRatio > 0.3) score += 30;
  else if (bulletRatio > 0.2) score += 20;
  else if (bulletRatio > 0.1) score += 10;
  
  // Bonus for action verbs in bullet points
  if (nlpAnalysis.actionVerbCount > 5) score += 20;
  
  // Bonus for quantifiable achievements
  const numbers = (resumeContent.match(/\d+[%$]?/g) || []).length;
  if (numbers > 3) score += 10;
  
  return Math.min(score, 100);
}

function detectSections(text: string): string[] {
  const detected: string[] = []

  for (const section of resumeSections) {
    if (text.includes(section)) {
      detected.push(section)
    }
  }

  return detected
}

function calculateKeywordScore(matches: number, totalKeywords: number): number {
  if (totalKeywords === 0) return 70 // Default score if no job description

  const matchPercentage = (matches / totalKeywords) * 100
  return Math.min(Math.round(matchPercentage), 100)
}

function calculateSectionScore(detectedSections: string[]): number {
  const essentialSections = ["summary", "experience", "education", "skills"]
  let score = 0

  for (const section of essentialSections) {
    if (detectedSections.includes(section)) {
      score += 25
    }
  }

  return score
}

function calculateRelevanceScore(matches: number, totalKeywords: number): number {
  if (totalKeywords === 0) return 0

  const matchPercentage = (matches / totalKeywords) * 100
  return Math.min(Math.round(matchPercentage), 100)
}

function calculateLengthScore(text: string): number {
  const wordCount = text.split(/\s+/).length

  // Ideal resume length is between 300-700 words
  if (wordCount < 200) return 50
  if (wordCount < 300) return 70
  if (wordCount <= 700) return 100
  if (wordCount <= 900) return 80
  return 60 // Too long
}

function extractSectionContent(text: string, sectionName: string): string {
  // Simplified implementation
  // In a real application, you would use more sophisticated techniques
  const lowerText = text.toLowerCase()
  const sectionIndex = lowerText.indexOf(sectionName)

  if (sectionIndex === -1) return ""

  // Find the start of the section content
  const contentStart = lowerText.indexOf("\n", sectionIndex) + 1

  // Find the end of the section (next section or end of text)
  let contentEnd = text.length
  for (const section of resumeSections) {
    if (section === sectionName) continue

    const nextSectionIndex = lowerText.indexOf(section, contentStart)
    if (nextSectionIndex !== -1 && nextSectionIndex < contentEnd) {
      contentEnd = nextSectionIndex
    }
  }

  return text.substring(contentStart, contentEnd).trim()
}

function calculateSectionQualityScore(sectionContent: string): number {
  // Enhanced implementation using content analysis
  if (!sectionContent) return 0

  const wordCount = sectionContent.split(/\s+/).length
  const bulletPoints = (sectionContent.match(/•|-|\*/g) || []).length
  const hasNumbers = /\d+/.test(sectionContent)
  const actionVerbCount = actionVerbs.filter(verb => 
    sectionContent.toLowerCase().includes(verb)
  ).length

  // Dynamic base score based on content quality
  let score = 40; // Reduced base score for more dynamic calculation
  
  // Content length scoring
  if (wordCount > 50) score += 20;
  else if (wordCount > 30) score += 15;
  else if (wordCount > 15) score += 10;
  
  // Bullet point usage
  if (bulletPoints > 3) score += 20;
  else if (bulletPoints > 0) score += 15;
  
  // Quantifiable achievements
  if (hasNumbers) score += 15;
  
  // Action verb usage
  if (actionVerbCount > 2) score += 15;
  else if (actionVerbCount > 0) score += 10;
  
  // Bonus for well-structured content
  const sentences = sectionContent.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  if (sentences > 2 && bulletPoints > 0) score += 5;

  return Math.min(score, 100)
}

function generateSectionSuggestions(sectionName: string, content: string): string {
  // Simplified implementation
  // In a real application, you would provide more specific suggestions

  if (!content) {
    return `Add a ${sectionName} section to your resume.`
  }

  const wordCount = content.split(/\s+/).length
  const bulletPoints = (content.match(/•|-|\*/g) || []).length
  const hasNumbers = /\d+/.test(content)

  const suggestions = []

  if (sectionName === "experience" || sectionName === "projects") {
    if (bulletPoints === 0) {
      suggestions.push("Use bullet points to highlight achievements.")
    }
    if (!hasNumbers) {
      suggestions.push("Add quantifiable achievements with numbers and percentages.")
    }
    if (wordCount < 50) {
      suggestions.push("Expand this section with more details about your achievements.")
    }
  }

  if (sectionName === "skills") {
    if (wordCount < 20) {
      suggestions.push("Add more relevant skills to this section.")
    }
  }

  return suggestions.join(" ")
}

function generateSuggestions(
  atsScore: number,
  keywordScore: number,
  grammarScore: number,
  formattingScore: number,
  sectionScore: number,
  actionVerbScore: number,
  relevanceScore: number,
  bulletPointScore: number,
  languageToneScore: number,
  lengthScore: number,
  detectedSections: string[],
): string {
  const suggestions = []

  if (atsScore < 80) {
    suggestions.push("Improve ATS compatibility by using standard formatting and avoiding complex layouts.")
  }

  if (keywordScore < 70) {
    suggestions.push("Include more relevant keywords from the job description.")
  }

  if (grammarScore < 80) {
    suggestions.push("Review and improve grammar and spelling throughout the resume.")
  }

  if (formattingScore < 80) {
    suggestions.push("Use consistent formatting with clear headings and bullet points.")
  }

  if (sectionScore < 100) {
    const missingSections = ["summary", "experience", "education", "skills"].filter(
      section => !detectedSections.includes(section)
    )
    if (missingSections.length > 0) {
      suggestions.push(`Add missing sections: ${missingSections.join(", ")}.`)
    }
  }

  if (actionVerbScore < 70) {
    suggestions.push("Use more strong action verbs to describe your achievements.")
  }

  if (relevanceScore < 70 && relevanceScore > 0) {
    suggestions.push("Better align your experience with the job requirements.")
  }

  if (bulletPointScore < 80) {
    suggestions.push("Use bullet points to make your achievements more readable.")
  }

  if (languageToneScore < 80) {
    suggestions.push("Use more professional and confident language.")
  }

  if (lengthScore < 80) {
    suggestions.push("Optimize resume length - aim for 1-2 pages with concise, impactful content.")
  }

  return suggestions.join(" ")
}

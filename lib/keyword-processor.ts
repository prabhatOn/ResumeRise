import { prisma } from "./db"

export interface ProcessedKeyword {
  text: string
  normalizedKeyword: string
  count: number
  isFromJobDescription: boolean
  isMatch: boolean
  category?: string
  importance: number
  source?: string
}

export interface KeywordProcessingOptions {
  enableAnalytics?: boolean
  includeCategories?: boolean
  minKeywordLength?: number
  maxKeywords?: number
}

/**
 * Advanced keyword processor with normalization, categorization, and deduplication
 */
export class KeywordProcessor {
  private stopWords = new Set([
    'and', 'the', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'were',
    'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'can',
    'may', 'might', 'must', 'shall', 'does', 'did', 'not', 'you', 'your',
    'our', 'their', 'his', 'her', 'its', 'they', 'them', 'than', 'then'
  ])

  private technicalKeywordPatterns = [
    /\b(java|python|javascript|typescript|react|angular|vue|node|sql|html|css)\b/gi,
    /\b(aws|azure|gcp|docker|kubernetes|api|rest|graphql|mongodb|postgresql)\b/gi,
    /\b(agile|scrum|devops|ci\/cd|git|github|jenkins|terraform)\b/gi
  ]

  private softSkillPatterns = [
    /\b(leadership|communication|teamwork|problem[\s-]solving|analytical)\b/gi,
    /\b(project[\s-]management|time[\s-]management|critical[\s-]thinking)\b/gi
  ]

  private certificationPatterns = [
    /\b(aws|azure|google|microsoft|cisco|pmp|six[\s-]sigma|scrum[\s-]master)\b/gi,
    /\b(certified|certification|professional|associate|expert|specialist)\b/gi
  ]

  /**
   * Normalize keyword for efficient storage and matching
   */
  private normalizeKeyword(keyword: string): string {
    return keyword
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
      .replace(/\s+/g, ' ') // Normalize whitespace
  }

  /**
   * Categorize keyword based on patterns and context
   */
  private categorizeKeyword(keyword: string, context?: string): string {
    const normalizedKeyword = keyword.toLowerCase()

    // Check technical patterns
    for (const pattern of this.technicalKeywordPatterns) {
      if (pattern.test(normalizedKeyword)) {
        return 'technical'
      }
    }

    // Check soft skill patterns
    for (const pattern of this.softSkillPatterns) {
      if (pattern.test(normalizedKeyword)) {
        return 'soft_skill'
      }
    }

    // Check certification patterns
    for (const pattern of this.certificationPatterns) {
      if (pattern.test(normalizedKeyword)) {
        return 'certification'
      }
    }

    // Context-based categorization
    if (context) {
      const contextLower = context.toLowerCase()
      if (contextLower.includes('skill') || contextLower.includes('technical')) {
        return 'technical'
      }
      if (contextLower.includes('education') || contextLower.includes('certification')) {
        return 'certification'
      }
      if (contextLower.includes('experience') || contextLower.includes('work')) {
        return 'experience'
      }
    }

    return 'general'
  }

  /**
   * Calculate keyword importance based on frequency and industry relevance
   */
  private async calculateImportance(
    keyword: string, 
    industry: string, 
    count: number
  ): Promise<number> {
    try {
      // Check if this keyword is in our industry keywords database
      const industryKeyword = await prisma.industryKeyword.findFirst({
        where: {
          normalizedKeyword: this.normalizeKeyword(keyword),
          industry: industry
        }
      })

      if (industryKeyword) {
        return Math.min(5, industryKeyword.importance + (count > 3 ? 1 : 0))
      }

      // Base importance on frequency and length
      let importance = 1
      if (count > 5) importance += 2
      else if (count > 2) importance += 1
      
      if (keyword.length > 8) importance += 1 // Longer keywords often more specific/important
      
      return Math.min(5, importance)
    } catch (error) {
      console.error('Error calculating keyword importance:', error)
      return 1
    }
  }

  /**
   * Extract and process keywords from text with advanced filtering
   */
  extractKeywords(
    text: string, 
    options: KeywordProcessingOptions = {}
  ): { text: string; count: number; source?: string }[] {
    const { minKeywordLength = 3, maxKeywords = 200 } = options

    // Split text into words and filter
    const words = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length >= minKeywordLength && 
        !this.stopWords.has(word) &&
        !/^\d+$/.test(word) // Exclude pure numbers
      )

    // Count word frequencies
    const wordCounts = new Map<string, number>()
    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
    })

    // Extract multi-word phrases (2-3 words)
    const phrases = this.extractPhrases(text, minKeywordLength)
    phrases.forEach(phrase => {
      wordCounts.set(phrase.text, phrase.count)
    })

    // Convert to array and sort by frequency
    const keywords = Array.from(wordCounts.entries())
      .map(([text, count]) => ({ text, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxKeywords)

    return keywords
  }

  /**
   * Extract meaningful phrases from text
   */
  private extractPhrases(
    text: string, 
    minLength: number
  ): { text: string; count: number }[] {
    const phrases = new Map<string, number>()
    const sentences = text.split(/[.!?]+/)

    sentences.forEach(sentence => {
      const words = sentence
        .toLowerCase()
        .replace(/[^\w\s-]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length >= minLength && !this.stopWords.has(word))

      // Extract 2-word phrases
      for (let i = 0; i < words.length - 1; i++) {
        const phrase = `${words[i]} ${words[i + 1]}`
        if (phrase.length >= minLength * 2) {
          phrases.set(phrase, (phrases.get(phrase) || 0) + 1)
        }
      }

      // Extract 3-word phrases
      for (let i = 0; i < words.length - 2; i++) {
        const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`
        if (phrase.length >= minLength * 3) {
          phrases.set(phrase, (phrases.get(phrase) || 0) + 1)
        }
      }
    })

    return Array.from(phrases.entries())
      .map(([text, count]) => ({ text, count }))
      .filter(phrase => phrase.count >= 2) // Only include phrases that appear multiple times
  }
  /**
   * Process keywords for database storage with enhanced metadata
   */
  async processKeywordsForAnalysis(
    resumeContent: string,
    jobDescription: string | undefined,
    industry: string,
    options: KeywordProcessingOptions = {}
  ): Promise<ProcessedKeyword[]> {
    const keywordMap = new Map<string, ProcessedKeyword>()

    // Extract resume keywords
    const resumeKeywords = this.extractKeywords(resumeContent, options)
    
    // Extract job description keywords
    const jobKeywords = jobDescription 
      ? this.extractKeywords(jobDescription, options)
      : []

    // Process resume keywords
    for (const keyword of resumeKeywords) {
      const normalized = this.normalizeKeyword(keyword.text)
      const category = this.categorizeKeyword(keyword.text, 'resume')
      const importance = await this.calculateImportance(keyword.text, industry, keyword.count)
      
      const isMatch = jobKeywords.some(jk => 
        this.normalizeKeyword(jk.text) === normalized
      )

      keywordMap.set(normalized, {
        text: keyword.text,
        normalizedKeyword: normalized,
        count: keyword.count,
        isFromJobDescription: false,
        isMatch,
        category,
        importance,
        source: 'resume'
      })
    }

    // Process job description keywords
    for (const keyword of jobKeywords) {
      const normalized = this.normalizeKeyword(keyword.text)
      const existing = keywordMap.get(normalized)
      
      if (existing) {
        // Update existing keyword with job description info
        existing.isMatch = true
      } else {
        // Add missing job description keyword
        const category = this.categorizeKeyword(keyword.text, 'job_description')
        const importance = await this.calculateImportance(keyword.text, industry, keyword.count)
        
        keywordMap.set(normalized, {
          text: keyword.text,
          normalizedKeyword: normalized,
          count: 0, // Not in resume
          isFromJobDescription: true,
          isMatch: false,
          category,
          importance,
          source: 'job_description'
        })
      }
    }

    // Update keyword analytics if enabled
    if (options.enableAnalytics) {
      await this.updateKeywordAnalytics(Array.from(keywordMap.values()), industry)
    }

    return Array.from(keywordMap.values())
  }

  /**
   * Update keyword analytics for performance tracking
   */
  private async updateKeywordAnalytics(
    keywords: ProcessedKeyword[], 
    industry: string
  ): Promise<void> {
    try {
      for (const keyword of keywords) {
        await prisma.keywordAnalytics.upsert({
          where: {
            normalizedKeyword_industry: {
              normalizedKeyword: keyword.normalizedKeyword,
              industry: industry
            }
          },
          update: {
            totalOccurrences: {
              increment: keyword.count
            },
            lastSeen: new Date(),
            matchRate: keyword.isMatch ? {
              increment: 0.1 // Gradually increase match rate for matched keywords
            } : undefined
          },
          create: {
            keyword: keyword.text,
            normalizedKeyword: keyword.normalizedKeyword,
            industry: industry,
            totalOccurrences: keyword.count,
            matchRate: keyword.isMatch ? 0.1 : 0.0,
            lastSeen: new Date()
          }
        })
      }
    } catch (error) {
      console.error('Error updating keyword analytics:', error)
    }
  }

  /**
   * Get trending keywords for an industry
   */
  async getTrendingKeywords(industry: string, limit: number = 20): Promise<{
    keyword: string
    matchRate: number
    totalOccurrences: number
  }[]> {
    try {
      const trending = await prisma.keywordAnalytics.findMany({
        where: {
          industry: industry,
          totalOccurrences: {
            gte: 5 // Minimum occurrences to be considered trending
          }
        },
        orderBy: [
          { matchRate: 'desc' },
          { totalOccurrences: 'desc' }
        ],
        take: limit,
        select: {
          keyword: true,
          matchRate: true,
          totalOccurrences: true
        }
      })

      return trending
    } catch (error) {
      console.error('Error getting trending keywords:', error)
      return []
    }
  }

  /**
   * Bulk create keywords with conflict resolution
   */
  async createKeywordsForAnalysis(
    analysisId: number, 
    keywords: ProcessedKeyword[]
  ): Promise<void> {
    try {
      // Use createMany with skipDuplicates to handle unique constraint efficiently
      await prisma.keyword.createMany({
        data: keywords.map(keyword => ({
          analysisId,
          keyword: keyword.text,
          normalizedKeyword: keyword.normalizedKeyword,
          count: keyword.count,
          isFromJobDescription: keyword.isFromJobDescription,
          isMatch: keyword.isMatch,
          category: keyword.category,
          importance: keyword.importance,
          source: keyword.source
        })),
        skipDuplicates: true // Skip duplicates instead of failing
      })
    } catch (error) {
      console.error('Error creating keywords for analysis:', error)
      throw error
    }
  }
}

// Export singleton instance
export const keywordProcessor = new KeywordProcessor()

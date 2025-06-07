// Enhanced NLP analyzer using natural, compromise, and sentiment libraries
import natural from 'natural'
import nlp from 'compromise'
import { SentimentAnalyzer, PorterStemmer } from 'natural'
import { log } from './logger'

// Initialize sentiment analyzer
const stemmer = PorterStemmer
const analyzer = new SentimentAnalyzer('English', stemmer, 'afinn')

// Action verbs for resume analysis
const ACTION_VERBS = [
  'achieved', 'analyzed', 'built', 'created', 'designed', 'developed', 'executed',
  'implemented', 'improved', 'increased', 'led', 'managed', 'optimized', 'organized',
  'performed', 'planned', 'produced', 'reduced', 'solved', 'streamlined', 'supervised',
  'delivered', 'collaborated', 'initiated', 'maintained', 'established', 'enhanced',
  'facilitated', 'generated', 'accelerated', 'administered', 'coordinated', 'conducted'
]

// Technical skills by category
const TECHNICAL_SKILLS = {
  programming: [
    'javascript', 'python', 'java', 'typescript', 'react', 'node.js', 'angular', 'vue',
    'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'c++', 'c#', 'html', 'css'
  ],
  databases: [
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite',
    'oracle', 'cassandra', 'dynamodb', 'firestore'
  ],
  cloud: [
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible',
    'jenkins', 'ci/cd', 'microservices', 'serverless'
  ],
  tools: [
    'git', 'jira', 'confluence', 'slack', 'figma', 'adobe', 'photoshop',
    'illustrator', 'sketch', 'postman', 'tableau', 'power bi'
  ]
}

export interface NLPAnalysisResult {
  sentimentScore: number
  sentimentLabel: string
  readabilityScore: number
  complexityScore: number
  actionVerbCount: number
  actionVerbScore: number
  technicalSkillsFound: string[]
  technicalSkillsScore: number
  grammarIssues: Array<{
    type: string
    text: string
    suggestion: string
    position: number
  }>
  languageMetrics: {
    wordCount: number
    sentenceCount: number
    averageWordsPerSentence: number
    uniqueWordRatio: number
    formalityScore: number
  }
  keyPhrases: Array<{
    phrase: string
    frequency: number
    importance: number
  }>
}

export class NLPAnalyzer {
  private tokenizer: natural.WordTokenizer
  private stemmer: typeof PorterStemmer
  
  constructor() {
    this.tokenizer = new natural.WordTokenizer()
    this.stemmer = PorterStemmer
  }

  public async analyzeText(text: string): Promise<NLPAnalysisResult> {
    const startTime = Date.now()
    
    try {
      // Tokenize and clean text
      const tokens = this.tokenizer.tokenize(text.toLowerCase()) || []
      const cleanTokens = tokens.filter(token => token.length > 2 && /^[a-zA-Z]+$/.test(token))
      
      // Sentiment analysis
      const sentimentResult = this.analyzeSentiment(cleanTokens)
      
      // Readability analysis
      const readabilityScore = this.calculateReadability(text, tokens)
      
      // Complexity analysis
      const complexityScore = this.calculateComplexity(text, tokens)
      
      // Action verb analysis
      const actionVerbAnalysis = this.analyzeActionVerbs(tokens)
      
      // Technical skills analysis
      const technicalSkillsAnalysis = this.analyzeTechnicalSkills(tokens)
      
      // Grammar and language analysis
      const grammarAnalysis = this.analyzeGrammar(text)
      
      // Language metrics
      const languageMetrics = this.calculateLanguageMetrics(text, tokens)
      
      // Key phrases extraction
      const keyPhrases = this.extractKeyPhrases(text)
      
      const result: NLPAnalysisResult = {
        sentimentScore: sentimentResult.score,
        sentimentLabel: sentimentResult.label,
        readabilityScore,
        complexityScore,
        actionVerbCount: actionVerbAnalysis.count,
        actionVerbScore: actionVerbAnalysis.score,
        technicalSkillsFound: technicalSkillsAnalysis.skills,
        technicalSkillsScore: technicalSkillsAnalysis.score,
        grammarIssues: grammarAnalysis,
        languageMetrics,
        keyPhrases
      }

      log.performance('nlp_analysis', Date.now() - startTime, {
        textLength: text.length,
        tokenCount: tokens.length,
        sentimentScore: result.sentimentScore
      })

      return result    } catch (error) {
      log.error('nlp_analysis_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        textLength: text.length
      })
      
      // Return default values on error
      return {
        sentimentScore: 0,
        sentimentLabel: 'neutral',
        readabilityScore: 50,
        complexityScore: 50,
        actionVerbCount: 0,
        actionVerbScore: 0,
        technicalSkillsFound: [],
        technicalSkillsScore: 0,
        grammarIssues: [],
        languageMetrics: {
          wordCount: 0,
          sentenceCount: 0,
          averageWordsPerSentence: 0,
          uniqueWordRatio: 0,
          formalityScore: 50
        },
        keyPhrases: []
      }
    }
  }

  private analyzeSentiment(tokens: string[]): { score: number, label: string } {
    try {
      const stemmedTokens = tokens.map(token => this.stemmer.stem(token))
      const score = analyzer.getSentiment(stemmedTokens)
      
      // Convert score to 0-100 scale
      const normalizedScore = Math.max(0, Math.min(100, (score + 1) * 50))
      
      let label = 'neutral'
      if (score > 0.1) label = 'positive'
      else if (score < -0.1) label = 'negative'
      
      return { score: normalizedScore, label }
    } catch (error) {
      return { score: 50, label: 'neutral' }
    }
  }

  private calculateReadability(text: string, tokens: string[]): number {
    try {
      // Simple readability score based on sentence length and word complexity
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const averageWordsPerSentence = tokens.length / sentences.length
      const complexWords = tokens.filter(token => token.length > 6).length
      const complexWordRatio = complexWords / tokens.length
      
      // Higher score = more readable (shorter sentences, simpler words)
      const readabilityScore = Math.max(0, Math.min(100, 
        100 - (averageWordsPerSentence * 2) - (complexWordRatio * 30)
      ))
      
      return Math.round(readabilityScore)
    } catch (error) {
      return 50
    }
  }

  private calculateComplexity(text: string, tokens: string[]): number {
    try {
      // Complexity based on vocabulary diversity and sentence structure
      const uniqueTokens = new Set(tokens)
      const vocabularyDiversity = uniqueTokens.size / tokens.length
      const averageWordLength = tokens.reduce((sum, token) => sum + token.length, 0) / tokens.length
      
      // Higher complexity = more diverse vocabulary and longer words
      const complexityScore = Math.min(100, 
        (vocabularyDiversity * 80) + (averageWordLength * 5)
      )
      
      return Math.round(complexityScore)
    } catch (error) {
      return 50
    }
  }

  private analyzeActionVerbs(tokens: string[]): { count: number, score: number } {
    try {
      const actionVerbsFound = tokens.filter(token => 
        ACTION_VERBS.includes(token.toLowerCase())
      )
      
      const count = actionVerbsFound.length
      // Score based on action verb density (aim for 1 action verb per 20-30 words)
      const idealRatio = 0.04 // 4%
      const actualRatio = count / tokens.length
      const score = Math.min(100, (actualRatio / idealRatio) * 100)
      
      return { count, score: Math.round(score) }
    } catch (error) {
      return { count: 0, score: 0 }
    }
  }

  private analyzeTechnicalSkills(tokens: string[]): { skills: string[], score: number } {
    try {
      const allSkills = [
        ...TECHNICAL_SKILLS.programming,
        ...TECHNICAL_SKILLS.databases,
        ...TECHNICAL_SKILLS.cloud,
        ...TECHNICAL_SKILLS.tools
      ]
      
      const skillsFound = allSkills.filter(skill => 
        tokens.some(token => token.toLowerCase().includes(skill.toLowerCase()))
      )
        // Remove duplicates and sort by relevance
      const uniqueSkills = Array.from(new Set(skillsFound))
      
      // Score based on number and diversity of technical skills
      const score = Math.min(100, uniqueSkills.length * 5)
      
      return { skills: uniqueSkills, score }
    } catch (error) {
      return { skills: [], score: 0 }
    }
  }

  private analyzeGrammar(text: string): Array<{ type: string, text: string, suggestion: string, position: number }> {
    try {
      const issues: Array<{ type: string, text: string, suggestion: string, position: number }> = []
      
      // Use compromise for basic grammar analysis
      const doc = nlp(text)
        // Check for passive voice
      const passiveVoice = doc.match('#Verb [be] #PastTense').out('array')
      passiveVoice.forEach((phrase: string, index: number) => {
        issues.push({
          type: 'passive_voice',
          text: phrase,
          suggestion: 'Consider using active voice for stronger impact',
          position: index
        })
      })
      
      // Check for weak words
      const weakWords = ['very', 'really', 'quite', 'somewhat', 'rather']
      weakWords.forEach(word => {
        const matches = doc.match(word).out('array')
        matches.forEach((match: string, index: number) => {
          issues.push({
            type: 'weak_word',
            text: match,
            suggestion: `Consider removing or replacing "${word}" with a stronger word`,
            position: index
          })
        })
      })
      
      return issues.slice(0, 10) // Limit to 10 issues
    } catch (error) {
      return []
    }
  }

  private calculateLanguageMetrics(text: string, tokens: string[]): NLPAnalysisResult['languageMetrics'] {
    try {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const uniqueWords = new Set(tokens.map(token => token.toLowerCase()))
      
      // Formality score based on formal vs informal words
      const formalWords = tokens.filter(token => 
        ['achievement', 'accomplishment', 'professional', 'experience', 'expertise', 'proficient'].includes(token.toLowerCase())
      ).length
      const informalWords = tokens.filter(token => 
        ['stuff', 'things', 'lots', 'great', 'awesome', 'cool'].includes(token.toLowerCase())
      ).length
      
      const formalityScore = Math.min(100, Math.max(0, 
        50 + ((formalWords - informalWords) * 10)
      ))
      
      return {
        wordCount: tokens.length,
        sentenceCount: sentences.length,
        averageWordsPerSentence: Math.round(tokens.length / sentences.length * 10) / 10,
        uniqueWordRatio: Math.round(uniqueWords.size / tokens.length * 100) / 100,
        formalityScore: Math.round(formalityScore)
      }
    } catch (error) {
      return {
        wordCount: 0,
        sentenceCount: 0,
        averageWordsPerSentence: 0,
        uniqueWordRatio: 0,
        formalityScore: 50
      }
    }
  }

  private extractKeyPhrases(text: string): Array<{ phrase: string, frequency: number, importance: number }> {
    try {
      const doc = nlp(text)
      
      // Extract noun phrases
      const nounPhrases = doc.match('#Adjective? #Noun+').out('array')
        // Count frequency
      const phraseFreq: { [key: string]: number } = {}
      nounPhrases.forEach((phrase: string) => {
        const normalized = phrase.toLowerCase().trim()
        if (normalized.length > 3) {
          phraseFreq[normalized] = (phraseFreq[normalized] || 0) + 1
        }
      })
      
      // Convert to array and calculate importance
      const keyPhrases = Object.entries(phraseFreq)
        .map(([phrase, frequency]) => ({
          phrase,
          frequency,
          importance: frequency * phrase.split(' ').length // Longer phrases get higher importance
        }))
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 20) // Top 20 key phrases
      
      return keyPhrases
    } catch (error) {
      return []
    }
  }
}

// Singleton instance
export const nlpAnalyzer = new NLPAnalyzer()

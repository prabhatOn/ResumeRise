// Industry keywords for detection
const industryKeywords: Record<string, string[]> = {
  tech: [
    "software",
    "developer",
    "engineer",
    "programming",
    "code",
    "java",
    "python",
    "javascript",
    "react",
    "angular",
    "node",
    "aws",
    "cloud",
    "devops",
    "fullstack",
    "frontend",
    "backend",
    "web",
    "mobile",
    "app",
    "database",
    "sql",
    "nosql",
    "machine learning",
    "artificial intelligence",
    "data science",
    "algorithm",
  ],
  finance: [
    "finance",
    "accounting",
    "investment",
    "banking",
    "financial",
    "analyst",
    "portfolio",
    "trading",
    "stocks",
    "bonds",
    "securities",
    "audit",
    "tax",
    "budget",
    "forecast",
    "revenue",
    "profit",
    "loss",
    "balance sheet",
    "income statement",
    "cash flow",
    "equity",
    "asset",
    "liability",
    "hedge fund",
    "private equity",
  ],
  healthcare: [
    "healthcare",
    "medical",
    "clinical",
    "patient",
    "doctor",
    "nurse",
    "physician",
    "hospital",
    "pharmacy",
    "pharmaceutical",
    "health",
    "care",
    "treatment",
    "diagnosis",
    "therapy",
    "medicine",
    "surgery",
    "laboratory",
    "research",
    "biotech",
    "life science",
    "clinical trial",
    "regulatory",
  ],
  marketing: [
    "marketing",
    "brand",
    "advertising",
    "market research",
    "digital marketing",
    "social media",
    "content",
    "seo",
    "sem",
    "campaign",
    "customer",
    "consumer",
    "product",
    "promotion",
    "public relations",
    "communications",
    "creative",
    "strategy",
    "analytics",
    "conversion",
    "engagement",
    "audience",
  ],
  legal: [
    "legal",
    "law",
    "attorney",
    "lawyer",
    "counsel",
    "litigation",
    "contract",
    "compliance",
    "regulation",
    "policy",
    "legislation",
    "court",
    "judge",
    "paralegal",
    "intellectual property",
    "patent",
    "trademark",
    "copyright",
  ],
}

// Detect the most likely industry based on resume content
export function detectIndustry(resumeText: string): string {
  const text = resumeText.toLowerCase()

  // Count matches for each industry
  const matches: Record<string, number> = {}

  Object.keys(industryKeywords).forEach((industry) => {
    matches[industry] = 0

    industryKeywords[industry].forEach((keyword) => {
      // Count occurrences of each keyword
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, "gi")
      const occurrences = (text.match(regex) || []).length
      matches[industry] += occurrences
    })
  })

  // Find industry with most matches
  let maxMatches = 0
  let detectedIndustry = "general"

  Object.keys(matches).forEach((industry) => {
    if (matches[industry] > maxMatches) {
      maxMatches = matches[industry]
      detectedIndustry = industry
    }
  })

  return detectedIndustry
}

// Industry-specific scoring criteria
const industryCriteria: Record<string, Record<string, number>> = {
  tech: {
    technicalSkillsWeight: 0.25,
    projectsWeight: 0.2,
    experienceWeight: 0.2,
    educationWeight: 0.15,
    certificationWeight: 0.1,
    actionVerbWeight: 0.05,
    formattingWeight: 0.05,
  },
  finance: {
    experienceWeight: 0.25,
    technicalSkillsWeight: 0.2,
    educationWeight: 0.2,
    certificationWeight: 0.15,
    actionVerbWeight: 0.1,
    formattingWeight: 0.05,
    projectsWeight: 0.05,
  },
  healthcare: {
    educationWeight: 0.25,
    certificationWeight: 0.2,
    experienceWeight: 0.2,
    technicalSkillsWeight: 0.15,
    actionVerbWeight: 0.1,
    formattingWeight: 0.05,
    projectsWeight: 0.05,
  },
  marketing: {
    experienceWeight: 0.25,
    projectsWeight: 0.2,
    technicalSkillsWeight: 0.15,
    actionVerbWeight: 0.15,
    educationWeight: 0.1,
    formattingWeight: 0.1,
    certificationWeight: 0.05,
  },
  legal: {
    educationWeight: 0.25,
    experienceWeight: 0.25,
    certificationWeight: 0.2,
    technicalSkillsWeight: 0.1,
    actionVerbWeight: 0.1,
    formattingWeight: 0.05,
    projectsWeight: 0.05,
  },
  general: {
    experienceWeight: 0.2,
    educationWeight: 0.2,
    technicalSkillsWeight: 0.15,
    projectsWeight: 0.15,
    actionVerbWeight: 0.1,
    certificationWeight: 0.1,
    formattingWeight: 0.1,
  },
}

// Calculate industry-specific score
export function calculateIndustryScore(industry: string, sectionScores: Record<string, number>): number {
  const criteria = industryCriteria[industry] || industryCriteria.general

  let totalScore = 0

  // Map section scores to criteria weights
  if (sectionScores.skills) {
    totalScore += sectionScores.skills * criteria.technicalSkillsWeight
  }

  if (sectionScores.projects) {
    totalScore += sectionScores.projects * criteria.projectsWeight
  }

  if (sectionScores.experience) {
    totalScore += sectionScores.experience * criteria.experienceWeight
  }

  if (sectionScores.education) {
    totalScore += sectionScores.education * criteria.educationWeight
  }

  if (sectionScores.certifications) {
    totalScore += sectionScores.certifications * criteria.certificationWeight
  }

  if (sectionScores.actionVerbs) {
    totalScore += sectionScores.actionVerbs * criteria.actionVerbWeight
  }

  if (sectionScores.formatting) {
    totalScore += sectionScores.formatting * criteria.formattingWeight
  }

  return Math.round(totalScore)
}

// Get industry-specific recommendations
export function getIndustryRecommendations(industry: string): string[] {
  const recommendations: Record<string, string[]> = {
    tech: [
      "Highlight specific programming languages and technologies in a dedicated technical skills section",
      "Include GitHub/portfolio links to showcase your code",
      "Quantify your achievements with metrics (e.g., improved performance by 30%)",
      "List specific technical projects with your role and technologies used",
      "Include system design or architecture experience if applicable",
    ],
    finance: [
      "Emphasize financial certifications (CFA, CPA, etc.)",
      "Highlight experience with financial software and tools",
      "Include quantitative achievements and financial metrics",
      "Demonstrate knowledge of regulations and compliance",
      "Showcase analytical and modeling skills",
    ],
    healthcare: [
      "List all relevant certifications and licenses prominently",
      "Include experience with electronic health record (EHR) systems",
      "Highlight patient care metrics and outcomes if applicable",
      "Emphasize knowledge of healthcare regulations (HIPAA, etc.)",
      "Include specialized medical knowledge or procedures",
    ],
    marketing: [
      "Showcase campaign results with specific metrics (ROI, conversion rates, etc.)",
      "Highlight experience with marketing tools and platforms",
      "Include examples of creative work or content creation",
      "Demonstrate knowledge of analytics and data-driven decision making",
      "Emphasize brand strategy and positioning experience",
    ],
    legal: [
      "Highlight specific areas of legal expertise",
      "Include case outcomes and settlements if applicable",
      "Emphasize research and writing skills",
      "List relevant bar admissions and jurisdictions",
      "Showcase knowledge of specific regulations and compliance areas",
    ],
    general: [
      "Tailor your resume to the specific job description",
      "Quantify achievements with specific metrics",
      "Use strong action verbs to begin bullet points",
      "Ensure consistent formatting throughout",
      "Include relevant certifications and technical skills",
    ],
  }

  return recommendations[industry] || recommendations.general
}

// Get detailed industry fit analysis with explanation
export function getDetailedIndustryAnalysis(
  industry: string, 
  industryScore: number, 
  resumeText: string,
  sectionScores: Record<string, number>
): {
  analysis: string
  strengths: string[]
  improvements: string[]
  keyWords: string[]
  missingElements: string[]
} {
  const text = resumeText.toLowerCase()
  const criteria = industryCriteria[industry] || industryCriteria.general
  
  // Analyze keyword presence
  const presentKeywords = industryKeywords[industry]?.filter(keyword => {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, "gi")
    return regex.test(text)
  }) || []
  
  const missingKeywords = industryKeywords[industry]?.filter(keyword => {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, "gi")
    return !regex.test(text)
  }) || []

  // Analyze section performance
  const strongSections = Object.entries(sectionScores)
    .filter(([section, score]) => score >= 80)
    .map(([section]) => section)
  
  const weakSections = Object.entries(sectionScores)
    .filter(([section, score]) => score < 60)
    .map(([section]) => section)

  const analysis = generateIndustryAnalysisText(industry, industryScore, strongSections, weakSections, presentKeywords.length, missingKeywords.length)
  
  const strengths = generateStrengthsAnalysis(industry, strongSections, presentKeywords, sectionScores)
  const improvements = generateImprovementsAnalysis(industry, weakSections, missingKeywords, sectionScores, criteria)
  
  const missingElements = generateMissingElementsAnalysis(industry, text)

  return {
    analysis,
    strengths,
    improvements,
    keyWords: presentKeywords.slice(0, 15), // Show top 15 matched keywords
    missingElements
  }
}

function generateIndustryAnalysisText(
  industry: string, 
  score: number, 
  strongSections: string[], 
  weakSections: string[], 
  keywordMatches: number,
  missingKeywords: number
): string {
  const industryName = industry.charAt(0).toUpperCase() + industry.slice(1)
  
  let analysis = `Your resume shows a ${score}/100 fit for ${industryName} positions. `
  
  if (score >= 85) {
    analysis += `This is an excellent match! Your resume demonstrates strong alignment with ${industryName} industry expectations.`
  } else if (score >= 70) {
    analysis += `This is a good match with room for optimization. Your resume shows solid foundation for ${industryName} roles.`
  } else if (score >= 55) {
    analysis += `This is a moderate match. While you have some relevant elements, significant improvements could better position you for ${industryName} roles.`
  } else {
    analysis += `This shows limited alignment with ${industryName} requirements. Substantial improvements are needed to strengthen your candidacy.`
  }

  analysis += ` You have ${keywordMatches} relevant industry keywords, but are missing ${missingKeywords} important terms.`
  
  if (strongSections.length > 0) {
    analysis += ` Your strongest areas include: ${strongSections.join(', ')}.`
  }
  
  if (weakSections.length > 0) {
    analysis += ` Areas needing improvement: ${weakSections.join(', ')}.`
  }

  return analysis
}

function generateStrengthsAnalysis(
  industry: string, 
  strongSections: string[], 
  presentKeywords: string[], 
  sectionScores: Record<string, number>
): string[] {
  const strengths: string[] = []
  
  if (strongSections.includes('skills') || strongSections.includes('technical skills')) {
    strengths.push(`Strong technical skills section showcases relevant ${industry} expertise`)
  }
  
  if (strongSections.includes('experience')) {
    strengths.push(`Well-developed experience section demonstrates practical ${industry} knowledge`)
  }
  
  if (strongSections.includes('projects')) {
    strengths.push(`Project portfolio effectively highlights hands-on ${industry} experience`)
  }
  
  if (strongSections.includes('education')) {
    strengths.push(`Educational background aligns well with ${industry} requirements`)
  }
  
  if (presentKeywords.length >= 10) {
    strengths.push(`Good use of industry-specific terminology (${presentKeywords.length} relevant keywords found)`)
  }
  
  if (sectionScores.actionVerbs >= 80) {
    strengths.push("Strong use of action verbs demonstrates impact and initiative")
  }
  
  if (sectionScores.formatting >= 85) {
    strengths.push("Professional formatting enhances readability and ATS compatibility")
  }

  return strengths.length > 0 ? strengths : ["Resume demonstrates basic professional structure and content organization"]
}

function generateImprovementsAnalysis(
  industry: string, 
  weakSections: string[], 
  missingKeywords: string[], 
  sectionScores: Record<string, number>,
  criteria: Record<string, number>
): string[] {
  const improvements: string[] = []
  
  // Industry-specific improvements based on weak sections
  if (weakSections.includes('skills') && criteria.technicalSkillsWeight > 0.15) {
    improvements.push(`Expand technical skills section - it's crucial for ${industry} roles (${Math.round(criteria.technicalSkillsWeight * 100)}% of industry score)`)
  }
  
  if (weakSections.includes('experience') && criteria.experienceWeight > 0.15) {
    improvements.push(`Strengthen experience section with more detailed achievements (${Math.round(criteria.experienceWeight * 100)}% of industry score)`)
  }
  
  if (weakSections.includes('projects') && criteria.projectsWeight > 0.15) {
    improvements.push(`Add relevant project portfolio to demonstrate practical application (${Math.round(criteria.projectsWeight * 100)}% of industry score)`)
  }
  
  if (weakSections.includes('education') && criteria.educationWeight > 0.15) {
    improvements.push(`Enhance education section with relevant coursework and achievements (${Math.round(criteria.educationWeight * 100)}% of industry score)`)
  }
  
  if (missingKeywords.length > 10) {
    improvements.push(`Incorporate more industry-specific keywords (missing ${missingKeywords.length} important terms)`)
  }
  
  if (sectionScores.actionVerbs < 70) {
    improvements.push("Use more powerful action verbs to describe achievements and responsibilities")
  }
  
  if (sectionScores.formatting < 80) {
    improvements.push("Improve formatting consistency for better professional presentation")
  }

  return improvements.length > 0 ? improvements : ["Focus on adding more quantifiable achievements and industry-specific terminology"]
}

function generateMissingElementsAnalysis(
  industry: string, 
  resumeText: string
): string[] {
  const missing: string[] = []
  const text = resumeText.toLowerCase()
  
  // Check for common missing elements by industry
  const industryChecks: Record<string, { element: string; keywords: string[]; description: string }[]> = {
    tech: [
      { element: "Version Control", keywords: ["git", "github", "gitlab", "svn"], description: "Version control experience (Git, GitHub, etc.)" },
      { element: "Cloud Platforms", keywords: ["aws", "azure", "gcp", "cloud"], description: "Cloud platform experience (AWS, Azure, GCP)" },
      { element: "Agile/Scrum", keywords: ["agile", "scrum", "kanban", "sprint"], description: "Agile methodology experience" },
      { element: "Testing", keywords: ["test", "testing", "unit test", "integration"], description: "Testing and quality assurance experience" },
      { element: "CI/CD", keywords: ["ci/cd", "jenkins", "pipeline", "deployment"], description: "Continuous integration/deployment experience" }
    ],
    finance: [
      { element: "Financial Modeling", keywords: ["model", "modeling", "financial model", "valuation"], description: "Financial modeling and valuation skills" },
      { element: "Risk Management", keywords: ["risk", "risk management", "var", "stress test"], description: "Risk assessment and management experience" },
      { element: "Regulatory Knowledge", keywords: ["sec", "compliance", "regulation", "audit"], description: "Regulatory compliance and audit experience" },
      { element: "Financial Software", keywords: ["bloomberg", "excel", "sql", "tableau"], description: "Proficiency with financial software and tools" }
    ],
    healthcare: [
      { element: "Clinical Experience", keywords: ["clinical", "patient", "bedside", "rounds"], description: "Direct patient care or clinical experience" },
      { element: "EHR Systems", keywords: ["ehr", "electronic health", "epic", "cerner"], description: "Electronic health record system experience" },
      { element: "Medical Certifications", keywords: ["board certified", "license", "certification", "cme"], description: "Professional medical certifications and licenses" },
      { element: "Research Experience", keywords: ["research", "clinical trial", "publication", "study"], description: "Medical research or clinical trial experience" }
    ],
    marketing: [
      { element: "Digital Marketing", keywords: ["seo", "sem", "ppc", "google ads"], description: "Digital marketing and SEO experience" },
      { element: "Analytics Tools", keywords: ["google analytics", "adobe", "hubspot", "salesforce"], description: "Marketing analytics and automation tools" },
      { element: "Content Creation", keywords: ["content", "copywriting", "creative", "brand"], description: "Content creation and brand management" },
      { element: "Campaign Management", keywords: ["campaign", "roi", "conversion", "attribution"], description: "Marketing campaign management and optimization" }
    ],
    legal: [
      { element: "Legal Research", keywords: ["westlaw", "lexis", "research", "brief"], description: "Legal research and brief writing experience" },
      { element: "Court Experience", keywords: ["litigation", "court", "trial", "deposition"], description: "Litigation and court appearance experience" },
      { element: "Contract Management", keywords: ["contract", "agreement", "negotiation", "draft"], description: "Contract drafting and negotiation skills" },
      { element: "Compliance", keywords: ["compliance", "regulatory", "policy", "procedure"], description: "Regulatory compliance and policy development" }
    ]
  }
  
  const checks = industryChecks[industry] || []
  
  checks.forEach(check => {
    const hasElement = check.keywords.some(keyword => {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, "gi")
      return regex.test(text)
    })
    
    if (!hasElement) {
      missing.push(check.description)
    }
  })
  
  // Check for quantifiable achievements
  const hasNumbers = /\d+[\%]?/.test(text)
  if (!hasNumbers) {
    missing.push("Quantifiable achievements with specific numbers and percentages")
  }
  
  // Check for action verbs at beginning of bullet points
  const bulletPoints = text.match(/[•\-\*]\s*[a-z]/gi) || []
  const actionVerbBullets = bulletPoints.filter(bullet => {
    const firstWord = bullet.replace(/[•\-\*]\s*/, '').split(' ')[0]
    return actionVerbs.includes(firstWord.toLowerCase())
  })
  
  if (bulletPoints.length > 0 && actionVerbBullets.length / bulletPoints.length < 0.7) {
    missing.push("More action verbs at the beginning of bullet points")
  }

  return missing
}

// Enhanced action verbs list for checking
const actionVerbs = [
  "achieved", "improved", "trained", "maintained", "managed", "created", "resolved",
  "volunteered", "influenced", "increased", "decreased", "researched", "authored",
  "developed", "designed", "implemented", "launched", "spearheaded", "coordinated",
  "executed", "optimized", "streamlined", "established", "initiated", "built",
  "led", "supervised", "mentored", "delivered", "exceeded", "generated", "reduced",
  "saved", "accelerated", "transformed", "revitalized", "strengthened", "enhanced"
]

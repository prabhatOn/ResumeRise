import { detectIndustry, getDetailedIndustryAnalysis } from "./industry-analyzer"

interface ComprehensiveIssue {
  id: string
  category: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  impact: string
  solution: string
  examples?: string[]
  lineNumbers?: number[]
  priority: number
}

interface ComprehensiveAnalysis {
  overallScore: number
  industryFit: {
    score: number
    analysis: string
    strengths: string[]
    improvements: string[]
    keyWords: string[]
    missingElements: string[]
  }
  issues: ComprehensiveIssue[]
  strengths: string[]
  quickWins: ComprehensiveIssue[]
  actionPlan: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
}

export function performComprehensiveAnalysis(
  resumeContent: string,
  jobDescription?: string,
  sectionScores?: Record<string, number>,
  keywords?: { text: string; count: number; isMatch: boolean }[]
): ComprehensiveAnalysis {
  const industry = detectIndustry(resumeContent)
  const text = resumeContent.toLowerCase()
  const lines = resumeContent.split('\n')
  
  // Default section scores if not provided
  const defaultSectionScores = sectionScores || {
    skills: 75,
    experience: 80,
    education: 70,
    projects: 65,
    actionVerbs: 70,
    formatting: 75
  }

  // Get detailed industry analysis
  const industryFit = getDetailedIndustryAnalysis(industry, 75, resumeContent, defaultSectionScores)

  // Analyze comprehensive issues
  const issues = analyzeComprehensiveIssues(resumeContent, lines, industry, jobDescription, keywords)
  
  // Calculate overall score
  const overallScore = calculateOverallScore(issues, defaultSectionScores)
  
  // Identify strengths
  const strengths = identifyStrengths(resumeContent, defaultSectionScores, keywords)
  
  // Find quick wins (easy fixes with high impact)
  const quickWins = issues.filter(issue => 
    issue.severity !== "critical" && 
    issue.category === "formatting" || 
    issue.category === "content_structure" ||
    issue.category === "keywords"
  ).slice(0, 5)

  // Create action plan
  const actionPlan = createActionPlan(issues, industryFit.improvements)
  return {
    overallScore,
    industryFit: {
      score: 75, // Default industry score, will be calculated properly
      ...industryFit
    },
    issues: issues.sort((a, b) => b.priority - a.priority),
    strengths,
    quickWins,
    actionPlan
  }
}

function analyzeComprehensiveIssues(
  resumeContent: string,
  lines: string[],
  industry: string,
  jobDescription?: string,
  keywords?: { text: string; count: number; isMatch: boolean }[]
): ComprehensiveIssue[] {
  const issues: ComprehensiveIssue[] = []
  const text = resumeContent.toLowerCase()

  // 1. Contact Information Issues
  issues.push(...analyzeContactInformation(resumeContent, lines))

  // 2. Professional Summary Issues
  issues.push(...analyzeProfessionalSummary(resumeContent, lines))

  // 3. Experience Section Issues
  issues.push(...analyzeExperienceSection(resumeContent, lines, industry))

  // 4. Skills Section Issues
  issues.push(...analyzeSkillsSection(resumeContent, lines, industry))

  // 5. Education Section Issues
  issues.push(...analyzeEducationSection(resumeContent, lines))

  // 6. Formatting and ATS Issues
  issues.push(...analyzeFormattingAndATS(resumeContent, lines))

  // 7. Content Quality Issues
  issues.push(...analyzeContentQuality(resumeContent, lines))

  // 8. Keyword Optimization Issues
  if (jobDescription && keywords) {
    issues.push(...analyzeKeywordOptimization(jobDescription, keywords, resumeContent))
  }

  // 9. Industry-Specific Issues
  issues.push(...analyzeIndustrySpecificIssues(resumeContent, industry))

  // 10. Length and Structure Issues
  issues.push(...analyzeLengthAndStructure(resumeContent, lines))

  return issues
}

function analyzeContactInformation(resumeContent: string, lines: string[]): ComprehensiveIssue[] {
  const issues: ComprehensiveIssue[] = []
  const text = resumeContent.toLowerCase()

  // Check for email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  if (!emailRegex.test(text)) {
    issues.push({
      id: "contact_no_email",
      category: "contact_information",
      severity: "critical",
      title: "Missing Email Address",
      description: "Your resume doesn't include an email address in the contact section.",
      impact: "Recruiters cannot contact you, making your resume essentially useless.",
      solution: "Add a professional email address at the top of your resume. Use firstname.lastname@domain.com format.",
      priority: 100
    })
  }

  // Check for unprofessional email
  const unprofessionalEmails = ["hotmail", "yahoo", "aol", "live"]
  const emailMatch = text.match(emailRegex)?.[0]
  if (emailMatch && unprofessionalEmails.some(domain => emailMatch.includes(domain))) {
    issues.push({
      id: "contact_unprofessional_email",
      category: "contact_information", 
      severity: "medium",
      title: "Unprofessional Email Provider",
      description: "Using an outdated email provider can make you appear less tech-savvy.",
      impact: "May create a negative first impression with recruiters.",
      solution: "Consider switching to Gmail or creating a custom domain email for better professional appearance.",
      priority: 40
    })
  }

  // Check for phone number
  const phoneRegex = /[\+]?[1-9]?[\-\s\(\)]?[\d\-\s\(\)]{10,}/
  if (!phoneRegex.test(text)) {
    issues.push({
      id: "contact_no_phone",
      category: "contact_information",
      severity: "high",
      title: "Missing Phone Number",
      description: "No phone number found in your contact information.",
      impact: "Recruiters prefer to call candidates for quick screening conversations.",
      solution: "Add your phone number with area code. Format: (555) 123-4567 or +1-555-123-4567 for international.",
      priority: 80
    })
  }

  // Check for LinkedIn
  if (!text.includes("linkedin") && !text.includes("in/")) {
    issues.push({
      id: "contact_no_linkedin",
      category: "contact_information",
      severity: "medium",
      title: "Missing LinkedIn Profile",
      description: "LinkedIn profile URL not found in contact information.",
      impact: "Recruiters often check LinkedIn for additional information and professional network.",
      solution: "Add your LinkedIn profile URL: linkedin.com/in/yourname",
      priority: 50
    })
  }

  return issues
}

function analyzeProfessionalSummary(resumeContent: string, lines: string[]): ComprehensiveIssue[] {
  const issues: ComprehensiveIssue[] = []
  const text = resumeContent.toLowerCase()

  // Check if summary exists
  const summaryKeywords = ["summary", "profile", "objective", "about"]
  const hasSummary = summaryKeywords.some(keyword => text.includes(keyword))

  if (!hasSummary) {
    issues.push({
      id: "summary_missing",
      category: "professional_summary",
      severity: "high",
      title: "Missing Professional Summary",
      description: "No professional summary or objective statement found.",
      impact: "Recruiters won't understand your value proposition in the first 6 seconds of scanning.",
      solution: "Add a 2-3 sentence professional summary highlighting your key skills, experience, and career goals.",
      examples: [
        "Experienced software engineer with 5+ years developing scalable web applications...",
        "Results-driven marketing professional with expertise in digital campaigns..."
      ],
      priority: 85
    })
  } else {
    // Analyze summary quality
    const summarySection = extractSummarySection(resumeContent)
    if (summarySection && summarySection.length < 100) {
      issues.push({
        id: "summary_too_short",
        category: "professional_summary",
        severity: "medium",
        title: "Professional Summary Too Brief",
        description: "Your professional summary is very short and doesn't provide enough context.",
        impact: "Fails to capture recruiter attention and showcase your value proposition.",
        solution: "Expand your summary to 2-3 sentences (100-200 words) highlighting key achievements and skills.",
        priority: 60
      })
    }

    if (summarySection && summarySection.length > 300) {
      issues.push({
        id: "summary_too_long",
        category: "professional_summary",
        severity: "medium",
        title: "Professional Summary Too Lengthy",
        description: "Your professional summary is too long and may lose recruiter attention.",
        impact: "Recruiters may skip reading it entirely due to its length.",
        solution: "Condense your summary to 2-3 impactful sentences focusing on your strongest qualifications.",
        priority: 45
      })
    }
  }

  return issues
}

function analyzeExperienceSection(resumeContent: string, lines: string[], industry: string): ComprehensiveIssue[] {
  const issues: ComprehensiveIssue[] = []
  const text = resumeContent.toLowerCase()

  // Check for experience section
  if (!text.includes("experience") && !text.includes("employment") && !text.includes("work history")) {
    issues.push({
      id: "experience_missing",
      category: "experience",
      severity: "critical",
      title: "Missing Experience Section",
      description: "No work experience section found in your resume.",
      impact: "Employers cannot evaluate your professional background and qualifications.",
      solution: "Add a work experience section with your most recent positions, including job titles, companies, dates, and achievements.",
      priority: 95
    })
    return issues
  }

  // Check for quantifiable achievements
  const hasNumbers = /\d+[\%\$\,\.]/.test(text)
  if (!hasNumbers) {
    issues.push({
      id: "experience_no_metrics",
      category: "experience",
      severity: "high",
      title: "Missing Quantifiable Achievements",
      description: "Your experience section lacks specific numbers, percentages, or metrics.",
      impact: "Without metrics, your achievements appear less credible and impactful.",
      solution: "Add specific numbers: 'Increased sales by 25%', 'Managed team of 8', 'Reduced costs by $50K'",
      examples: [
        "Instead of: 'Improved customer satisfaction'",
        "Write: 'Improved customer satisfaction scores by 23% through streamlined support process'"
      ],
      priority: 90
    })
  }

  // Check for insufficient metrics in achievements
  const achievementLines = resumeContent.split('\n').filter(line => 
    line.includes('•') && (line.includes('improved') || line.includes('increased') || line.includes('reduced') || line.includes('developed'))
  )
  
  const linesWithMetrics = achievementLines.filter(line => /\d+/.test(line))
  
  if (achievementLines.length > 0 && linesWithMetrics.length < achievementLines.length * 0.7) {
    issues.push({
      id: "experience_insufficient_metrics",
      category: "experience", 
      severity: "high",
      title: "Insufficient Quantified Results",
      description: `Only ${Math.round((linesWithMetrics.length / achievementLines.length) * 100)}% of your achievement statements include specific metrics.`,
      impact: "Achievements without numbers are less compelling and harder to verify.",
      solution: "Add specific metrics to at least 70% of your achievement statements. Include percentages, dollar amounts, time savings, or team sizes.",
      examples: [
        "Change: 'Led team of developers' → 'Led team of 5 developers'",
        "Change: 'Improved performance' → 'Improved application performance by 40%'"
      ],
      priority: 85
    })
  }

  // Check for action verbs
  const actionVerbs = ["achieved", "improved", "managed", "created", "developed", "implemented", "launched", "led", "built", "designed", "optimized"]
  const bulletPoints = resumeContent.match(/[•\-\*]\s*[A-Za-z]/g) || []
  let actionVerbCount = 0

  bulletPoints.forEach(bullet => {
    const firstWord = bullet.replace(/[•\-\*]\s*/, '').split(' ')[0].toLowerCase()
    if (actionVerbs.includes(firstWord)) {
      actionVerbCount++
    }
  })

  if (bulletPoints.length > 0 && actionVerbCount / bulletPoints.length < 0.6) {
    issues.push({
      id: "experience_weak_action_verbs",
      category: "experience",
      severity: "medium",
      title: "Weak Action Verbs",
      description: `Only ${Math.round((actionVerbCount / bulletPoints.length) * 100)}% of your bullet points start with strong action verbs.`,
      impact: "Weak verbs make your achievements sound passive and less impressive.",
      solution: "Start each bullet point with powerful action verbs like 'achieved', 'improved', 'managed', 'created'.",
      examples: [
        "Instead of: 'Responsible for maintaining applications'",
        "Write: 'Maintained and optimized 5 critical applications'"
      ],
      priority: 65
    })
  }

  // Check for missing leadership examples
  const leadershipKeywords = ["led", "managed", "supervised", "mentored", "guided", "directed", "coordinated"]
  const hasLeadership = leadershipKeywords.some(keyword => text.includes(keyword))
  
  if (!hasLeadership && industry === "tech") {
    issues.push({
      id: "experience_missing_leadership",
      category: "experience",
      severity: "medium", 
      title: "No Leadership Experience Highlighted",
      description: "Your resume doesn't showcase any leadership or team management experience.",
      impact: "Many senior roles require leadership skills, and their absence may limit advancement opportunities.",
      solution: "Add examples of leading projects, mentoring colleagues, or coordinating team efforts.",
      examples: [
        "Led cross-functional team of 4 in feature development",
        "Mentored 2 junior developers on best practices"
      ],
      priority: 70
    })
  }

  // Check for soft skills integration
  const softSkillsIntegrated = text.includes("collaborated") || text.includes("communicated") || text.includes("presented")
  
  if (!softSkillsIntegrated) {
    issues.push({
      id: "experience_missing_soft_skills",
      category: "experience",
      severity: "medium",
      title: "Limited Soft Skills Demonstration",
      description: "Your experience section doesn't demonstrate important soft skills like collaboration or communication.",
      impact: "Technical skills alone aren't enough; employers also value teamwork and communication abilities.",
      solution: "Include examples of collaboration, communication, or presentation skills in your achievement statements.",
      examples: [
        "Collaborated with design team to implement pixel-perfect UIs",
        "Presented technical solutions to stakeholders"
      ],
      priority: 55
    })
  }

  // Check for technology/tool context
  const techMentions = (text.match(/(using|with|in)\s+(react|javascript|python|java|aws|docker)/g) || []).length
  
  if (industry === "tech" && techMentions < 3) {
    issues.push({
      id: "experience_insufficient_tech_context", 
      category: "experience",
      severity: "medium",
      title: "Insufficient Technology Context",
      description: "Your achievements don't clearly specify which technologies or tools you used.",
      impact: "Recruiters and hiring managers want to see specific technology experience for relevance assessment.",
      solution: "Add technology context to your achievements: 'Built web application using React and Node.js'",
      examples: [
        "Change: 'Developed applications' → 'Developed React applications with Node.js backend'",
        "Change: 'Improved performance' → 'Improved PostgreSQL query performance by 40%'"
      ],
      priority: 60
    })
  }

  // Check for job gaps
  const dates = resumeContent.match(/\b(19|20)\d{2}\b/g) || []
  if (dates.length >= 4) {
    const years = dates.map(d => parseInt(d)).sort((a, b) => b - a)
    const gaps = []
    for (let i = 0; i < years.length - 1; i++) {
      if (years[i] - years[i + 1] > 2) {
        gaps.push(years[i + 1])
      }
    }

    if (gaps.length > 0) {
      issues.push({
        id: "experience_employment_gaps",
        category: "experience",
        severity: "medium",
        title: "Employment Gaps Need Explanation",
        description: "There appear to be gaps in your employment history.",
        impact: "Unexplained gaps raise questions about your career continuity.",
        solution: "Add brief explanations for gaps: education, family care, freelancing, or professional development.",
        priority: 55
      })
    }
  }

  return issues
}

function analyzeSkillsSection(resumeContent: string, lines: string[], industry: string): ComprehensiveIssue[] {
  const issues: ComprehensiveIssue[] = []
  const text = resumeContent.toLowerCase()

  if (!text.includes("skills") && !text.includes("technical") && !text.includes("competencies")) {
    issues.push({
      id: "skills_missing",
      category: "skills",
      severity: "high",
      title: "Missing Skills Section",
      description: "No dedicated skills section found in your resume.",
      impact: "ATS systems and recruiters look for specific skills to match job requirements.",
      solution: "Add a skills section with relevant technical and soft skills for your industry.",
      priority: 80
    })
    return issues
  }

  // Check for skill organization/categorization
  const hasSkillCategories = text.includes("programming") || text.includes("frameworks") || text.includes("languages") || text.includes("databases") || text.includes("tools")
  
  if (!hasSkillCategories) {
    issues.push({
      id: "skills_poor_organization",
      category: "skills",
      severity: "medium",
      title: "Skills Not Properly Categorized",
      description: "Your skills section lists items without clear categories or organization.",
      impact: "Unorganized skills are harder for recruiters to quickly assess your technical breadth.",
      solution: "Organize skills into categories like 'Programming Languages', 'Frameworks', 'Databases', 'Cloud Technologies'.",
      examples: [
        "Programming Languages: JavaScript, Python, Java",
        "Frameworks: React, Node.js, Express",
        "Databases: PostgreSQL, MongoDB"
      ],
      priority: 60
    })
  }

  // Industry-specific skill analysis
  const industrySkills = {
    tech: {
      required: ["programming", "software", "development", "javascript", "python", "java", "react", "node"],
      advanced: ["microservices", "cloud", "devops", "kubernetes", "docker", "ci/cd"],
      soft: ["agile", "scrum", "collaboration", "problem-solving"]
    },
    finance: {
      required: ["financial", "analysis", "excel", "modeling", "valuation", "risk", "accounting"],
      advanced: ["bloomberg", "vba", "sql", "tableau", "python"],
      soft: ["attention to detail", "analytical", "compliance"]
    },
    healthcare: {
      required: ["clinical", "patient", "medical", "healthcare", "ehr", "hipaa"],
      advanced: ["epic", "cerner", "medical coding", "quality improvement"],
      soft: ["empathy", "communication", "patient care"]
    },
    marketing: {
      required: ["marketing", "digital", "seo", "analytics", "campaign", "social media"],
      advanced: ["google ads", "facebook ads", "hubspot", "salesforce", "a/b testing"],
      soft: ["creativity", "communication", "brand management"]
    },
    legal: {
      required: ["legal", "litigation", "compliance", "contract", "research", "law"],
      advanced: ["westlaw", "lexis", "ediscovery", "case management"],
      soft: ["attention to detail", "analytical", "written communication"]
    }
  }

  const expectedSkills = industrySkills[industry as keyof typeof industrySkills] || industrySkills.tech
  const presentRequiredSkills = expectedSkills.required.filter(skill => text.includes(skill))
  const presentAdvancedSkills = expectedSkills.advanced.filter(skill => text.includes(skill))

  if (presentRequiredSkills.length < expectedSkills.required.length * 0.4) {
    issues.push({
      id: "skills_industry_mismatch",
      category: "skills",
      severity: "high",
      title: `Missing Key ${industry.charAt(0).toUpperCase() + industry.slice(1)} Skills`,
      description: `Your skills section lacks important ${industry} industry keywords.`,
      impact: "ATS systems may not identify you as a qualified candidate for the role.",
      solution: `Add relevant ${industry} skills like: ${expectedSkills.required.slice(0, 5).join(", ")}`,
      priority: 75
    })
  }

  if (industry === "tech" && presentAdvancedSkills.length < 2) {
    issues.push({
      id: "skills_missing_advanced_tech",
      category: "skills",
      severity: "medium",
      title: "Limited Advanced Technical Skills",
      description: "Your resume lacks advanced technical skills that demonstrate senior-level expertise.",
      impact: "For senior roles, employers expect knowledge of advanced technologies and methodologies.",
      solution: "Add advanced skills like: cloud platforms (AWS/Azure), containerization (Docker/Kubernetes), CI/CD pipelines, microservices architecture.",
      examples: [
        "Cloud: AWS, Docker, Kubernetes",
        "DevOps: Jenkins, CI/CD, Infrastructure as Code"
      ],
      priority: 65
    })
  }

  // Check for skill levels/proficiency
  const hasSkillLevels = text.includes("proficient") || text.includes("expert") || text.includes("advanced") || text.includes("beginner") || text.includes("years")
  
  if (!hasSkillLevels) {
    issues.push({
      id: "skills_no_proficiency_levels",
      category: "skills",
      severity: "low",
      title: "No Skill Proficiency Levels Indicated",
      description: "Your skills section doesn't indicate your proficiency level with different technologies.",
      impact: "Employers can't gauge your expertise level, which may lead to mismatched role assignments.",
      solution: "Consider adding proficiency indicators: 'Expert in JavaScript (5+ years)', 'Proficient in Python', 'Familiar with Kubernetes'.",
      examples: [
        "Expert: JavaScript, React (5+ years)",
        "Proficient: Python, Node.js (2-3 years)",
        "Familiar: Kubernetes, Docker (< 1 year)"
      ],
      priority: 35
    })
  }

  // Check for soft skills balance
  const softSkillKeywords = ["communication", "leadership", "teamwork", "problem-solving", "analytical", "creative"]
  const presentSoftSkills = softSkillKeywords.filter(skill => text.includes(skill))
  
  if (presentSoftSkills.length < 2) {
    issues.push({
      id: "skills_missing_soft_skills",
      category: "skills",
      severity: "medium",
      title: "Insufficient Soft Skills Listed",
      description: "Your skills section focuses heavily on technical skills but lacks important soft skills.",
      impact: "Employers value both technical and soft skills; an imbalance suggests poor self-awareness.",
      solution: "Add 2-3 relevant soft skills that complement your technical abilities.",
      examples: [
        "Technical Skills + Leadership, Communication",
        "Programming Skills + Problem-solving, Team Collaboration"
      ],
      priority: 50
    })
  }

  // Check for outdated technologies
  const outdatedTech = ["flash", "silverlight", "internet explorer", "jquery", "perl", "cobol"]
  const hasOutdatedTech = outdatedTech.some(tech => text.includes(tech))
  
  if (hasOutdatedTech) {
    issues.push({
      id: "skills_outdated_technologies",
      category: "skills",
      severity: "medium",
      title: "Outdated Technologies Listed",
      description: "Your skills section includes outdated or less relevant technologies.",
      impact: "Listing outdated skills can make you appear out of touch with current industry standards.",
      solution: "Remove outdated technologies and replace with modern alternatives or focus on currently relevant skills.",
      examples: [
        "Replace jQuery with modern JavaScript/React",
        "Replace Flash with HTML5/CSS3"
      ],
      priority: 45
    })
  }

  // Check for missing certification mentions
  if (industry === "tech" && !text.includes("aws") && !text.includes("azure") && !text.includes("google cloud") && !text.includes("certified")) {
    issues.push({
      id: "skills_missing_certifications",
      category: "skills", 
      severity: "low",
      title: "No Technical Certifications Mentioned",
      description: "Your resume doesn't mention any professional certifications or cloud platform credentials.",
      impact: "Certifications demonstrate commitment to professional development and validate expertise.",
      solution: "If you have certifications, add them to your skills or create a dedicated certifications section.",
      examples: [
        "AWS Certified Developer Associate",
        "Google Cloud Professional Developer",
        "Microsoft Azure Fundamentals"
      ],
      priority: 40
    })
  }

  return issues
}

function analyzeEducationSection(resumeContent: string, lines: string[]): ComprehensiveIssue[] {
  const issues: ComprehensiveIssue[] = []
  const text = resumeContent.toLowerCase()

  if (!text.includes("education") && !text.includes("degree") && !text.includes("university") && !text.includes("college")) {
    issues.push({
      id: "education_missing",
      category: "education",
      severity: "medium",
      title: "Missing Education Section",
      description: "No education section found in your resume.",
      impact: "Many employers require degree information for qualification verification.",
      solution: "Add an education section with your highest degree, institution, and graduation year.",
      priority: 60
    })
  }

  return issues
}

function analyzeFormattingAndATS(resumeContent: string, lines: string[]): ComprehensiveIssue[] {
  const issues: ComprehensiveIssue[] = []

  // Check for consistent formatting
  const bulletTypes = resumeContent.match(/[•\-\*]/g) || []
  const uniqueBullets = Array.from(new Set(bulletTypes))
  if (uniqueBullets.length > 1) {
    issues.push({
      id: "formatting_inconsistent_bullets",
      category: "formatting",
      severity: "low",
      title: "Inconsistent Bullet Point Formatting",
      description: "Multiple bullet point styles used throughout the resume.",
      impact: "Inconsistent formatting appears unprofessional and distracts from content.",
      solution: "Use consistent bullet points throughout (• recommended for ATS compatibility).",
      priority: 30
    })
  }

  // Check for special characters that may cause ATS issues
  const problematicChars = /[""''‚„]/g
  if (problematicChars.test(resumeContent)) {
    issues.push({
      id: "formatting_special_characters",
      category: "formatting",
      severity: "medium",
      title: "ATS-Unfriendly Special Characters",
      description: "Smart quotes or special characters detected that may cause ATS parsing issues.",
      impact: "ATS systems may not parse your resume correctly, leading to rejection.",
      solution: "Replace smart quotes with standard quotes (\" ') and avoid special symbols.",
      priority: 70
    })
  }

  // Check for tables or complex formatting
  if (resumeContent.includes("│") || resumeContent.includes("┌") || resumeContent.includes("└")) {
    issues.push({
      id: "formatting_complex_tables",
      category: "formatting",
      severity: "high",
      title: "Complex Table Formatting Detected",
      description: "Tables or complex formatting elements found in resume.",
      impact: "ATS systems often cannot parse table content correctly.",
      solution: "Convert table content to simple text format with clear headings and bullet points.",
      priority: 85
    })
  }

  // Check for section headers formatting
  const sectionHeaders = lines.filter(line => 
    line.trim().length > 0 && 
    (line.toLowerCase().includes("experience") || 
     line.toLowerCase().includes("education") || 
     line.toLowerCase().includes("skills") ||
     line.toLowerCase().includes("summary"))
  )

  const inconsistentHeaders = sectionHeaders.some(header => 
    header !== header.toUpperCase() && header !== header.toLowerCase()
  )

  if (inconsistentHeaders) {
    issues.push({
      id: "formatting_inconsistent_headers",
      category: "formatting",
      severity: "low",
      title: "Inconsistent Section Header Formatting",
      description: "Section headers use inconsistent capitalization or formatting styles.",
      impact: "Inconsistent headers make your resume appear less polished and professional.",
      solution: "Use consistent formatting for all section headers (either ALL CAPS, Title Case, or lowercase).",
      examples: [
        "Consistent: WORK EXPERIENCE, EDUCATION, SKILLS",
        "Or: Work Experience, Education, Skills"
      ],
      priority: 35
    })
  }

  // Check for excessive white space
  const emptyLines = lines.filter(line => line.trim() === "").length
  const totalLines = lines.length
  
  if (emptyLines > totalLines * 0.3) {
    issues.push({
      id: "formatting_excessive_whitespace",
      category: "formatting",
      severity: "medium",
      title: "Excessive White Space",
      description: "Your resume has too much empty space, which wastes valuable real estate.",
      impact: "Excessive white space makes your resume appear sparse and may suggest lack of experience.",
      solution: "Remove unnecessary blank lines and optimize spacing to fit more relevant content.",
      priority: 45
    })
  }

  // Check for missing contact information formatting
  const firstFewLines = lines.slice(0, 5).join(" ").toLowerCase()
  const contactElements = {
    email: /@/.test(firstFewLines),
    phone: /\(\d{3}\)|\d{3}[-\.\s]\d{3}/.test(firstFewLines),
    location: /(city|state|,)/.test(firstFewLines)
  }

  const missingContactFormat = Object.values(contactElements).filter(Boolean).length < 2

  if (missingContactFormat) {
    issues.push({
      id: "formatting_contact_not_prominent",
      category: "formatting",
      severity: "medium",
      title: "Contact Information Not Prominently Displayed",
      description: "Your contact information isn't clearly formatted or positioned at the top of your resume.",
      impact: "Recruiters should be able to quickly find your contact details.",
      solution: "Place contact information prominently at the top with clear formatting: Name, Phone, Email, Location.",
      examples: [
        "John Smith",
        "(555) 123-4567 | john.smith@email.com | San Francisco, CA"
      ],
      priority: 60
    })
  }
  // Check for date formatting consistency
  const dateFormats = resumeContent.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}|\d{4}-\d{4})\b/g) || []
  const uniqueDateFormats = Array.from(new Set(dateFormats.map(date => {
    if (/\d{4}-\d{4}/.test(date)) return "year-range"
    if (/\d{4}/.test(date)) return "year-only"
    if (/\d{1,2}\/\d{1,2}\/\d{2,4}/.test(date)) return "mm/dd/yyyy"
    if (/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(date)) return "month-name"
    return "other"
  })))

  if (uniqueDateFormats.length > 2) {
    issues.push({
      id: "formatting_inconsistent_dates",
      category: "formatting",
      severity: "low",
      title: "Inconsistent Date Formatting",
      description: "Multiple date formats used throughout your resume.",
      impact: "Inconsistent formatting reduces professionalism and can confuse ATS systems.",
      solution: "Use consistent date format throughout: either 'Month Year' or 'MM/YYYY' format.",
      examples: [
        "Consistent: Jan 2021 - Present, Sep 2019 - Dec 2020",
        "Or: 01/2021 - Present, 09/2019 - 12/2020"
      ],
      priority: 25
    })
  }

  // Check for file format optimization
  // Note: This would typically be checked at file level, but we can suggest best practices
  issues.push({
    id: "formatting_file_format_advice",
    category: "formatting",
    severity: "low",
    title: "File Format Optimization Recommendation",
    description: "Ensure your resume is saved in ATS-friendly format.",
    impact: "Wrong file formats can prevent ATS systems from parsing your resume correctly.",
    solution: "Save your resume as a .docx or .pdf file. Avoid .pages, .txt, or image formats.",
    examples: [
      "Preferred: resume.docx or resume.pdf",
      "Avoid: resume.pages, resume.jpg"
    ],
    priority: 20
  })

  return issues
}

function analyzeContentQuality(resumeContent: string, lines: string[]): ComprehensiveIssue[] {
  const issues: ComprehensiveIssue[] = []
  const text = resumeContent.toLowerCase()

  // Check for personal pronouns
  const pronouns = ["i ", "me ", "my ", "mine "]
  const pronounCount = pronouns.reduce((count, pronoun) => 
    count + (text.match(new RegExp(pronoun, "g")) || []).length, 0)

  if (pronounCount > 3) {
    issues.push({
      id: "content_personal_pronouns",
      category: "content_quality",
      severity: "medium",
      title: "Excessive Use of Personal Pronouns",
      description: "Too many personal pronouns (I, me, my) found in resume content.",
      impact: "Makes resume sound less professional and takes up valuable space.",
      solution: "Remove personal pronouns. Start bullet points with action verbs instead.",
      examples: [
        "Instead of: 'I managed a team of 5 people'",
        "Write: 'Managed team of 5 people'"
      ],
      priority: 45
    })
  }

  // Check for passive voice
  const passiveIndicators = ["was", "were", "been", "being"]
  const passiveCount = passiveIndicators.reduce((count, indicator) => 
    count + (text.match(new RegExp(`\\b${indicator}\\b`, "g")) || []).length, 0)

  if (passiveCount > 5) {
    issues.push({
      id: "content_passive_voice",
      category: "content_quality",
      severity: "medium",
      title: "Excessive Passive Voice",
      description: "Too much passive voice makes your achievements sound less impactful.",
      impact: "Passive voice weakens the impact of your accomplishments.",
      solution: "Use active voice with strong action verbs to describe your achievements.",
      priority: 50
    })
  }

  // Check for buzzwords without substance
  const buzzwords = ["synergy", "leverage", "utilize", "paradigm", "innovative", "dynamic", "results-oriented", "think outside the box"]
  const buzzwordCount = buzzwords.reduce((count, word) => 
    count + (text.match(new RegExp(`\\b${word}\\b`, "g")) || []).length, 0)

  if (buzzwordCount > 3) {
    issues.push({
      id: "content_empty_buzzwords",
      category: "content_quality",
      severity: "low",
      title: "Overuse of Empty Buzzwords",
      description: "Too many generic buzzwords without specific context or achievements.",
      impact: "Buzzwords without substance make your resume appear generic and unconvincing.",
      solution: "Replace buzzwords with specific achievements and concrete examples of your work.",
      priority: 35
    })
  }

  // Check for spelling/grammar indicators
  const commonMisspellings = ["recieve", "seperate", "occured", "achievment", "responsable", "maintainance"]
  const misspellingCount = commonMisspellings.reduce((count, word) => 
    count + (text.match(new RegExp(`\\b${word}\\b`, "g")) || []).length, 0)

  if (misspellingCount > 0) {
    issues.push({
      id: "content_spelling_errors",
      category: "content_quality",
      severity: "high",
      title: "Potential Spelling Errors Detected",
      description: "Common misspellings found in your resume content.",
      impact: "Spelling errors create a negative impression and suggest lack of attention to detail.",
      solution: "Carefully proofread your resume and use spell-check tools before submitting.",
      examples: [
        "recieve → receive",
        "seperate → separate", 
        "achievment → achievement"
      ],
      priority: 85
    })
  }

  // Check for repetitive language
  const words = text.split(/\s+/).filter(word => word.length > 4)
  const wordCount = words.reduce((acc: Record<string, number>, word) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {})
  
  const overusedWords = Object.entries(wordCount)
    .filter(([word, count]) => count > 4 && !["experience", "skills", "development", "management"].includes(word))
    .map(([word]) => word)

  if (overusedWords.length > 0) {
    issues.push({
      id: "content_repetitive_language",
      category: "content_quality",
      severity: "medium",
      title: "Repetitive Language Usage",
      description: `Overuse of certain words: ${overusedWords.slice(0, 3).join(", ")}`,
      impact: "Repetitive language makes your resume monotonous and less engaging.",
      solution: "Use synonyms and varied vocabulary to describe your achievements and responsibilities.",
      examples: [
        "Instead of repeating 'developed' use: created, built, designed, implemented",
        "Instead of repeating 'managed' use: led, supervised, coordinated, directed"
      ],
      priority: 40
    })
  }

  // Check for lack of specific details
  const vagueTerms = ["responsible for", "helped with", "worked on", "involved in", "participated in"]
  const vagueCount = vagueTerms.reduce((count, term) => 
    count + (text.match(new RegExp(term, "g")) || []).length, 0)

  if (vagueCount > 2) {
    issues.push({
      id: "content_vague_descriptions",
      category: "content_quality",
      severity: "medium",
      title: "Vague Job Descriptions",
      description: "Too many vague phrases that don't clearly describe your contributions.",
      impact: "Vague descriptions fail to demonstrate your actual impact and value.",
      solution: "Replace vague terms with specific action verbs and concrete achievements.",
      examples: [
        "Instead of: 'Responsible for database management'",
        "Write: 'Optimized PostgreSQL databases, reducing query time by 30%'"
      ],
      priority: 60
    })
  }

  // Check for missing context in achievements
  const achievementLines = resumeContent.split('\n').filter(line => 
    line.includes('•') && (
      line.toLowerCase().includes('improved') || 
      line.toLowerCase().includes('increased') || 
      line.toLowerCase().includes('reduced') ||
      line.toLowerCase().includes('created') ||
      line.toLowerCase().includes('developed')
    )
  )

  const linesWithContext = achievementLines.filter(line => 
    /\b(by|through|using|with|for)\b/.test(line.toLowerCase())
  )

  if (achievementLines.length > 0 && linesWithContext.length < achievementLines.length * 0.5) {
    issues.push({
      id: "content_missing_context",
      category: "content_quality",
      severity: "medium",
      title: "Achievements Lack Context",
      description: "Many achievements don't explain how or why they were accomplished.",
      impact: "Without context, achievements appear less credible and impressive.",
      solution: "Add context to your achievements explaining methods, tools, or approaches used.",
      examples: [
        "Change: 'Improved performance by 40%'",
        "To: 'Improved application performance by 40% through database optimization and code refactoring'"
      ],
      priority: 65
    })
  }

  return issues
}

function analyzeKeywordOptimization(
  jobDescription: string,
  keywords: { text: string; count: number; isMatch: boolean }[],
  resumeContent: string
): ComprehensiveIssue[] {
  const issues: ComprehensiveIssue[] = []
  
  const missingKeywords = keywords.filter(k => !k.isMatch && k.count === 0)
  const importantMissing = missingKeywords.slice(0, 10) // Top 10 missing keywords

  if (importantMissing.length > 0) {
    issues.push({
      id: "keywords_missing_important",
      category: "keywords",
      severity: "high",
      title: "Missing Important Job Keywords",
      description: `${importantMissing.length} important keywords from the job description are missing from your resume.`,
      impact: "ATS systems may rank your resume lower due to poor keyword matching.",
      solution: `Consider incorporating these keywords naturally: ${importantMissing.slice(0, 5).map(k => k.text).join(", ")}`,
      priority: 85
    })
  }

  const matchedKeywords = keywords.filter(k => k.isMatch)
  const totalJobKeywords = keywords.filter(k => k.count > 0).length

  if (matchedKeywords.length < totalJobKeywords * 0.4) {
    issues.push({
      id: "keywords_low_match_rate",
      category: "keywords",
      severity: "medium",
      title: "Low Keyword Match Rate",
      description: `Only ${Math.round((matchedKeywords.length / totalJobKeywords) * 100)}% keyword match with job description.`,
      impact: "Low keyword matching reduces your chances of passing ATS screening.",
      solution: "Aim for 60-70% keyword match by naturally incorporating relevant terms from the job posting.",
      priority: 70
    })
  }

  return issues
}

function analyzeIndustrySpecificIssues(resumeContent: string, industry: string): ComprehensiveIssue[] {
  const issues: ComprehensiveIssue[] = []
  const text = resumeContent.toLowerCase()

  // Industry-specific requirements
  const industryRequirements = {
    tech: {
      requirements: ["github", "portfolio", "projects"],
      title: "Missing Technical Portfolio",
      description: "Tech resumes should include links to GitHub, portfolio, or project examples."
    },
    finance: {
      requirements: ["excel", "financial modeling", "certification"],
      title: "Missing Financial Credentials",
      description: "Finance resumes should highlight certifications, Excel skills, and financial modeling experience."
    },
    healthcare: {
      requirements: ["license", "certification", "clinical"],
      title: "Missing Healthcare Credentials",
      description: "Healthcare resumes must prominently display licenses and certifications."
    }
  }

  const industryReq = industryRequirements[industry as keyof typeof industryRequirements]
  if (industryReq) {
    const presentRequirements = industryReq.requirements.filter(req => text.includes(req))
    if (presentRequirements.length < industryReq.requirements.length * 0.5) {
      issues.push({
        id: `industry_${industry}_requirements`,
        category: "industry_specific",
        severity: "medium",
        title: industryReq.title,
        description: industryReq.description,
        impact: "Industry-specific requirements are often mandatory for consideration.",
        solution: `Add relevant ${industry} elements: ${industryReq.requirements.join(", ")}`,
        priority: 65
      })
    }
  }

  return issues
}

function analyzeLengthAndStructure(resumeContent: string, lines: string[]): ComprehensiveIssue[] {
  const issues: ComprehensiveIssue[] = []
  const wordCount = resumeContent.split(/\s+/).length

  if (wordCount < 200) {
    issues.push({
      id: "length_too_short",
      category: "structure",
      severity: "high",
      title: "Resume Too Short",
      description: `Your resume is only ${wordCount} words, which is significantly below the recommended length.`,
      impact: "Short resumes suggest lack of experience or detail about your qualifications.",
      solution: "Expand your resume to 300-800 words by adding more detail about your achievements and responsibilities.",
      priority: 80
    })
  }

  if (wordCount > 1000) {
    issues.push({
      id: "length_too_long",
      category: "structure",
      severity: "medium",
      title: "Resume Too Long",
      description: `Your resume is ${wordCount} words, which may be too lengthy for most positions.`,
      impact: "Lengthy resumes may overwhelm recruiters and reduce the impact of your key qualifications.",
      solution: "Condense your resume to 300-800 words by focusing on most relevant and recent achievements.",
      priority: 50
    })
  }

  // Check for proper sections
  const requiredSections = ["contact", "experience", "education", "skills"]
  const presentSections = requiredSections.filter(section => 
    resumeContent.toLowerCase().includes(section) || 
    (section === "contact" && resumeContent.includes("@"))
  )

  if (presentSections.length < requiredSections.length) {
    const missing = requiredSections.filter(section => !presentSections.includes(section))
    issues.push({
      id: "structure_missing_sections",
      category: "structure",
      severity: "high",
      title: "Missing Essential Resume Sections",
      description: `Missing critical sections: ${missing.join(", ")}`,
      impact: "Incomplete resume structure makes it difficult for recruiters to find key information.",
      solution: `Add the missing sections: ${missing.join(", ")}`,
      priority: 90
    })
  }

  return issues
}

function calculateOverallScore(issues: ComprehensiveIssue[], sectionScores: Record<string, number>): number {
  const maxPenalty = 100
  const totalPenalty = issues.reduce((penalty, issue) => {
    const severityPenalty = {
      critical: 20,
      high: 15,
      medium: 8,
      low: 3
    }
    return penalty + severityPenalty[issue.severity]
  }, 0)

  const issueScore = Math.max(0, 100 - Math.min(totalPenalty, maxPenalty))
  const avgSectionScore = Object.values(sectionScores).reduce((sum, score) => sum + score, 0) / Object.values(sectionScores).length

  return Math.round((issueScore + avgSectionScore) / 2)
}

function identifyStrengths(
  resumeContent: string, 
  sectionScores: Record<string, number>,
  keywords?: { text: string; count: number; isMatch: boolean }[]
): string[] {
  const strengths: string[] = []
  const text = resumeContent.toLowerCase()

  // Check for quantifiable achievements
  const hasNumbers = /\d+[\%\$\,\.]/.test(text)
  if (hasNumbers) {
    strengths.push("Uses quantifiable achievements with specific metrics and numbers")
  }

  // Check for strong action verbs
  const actionVerbs = ["achieved", "improved", "managed", "created", "developed", "implemented", "launched", "led"]
  const bulletPoints = resumeContent.match(/[•\-\*]\s*[A-Za-z]/g) || []
  let actionVerbCount = 0

  bulletPoints.forEach(bullet => {
    const firstWord = bullet.replace(/[•\-\*]\s*/, '').split(' ')[0].toLowerCase()
    if (actionVerbs.includes(firstWord)) {
      actionVerbCount++
    }
  })

  if (bulletPoints.length > 0 && actionVerbCount / bulletPoints.length > 0.7) {
    strengths.push("Effectively uses strong action verbs to describe achievements")
  }

  // Check section scores
  Object.entries(sectionScores).forEach(([section, score]) => {
    if (score >= 85) {
      strengths.push(`Strong ${section.replace('_', ' ')} section with comprehensive content`)
    }
  })

  // Check keyword usage
  if (keywords) {
    const matchRate = keywords.filter(k => k.isMatch).length / keywords.length
    if (matchRate > 0.6) {
      strengths.push("Good keyword optimization matching job requirements")
    }
  }

  // Check for professional formatting
  const consistentBullets = (resumeContent.match(/[•]/g) || []).length > (resumeContent.match(/[\-\*]/g) || []).length
  if (consistentBullets) {
    strengths.push("Uses consistent and professional formatting throughout")
  }

  return strengths.length > 0 ? strengths : ["Resume demonstrates basic professional structure"]
}

function createActionPlan(issues: ComprehensiveIssue[], industryImprovements: string[]): {
  immediate: string[]
  shortTerm: string[]
  longTerm: string[]
} {
  const criticalIssues = issues.filter(i => i.severity === "critical")
  const highIssues = issues.filter(i => i.severity === "high")
  const mediumIssues = issues.filter(i => i.severity === "medium")

  const immediate = [
    ...criticalIssues.slice(0, 3).map(i => i.solution),
    ...highIssues.slice(0, 2).map(i => i.solution)
  ]

  const shortTerm = [
    ...highIssues.slice(2).map(i => i.solution),
    ...mediumIssues.slice(0, 3).map(i => i.solution),
    ...industryImprovements.slice(0, 2)
  ]

  const longTerm = [
    ...mediumIssues.slice(3).map(i => i.solution),
    ...industryImprovements.slice(2),
    "Consider professional resume review and optimization",
    "Regularly update resume with new achievements and skills"
  ]

  return {
    immediate: immediate.slice(0, 5),
    shortTerm: shortTerm.slice(0, 5),
    longTerm: longTerm.slice(0, 5)
  }
}

// Helper functions
function extractSummarySection(resumeContent: string): string | null {
  const lines = resumeContent.split('\n')
  const summaryKeywords = ["summary", "profile", "objective", "about"]
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase()
    if (summaryKeywords.some(keyword => line.includes(keyword))) {
      // Extract next few lines as summary
      let summary = ""
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].trim() === "" || 
            lines[j].toLowerCase().includes("experience") ||
            lines[j].toLowerCase().includes("education") ||
            lines[j].toLowerCase().includes("skills")) {
          break
        }
        summary += lines[j] + " "
      }
      return summary.trim()
    }
  }
  return null
}

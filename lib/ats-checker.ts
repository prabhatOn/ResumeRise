// ATS compatibility issues and their impact on score
interface ATSIssue {
  type: string
  description: string
  impact: number // Score reduction (0-100)
  solution: string
}

// ATS check result
export interface ATSCheckResult {
  score: number
  issues: ATSIssue[]
  passedChecks: string[]
}

/**
 * Performs a comprehensive ATS compatibility check on resume content
 * @param resumeContent The text content of the resume
 * @param fileType The file type of the resume (PDF, DOCX, etc.)
 * @param fileName The file name of the resume
 * @returns Detailed ATS check result with score and issues
 */
export function checkATSCompatibility(resumeContent: string, fileType: string, fileName: string): ATSCheckResult {
  const issues: ATSIssue[] = []
  const passedChecks: string[] = []
  let score = 100 // Start with perfect score and deduct based on issues

  // Check file type compatibility
  if (!checkFileTypeCompatibility(fileType)) {
    issues.push({
      type: "file_format",
      description: `File format ${fileType} may not be fully compatible with all ATS systems.`,
      impact: 15,
      solution: "Convert your resume to a standard .docx or .pdf format for better compatibility.",
    })
  } else {
    passedChecks.push("File format is ATS-compatible")
  }

  // Check file name for special characters
  if (!checkFileNameCompatibility(fileName)) {
    issues.push({
      type: "file_name",
      description: "File name contains spaces or special characters that may cause issues with some ATS systems.",
      impact: 5,
      solution: "Rename your file using only letters, numbers, and underscores (e.g., John_Smith_Resume.pdf).",
    })
  } else {
    passedChecks.push("File name is ATS-compatible")
  }

  // Check for complex tables
  if (hasComplexTables(resumeContent)) {
    issues.push({
      type: "complex_tables",
      description: "Complex tables detected in resume, which many ATS systems cannot parse correctly.",
      impact: 20,
      solution: "Replace tables with simple bullet points or plain text formatting.",
    })
  } else {
    passedChecks.push("No complex tables detected")
  }

  // Check for columns
  if (hasColumns(resumeContent)) {
    issues.push({
      type: "columns",
      description: "Multi-column layout detected, which can confuse ATS systems.",
      impact: 15,
      solution: "Use a single-column layout for better ATS compatibility.",
    })
  } else {
    passedChecks.push("Single-column layout detected")
  }

  // Check for images
  if (hasImages(resumeContent)) {
    issues.push({
      type: "images",
      description: "Images or graphics detected in resume, which ATS systems cannot read.",
      impact: 10,
      solution: "Remove images, logos, and graphics from your resume.",
    })
  } else {
    passedChecks.push("No images detected")
  }

  // Check for headers and footers
  if (hasHeadersFooters(resumeContent)) {
    issues.push({
      type: "headers_footers",
      description: "Headers or footers detected, which may be ignored by ATS systems.",
      impact: 10,
      solution: "Move important information from headers/footers into the main body of your resume.",
    })
  } else {
    passedChecks.push("No headers/footers detected")
  }

  // Check for fancy fonts
  if (hasFancyFonts(resumeContent)) {
    issues.push({
      type: "fancy_fonts",
      description: "Non-standard fonts detected, which may not render correctly in ATS systems.",
      impact: 5,
      solution: "Use standard fonts like Arial, Calibri, or Times New Roman.",
    })
  } else {
    passedChecks.push("Standard fonts detected")
  }

  // Check for special characters
  if (hasSpecialCharacters(resumeContent)) {
    issues.push({
      type: "special_characters",
      description: "Special characters or symbols detected that may not parse correctly in ATS systems.",
      impact: 5,
      solution: "Replace special characters with standard text alternatives.",
    })
  } else {
    passedChecks.push("No problematic special characters detected")
  }

  // Check for text in text boxes
  if (hasTextBoxes(resumeContent)) {
    issues.push({
      type: "text_boxes",
      description: "Text boxes detected, which may not be read by ATS systems.",
      impact: 10,
      solution: "Convert text boxes to standard text in the document body.",
    })
  } else {
    passedChecks.push("No text boxes detected")
  }

  // Check for standard section headings
  if (!hasStandardSectionHeadings(resumeContent)) {
    issues.push({
      type: "section_headings",
      description: "Non-standard section headings detected, which may confuse ATS systems.",
      impact: 10,
      solution: "Use standard section headings like 'Experience', 'Education', and 'Skills'.",
    })
  } else {
    passedChecks.push("Standard section headings detected")
  }

  // Check for contact information at the top
  if (!hasContactInfoAtTop(resumeContent)) {
    issues.push({
      type: "contact_info",
      description: "Contact information may not be at the top of the resume, which is preferred for ATS systems.",
      impact: 5,
      solution: "Place your name and contact information at the top of your resume.",
    })
  } else {
    passedChecks.push("Contact information properly positioned")
  }

  // Calculate final score by deducting impact points for each issue
  score = issues.reduce((currentScore, issue) => currentScore - issue.impact, score)

  // Ensure score doesn't go below 0
  score = Math.max(0, score)

  return {
    score,
    issues,
    passedChecks,
  }
}

// Helper functions for ATS checks

function checkFileTypeCompatibility(fileType: string): boolean {
  const compatibleTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc
    "text/plain", // .txt
    "text/rtf", // .rtf
  ]
  return compatibleTypes.includes(fileType.toLowerCase())
}

function checkFileNameCompatibility(fileName: string): boolean {
  // Check for spaces and special characters except underscores and hyphens
  return !/[^\w\-.]/.test(fileName)
}

function hasComplexTables(content: string): boolean {
  // Check for table markers in the content
  const tableMarkers = ["<table", "<tr", "<td", "<th", "|---|", "+---+"]
  return tableMarkers.some((marker) => content.includes(marker)) || (content.match(/\|.*\|/g)?.length || 0) > 2 // Markdown tables
}

function hasColumns(content: string): boolean {
  // Check for column markers or patterns
  const columnMarkers = ["<column", "column-count", "multi-column"]

  // Also check for tab patterns that might indicate columns
  const tabPatterns = content.match(/\t{2,}/g)
  const hasTabColumns = (tabPatterns?.length || 0) > 3

  // Check for consistent spacing patterns that might indicate columns
  const spacePatterns = content.match(/\s{5,}/g)
  const hasSpaceColumns = (spacePatterns?.length || 0) > 5

  return columnMarkers.some((marker) => content.toLowerCase().includes(marker)) || hasTabColumns || hasSpaceColumns
}

function hasImages(content: string): boolean {
  // Check for image markers
  const imageMarkers = ["<img", "<image", ".jpg", ".png", ".gif", ".jpeg", "data:image"]
  return imageMarkers.some((marker) => content.toLowerCase().includes(marker))
}

function hasHeadersFooters(content: string): boolean {
  // Check for header/footer markers
  const headerFooterMarkers = ["<header", "<footer", "header:", "footer:"]

  // Also check for page numbers in a format typical of headers/footers
  const pageNumberPatterns = /page\s*\d+\s*of\s*\d+/i

  return (
    headerFooterMarkers.some((marker) => content.toLowerCase().includes(marker)) || pageNumberPatterns.test(content)
  )
}

function hasFancyFonts(content: string): boolean {
  // Check for non-standard font markers
  const fancyFontMarkers = [
    "font-family:",
    "comic",
    "papyrus",
    "brush script",
    "impact",
    "copperplate",
    "courier",
    "symbol",
    "wingdings",
    "webdings",
  ]
  return fancyFontMarkers.some((marker) => content.toLowerCase().includes(marker))
}

function hasSpecialCharacters(content: string): boolean {
  // Check for problematic special characters
  const specialCharRegex = /[^\w\s.,;:'"!?@#$%&*()[\]{}/\-+<>=]/g
  const matches = content.match(specialCharRegex)

  // Allow a few special characters, but flag if there are too many
  return (matches?.length || 0) > 10
}

function hasTextBoxes(content: string): boolean {
  // Check for text box markers
  const textBoxMarkers = ["<textbox", "text-box", "textbox", "text box", "text frame"]
  return textBoxMarkers.some((marker) => content.toLowerCase().includes(marker))
}

function hasStandardSectionHeadings(content: string): boolean {
  // Check for standard section headings
  const standardHeadings = [
    "experience",
    "work experience",
    "employment",
    "education",
    "skills",
    "qualifications",
    "summary",
    "objective",
    "profile",
    "certifications",
    "projects",
    "publications",
    "awards",
  ]

  // Count how many standard headings are found
  const foundHeadings = standardHeadings.filter((heading) => {
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`\\b${escapedHeading}\\b`, "i").test(content)
  })

  // Require at least 3 standard headings
  return foundHeadings.length >= 3
}

function hasContactInfoAtTop(content: string): boolean {
  // Get the first 500 characters to check the top of the resume
  const topContent = content.substring(0, 500).toLowerCase()

  // Check for contact information patterns
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  const phonePattern = /\b(\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}\b/
  const linkedinPattern = /linkedin\.com\/in\/[a-z0-9-]+/

  return emailPattern.test(topContent) || phonePattern.test(topContent) || linkedinPattern.test(topContent)
}

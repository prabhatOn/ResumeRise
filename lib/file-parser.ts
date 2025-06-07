import mammoth from "mammoth"

// Enhanced PDF parsing with pdf2json
async function safePdfParse(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const PDF2Json = (await import('pdf2json')).default
    
    return new Promise((resolve, reject) => {
      const pdfParser = new PDF2Json()
      
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error('PDF parsing error:', errData)
        reject(new Error(`PDF parsing failed: ${errData.parserError}`))
      })
      
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          let text = ''
          
          // Extract text from all pages
          if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
            for (const page of pdfData.Pages) {
              if (page.Texts && Array.isArray(page.Texts)) {
                for (const textItem of page.Texts) {
                  if (textItem.R && Array.isArray(textItem.R)) {
                    for (const textRun of textItem.R) {
                      if (textRun.T) {
                        // Decode URL-encoded text
                        text += decodeURIComponent(textRun.T) + ' '
                      }
                    }
                  }
                }
                text += '\n'
              }
            }
          }
          
          // Clean up the text
          const cleanText = text
            .replace(/\r\n/g, '\n') // Normalize line endings
            .replace(/\r/g, '\n') // Normalize line endings
            .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple blank lines
            .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs
            .trim()
          
          if (!cleanText) {
            resolve(`This PDF appears to be image-based or contains no extractable text. 

For the best analysis results, please try one of these options:
1. Upload your resume as a .docx (Word) file
2. Upload as a plain text (.txt) file
3. If this is a scanned PDF, try using OCR to convert it to text first

This will ensure our ATS analyzer can properly read and analyze your resume content.`)
          } else {
            resolve(cleanText)
          }
        } catch (error) {
          reject(error)
        }
      })
      
      // Parse the PDF buffer
      pdfParser.parseBuffer(buffer)
    })
  } catch (error: any) {
    console.error("PDF parsing error:", error)
    
    return `Unable to parse this PDF file. This might be due to:
- Complex formatting or embedded images
- Password protection
- Corrupted file structure
- Scanned/image-based PDF

For the best analysis results, please:
1. Upload your resume as a .docx (Word) file
2. Upload as a plain text (.txt) file  
3. Save your PDF as a Word document first, then upload the .docx version

This will ensure our ATS analyzer can properly read and analyze your resume content.`
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type
  const buffer = await file.arrayBuffer()

  // PDF extraction
  if (fileType === "application/pdf") {
    try {
      const text = await safePdfParse(Buffer.from(buffer))
      return text
    } catch (error: any) {
      console.error("Error parsing PDF:", error)
      throw new Error("Failed to parse PDF file. Please try uploading a DOCX or text file instead.")
    }
  }

  // DOCX extraction
  else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    try {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
      return result.value
    } catch (error: any) {
      console.error("Error parsing DOCX:", error)
      throw new Error("Failed to parse DOCX file")
    }
  }

  // Plain text
  else if (fileType === "text/plain") {
    return new TextDecoder().decode(buffer)
  }

  // Unsupported format
  else {
    throw new Error(`Unsupported file type: ${fileType}`)
  }
}

// Extract structured sections from resume text
export function extractSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {}

  // Common section headers in resumes
  const sectionHeaders = [
    "summary",
    "objective",
    "experience",
    "work experience",
    "employment history",
    "education",
    "skills",
    "technical skills",
    "projects",
    "certifications",
    "awards",
    "publications",
    "languages",
    "interests",
    "references",
  ]

  // Find sections in the text
  let currentSection = "header"
  sections[currentSection] = ""

  const lines = text.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Check if this line is a section header
    const headerMatch = sectionHeaders.find(
      (header) => line.toLowerCase().includes(header) && line.length < 30, // Avoid matching section names in regular text
    )

    if (headerMatch && (line.toUpperCase() === line || /^[A-Z]/.test(line))) {
      currentSection = headerMatch
      sections[currentSection] = ""
    } else {
      sections[currentSection] += line + "\n"
    }
  }

  // Clean up sections
  Object.keys(sections).forEach((key) => {
    sections[key] = sections[key].trim()
  })

  return sections
}

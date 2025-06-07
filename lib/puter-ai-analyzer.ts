// Utility to call Puter AI (or similar free LLM API) for resume analysis

/**
 * Analyze resume using Puter AI API (or similar free LLM API)
 * @param resumeText The plain text of the resume
 * @param jobDescription Optional job description for context
 * @returns AI-powered suggestions and analysis
 */
export interface PuterAIResult {
  suggestions: string[];
  aiScore?: number;
  rawResponse?: unknown;
}

export async function analyzeResumeWithPuterAI(
  resumeText: string,
  jobDescription?: string
): Promise<PuterAIResult> {
  try {
    const suggestions = await generateIntelligentSuggestions(resumeText, jobDescription);
    const aiScore = calculateAIScore(resumeText, jobDescription);

    return {
      suggestions,
      aiScore,
      rawResponse: {
        source: "puter_ai_chat",
        timestamp: new Date().toISOString()
      }
    };  } catch {
    // Fallback suggestions
    return {
      suggestions: [
        "Consider adding more quantifiable achievements with specific numbers and percentages",
        "Ensure your resume includes relevant keywords from the job description",
        "Use strong action verbs to begin each bullet point in your experience section",
        "Add a professional summary that highlights your key qualifications",
        "Review formatting to ensure ATS compatibility with standard fonts and clear section headers"
      ],
      aiScore: 75
    };
  }
}

async function generateIntelligentSuggestions(resumeText: string, jobDescription?: string): Promise<string[]> {
  const prompt = `You are an AI resume reviewer. Analyze the following resume and return 5 specific improvement suggestions to make it more ATS-friendly, impactful, and tailored to the job description.

Resume:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}` : ""}
  
Return the suggestions in numbered list format.`;

  // @ts-expect-error - 'puter' is globally available if you loaded the script
  const response = await puter.ai.chat(prompt);

  if (!response || !response.text) throw new Error("No response from Puter AI");
  const suggestions = response.text
    .split('\n')
    .map((line: string) => line.trim().replace(/^\d+[\).]?\s*/, ''))
    .filter((line: string) => line.length > 0);

  return suggestions.slice(0, 5);
}

function calculateAIScore(resumeText: string, jobDescription?: string): number {
  let score = 50;

  // Contact information (+10)
  if (resumeText.includes('@') && resumeText.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
    score += 10;
  }

  // Professional summary (+10)
  if (resumeText.toLowerCase().includes('summary') || resumeText.toLowerCase().includes('objective')) {
    score += 10;
  }

  // Quantifiable achievements (+15)
  const numberCount = resumeText.match(/\d+%|\$\d+|\d+\+|increased.*\d+|reduced.*\d+|improved.*\d+/gi)?.length || 0;
  score += Math.min(numberCount * 3, 15);

  // Skills section (+10)
  if (resumeText.toLowerCase().includes('skill') || resumeText.toLowerCase().includes('technical')) {
    score += 10;
  }

  // Education section (+5)
  if (resumeText.toLowerCase().includes('education') || resumeText.toLowerCase().includes('degree')) {
    score += 5;
  }

  // Job description matching (+15)
  if (jobDescription) {
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const importantJobWords = jobWords.filter(word => word.length > 4);
    const matchingWords = importantJobWords.filter(word =>
      resumeText.toLowerCase().includes(word)
    );
    const matchRate = matchingWords.length / importantJobWords.length;
    score += Math.round(matchRate * 15);
  }

  return Math.min(Math.max(score, 20), 100);
}

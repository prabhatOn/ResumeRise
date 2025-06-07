import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create a demo user
  const passwordHash = await hash("password123", 10)

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      passwordHash,
      name: "Demo User",
    },
  })

  console.log({ demoUser })

  // Create sample job descriptions
  const jobDescriptions = [
    {
      title: "Software Engineer",
      content: `
Job Title: Software Engineer

About Us:
We are a leading technology company specializing in innovative software solutions. We're looking for a talented Software Engineer to join our dynamic team.

Responsibilities:
- Design, develop, and maintain high-quality software applications
- Write clean, efficient, and well-documented code
- Collaborate with cross-functional teams to define and implement new features
- Troubleshoot, debug, and upgrade existing software
- Stay up-to-date with emerging trends and technologies

Requirements:
- Bachelor's degree in Computer Science, Engineering, or related field
- 2+ years of experience in software development
- Proficiency in JavaScript, TypeScript, and React
- Experience with Node.js and RESTful APIs
- Familiarity with database systems (SQL, NoSQL)
- Strong problem-solving skills and attention to detail
- Excellent communication and teamwork abilities

Nice to Have:
- Experience with cloud platforms (AWS, Azure, GCP)
- Knowledge of CI/CD pipelines and DevOps practices
- Contributions to open-source projects
- Experience with microservices architecture

Benefits:
- Competitive salary and benefits package
- Flexible work arrangements
- Professional development opportunities
- Collaborative and innovative work environment
      `,
      userId: demoUser.id,
    },
    {
      title: "Data Analyst",
      content: `
Job Title: Data Analyst

About Us:
We are a data-driven company seeking a skilled Data Analyst to help transform our data into insights and drive business decisions.

Responsibilities:
- Collect, process, and analyze large datasets
- Create and maintain dashboards and reports
- Identify trends, patterns, and opportunities in data
- Collaborate with stakeholders to understand business requirements
- Present findings and recommendations to non-technical audiences

Requirements:
- Bachelor's degree in Statistics, Mathematics, Economics, or related field
- 2+ years of experience in data analysis
- Proficiency in SQL and data visualization tools (Tableau, Power BI)
- Experience with statistical analysis and data mining
- Strong Excel skills and attention to detail
- Excellent problem-solving and communication abilities

Nice to Have:
- Knowledge of Python or R for data analysis
- Experience with big data technologies
- Understanding of machine learning concepts
- Business intelligence tool experience

Benefits:
- Competitive compensation package
- Health and wellness benefits
- Professional development opportunities
- Collaborative work environment
      `,
      userId: demoUser.id,
    },
  ]

  for (const jobDesc of jobDescriptions) {
    await prisma.jobDescription
      .create({
        data: jobDesc,
      })
      .catch((error) => {
        // Log error but continue seeding
        console.log(`Job description "${jobDesc.title}" may already exist or failed to create:`, error.message)
      })
  }

  // Create sample resume with analysis data
  const sampleResumeContent = `
John Smith
Software Engineer
Email: john.smith@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith | GitHub: github.com/johnsmith

EXPERIENCE
Software Developer - Tech Solutions Inc. (2022-Present)
• Developed and maintained web applications using React and Node.js
• Collaborated with team members to implement new features
• Worked on database optimization and API development
• Responsible for code reviews and testing

Junior Developer - StartupCorp (2021-2022)
• Built responsive websites using HTML, CSS, and JavaScript
• Assisted in troubleshooting and debugging applications
• Participated in daily standups and agile development process

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2017-2021)
GPA: 3.5/4.0

SKILLS
• Programming Languages: JavaScript, TypeScript, Python
• Frameworks: React, Node.js, Express
• Databases: MongoDB, PostgreSQL
• Tools: Git, Docker, AWS
`

  try {
    const sampleResume = await prisma.resume.create({
      data: {
        userId: demoUser.id,
        title: "Sample Software Engineer Resume",
        content: sampleResumeContent,
        fileName: "sample-resume.pdf",
        fileType: "application/pdf",
      },
    })

    // Create sample analysis with AI suggestions
    const sampleAnalysis = await prisma.analysis.create({
      data: {
        resumeId: sampleResume.id,
        totalScore: 75,
        atsScore: 80,
        keywordScore: 70,
        grammarScore: 85,
        formattingScore: 90,
        sectionScore: 75,
        actionVerbScore: 65,
        bulletPointScore: 80,
        languageToneScore: 75,
        suggestions: JSON.stringify({
          general: "Consider adding more quantifiable achievements to strengthen your resume.",
          suggestionList: [
            "Add specific metrics and numbers to quantify your achievements",
            "Include more technical keywords relevant to software engineering",
            "Improve action verbs to make accomplishments more impactful"
          ],
          aiSuggestions: [
            "Replace 'Worked on database optimization' with 'Optimized database queries, reducing response time by 30%'",
            "Change 'Collaborated with team members' to 'Led cross-functional team of 5 developers to deliver projects 15% ahead of schedule'",
            "Add specific technologies and frameworks you've used in each role",
            "Include quantified results like 'Reduced bug reports by 40%' or 'Improved application performance by 25%'"
          ],
          aiScore: 78,
          industry: "technology",
          industryScore: 80,
          industryRecommendations: [
            "Add open-source contributions to showcase coding skills",
            "Include cloud platform certifications",
            "Mention agile/scrum methodologies experience"
          ],
          atsDetails: {
            formatCompliance: 85,
            keywordDensity: 70,
            sectionStructure: 90
          },
          comprehensiveAnalysis: {
            strengths: [
              "Clear contact information",
              "Relevant technical skills listed",
              "Progressive career experience"
            ],
            issues: [
              {
                type: "missing_metrics",
                severity: "high",
                description: "Achievements lack quantifiable results",
                suggestion: "Add specific numbers, percentages, and metrics to demonstrate impact"
              },
              {
                type: "weak_action_verbs",
                severity: "medium", 
                description: "Some bullet points use weak action verbs",
                suggestion: "Replace 'Responsible for' and 'Worked on' with stronger action verbs"
              }
            ]
          }
        }),
        jobDescriptionId: null,
      },
    })

    // Create sample keywords
    await prisma.keyword.createMany({
      data: [
        { 
          analysisId: sampleAnalysis.id, 
          keyword: "JavaScript", 
          normalizedKeyword: "javascript",
          count: 2, 
          isMatch: true, 
          isFromJobDescription: true,
          category: "technical",
          importance: 5,
          source: "skills"
        },
        { 
          analysisId: sampleAnalysis.id, 
          keyword: "React", 
          normalizedKeyword: "react",
          count: 2, 
          isMatch: true, 
          isFromJobDescription: true,
          category: "technical",
          importance: 5,
          source: "skills"
        },
        { 
          analysisId: sampleAnalysis.id, 
          keyword: "Node.js", 
          normalizedKeyword: "nodejs",
          count: 2, 
          isMatch: true, 
          isFromJobDescription: true,
          category: "technical",
          importance: 4,
          source: "skills"
        },
        { 
          analysisId: sampleAnalysis.id, 
          keyword: "TypeScript", 
          normalizedKeyword: "typescript",
          count: 1, 
          isMatch: true, 
          isFromJobDescription: true,
          category: "technical",
          importance: 4,
          source: "skills"
        },
        { 
          analysisId: sampleAnalysis.id, 
          keyword: "AWS", 
          normalizedKeyword: "aws",
          count: 1, 
          isMatch: true, 
          isFromJobDescription: false,
          category: "tool",
          importance: 3,
          source: "skills"
        },
      ]
    })

    // Create sample sections
    await prisma.section.createMany({
      data: [
        { 
          analysisId: sampleAnalysis.id, 
          name: "Experience", 
          content: "Software Developer experience section with work history and achievements",
          score: 80, 
          suggestions: "Add more quantifiable achievements" 
        },
        { 
          analysisId: sampleAnalysis.id, 
          name: "Education", 
          content: "Bachelor of Science in Computer Science from University of Technology",
          score: 85, 
          suggestions: null 
        },
        { 
          analysisId: sampleAnalysis.id, 
          name: "Skills", 
          content: "Technical skills including JavaScript, React, Node.js, and various tools",
          score: 75, 
          suggestions: "Group skills by category" 
        },
      ]
    })

    // Create sample issues
    await prisma.issue.createMany({
      data: [
        { 
          analysisId: sampleAnalysis.id, 
          category: "achievements",
          description: "Missing quantifiable achievements in experience section", 
          severity: "high",
          suggestion: "Add specific metrics and numbers to demonstrate impact"
        },
        { 
          analysisId: sampleAnalysis.id, 
          category: "language",
          description: "Weak action verbs used in some bullet points", 
          severity: "medium",
          suggestion: "Replace weak verbs with strong action words like 'Led', 'Implemented', 'Optimized'"
        },
      ]
    })

    console.log("Sample resume and analysis created successfully!")
  } catch (error) {
    console.log("Sample resume creation failed:", error instanceof Error ? error.message : String(error))
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

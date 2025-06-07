import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedKeywordData() {
  console.log("🌱 Seeding keyword categories...")

  // Create keyword categories
  const categories = [
    {
      name: "technical",
      description: "Technical skills and programming languages",
      industry: null
    },
    {
      name: "soft_skill",
      description: "Soft skills and interpersonal abilities",
      industry: null
    },
    {
      name: "certification",
      description: "Professional certifications and credentials",
      industry: null
    },
    {
      name: "tool",
      description: "Software tools and platforms",
      industry: null
    },
    {
      name: "framework",
      description: "Development frameworks and libraries",
      industry: "tech"
    },
    {
      name: "methodology",
      description: "Development methodologies and practices",
      industry: "tech"
    }
  ]

  for (const category of categories) {
    await prisma.keywordCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
  }

  console.log("✅ Keyword categories seeded")

  console.log("🌱 Seeding industry keywords...")

  // Technology industry keywords
  const techKeywords = [
    // Programming Languages
    { keyword: "JavaScript", category: "technical", importance: 5 },
    { keyword: "TypeScript", category: "technical", importance: 5 },
    { keyword: "Python", category: "technical", importance: 5 },
    { keyword: "Java", category: "technical", importance: 5 },
    { keyword: "React", category: "framework", importance: 5 },
    { keyword: "Node.js", category: "framework", importance: 4 },
    { keyword: "Angular", category: "framework", importance: 4 },
    { keyword: "Vue.js", category: "framework", importance: 4 },
    
    // Tools and Technologies
    { keyword: "Docker", category: "tool", importance: 4 },
    { keyword: "Kubernetes", category: "tool", importance: 4 },
    { keyword: "AWS", category: "tool", importance: 5 },
    { keyword: "Azure", category: "tool", importance: 4 },
    { keyword: "Git", category: "tool", importance: 5 },
    { keyword: "GitHub", category: "tool", importance: 4 },
    { keyword: "Jenkins", category: "tool", importance: 3 },
    
    // Databases
    { keyword: "PostgreSQL", category: "technical", importance: 4 },
    { keyword: "MongoDB", category: "technical", importance: 4 },
    { keyword: "MySQL", category: "technical", importance: 4 },
    { keyword: "Redis", category: "technical", importance: 3 },
    
    // Methodologies
    { keyword: "Agile", category: "methodology", importance: 4 },
    { keyword: "Scrum", category: "methodology", importance: 4 },
    { keyword: "DevOps", category: "methodology", importance: 4 },
    { keyword: "CI/CD", category: "methodology", importance: 4 },
    
    // Soft Skills
    { keyword: "Leadership", category: "soft_skill", importance: 4 },
    { keyword: "Problem Solving", category: "soft_skill", importance: 4 },
    { keyword: "Team Collaboration", category: "soft_skill", importance: 4 },
    { keyword: "Communication", category: "soft_skill", importance: 5 }
  ]

  for (const keyword of techKeywords) {
    await prisma.industryKeyword.upsert({
      where: {
        normalizedKeyword_industry_category: {
          normalizedKeyword: keyword.keyword.toLowerCase(),
          industry: "tech",
          category: keyword.category
        }
      },
      update: {},
      create: {
        keyword: keyword.keyword,
        normalizedKeyword: keyword.keyword.toLowerCase(),
        industry: "tech",
        category: keyword.category,
        importance: keyword.importance
      }
    })
  }

  // Finance industry keywords
  const financeKeywords = [
    { keyword: "Excel", category: "tool", importance: 5 },
    { keyword: "Financial Modeling", category: "technical", importance: 5 },
    { keyword: "Risk Management", category: "technical", importance: 4 },
    { keyword: "Portfolio Management", category: "technical", importance: 4 },
    { keyword: "Bloomberg Terminal", category: "tool", importance: 4 },
    { keyword: "SQL", category: "technical", importance: 4 },
    { keyword: "Python", category: "technical", importance: 4 },
    { keyword: "R", category: "technical", importance: 3 },
    { keyword: "CFA", category: "certification", importance: 5 },
    { keyword: "FRM", category: "certification", importance: 4 },
    { keyword: "Analytical Thinking", category: "soft_skill", importance: 4 },
    { keyword: "Attention to Detail", category: "soft_skill", importance: 5 }
  ]

  for (const keyword of financeKeywords) {
    await prisma.industryKeyword.upsert({
      where: {
        normalizedKeyword_industry_category: {
          normalizedKeyword: keyword.keyword.toLowerCase(),
          industry: "finance",
          category: keyword.category
        }
      },
      update: {},
      create: {
        keyword: keyword.keyword,
        normalizedKeyword: keyword.keyword.toLowerCase(),
        industry: "finance",
        category: keyword.category,
        importance: keyword.importance
      }
    })
  }

  // Healthcare industry keywords
  const healthcareKeywords = [
    { keyword: "Patient Care", category: "technical", importance: 5 },
    { keyword: "Medical Records", category: "technical", importance: 4 },
    { keyword: "HIPAA", category: "certification", importance: 5 },
    { keyword: "Electronic Health Records", category: "tool", importance: 4 },
    { keyword: "Clinical Research", category: "technical", importance: 4 },
    { keyword: "Healthcare Compliance", category: "technical", importance: 4 },
    { keyword: "Empathy", category: "soft_skill", importance: 5 },
    { keyword: "Communication", category: "soft_skill", importance: 5 },
    { keyword: "Critical Thinking", category: "soft_skill", importance: 4 }
  ]

  for (const keyword of healthcareKeywords) {
    await prisma.industryKeyword.upsert({
      where: {
        normalizedKeyword_industry_category: {
          normalizedKeyword: keyword.keyword.toLowerCase(),
          industry: "healthcare",
          category: keyword.category
        }
      },
      update: {},
      create: {
        keyword: keyword.keyword,
        normalizedKeyword: keyword.keyword.toLowerCase(),
        industry: "healthcare",
        category: keyword.category,
        importance: keyword.importance
      }
    })
  }

  console.log("✅ Industry keywords seeded")
  console.log("🎉 Keyword data seeding completed!")
}

async function main() {
  try {
    await seedKeywordData()
  } catch (error) {
    console.error("❌ Error seeding keyword data:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}

export { seedKeywordData }

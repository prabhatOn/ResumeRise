import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Prevent multiple instances of Prisma Client in development
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

// Warm up the connection in production
if (process.env.NODE_ENV === "production") {
  prisma.$connect().catch((error) => {
    console.error("Failed to connect to database:", error)
  })
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma

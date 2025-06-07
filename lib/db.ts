import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Prevent multiple instances of Prisma Client in development
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

// Note: Prisma will connect automatically when a query is made
// Skipping manual connection to avoid build-time issues

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma

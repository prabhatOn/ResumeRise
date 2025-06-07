import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Prevent multiple instances of Prisma Client
export const prisma = globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  })

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

export default prisma

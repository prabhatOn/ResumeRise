import { prisma } from './db'

export async function checkDatabaseConnection(): Promise<{
  isConnected: boolean
  error?: string
  latency?: number
}> {
  try {
    const start = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const latency = Date.now() - start

    return {
      isConnected: true,
      latency,
    }
  } catch (error) {
    console.error('Database connection check failed:', error)
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function ensureDatabaseConnection(): Promise<void> {
  const result = await checkDatabaseConnection()
  
  if (!result.isConnected) {
    throw new Error(`Database connection failed: ${result.error}`)
  }
  
  console.log(`✅ Database connected (${result.latency}ms)`)
}

export async function gracefulDatabaseDisconnect(): Promise<void> {
  try {
    await prisma.$disconnect()
    console.log('🔌 Database disconnected gracefully')
  } catch (error) {
    console.error('Error disconnecting from database:', error)
  }
}

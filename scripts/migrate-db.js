const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateDatabase() {
  try {
    console.log('🔄 Starting database migration...')
    
    // Check database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Run migrations
    console.log('🔄 Applying database migrations...')
    const { execSync } = require('child_process')
    
    try {
      execSync('npx prisma migrate dev --name add-audit-trail-models', {
        stdio: 'inherit',
        cwd: process.cwd()
      })
      console.log('✅ Database migrations applied successfully')
    } catch (error) {
      console.log('⚠️  Migration may have already been applied or encountered an issue')
      console.log('Checking current schema...')
    }
    
    // Generate Prisma client
    console.log('🔄 Generating Prisma client...')
    execSync('npx prisma generate', {
      stdio: 'inherit',
      cwd: process.cwd()
    })
    console.log('✅ Prisma client generated successfully')
    
    // Verify tables exist
    console.log('🔄 Verifying new tables...')
    
    const tables = [
      'user_activities',
      'performance_metrics', 
      'error_logs',
      'api_usage',
      'file_uploads'
    ]
    
    for (const table of tables) {
      try {
        // Check if table exists by running a simple query
        await prisma.$queryRaw`SELECT 1 FROM ${table} LIMIT 1`
        console.log(`✅ Table ${table} exists and is accessible`)
      } catch (error) {
        console.log(`❌ Table ${table} not found or not accessible`)
        console.log(`Error: ${error.message}`)
      }
    }
    
    console.log('🎉 Database migration completed!')
    
  } catch (error) {
    console.error('❌ Database migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

if (require.main === module) {
  migrateDatabase()
}

module.exports = { migrateDatabase }

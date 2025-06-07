#!/usr/bin/env node

/**
 * Database setup script for Resume ATS
 * This script helps set up the database for development
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Resume ATS Database...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please create one based on .env.example');
  process.exit(1);
}

// Read DATABASE_URL from .env
const envContent = fs.readFileSync(envPath, 'utf8');
const databaseUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);

if (!databaseUrlMatch) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

const databaseUrl = databaseUrlMatch[1];
console.log('📊 Database URL found in .env file');

// Check if it's a local PostgreSQL URL
if (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
  console.log('🔧 Local PostgreSQL database detected');
  console.log('\n📝 To set up local PostgreSQL:');
  console.log('1. Install PostgreSQL: https://www.postgresql.org/download/');
  console.log('2. Create a database named "resume_ats"');
  console.log('3. Update the DATABASE_URL in .env with your credentials');
  console.log('\nAlternatively, you can use a cloud database like:');
  console.log('- Neon: https://neon.tech/');
  console.log('- Supabase: https://supabase.com/');
  console.log('- Railway: https://railway.app/');
}

try {
  console.log('\n🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('\n🗄️ Running database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  
  console.log('\n🌱 Seeding database...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup completed successfully!');
  console.log('\n🚀 You can now run: npm run dev');
  
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure PostgreSQL is running');
  console.log('2. Check your DATABASE_URL in .env file');
  console.log('3. Ensure the database exists');
  console.log('4. Verify database credentials');
  process.exit(1);
}

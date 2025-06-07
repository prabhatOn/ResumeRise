#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Resume ATS System...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created. Please update it with your configuration.\n');
  } else {
    console.log('❌ .env.example not found. Please create .env manually.\n');
  }
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully.\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Generate Prisma client
console.log('🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully.\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Run database migrations
console.log('🗄️  Running database migrations...');
try {
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('✅ Database migrations completed successfully.\n');
} catch (error) {
  console.log('⚠️  Database migrations failed. You may need to set up your database first.\n');
}

// Create uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created.\n');
}

// Create logs directory
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  console.log('📁 Creating logs directory...');
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Logs directory created.\n');
}

console.log('🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update your .env file with the correct configuration');
console.log('2. Start your database and Redis server');
console.log('3. Run "npm run dev" to start the development server');
console.log('4. For production, run "npm run build" followed by "npm start"');
console.log('\n🔧 Available commands:');
console.log('- npm run dev          Start development server');
console.log('- npm run build        Build for production');
console.log('- npm run start        Start production server');
console.log('- npm run test         Run tests');
console.log('- npm run db:studio    Open Prisma Studio');
console.log('- npm run lint         Run linting');
console.log('\n🐳 Docker commands:');
console.log('- npm run docker:build Build Docker image');
console.log('- npm run docker:run   Run Docker container');
console.log('- docker-compose up    Start all services');
console.log('\n✨ Happy coding!');

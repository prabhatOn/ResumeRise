# ResumeRise - Professional Resume Analysis

A professional resume analysis application that helps users optimize their resumes for Applicant Tracking Systems (ATS).

## Features

- Resume upload and analysis
- ATS compatibility checking
- Keyword matching with job descriptions
- Industry-specific scoring and recommendations
- Detailed section analysis
- Interactive visualizations
- PDF and DOCX parsing

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL (via Neon)
- NextAuth.js for authentication
- Tailwind CSS
- shadcn/ui components
- Chart.js for visualizations

## Deployment

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Vercel account (recommended for deployment)

### Environment Variables

Create a `.env` file based on `.env.example` with the following variables:

\`\`\`
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/resume_ats"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-at-least-32-chars-long"
\`\`\`

### Local Development

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Set up the database:
   \`\`\`
   npx prisma migrate dev
   npx prisma db seed
   \`\`\`
4. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

### Production Deployment

#### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Import the project in Vercel
3. Set the required environment variables
4. Deploy

#### Manual Deployment

1. Build the application:
   \`\`\`
   npm run build
   \`\`\`
2. Start the production server:
   \`\`\`
   npm start
   \`\`\`

## Database Setup

The application uses Prisma ORM with PostgreSQL. Here are several setup options:

### Option 1: Quick Setup (Recommended for Development)

Run the automated setup script:
\`\`\`bash
npm run db:setup
\`\`\`

### Option 2: Manual Setup

1. **Create a PostgreSQL database**
   - Install PostgreSQL locally: https://www.postgresql.org/download/
   - Create a database named `resume_ats`
   - Or use a cloud provider (Neon, Supabase, Railway)

2. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your database credentials

3. **Run database setup**
   \`\`\`bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed database with sample data
   npm run db:seed
   \`\`\`

### Option 3: Using Docker (if available)

\`\`\`bash
# Start PostgreSQL container
docker compose up db -d

# Run setup
npm run db:setup
\`\`\`

### Database Commands

- \`npm run db:setup\` - Complete database setup
- \`npm run db:generate\` - Generate Prisma client
- \`npm run db:migrate\` - Run database migrations
- \`npm run db:seed\` - Seed database with sample data
- \`npm run db:reset\` - Reset database (⚠️ deletes all data)
- \`npm run db:studio\` - Open Prisma Studio

### Troubleshooting

If you encounter database connection issues:

1. **Check database is running**
   \`\`\`bash
   # Test health endpoint
   curl http://localhost:3000/api/health
   \`\`\`

2. **Verify DATABASE_URL format**
   \`\`\`
   postgresql://username:password@host:port/database
   \`\`\`

3. **Common solutions**
   - Ensure PostgreSQL service is running
   - Check firewall settings
   - Verify database credentials
   - For cloud databases, check network access

## License

MIT

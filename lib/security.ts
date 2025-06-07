import { z } from 'zod'
import { log } from './logger'

// Validation schemas for API inputs
export const schemas = {
  // Resume upload validation
  resumeUpload: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    resumeFile: z.instanceof(File).refine(
      (file) => file.size <= 10 * 1024 * 1024, // 10MB
      'File size must be less than 10MB'
    ).refine(
      (file) => ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
      'Only PDF and DOCX files are allowed'
    ),
    jobDescription: z.string().max(10000, 'Job description too long').optional().transform(val => val || undefined)
  }),

  // User registration validation
  userRegistration: z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
    email: z.string().email('Invalid email format').max(100, 'Email too long'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password too long')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
        'Password must contain uppercase, lowercase, number and special character')
  }),

  // User login validation
  userLogin: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  }),

  // Resume ID validation
  resumeId: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid resume ID').transform(Number)
  }),

  // Analysis parameters
  analysisParams: z.object({
    includeJobDescription: z.boolean().optional(),
    detailedAnalysis: z.boolean().optional(),
    industrySpecific: z.boolean().optional()
  })
}

// File upload security validation
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File size exceeds 10MB limit' }
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF and DOCX files are allowed' }
  }

  // Check file name for malicious patterns
  const fileName = file.name.toLowerCase()
  const suspiciousPatterns = [
    /\.exe$/,
    /\.bat$/,
    /\.cmd$/,
    /\.scr$/,
    /\.vbs$/,
    /\.js$/,
    /\.jar$/,
    /\.php$/,
    /\.asp$/,
    /\.jsp$/
  ]

  if (suspiciousPatterns.some(pattern => pattern.test(fileName))) {
    log.warn('Suspicious file upload attempt', { fileName, fileType: file.type })
    return { valid: false, error: 'File type not allowed for security reasons' }
  }

  return { valid: true }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Content Security Policy headers
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block'
}

// API key validation (for future integrations)
export function validateApiKey(apiKey: string | null): boolean {
  if (!apiKey) return false
  
  // Add your API key validation logic here
  // For now, just check if it's a valid format
  return /^[a-zA-Z0-9_-]{32,}$/.test(apiKey)
}

// Request origin validation
export function validateOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false
  return allowedOrigins.includes(origin)
}

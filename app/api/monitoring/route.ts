import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { log } from "@/lib/logger"

export async function GET(request: Request) {
  let session: Session | null = null
  try {
    session = await getServerSession(authOptions)
    
    // Check if user is admin (you might want to add an admin role to your user model)
    if (!session?.user?.email?.endsWith('@admin.com')) { // Simple admin check
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '24h'
    
    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (timeframe) {
      case '1h':
        startDate.setHours(now.getHours() - 1)
        break
      case '24h':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      default:
        startDate.setDate(now.getDate() - 1)
    }

    // Get system health metrics
    const systemHealth = {
      database: await checkDatabaseHealth(),
      memory: getMemoryUsage(),
      uptime: process.uptime(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    }

    // Mock error logs (in production, you'd query your ErrorLog table)
    const errorLogs = [
      {
        id: 1,
        timestamp: new Date(),
        level: 'error',
        message: 'Resume upload failed',
        errorType: 'resume_upload_error',
        userId: 'user123',
        stack: 'Error: File validation failed...',
        count: 3
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 3600000),
        level: 'warning',
        message: 'Slow database query detected',
        errorType: 'performance_warning',
        userId: null,
        stack: null,
        count: 15
      }
    ]

    // Mock performance metrics
    const performanceMetrics = [
      {
        operation: 'resume_analysis',
        averageTime: 2300,
        count: 45,
        slowestTime: 5600,
        fastestTime: 1200
      },
      {
        operation: 'text_extraction',
        averageTime: 800,
        count: 50,
        slowestTime: 2100,
        fastestTime: 300
      },
      {
        operation: 'database_query',
        averageTime: 150,
        count: 200,
        slowestTime: 800,
        fastestTime: 50
      }
    ]

    // Mock API usage stats
    const apiStats = {
      totalRequests: 1247,
      successfulRequests: 1203,
      failedRequests: 44,
      averageResponseTime: 450,
      rateLimitHits: 8,
      topEndpoints: [
        { endpoint: '/api/resumes/upload', requests: 450, errors: 12 },
        { endpoint: '/api/analytics', requests: 200, errors: 2 },
        { endpoint: '/api/health', requests: 597, errors: 0 }
      ]
    }

    const monitoring = {
      systemHealth,
      errorLogs,
      performanceMetrics,
      apiStats,      alerts: generateAlerts(systemHealth, errorLogs, performanceMetrics),
      timestamp: new Date().toISOString()
    }

    log.info('monitoring_dashboard_accessed', {
      userId: session.user.id,
      timeframe,
      adminEmail: session.user.email
    })

    return NextResponse.json(monitoring)
  } catch (error) {
    log.error('monitoring_dashboard_error', {
      message: error instanceof Error ? error.message : 'Unknown error',
      userId: session?.user?.id || 'unknown'
    })
    
    return NextResponse.json(
      { message: "Failed to fetch monitoring data" },
      { status: 500 }
    )
  }
}

async function checkDatabaseHealth() {
  try {
    // Simple database connectivity check
    const start = Date.now()
    // In a real implementation, you'd check your actual database
    await new Promise(resolve => setTimeout(resolve, 10)) // Simulate DB query
    const responseTime = Date.now() - start
    
    return {
      status: 'healthy',
      responseTime,
      connections: Math.floor(Math.random() * 20) + 5, // Mock connection count
      lastChecked: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      lastChecked: new Date().toISOString()
    }
  }
}

function getMemoryUsage() {
  const usage = process.memoryUsage()
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
    external: Math.round(usage.external / 1024 / 1024), // MB
    rss: Math.round(usage.rss / 1024 / 1024), // MB
    heapUsagePercent: Math.round((usage.heapUsed / usage.heapTotal) * 100)
  }
}

function generateAlerts(systemHealth: any, errorLogs: any[], performanceMetrics: any[]) {
  const alerts = []

  // Database health alert
  if (systemHealth.database.status !== 'healthy') {
    alerts.push({
      id: 'db-health',
      level: 'critical',
      title: 'Database Health Issue',
      description: 'Database connectivity problems detected',
      timestamp: new Date().toISOString()
    })
  }

  // Memory usage alert
  if (systemHealth.memory.heapUsagePercent > 90) {
    alerts.push({
      id: 'memory-high',
      level: 'warning',
      title: 'High Memory Usage',
      description: `Memory usage is at ${systemHealth.memory.heapUsagePercent}%`,
      timestamp: new Date().toISOString()
    })
  }

  // Error rate alert
  const recentErrors = errorLogs.filter(log => 
    log.level === 'error' && 
    new Date(log.timestamp).getTime() > Date.now() - 3600000 // Last hour
  )
  
  if (recentErrors.length > 10) {
    alerts.push({
      id: 'error-rate-high',
      level: 'warning',
      title: 'High Error Rate',
      description: `${recentErrors.length} errors in the last hour`,
      timestamp: new Date().toISOString()
    })
  }

  // Performance alert
  const slowOperations = performanceMetrics.filter(metric => metric.averageTime > 3000)
  if (slowOperations.length > 0) {
    alerts.push({
      id: 'performance-slow',
      level: 'warning',
      title: 'Slow Operations Detected',
      description: `${slowOperations.length} operations are performing slowly`,
      timestamp: new Date().toISOString()
    })
  }

  return alerts
}

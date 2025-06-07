import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db-health"
import { log } from "@/lib/logger"
import { nlpAnalyzer } from "@/lib/nlp-analyzer"
import fs from 'fs'
import path from 'path'

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  environment: string
  version: string
  checks: {
    database: {
      status: 'pass' | 'fail'
      latency?: number
      error?: string
    }
    nlp: {
      status: 'pass' | 'fail'
      latency?: number
      error?: string
    }
    memory: {
      status: 'pass' | 'warn' | 'fail'
      usage: number
      limit: number
      percentage: number
    }
    disk: {
      status: 'pass' | 'warn' | 'fail'
      logsSize?: number
    }
  }
  uptime: number
}

export async function GET() {
  const startTime = Date.now()
  
  try {
    const healthResult: HealthCheckResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: { status: 'fail' },
        nlp: { status: 'fail' },
        memory: { status: 'fail', usage: 0, limit: 0, percentage: 0 },
        disk: { status: 'fail' }
      },
      uptime: process.uptime()
    }

    // Database health check
    try {
      const dbHealth = await checkDatabaseConnection()
      healthResult.checks.database = {
        status: dbHealth.isConnected ? 'pass' : 'fail',
        latency: dbHealth.latency,
        error: dbHealth.error
      }
    } catch (error) {
      healthResult.checks.database = {
        status: 'fail',
        error: error instanceof Error ? error.message : 'Unknown database error'
      }
    }

    // NLP service health check
    try {
      const nlpStartTime = Date.now()
      await nlpAnalyzer.analyzeText("health check test")
      const nlpLatency = Date.now() - nlpStartTime
      
      healthResult.checks.nlp = {
        status: 'pass',
        latency: nlpLatency
      }
    } catch (error) {
      healthResult.checks.nlp = {
        status: 'fail',
        error: error instanceof Error ? error.message : 'NLP service unavailable'
      }
    }

    // Memory health check
    try {
      const memUsage = process.memoryUsage()
      const totalMem = memUsage.heapTotal
      const usedMem = memUsage.heapUsed
      const memPercentage = (usedMem / totalMem) * 100
      
      let memStatus: 'pass' | 'warn' | 'fail' = 'pass'
      if (memPercentage > 90) memStatus = 'fail'
      else if (memPercentage > 80) memStatus = 'warn'
      
      healthResult.checks.memory = {
        status: memStatus,
        usage: Math.round(usedMem / 1024 / 1024), // MB
        limit: Math.round(totalMem / 1024 / 1024), // MB
        percentage: Math.round(memPercentage)
      }
    } catch (error) {
      healthResult.checks.memory = {
        status: 'fail',
        usage: 0,
        limit: 0,
        percentage: 0
      }
      log.warn('Memory check failed', { error: error instanceof Error ? error.message : 'Unknown error' })
    }

    // Disk space check (logs directory)
    try {
      let logsSize = 0
      const logsDir = path.join(process.cwd(), 'logs')
      
      if (fs.existsSync(logsDir)) {
        const files = fs.readdirSync(logsDir)
        for (const file of files) {
          const filePath = path.join(logsDir, file)
          const stats = fs.statSync(filePath)
          logsSize += stats.size
        }
      }
      
      const logsSizeMB = logsSize / 1024 / 1024
      let diskStatus: 'pass' | 'warn' | 'fail' = 'pass'
      if (logsSizeMB > 1000) diskStatus = 'fail' // 1GB
      else if (logsSizeMB > 500) diskStatus = 'warn' // 500MB
      
      healthResult.checks.disk = {
        status: diskStatus,
        logsSize: Math.round(logsSizeMB)
      }
    } catch (error) {
      healthResult.checks.disk = {
        status: 'fail'
      }
      log.warn('Disk check failed', { error: error instanceof Error ? error.message : 'Unknown error' })
    }

    // Determine overall health status
    const checks = Object.values(healthResult.checks)
    const hasFailures = checks.some(check => check.status === 'fail')
    const hasWarnings = checks.some(check => check.status === 'warn')
    
    if (hasFailures) {
      healthResult.status = 'unhealthy'
    } else if (hasWarnings) {
      healthResult.status = 'degraded'
    }

    // Log health check
    log.performance('health_check', Date.now() - startTime, {
      status: healthResult.status,
      dbConnected: healthResult.checks.database.status === 'pass',
      nlpWorking: healthResult.checks.nlp.status === 'pass',
      memoryUsage: healthResult.checks.memory.percentage
    })

    // Return appropriate status code
    const statusCode = healthResult.status === 'healthy' ? 200 : 
                      healthResult.status === 'degraded' ? 200 : 503

    return NextResponse.json(healthResult, { status: statusCode })
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    log.error('health_check_error', { 
      message: errorMessage,
      processingTime: Date.now() - startTime 
    })

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        error: errorMessage,
        uptime: process.uptime()
      },
      { status: 503 }
    )
  }
}

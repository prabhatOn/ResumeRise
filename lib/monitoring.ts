import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'

interface PerformanceMetrics {
  startTime: number
  endTime?: number
  duration?: number
  memoryUsage?: NodeJS.MemoryUsage
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map()

  start(operationId: string): void {
    this.metrics.set(operationId, {
      startTime: performance.now(),
      memoryUsage: process.memoryUsage()
    })
  }

  end(operationId: string, meta?: any): number {
    const metric = this.metrics.get(operationId)
    if (!metric) {
      log.warn(`Performance metric not found for operation: ${operationId}`)
      return 0
    }

    const endTime = performance.now()
    const duration = endTime - metric.startTime

    metric.endTime = endTime
    metric.duration = duration

    log.performance(operationId, duration, {
      ...meta,
      memoryUsage: metric.memoryUsage,
      finalMemoryUsage: process.memoryUsage()
    })

    this.metrics.delete(operationId)
    return duration
  }

  measure<T>(operationId: string, operation: () => Promise<T> | T, meta?: any): Promise<T> | T {
    this.start(operationId)
    
    try {
      const result = operation()
      
      if (result instanceof Promise) {
        return result.finally(() => {
          this.end(operationId, meta)
        })
      } else {
        this.end(operationId, meta)
        return result
      }
    } catch (error) {
      this.end(operationId, { ...meta, error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }
}

// Middleware for API route performance monitoring
export function withPerformanceMonitoring(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const monitor = new PerformanceMonitor()
    const operationId = `${req.method} ${req.nextUrl.pathname}`
      log.apiRequest(req.method, req.nextUrl.pathname, undefined, {
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    })

    return monitor.measure(operationId, () => handler(req, ...args), {
      method: req.method,
      pathname: req.nextUrl.pathname,
      searchParams: Object.fromEntries(req.nextUrl.searchParams)
    })
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  constructor(
    private windowMs: number = 15 * 60 * 1000, // 15 minutes
    private maxRequests: number = 100
  ) {}

  isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    const requests = this.requests.get(identifier) || []
    const recentRequests = requests.filter(time => time > windowStart)
    
    if (recentRequests.length >= this.maxRequests) {
      log.warn('Rate limit exceeded', { 
        identifier, 
        requestCount: recentRequests.length,
        maxRequests: this.maxRequests 
      })
      return true
    }
    
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)
    
    return false
  }
}

export const globalRateLimiter = new RateLimiter()

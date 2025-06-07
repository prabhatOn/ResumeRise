import { Redis } from 'ioredis'
import { log } from './logger'

// Redis client configuration  
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  enableReadyCheck: false,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  family: 4, // Use IPv4
})

// Cache key prefixes
const CACHE_PREFIXES = {
  RESUME_ANALYSIS: 'analysis:',
  USER_SESSION: 'session:',
  RATE_LIMIT: 'rate:',
  KEYWORD_ANALYTICS: 'keywords:',
  INDUSTRY_DATA: 'industry:',
  NLP_RESULTS: 'nlp:',
  API_RESPONSE: 'api:',
} as const

// Cache TTL (Time To Live) in seconds
const CACHE_TTL = {
  RESUME_ANALYSIS: 24 * 60 * 60, // 24 hours
  USER_SESSION: 30 * 60, // 30 minutes
  RATE_LIMIT: 60 * 60, // 1 hour
  KEYWORD_ANALYTICS: 7 * 24 * 60 * 60, // 7 days
  INDUSTRY_DATA: 30 * 24 * 60 * 60, // 30 days
  NLP_RESULTS: 12 * 60 * 60, // 12 hours
  API_RESPONSE: 5 * 60, // 5 minutes
} as const

export class CacheManager {
  private redis: Redis

  constructor() {
    this.redis = redis
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.redis.on('connect', () => {
      log.info('redis_connected', {
        status: 'connected',
        timestamp: new Date().toISOString()      })
    })

    this.redis.on('error', (error) => {
      log.error('redis_error', {
        message: error.message,
        stack: error.stack
      })
    })

    this.redis.on('reconnecting', () => {
      log.info('redis_reconnecting', {
        status: 'reconnecting',
        timestamp: new Date().toISOString()
      })
    })
  }

  // Generic cache methods
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key)
      if (!data) return null
      
      return JSON.parse(data) as T    } catch (error) {
      log.error('cache_get_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        key,
        operation: 'get'
      })
      return null
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value)
      
      if (ttl) {
        await this.redis.setex(key, ttl, serialized)
      } else {
        await this.redis.set(key, serialized)
      }
      
      return true    } catch (error) {
      log.error('cache_set_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        key,
        ttl,
        operation: 'set'
      })
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.redis.del(key)
      return true    } catch (error) {
      log.error('cache_del_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        key,
        operation: 'del'
      })
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key)
      return result === 1    } catch (error) {
      log.error('cache_exists_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        key,
        operation: 'exists'
      })
      return false
    }
  }

  // Resume analysis caching
  async cacheResumeAnalysis(
    resumeId: number, 
    analysis: any
  ): Promise<boolean> {
    const key = `${CACHE_PREFIXES.RESUME_ANALYSIS}${resumeId}`
    return this.set(key, analysis, CACHE_TTL.RESUME_ANALYSIS)
  }

  async getResumeAnalysis(resumeId: number): Promise<any | null> {
    const key = `${CACHE_PREFIXES.RESUME_ANALYSIS}${resumeId}`
    return this.get(key)
  }

  // NLP results caching
  async cacheNLPAnalysis(
    contentHash: string, 
    nlpResults: any
  ): Promise<boolean> {
    const key = `${CACHE_PREFIXES.NLP_RESULTS}${contentHash}`
    return this.set(key, nlpResults, CACHE_TTL.NLP_RESULTS)
  }

  async getNLPAnalysis(contentHash: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.NLP_RESULTS}${contentHash}`
    return this.get(key)
  }

  // Keyword analytics caching
  async cacheKeywordAnalytics(
    industry: string, 
    analytics: any
  ): Promise<boolean> {
    const key = `${CACHE_PREFIXES.KEYWORD_ANALYTICS}${industry}`
    return this.set(key, analytics, CACHE_TTL.KEYWORD_ANALYTICS)
  }

  async getKeywordAnalytics(industry: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.KEYWORD_ANALYTICS}${industry}`
    return this.get(key)
  }

  // Industry data caching
  async cacheIndustryData(
    industry: string, 
    data: any
  ): Promise<boolean> {
    const key = `${CACHE_PREFIXES.INDUSTRY_DATA}${industry}`
    return this.set(key, data, CACHE_TTL.INDUSTRY_DATA)
  }

  async getIndustryData(industry: string): Promise<any | null> {
    const key = `${CACHE_PREFIXES.INDUSTRY_DATA}${industry}`
    return this.get(key)
  }

  // Rate limiting
  async incrementRateLimit(
    identifier: string, 
    window: number = 3600
  ): Promise<number> {
    try {
      const key = `${CACHE_PREFIXES.RATE_LIMIT}${identifier}`
      const multi = this.redis.multi()
      
      multi.incr(key)
      multi.expire(key, window)
      
      const results = await multi.exec()
      return results?.[0]?.[1] as number || 0    } catch (error) {
      log.error('rate_limit_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        identifier,
        window,
        operation: 'increment'
      })
      return 0
    }
  }

  async getRateLimit(identifier: string): Promise<number> {
    try {
      const key = `${CACHE_PREFIXES.RATE_LIMIT}${identifier}`
      const count = await this.redis.get(key)
      return count ? parseInt(count, 10) : 0    } catch (error) {
      log.error('rate_limit_get_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        identifier,
        operation: 'get'
      })
      return 0
    }
  }

  // API response caching
  async cacheAPIResponse(
    endpoint: string,
    params: string,
    response: any
  ): Promise<boolean> {
    const key = `${CACHE_PREFIXES.API_RESPONSE}${endpoint}:${params}`
    return this.set(key, response, CACHE_TTL.API_RESPONSE)
  }

  async getAPIResponse(
    endpoint: string,
    params: string
  ): Promise<any | null> {
    const key = `${CACHE_PREFIXES.API_RESPONSE}${endpoint}:${params}`
    return this.get(key)
  }

  // Bulk operations
  async getMultiple(keys: string[]): Promise<(any | null)[]> {
    try {
      const results = await this.redis.mget(...keys)
      return results.map(result => result ? JSON.parse(result) : null)    } catch (error) {
      log.error('cache_mget_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        keyCount: keys.length,
        operation: 'mget'
      })
      return keys.map(() => null)
    }
  }

  async setMultiple(data: Array<{ key: string; value: any; ttl?: number }>): Promise<boolean> {
    try {
      const multi = this.redis.multi()
      
      data.forEach(({ key, value, ttl }) => {
        const serialized = JSON.stringify(value)
        if (ttl) {
          multi.setex(key, ttl, serialized)
        } else {
          multi.set(key, serialized)
        }
      })
      
      await multi.exec()
      return true    } catch (error) {
      log.error('cache_mset_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        itemCount: data.length,
        operation: 'mset'
      })
      return false
    }
  }

  // Cache invalidation
  async invalidatePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length === 0) return 0
      
      await this.redis.del(...keys)
      
      log.info('cache_invalidation', {
        pattern,
        keysDeleted: keys.length
      })
      
      return keys.length    } catch (error) {
      log.error('cache_invalidation_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        pattern,
        operation: 'invalidate'
      })
      return 0
    }
  }

  // Cache statistics
  async getStats(): Promise<{
    memory: any
    keyspace: any
    performance: any
  }> {
    try {
      const info = await this.redis.info()
      const keyspace = await this.redis.info('keyspace')
      
      return {
        memory: this.parseInfoSection(info, 'memory'),
        keyspace: this.parseKeyspaceInfo(keyspace),
        performance: {
          connected: this.redis.status === 'ready',
          lastPing: Date.now()
        }
      }
    } catch (error) {
      log.error('cache_stats_error', error instanceof Error ? error.message : 'Unknown error')
      return {
        memory: {},
        keyspace: {},
        performance: { connected: false, lastPing: 0 }
      }
    }
  }

  private parseInfoSection(info: string, section: string): any {
    const lines = info.split('\r\n')
    const sectionStart = lines.findIndex(line => line === `# ${section.charAt(0).toUpperCase() + section.slice(1)}`)
    
    if (sectionStart === -1) return {}
    
    const result: any = {}
    for (let i = sectionStart + 1; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith('#') || line === '') break
      
      const [key, value] = line.split(':')
      if (key && value) {
        result[key] = isNaN(Number(value)) ? value : Number(value)
      }
    }
    
    return result
  }

  private parseKeyspaceInfo(keyspace: string): any {
    const result: any = {}
    const lines = keyspace.split('\r\n')
    
    lines.forEach(line => {
      if (line.startsWith('db')) {
        const [db, info] = line.split(':')
        const metrics = info.split(',').reduce((acc: any, metric) => {
          const [key, value] = metric.split('=')
          acc[key] = isNaN(Number(value)) ? value : Number(value)
          return acc
        }, {})
        result[db] = metrics
      }
    })
    
    return result
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const testKey = 'health:check'
      const testValue = Date.now().toString()
      
      await this.redis.setex(testKey, 10, testValue)
      const retrieved = await this.redis.get(testKey)
      await this.redis.del(testKey)
      
      return retrieved === testValue
    } catch (error) {
      log.error('cache_health_check_error', error instanceof Error ? error.message : 'Unknown error')
      return false
    }
  }

  // Graceful shutdown
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit()
      log.info('redis_disconnected', {
        status: 'disconnected',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      log.error('redis_disconnect_error', error instanceof Error ? error.message : 'Unknown error')
    }
  }
}

// Create and export singleton instance
export const cacheManager = new CacheManager()

// Helper function to generate content hash for caching
export function generateContentHash(content: string): string {
  const crypto = require('crypto')
  return crypto.createHash('md5').update(content).digest('hex')
}

// Cache middleware for API routes
export function withCache(
  keyGenerator: (req: Request) => string,
  ttl: number = CACHE_TTL.API_RESPONSE
) {  return function cacheMiddleware(handler: (...args: any[]) => Promise<any>) {
    return async function cachedHandler(req: Request, ...args: any[]) {
      const cacheKey = keyGenerator(req)
      
      // Try to get from cache first
      const cached = await cacheManager.get(cacheKey)
      if (cached) {
        log.info('cache_hit', { key: cacheKey })
        return new Response(JSON.stringify(cached), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      // Execute handler and cache result
      const response = await handler(req, ...args)
      
      if (response.ok) {
        const data = await response.json()
        await cacheManager.set(cacheKey, data, ttl)
        log.info('cache_miss_set', { key: cacheKey })
      }
      
      return response
    }
  }
}

import winston from 'winston'

// Create logger instance with different levels and transports
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'resume-ats',
    environment: process.env.NODE_ENV 
  },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ],
})

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }))
}

// Enhanced logging functions with structured data
export const log = {
  error: (message: string, meta?: any) => {
    logger.error(message, { 
      ...meta, 
      timestamp: new Date().toISOString(),
      userId: meta?.userId || 'anonymous'
    })
  },
  
  warn: (message: string, meta?: any) => {
    logger.warn(message, { 
      ...meta, 
      timestamp: new Date().toISOString() 
    })
  },
  
  info: (message: string, meta?: any) => {
    logger.info(message, { 
      ...meta, 
      timestamp: new Date().toISOString() 
    })
  },
  
  debug: (message: string, meta?: any) => {
    logger.debug(message, { 
      ...meta, 
      timestamp: new Date().toISOString() 
    })
  },

  // Specific logging functions for common scenarios
  userAction: (action: string, userId: string, meta?: any) => {
    logger.info(`User action: ${action}`, {
      userId,
      action,
      ...meta,
      timestamp: new Date().toISOString()
    })
  },

  apiRequest: (method: string, url: string, userId?: string, meta?: any) => {
    logger.info(`API Request: ${method} ${url}`, {
      method,
      url,
      userId: userId || 'anonymous',
      ...meta,
      timestamp: new Date().toISOString()
    })
  },

  databaseOperation: (operation: string, table: string, meta?: any) => {
    logger.debug(`Database operation: ${operation} on ${table}`, {
      operation,
      table,
      ...meta,
      timestamp: new Date().toISOString()
    })
  },

  performance: (operation: string, duration: number, meta?: any) => {
    logger.info(`Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      ...meta,
      timestamp: new Date().toISOString()
    })
  }
}

export default logger

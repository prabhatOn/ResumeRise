// Simple console logger for deployment
export const log = {
  error: (message: string, meta?: Record<string, unknown>) => {
    console.error(`[ERROR] ${message}`, meta || {})
  },
  
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn(`[WARN] ${message}`, meta || {})
  },
  
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(`[INFO] ${message}`, meta || {})
  },
  
  debug: (message: string, meta?: Record<string, unknown>) => {
    console.log(`[DEBUG] ${message}`, meta || {})
  },
}

export default { log }

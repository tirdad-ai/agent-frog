/**
 * Logger Service
 * 
 * Centralized logging for all services
 * Edge Runtime compatible - uses console with structured formatting
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success' | 'security' | 'audit'

interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, any>
  timestamp: string
  service: string
}

export class Logger {
  private service: string
  private logLevel: LogLevel

  constructor(service: string) {
    this.service = service
    // Determine log level from environment
    const envLogLevel = typeof process !== 'undefined' ? process.env.LOG_LEVEL : undefined
    this.logLevel = (envLogLevel as LogLevel) || 'info'
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'success', 'security', 'audit']
    const currentLevelIndex = levels.indexOf(this.logLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level) && level !== 'security' && level !== 'audit') {
      return
    }

    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      service: this.service,
    }

    // Check if we're in production
    const isProduction = typeof process !== 'undefined' && process.env.NODE_ENV === 'production'

    if (isProduction) {
      // Production: JSON structured logs
      console.log(JSON.stringify(entry))
    } else {
      // Development: Colored console output
      const prefix = `[${this.service}]`
      switch (level) {
        case 'debug':
          console.debug(prefix, message, context || '')
          break
        case 'info':
          console.info(prefix, message, context || '')
          break
        case 'warn':
          console.warn(prefix, '⚠️', message, context || '')
          break
        case 'error':
          console.error(prefix, '❌', message, context || '')
          break
        case 'success':
          console.log(prefix, '✅', message, context || '')
          break
        case 'security':
          console.log(prefix, '🔒 [SECURITY]', message, context || '')
          break
        case 'audit':
          console.log(prefix, '📋 [AUDIT]', message, context || '')
          break
      }
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error | any, context?: Record<string, any>): void {
    const errorContext = {
      ...context,
      error: error?.message || error?.toString(),
      stack: error?.stack,
    }
    this.log('error', message, errorContext)
  }

  success(message: string, context?: Record<string, any>): void {
    this.log('success', message, context)
  }

  /**
   * Log security events (auth, authorization, data access)
   * Always logged regardless of log level
   */
  security(event: string, context?: Record<string, any>): void {
    this.log('security', event, { ...context, security: true })
  }

  /**
   * Log audit events (user actions, data changes)
   * Always logged regardless of log level
   */
  audit(action: string, context?: Record<string, any>): void {
    this.log('audit', action, { ...context, audit: true })
  }

  /**
   * Log with custom level
   */
  logWithLevel(level: LogLevel, message: string, context?: Record<string, any>): void {
    this.log(level, message, context)
  }
}

# Logger Service

**Enhanced version from tirdad-turbo**  
**Edge Runtime Compatible**

---

## Features

✅ **Edge Runtime Compatible** - No Node.js dependencies  
✅ **Structured Logging** - JSON in production, colored console in development  
✅ **Log Levels** - debug, info, warn, error, success, security, audit  
✅ **Context-Aware** - Service name prefix on all logs  
✅ **Security & Audit** - Special log types always logged  
✅ **Configurable** - Respects `LOG_LEVEL` environment variable  
✅ **Emoji Support** - Visual indicators in development  

---

## Usage

### Basic Usage

```typescript
import { Logger } from '@repo/services'

const logger = new Logger('MyService')

logger.info('Operation started', { userId: '123' })
logger.success('Operation completed', { duration: '1.2s' })
logger.warn('Rate limit approaching', { usage: 85 })
logger.error('Operation failed', error, { userId: '123' })
logger.debug('Debug info', { data: { foo: 'bar' } })
```

### Security & Audit Logs

```typescript
// Security events - always logged regardless of log level
logger.security('User login successful', {
  userId: 'user_123',
  email: 'user@example.com',
  ipAddress: '192.168.1.1',
  role: 'TENANT_ADMIN'
})

// Audit events - always logged regardless of log level
logger.audit('Tenant status changed', {
  tenantId: 'tenant_abc',
  previousStatus: 'ACTIVE',
  newStatus: 'SUSPENDED',
  changedBy: 'admin_xyz'
})
```

---

## Log Levels

### Available Levels (in order of severity)

1. **debug** - Detailed debugging information
2. **info** - Informational messages
3. **warn** - Warning messages
4. **error** - Error messages
5. **success** - Success messages (custom)
6. **security** - Security events (always logged)
7. **audit** - Audit events (always logged)

### Log Level Configuration

Set via environment variable:

```bash
# Show all logs (development default)
LOG_LEVEL=debug

# Show info and above (production default)
LOG_LEVEL=info

# Show only warnings and errors
LOG_LEVEL=warn

# Show only errors
LOG_LEVEL=error
```

---

## Output Format

### Development Mode
Colored console output with emojis:

```
[AuthService] ✅ User signup completed { userId: 'user_123', tenantId: 'tenant_abc' }
[AuthService] 🔒 [SECURITY] User login successful { email: 'user@example.com' }
[AuthService] ⚠️ Login failed: Invalid password { userId: 'user_123' }
[AuthService] ❌ Database connection failed { error: 'Connection timeout' }
```

### Production Mode
Structured JSON logs:

```json
{
  "level": "security",
  "message": "User login successful",
  "context": {
    "userId": "user_123",
    "email": "user@example.com",
    "ipAddress": "192.168.1.1",
    "security": true
  },
  "timestamp": "2025-11-02T22:45:00.000Z",
  "service": "AuthService"
}
```

---

## API Reference

### Constructor

```typescript
new Logger(service: string)
```

**Parameters:**
- `service` - Service name (used as prefix in logs)

### Methods

#### `debug(message: string, context?: Record<string, any>): void`
Log debug information.

#### `info(message: string, context?: Record<string, any>): void`
Log informational messages.

#### `warn(message: string, context?: Record<string, any>): void`
Log warning messages.

#### `error(message: string, error?: Error | any, context?: Record<string, any>): void`
Log error messages with automatic error object handling.

**Note:** Error stack traces are automatically captured.

#### `success(message: string, context?: Record<string, any>): void`
Log success messages (custom level).

#### `security(event: string, context?: Record<string, any>): void`
Log security events. **Always logged regardless of log level.**

#### `audit(action: string, context?: Record<string, any>): void`
Log audit events. **Always logged regardless of log level.**

#### `logWithLevel(level: LogLevel, message: string, context?: Record<string, any>): void`
Log with a custom level.

---

## Best Practices

### 1. Use Appropriate Log Levels

```typescript
// ✅ Good
logger.debug('Validating input', { email: user.email })
logger.info('User created', { userId: user.id })
logger.warn('Rate limit approaching', { usage: 85 })
logger.error('Database query failed', error, { query: 'SELECT...' })

// ❌ Avoid
logger.info('Debug info here...') // Use debug instead
logger.error('User not found') // Use warn instead (not an error condition)
```

### 2. Include Relevant Context

```typescript
// ✅ Good - actionable context
logger.error('Payment failed', error, {
  userId: user.id,
  amount: payment.amount,
  paymentMethod: 'stripe',
  transactionId: tx.id
})

// ❌ Avoid - missing context
logger.error('Payment failed', error)
```

### 3. Use Security/Audit for Compliance

```typescript
// Always use security() for authentication/authorization
logger.security('User login successful', {
  userId: user.id,
  email: user.email,
  ipAddress: req.ip,
  role: user.role
})

// Always use audit() for data changes
logger.audit('Tenant status changed', {
  tenantId: tenant.id,
  previousStatus: 'ACTIVE',
  newStatus: 'SUSPENDED',
  changedBy: admin.id,
  reason: 'Policy violation'
})
```

### 4. Don't Log Sensitive Data

```typescript
// ❌ Never log passwords, tokens, or PII
logger.info('User data', { password: user.password }) // BAD!
logger.info('API call', { token: apiKey }) // BAD!

// ✅ Log safely
logger.info('User authenticated', { userId: user.id })
logger.info('API call authorized', { endpoint: '/api/users' })
```

### 5. Service Naming Convention

```typescript
// ✅ Good - PascalCase service names
new Logger('AuthService')
new Logger('TenantService')
new Logger('PaymentProcessor')

// ❌ Avoid - inconsistent naming
new Logger('auth-service')
new Logger('tenants')
```

---

## Examples

### AuthService Logging

```typescript
import { Logger } from '../infrastructure/logger'

export class AuthService {
  private logger = new Logger('AuthService')

  async signup(input: SignupInput, metadata: MetaData) {
    this.logger.info('Signup attempt', { 
      email: input.email,
      ipAddress: metadata.ipAddress 
    })

    try {
      const result = await this.createAccount(input)
      
      this.logger.security('User signup completed', {
        userId: result.user.id,
        tenantId: result.tenant.id,
        email: result.user.email,
        ipAddress: metadata.ipAddress
      })

      return result
    } catch (error) {
      this.logger.error('Signup failed', error, {
        email: input.email,
        ipAddress: metadata.ipAddress
      })
      throw error
    }
  }
}
```

### TenantService Logging

```typescript
export class TenantService {
  private logger = new Logger('TenantService')

  async updateTenantStatus(tenantId: string, status: string, adminId: string) {
    const currentStatus = await this.getCurrentStatus(tenantId)
    
    this.logger.info('Updating tenant status', { 
      tenantId, 
      from: currentStatus,
      to: status 
    })

    await this.update(tenantId, { status })

    this.logger.audit('Tenant status changed', {
      tenantId,
      previousStatus: currentStatus,
      newStatus: status,
      changedBy: adminId
    })

    this.logger.success('Tenant status updated', { tenantId, status })
  }
}
```

---

## Edge Runtime Compatibility

The logger is fully compatible with Next.js Edge Runtime:

```typescript
// Works in middleware
export async function middleware(request: NextRequest) {
  const logger = new Logger('Middleware')
  logger.info('Request received', { path: request.nextUrl.pathname })
}

// Works in edge API routes
export const runtime = 'edge'

export async function GET(request: Request) {
  const logger = new Logger('EdgeAPI')
  logger.info('API called')
}
```

---

## Migration from Winston

If you're migrating from Winston:

```typescript
// Before (Winston)
import winston from 'winston'
const logger = winston.createLogger({ ... })
logger.info('message', { meta: 'data' })

// After (Our Logger)
import { Logger } from '@repo/services'
const logger = new Logger('ServiceName')
logger.info('message', { meta: 'data' })
```

**Key differences:**
- ✅ No configuration needed
- ✅ Works in Edge Runtime
- ✅ Simpler API
- ✅ Built-in security/audit levels
- ❌ No file transports (use external log aggregator)
- ❌ No custom formatters (standardized format)

---

## Environment Variables

```bash
# Log level (default: info)
LOG_LEVEL=debug|info|warn|error

# Node environment (affects output format)
NODE_ENV=development|production
```

---

**Last Updated:** November 2, 2025  
**Version:** 2.0 (Enhanced from tirdad-turbo)

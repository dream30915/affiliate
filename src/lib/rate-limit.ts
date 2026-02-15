/**
 * NOTE: This in-memory rate limiter works for single-instance deployments.
 * For serverless/multi-instance production (Vercel, AWS Lambda), replace
 * with Redis-backed rate limiting (e.g. @upstash/ratelimit).
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Auto-cleanup expired entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup() {
    const now = Date.now()
    if (now - lastCleanup < CLEANUP_INTERVAL) return
    lastCleanup = now
    for (const [key, entry] of rateLimitMap) {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key)
        }
    }
}

/**
 * Simple in-memory rate limiter.
 * Returns true if the request is allowed, false if rate limited.
 */
export function rateLimit(
    key: string,
    { maxRequests = 10, windowMs = 60_000 }: { maxRequests?: number; windowMs?: number } = {}
): boolean {
    cleanup()

    const now = Date.now()
    const entry = rateLimitMap.get(key)

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
        return true
    }

    if (entry.count >= maxRequests) {
        return false
    }

    entry.count++
    return true
}

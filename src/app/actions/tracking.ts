"use server"

import { prisma } from "@/lib/prisma"
import { cookies, headers } from "next/headers"
import { rateLimit } from "@/lib/rate-limit"

export async function trackClick(code: string) {
    if (!code) return

    try {
        // Rate limit by IP: max 30 clicks per minute
        const headerStore = await headers()
        const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
        if (!rateLimit(`trackClick:${ip}`, { maxRequests: 30, windowMs: 60_000 })) {
            return
        }

        const affiliateLink = await prisma.affiliateLink.findUnique({
            where: { code },
        })

        if (affiliateLink) {
            // Record click
            await prisma.click.create({
                data: {
                    affiliateLinkId: affiliateLink.id,
                    ipAddress: ip,
                },
            })

            // Increment visits counter
            await prisma.affiliateLink.update({
                where: { id: affiliateLink.id },
                data: { visits: { increment: 1 } },
            })

            const cookieStore = await cookies()
            cookieStore.set("affiliate_ref", code, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            })
        }
    } catch {
        // Silently fail - click tracking should not break user experience
    }
}

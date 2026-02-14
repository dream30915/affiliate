"use server"

import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function trackClick(code: string) {
    if (!code) return

    try {
        const affiliateLink = await prisma.affiliateLink.findUnique({
            where: { code },
        })

        if (affiliateLink) {
            // Record click
            await prisma.click.create({
                data: {
                    affiliateLinkId: affiliateLink.id,
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
                path: "/"
            })
        }
    } catch (error) {
        console.error("Failed to track click", error)
    }
}

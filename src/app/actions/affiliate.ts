"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getAffiliateLink(productId: string) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
        throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) throw new Error("User not found")

    // Check if link exists
    const existingLink = await prisma.affiliateLink.findFirst({
        where: {
            userId: user.id,
            productId: productId,
        },
    })

    if (existingLink) {
        return existingLink.code
    }

    // Create new link
    const code = `aff_${user.id.substring(0, 8)}_${productId.substring(0, 8)}`

    const newLink = await prisma.affiliateLink.create({
        data: {
            userId: user.id,
            productId: productId,
            code: code,
        },
    })

    return newLink.code
}

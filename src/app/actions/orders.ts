"use server"

import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createOrderSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive().default(1),
})

/**
 * Create an order with affiliate attribution.
 *
 * Flow:
 * 1. Validate input
 * 2. Read `affiliate_ref` cookie (set by ClickTracker when user arrived via ?ref=CODE)
 * 3. Look up the affiliate link by code
 * 4. Calculate commission = total * (product.commission / 100)
 * 5. Create Order + OrderItem in a single transaction
 * 6. Clear the affiliate_ref cookie after successful attribution
 * 7. Revalidate dashboard pages so stats update
 */
export async function createOrder(productId: string, quantity: number = 1) {
    // Validate input
    const parsed = createOrderSchema.safeParse({ productId, quantity })
    if (!parsed.success) {
        throw new Error("Invalid order data: " + parsed.error.issues.map(i => i.message).join(", "))
    }

    const session = await getServerSession(authOptions)

    // Read the affiliate_ref cookie
    const cookieStore = await cookies()
    const affiliateRef = cookieStore.get("affiliate_ref")?.value

    // Fetch product
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
        throw new Error("Product not found")
    }

    const total = product.price * quantity
    let affiliateLinkId: string | null = null
    let commission = 0

    // Resolve affiliate attribution from cookie
    if (affiliateRef) {
        const affiliateLink = await prisma.affiliateLink.findUnique({
            where: { code: affiliateRef },
            include: { product: true },
        })

        if (affiliateLink) {
            // Attribute the order to this affiliate link.
            // The cookie stores the code of the LAST affiliate link clicked,
            // so we attribute the full order to that affiliate regardless of
            // whether the product in the link matches the product being purchased.
            // Commission is calculated using the PURCHASED product's rate.
            affiliateLinkId = affiliateLink.id
            commission = total * (product.commission / 100)
        }
    }

    // Create order + items in a transaction
    const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                userId: session?.user?.id || null,
                affiliateLinkId,
                total,
                commission,
                status: "COMPLETED",
                items: {
                    create: {
                        productId,
                        quantity,
                        price: product.price,
                    },
                },
            },
            include: {
                items: { include: { product: true } },
                affiliateLink: { include: { user: true } },
            },
        })

        return newOrder
    })

    // Clear the affiliate cookie after successful attribution
    if (affiliateLinkId) {
        cookieStore.delete("affiliate_ref")
    }

    // Revalidate dashboard pages so the new order shows up in stats
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/earnings")
    revalidatePath("/admin")
    revalidatePath("/admin/users")

    return {
        id: order.id,
        total: order.total,
        commission: order.commission,
        status: order.status,
        affiliateAttributed: !!affiliateLinkId,
        items: order.items.map(item => ({
            product: item.product.name,
            quantity: item.quantity,
            price: item.price,
        })),
    }
}

/**
 * Create a multi-product order (cart checkout).
 * Each item can come from a different product, but the affiliate attribution
 * applies to the entire order.
 */
export async function createCartOrder(
    items: { productId: string; quantity: number }[]
) {
    if (items.length === 0) {
        throw new Error("Cart is empty")
    }

    const session = await getServerSession(authOptions)
    const cookieStore = await cookies()
    const affiliateRef = cookieStore.get("affiliate_ref")?.value

    // Fetch all products in one query
    const productIds = items.map(i => i.productId)
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
    })

    const productMap = new Map(products.map(p => [p.id, p]))

    // Validate all products exist
    for (const item of items) {
        if (!productMap.has(item.productId)) {
            throw new Error(`Product not found: ${item.productId}`)
        }
    }

    // Calculate totals
    let total = 0
    let commission = 0
    const orderItems = items.map(item => {
        const product = productMap.get(item.productId)!
        const itemTotal = product.price * item.quantity
        total += itemTotal
        return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
        }
    })

    // Resolve affiliate
    let affiliateLinkId: string | null = null
    if (affiliateRef) {
        const affiliateLink = await prisma.affiliateLink.findUnique({
            where: { code: affiliateRef },
        })
        if (affiliateLink) {
            affiliateLinkId = affiliateLink.id
            // Commission on the entire cart total, using average commission rate
            const avgCommission = products.reduce((s, p) => s + p.commission, 0) / products.length
            commission = total * (avgCommission / 100)
        }
    }

    const order = await prisma.$transaction(async (tx) => {
        return tx.order.create({
            data: {
                userId: session?.user?.id || null,
                affiliateLinkId,
                total,
                commission,
                status: "COMPLETED",
                items: { create: orderItems },
            },
            include: {
                items: { include: { product: true } },
            },
        })
    })

    if (affiliateLinkId) {
        cookieStore.delete("affiliate_ref")
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/earnings")
    revalidatePath("/admin")

    return {
        id: order.id,
        total: order.total,
        commission: order.commission,
        itemCount: order.items.length,
        affiliateAttributed: !!affiliateLinkId,
    }
}

/**
 * Get orders attributed to the current user's affiliate links.
 * Used by the earnings page.
 */
export async function getMyAffiliateOrders() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    return prisma.order.findMany({
        where: {
            affiliateLink: { userId: session.user.id },
            status: "COMPLETED",
        },
        include: {
            items: { include: { product: true } },
            affiliateLink: true,
        },
        orderBy: { createdAt: "desc" },
    })
}

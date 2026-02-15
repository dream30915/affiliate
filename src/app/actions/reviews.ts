"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { rateLimit } from "@/lib/rate-limit"
import { z } from "zod"

const reviewSchema = z.object({
    name: z.string().min(2).max(100),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(5).max(2000),
    productId: z.string().min(1),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createReview(prevState: any, formData: FormData) {
    // Rate limit: max 5 reviews per minute per IP
    const headerStore = await headers()
    const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`createReview:${ip}`, { maxRequests: 5, windowMs: 60_000 })) {
        return { message: "Too many requests. Please try again later." }
    }

    const validatedFields = reviewSchema.safeParse({
        name: formData.get("name"),
        rating: formData.get("rating"),
        comment: formData.get("comment"),
        productId: formData.get("productId"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Post Review.",
        }
    }

    const { name, rating, comment, productId } = validatedFields.data

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
        return { message: "Product not found." }
    }

    try {
        await prisma.review.create({
            data: {
                name,
                rating,
                comment,
                productId,
            },
        })
    } catch (error) {
        return { message: "Database Error: Failed to Post Review." }
    }

    revalidatePath(`/products/${productId}`)
    return { success: true, message: "Review posted successfully!" }
}

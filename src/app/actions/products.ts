"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { z } from "zod"

const productSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    price: z.coerce.number().min(0.01),
    discount: z.coerce.number().min(0).max(100).default(0),
    image: z.string().url().optional().or(z.literal("")),
    commission: z.coerce.number().min(0).max(100),
    featured: z.preprocess((val) => val === "on" || val === "true", z.boolean()),
    categoryId: z.string().optional().or(z.literal("")),
    affiliateUrl: z.string().url().optional().or(z.literal("")),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createProduct(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return { message: "Unauthorized: Admin access required." }
    }
    const validatedFields = productSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        discount: formData.get("discount"),
        image: formData.get("image"),
        commission: formData.get("commission"),
        featured: formData.get("featured"),
        categoryId: formData.get("categoryId"),
        affiliateUrl: formData.get("affiliateUrl"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Product.",
        }
    }

    const { name, description, price, discount, image, commission, featured, categoryId, affiliateUrl } = validatedFields.data

    try {
        await prisma.product.create({
            data: {
                name,
                description,
                price,
                discount,
                image: image || "",
                commission,
                featured,
                categoryId: categoryId || null,
                affiliateUrl: affiliateUrl || null,
            },
        })
    } catch {
        return { message: "Database Error: Failed to Create Product." }
    }

    revalidatePath("/admin/products")
    revalidatePath("/")
    redirect("/admin/products")
}

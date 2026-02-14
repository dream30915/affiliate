"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const productSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    price: z.coerce.number().min(0.01),
    image: z.string().url().optional().or(z.literal("")),
    commission: z.coerce.number().min(0).max(100),
})

export async function createProduct(prevState: any, formData: FormData) {
    const validatedFields = productSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        image: formData.get("image"),
        commission: formData.get("commission"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Product.",
        }
    }

    const { name, description, price, image, commission } = validatedFields.data

    try {
        await prisma.product.create({
            data: {
                name,
                description,
                price,
                image: image || "",
                commission,
            },
        })
    } catch (error) {
        console.error(error)
        return { message: "Database Error: Failed to Create Product." }
    }

    revalidatePath("/admin/products")
    revalidatePath("/")
    redirect("/admin/products")
}

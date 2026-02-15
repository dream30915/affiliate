import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { z } from "zod"

const registerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(255),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(128)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, password } = registerSchema.parse(body)

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER", // Default role
            },
        })

        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(
            { message: "User created successfully", user: userWithoutPassword },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid input data", errors: error.issues },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"

const schema = z.object({
    email: z.string().email(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email } = schema.parse(body)

        const user = await prisma.user.findUnique({ where: { email } })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
        }

        // Delete any existing tokens for this email
        await prisma.passwordResetToken.deleteMany({ where: { email } })

        // Generate a secure token
        const token = crypto.randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        await prisma.passwordResetToken.create({
            data: { email, token, expires },
        })

        // TODO: Send email with reset link
        // For now, log the token in development
        if (process.env.NODE_ENV === "development") {
            console.log(`[DEV] Password reset link: ${process.env.NEXTAUTH_URL}/reset-password?token=${token}`)
        }

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid email address" }, { status: 400 })
        }
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }
}

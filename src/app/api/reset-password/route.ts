import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { z } from "zod"

const schema = z.object({
    token: z.string().min(1),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { token, password } = schema.parse(body)

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        })

        if (!resetToken || resetToken.expires < new Date()) {
            return NextResponse.json(
                { message: "Invalid or expired reset token" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword },
        })

        // Delete the used token
        await prisma.passwordResetToken.delete({ where: { token } })

        return NextResponse.json({ message: "Password has been reset successfully" })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid input", errors: error.issues },
                { status: 400 }
            )
        }
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }
}

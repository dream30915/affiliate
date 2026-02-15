import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const productCount = await prisma.product.count()
        const categoryCount = await prisma.category.count()
        const userCount = await prisma.user.count()

        return NextResponse.json({
            status: "ok",
            database: "connected",
            counts: { products: productCount, categories: categoryCount, users: userCount },
            env: {
                hasPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
                hasNonPooling: !!process.env.POSTGRES_URL_NON_POOLING,
                hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
                nodeEnv: process.env.NODE_ENV,
            }
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return NextResponse.json({
            status: "error",
            message,
            env: {
                hasPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
                hasNonPooling: !!process.env.POSTGRES_URL_NON_POOLING,
            }
        }, { status: 500 })
    }
}

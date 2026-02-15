import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { NewProductForm } from "./NewProductForm"

export default async function NewProductPage() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    })

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-800">Add New Product</h2>
                <p className="text-slate-500 mt-1">Create a new product listing in your affiliate store.</p>
            </div>
            <NewProductForm categories={categories} />
        </div>
    )
}

import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/ProductCard"

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="container px-6 mx-auto py-12 md:py-20">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Products</h1>
                <p className="text-slate-500 mt-1">
                    Browse our collection of high-commission affiliate products.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                    No products available yet. Check back soon!
                </div>
            )}
        </div>
    )
}

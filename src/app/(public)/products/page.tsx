import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/ProductCard"

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="container py-12 md:py-24">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
                    <p className="text-muted-foreground">
                        Browse our collection of high-commission products.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

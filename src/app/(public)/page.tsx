import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"

export default async function Home() {
    const products = await prisma.product.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary/10 to-background">
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                Start Your Affiliate Journey Today
                            </h1>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                Discover premium products, share with your audience, and earn industry-leading commissions.
                            </p>
                        </div>
                        <div className="space-x-4">
                            <Link href="/register">
                                <Button size="lg" className="px-8">
                                    Join Now
                                </Button>
                            </Link>
                            <Link href="/products">
                                <Button variant="outline" size="lg">
                                    Browse Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-12 md:py-24 lg:py-32 bg-background">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                                Featured Products
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                High Converting Items
                            </h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Hand-picked products with the highest earning potential for our affiliates.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import { PromoteButton } from "@/components/PromoteButton"

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await prisma.product.findUnique({
        where: { id: params.id },
    })

    if (!product) {
        notFound()
    }

    return (
        <div className="container py-12 md:py-24">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="overflow-hidden rounded-xl bg-muted aspect-square">
                    <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <Badge className="mb-2" variant="secondary">
                            {product.commission}% Commission
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {product.name}
                        </h1>
                        <div className="mt-4 text-2xl font-bold">
                            ${product.price.toFixed(2)}
                        </div>
                    </div>

                    <div className="prose text-muted-foreground">
                        <p>{product.description}</p>
                    </div>

                    <div className="flex flex-col gap-4 mt-auto">
                        <div className="rounded-lg border p-4 bg-muted/50">
                            <h3 className="font-semibold mb-2">Affiliate Stats</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">Est. Earnings</span>
                                    <span className="font-medium text-emerald-600">
                                        ${(product.price * (product.commission / 100)).toFixed(2)} / sale
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Conversion Rate</span>
                                    <span className="font-medium">2.5% (Avg)</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <PromoteButton productId={product.id} productName={product.name} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

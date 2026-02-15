import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PromoteButton } from "@/components/PromoteButton"
import { Badge } from "@/components/ui/badge"

export default async function AffiliateProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
                <p className="text-muted-foreground">Browse products to promote and earn commissions.</p>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead>Est. Earn</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="h-12 w-12 rounded bg-muted overflow-hidden relative">
                                        <Image
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.name}
                                            fill
                                            sizes="48px"
                                            className="object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div>{product.name}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                                </TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                                        {product.commission}%
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium text-emerald-600">
                                    ${(product.price * (product.commission / 100)).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <PromoteButton productId={product.id} productName={product.name} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

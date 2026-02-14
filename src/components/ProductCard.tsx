import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
    id: string
    name: string
    description: string
    price: number
    image: string
    commission: number
}

export function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="flex flex-col overflow-hidden group h-full">
            <CardHeader className="p-0">
                <div className="aspect-square relative overflow-hidden bg-muted">
                    <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-6">
                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                        {product.commission}% Com.
                    </Badge>
                </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
                <Link href={`/products/${product.id}`} className="w-full">
                    <Button className="w-full">Promote</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

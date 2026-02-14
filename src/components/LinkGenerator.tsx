"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link as LinkIcon, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getAffiliateLink } from "@/app/actions/affiliate"
import { toast } from "sonner"

interface Product {
    id: string
    name: string
    price: number
    commission: number
}

export function LinkGenerator({ products }: { products: Product[] }) {
    const [selectedProductId, setSelectedProductId] = useState("")
    const [generatedLink, setGeneratedLink] = useState("")
    const [loading, setLoading] = useState(false)

    const handleGenerate = async () => {
        if (!selectedProductId) {
            toast.error("Please select a product")
            return
        }

        setLoading(true)
        try {
            const code = await getAffiliateLink(selectedProductId)
            const origin = window.location.origin
            const link = `${origin}/products/${selectedProductId}?ref=${code}`
            setGeneratedLink(link)
            toast.success("Affiliate link generated!")
        } catch (error) {
            toast.error("Failed to generate link. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Generate New Link</CardTitle>
                <CardDescription>
                    Select a product to create your unique affiliate link.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                        <option value="">Select a product...</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name} - ${product.price.toFixed(2)} ({product.commission}% commission)
                            </option>
                        ))}
                    </select>
                    <Button onClick={handleGenerate} disabled={loading}>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        {loading ? "Generating..." : "Generate"}
                    </Button>
                </div>

                {generatedLink && (
                    <div className="p-4 bg-muted rounded-lg space-y-2 animate-in fade-in-0 slide-in-from-top-2">
                        <p className="text-sm font-medium">Your Affiliate Link</p>
                        <div className="flex gap-2">
                            <Input readOnly value={generatedLink} className="bg-background font-mono text-sm" />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    navigator.clipboard.writeText(generatedLink)
                                    toast.success("Copied to clipboard!")
                                }}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

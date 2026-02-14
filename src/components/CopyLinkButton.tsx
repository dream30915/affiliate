"use client"

import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

export function CopyLinkButton({ productId, code }: { productId: string; code: string }) {
    const handleCopy = () => {
        const link = `${window.location.origin}/products/${productId}?ref=${code}`
        navigator.clipboard.writeText(link)
        toast.success("Link copied to clipboard!")
    }

    return (
        <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="mr-2 h-3 w-3" />
            Copy
        </Button>
    )
}

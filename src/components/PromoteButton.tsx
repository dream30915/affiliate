"use client"

import { Button } from "@/components/ui/button"
import { getAffiliateLink } from "@/app/actions/affiliate"
import { toast } from "sonner"
import { Link as LinkIcon, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

export function PromoteButton({ productId, productName }: { productId: string, productName: string }) {
    const [code, setCode] = useState("")
    const [link, setLink] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleGetLink = async () => {
        try {
            const affiliateCode = await getAffiliateLink(productId)
            setCode(affiliateCode)
            // Construct full URL (assuming localhost for dev, should use env var)
            const origin = window.location.origin
            const fullLink = `${origin}/products/${productId}?ref=${affiliateCode}`
            setLink(fullLink)
            setIsOpen(true)
        } catch (error) {
            toast.error("Failed to generate link. Please try again.")
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link)
        toast.success("Link copied to clipboard!")
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleGetLink} variant="secondary" size="sm">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Promote
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Promote {productName}</DialogTitle>
                    <DialogDescription>
                        Share this link to earn commission on every sale.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Input
                            id="link"
                            defaultValue={link}
                            readOnly
                        />
                    </div>
                    <Button size="sm" className="px-3" onClick={copyToClipboard}>
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

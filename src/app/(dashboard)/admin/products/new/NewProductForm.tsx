"use client"

import { useFormState } from "react-dom"
import { createProduct } from "@/app/actions/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Star, Link as LinkIcon, Image as ImageIcon, Tag } from "lucide-react"

const initialState = {
    message: "",
    errors: undefined,
}

interface Category {
    id: string
    name: string
}

export function NewProductForm({ categories }: { categories: Category[] }) {
    const [state, formAction] = useFormState(createProduct, initialState)

    return (
        <form action={formAction} className="space-y-8 pb-20">
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass p-8 rounded-[2rem] space-y-6 shadow-sm ring-1 ring-slate-200">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-700 font-bold ml-1">Product Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                className="h-12 rounded-xl focus-visible:ring-primary border-slate-200"
                                placeholder="e.g. Premium Wireless Headphones"
                            />
                            {state?.errors?.name && (
                                <p className="text-xs font-bold text-red-500 mt-1 ml-1">{state.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-slate-700 font-bold ml-1">Detailed Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                className="min-h-[150px] rounded-xl focus-visible:ring-primary border-slate-200"
                                placeholder="Explain why this product is great..."
                            />
                            {state?.errors?.description && (
                                <p className="text-xs font-bold text-red-500 mt-1 ml-1">{state.errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-slate-700 font-bold ml-1">Price ($)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    className="h-12 rounded-xl focus-visible:ring-primary border-slate-200"
                                    placeholder="299.99"
                                />
                                {state?.errors?.price && (
                                    <p className="text-xs font-bold text-red-500 mt-1 ml-1">{state.errors.price}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="commission" className="text-slate-700 font-bold ml-1">Commission (%)</Label>
                                <Input
                                    id="commission"
                                    name="commission"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    required
                                    className="h-12 rounded-xl focus-visible:ring-primary border-slate-200"
                                    placeholder="15"
                                />
                                {state?.errors?.commission && (
                                    <p className="text-xs font-bold text-red-500 mt-1 ml-1">{state.errors.commission}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[2rem] space-y-6 shadow-sm ring-1 ring-slate-200">
                        <div className="space-y-2">
                            <Label htmlFor="affiliateUrl" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-blue-500" />
                                External Affiliate Link
                            </Label>
                            <Input
                                id="affiliateUrl"
                                name="affiliateUrl"
                                className="h-12 rounded-xl focus-visible:ring-primary border-slate-200"
                                placeholder="https://amazon.com/product..."
                            />
                            {state?.errors?.affiliateUrl && (
                                <p className="text-xs font-bold text-red-500 mt-1 ml-1">{state.errors.affiliateUrl}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Organization & Media */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-[2rem] space-y-6 shadow-sm ring-1 ring-slate-200">
                        <div className="space-y-2">
                            <Label htmlFor="categoryId" className="text-slate-700 font-bold ml-1">Category</Label>
                            <Select name="categoryId">
                                <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="discount" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-red-500" />
                                Discount (%)
                            </Label>
                            <Input
                                id="discount"
                                name="discount"
                                type="number"
                                step="1"
                                min="0"
                                max="100"
                                defaultValue="0"
                                className="h-12 rounded-xl focus-visible:ring-primary border-slate-200"
                            />
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Checkbox id="featured" name="featured" className="rounded-md h-5 w-5" />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="featured"
                                    className="text-sm font-bold text-slate-700 leading-none cursor-pointer flex items-center gap-2"
                                >
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    Feature this product
                                </label>
                                <p className="text-[11px] text-slate-400">
                                    Display on home page and top sections.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[2rem] space-y-6 shadow-sm ring-1 ring-slate-200">
                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-primary" />
                                Product Image URL
                            </Label>
                            <Input
                                id="image"
                                name="image"
                                className="h-12 rounded-xl focus-visible:ring-primary border-slate-200"
                                placeholder="https://unsplash.com/..."
                            />
                            {state?.errors?.image && (
                                <p className="text-xs font-bold text-red-500 mt-1 ml-1">{state.errors.image}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button type="submit" className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all text-lg font-bold">
                            Create Product
                        </Button>
                        <Button type="button" variant="outline" className="w-full h-12 rounded-2xl border-slate-200 text-slate-500 font-bold">
                            Save as Draft
                        </Button>
                    </div>

                    {state?.message && (
                        <p className="text-sm font-bold text-red-500 text-center bg-red-50 p-3 rounded-xl">{state.message}</p>
                    )}
                </div>
            </div>
        </form>
    )
}

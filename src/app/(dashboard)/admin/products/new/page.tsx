"use client"

import { useFormState } from "react-dom"
import { createProduct } from "@/app/actions/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const initialState = {
    message: "",
    errors: undefined,
}

export default function NewProductForm() {
    // @ts-ignore
    const [state, formAction] = useFormState(createProduct, initialState)

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" name="name" required placeholder="e.g. Wireless Headphones" />
                        {state?.errors?.name && (
                            <p className="text-sm text-destructive">{state.errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            placeholder="Describe the product..."
                        />
                        {state?.errors?.description && (
                            <p className="text-sm text-destructive">{state.errors.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                placeholder="29.99"
                            />
                            {state?.errors?.price && (
                                <p className="text-sm text-destructive">{state.errors.price}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="commission">Commission (%)</Label>
                            <Input
                                id="commission"
                                name="commission"
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                required
                                placeholder="10"
                            />
                            {state?.errors?.commission && (
                                <p className="text-sm text-destructive">{state.errors.commission}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input id="image" name="image" placeholder="https://example.com/image.jpg" />
                        {state?.errors?.image && (
                            <p className="text-sm text-destructive">{state.errors.image}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                        <Button type="submit">Create Product</Button>
                    </div>

                    {state?.message && (
                        <p className="text-sm text-destructive text-center">{state.message}</p>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}

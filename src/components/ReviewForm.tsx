"use client"

import { useFormState } from "react-dom"
import { createReview } from "@/app/actions/reviews"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useState } from "react"

const initialState = {
    message: "",
    errors: undefined,
    success: false,
}

export function ReviewForm({ productId }: { productId: string }) {
    const [state, formAction] = useFormState(createReview, initialState)
    const [rating, setRating] = useState(5)

    return (
        <div className="glass p-8 rounded-[2rem] border-slate-100 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Write a Review</h3>

            <form action={formAction} className="space-y-6">
                <input type="hidden" name="productId" value={productId} />
                <input type="hidden" name="rating" value={rating} />

                <div className="space-y-2">
                    <Label className="text-slate-700 font-bold ml-1">Your Name</Label>
                    <Input
                        name="name"
                        required
                        className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary"
                        placeholder="John Doe"
                    />
                    {state?.errors?.name && (
                        <p className="text-xs font-bold text-red-500 mt-1 ml-1">{state.errors.name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-700 font-bold ml-1">Rating</Label>
                    <div className="flex items-center gap-1 ml-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform active:scale-90"
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-700 font-bold ml-1">Your Comment</Label>
                    <Textarea
                        name="comment"
                        required
                        className="min-h-[120px] rounded-xl border-slate-200 focus-visible:ring-primary"
                        placeholder="Share your experience with this product..."
                    />
                    {state?.errors?.comment && (
                        <p className="text-xs font-bold text-red-500 mt-1 ml-1">{state.errors.comment}</p>
                    )}
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl bg-slate-900 shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all font-bold text-lg">
                    Post Review
                </Button>

                {state?.message && (
                    <p className={`text-sm font-bold text-center p-3 rounded-xl ${state.success ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {state.message}
                    </p>
                )}
            </form>
        </div>
    )
}

import { Star, User } from "lucide-react"

interface Review {
    id: string
    name: string
    rating: number
    comment: string
    createdAt: Date
}

export function ReviewsList({ reviews }: { reviews: Review[] }) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 glass rounded-[2rem] border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No reviews yet. Be the first to share your thoughts!</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="glass p-6 rounded-[2rem] border-slate-50 shadow-sm ring-1 ring-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{review.name}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                        &ldquo;{review.comment}&rdquo;
                    </p>
                </div>
            ))}
        </div>
    )
}

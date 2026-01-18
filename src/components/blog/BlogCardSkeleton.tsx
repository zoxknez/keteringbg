'use client'

export default function BlogCardSkeleton() {
    return (
        <div className="group relative glass-card rounded-2xl overflow-hidden border border-white/10">
            {/* Cover Image Skeleton */}
            <div className="relative h-56 overflow-hidden bg-white/5 animate-shimmer" />

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
                {/* Category Badge Skeleton */}
                <div className="w-24 h-6 bg-white/5 rounded-full animate-shimmer" />

                {/* Title Skeleton */}
                <div className="space-y-2">
                    <div className="h-6 bg-white/5 rounded animate-shimmer w-3/4" />
                    <div className="h-6 bg-white/5 rounded animate-shimmer w-1/2" />
                </div>

                {/* Excerpt Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded animate-shimmer w-full" />
                    <div className="h-4 bg-white/5 rounded animate-shimmer w-5/6" />
                </div>

                {/* Meta Skeleton */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <div className="h-4 bg-white/5 rounded animate-shimmer w-24" />
                    <div className="h-4 bg-white/5 rounded animate-shimmer w-20" />
                </div>
            </div>
        </div>
    )
}

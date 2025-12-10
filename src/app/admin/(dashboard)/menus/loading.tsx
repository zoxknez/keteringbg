export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-neutral-800 rounded-lg mb-2"></div>
          <div className="h-4 w-48 bg-neutral-800 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-neutral-800 rounded-xl"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-6 w-32 bg-neutral-800 rounded"></div>
                <div className="h-8 w-8 bg-neutral-800 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-neutral-800 rounded"></div>
                <div className="h-4 w-2/3 bg-neutral-800 rounded"></div>
              </div>
              <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                <div className="h-4 w-20 bg-neutral-800 rounded"></div>
                <div className="h-6 w-16 bg-neutral-800 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

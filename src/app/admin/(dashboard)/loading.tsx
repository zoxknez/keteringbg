export default function Loading() {
  return (
    <div className="space-y-6 md:space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-48 bg-neutral-800 rounded-lg mb-2"></div>
        <div className="h-4 w-64 bg-neutral-800 rounded-lg"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-neutral-900 rounded-xl md:rounded-2xl p-4 md:p-6 border border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 w-20 bg-neutral-800 rounded mb-2"></div>
                <div className="h-8 w-12 bg-neutral-800 rounded"></div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-neutral-800"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Skeleton */}
      <div className="bg-neutral-900 rounded-xl md:rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="h-6 w-40 bg-neutral-800 rounded"></div>
          <div className="h-4 w-12 bg-neutral-800 rounded"></div>
        </div>
        <div className="divide-y divide-neutral-800">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 md:p-6 flex items-center justify-between">
              <div className="flex-1">
                <div className="h-5 w-32 bg-neutral-800 rounded mb-2"></div>
                <div className="h-4 w-24 bg-neutral-800 rounded"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="h-4 w-20 bg-neutral-800 rounded mb-1"></div>
                  <div className="h-3 w-16 bg-neutral-800 rounded ml-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

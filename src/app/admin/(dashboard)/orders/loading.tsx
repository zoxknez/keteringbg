export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-neutral-800 rounded-lg mb-2"></div>
          <div className="h-4 w-48 bg-neutral-800 rounded-lg"></div>
        </div>
        <div className="h-10 w-40 bg-neutral-800 rounded-xl"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-neutral-800 flex gap-4">
          <div className="h-10 flex-1 bg-neutral-800 rounded-xl"></div>
          <div className="h-10 w-40 bg-neutral-800 rounded-xl"></div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-800 bg-neutral-800/50">
          <div className="col-span-4 h-4 bg-neutral-800 rounded"></div>
          <div className="col-span-3 h-4 bg-neutral-800 rounded"></div>
          <div className="col-span-2 h-4 bg-neutral-800 rounded"></div>
          <div className="col-span-2 h-4 bg-neutral-800 rounded"></div>
          <div className="col-span-1 h-4 bg-neutral-800 rounded"></div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-neutral-800">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center">
              <div className="col-span-4">
                <div className="h-5 w-32 bg-neutral-800 rounded mb-1"></div>
                <div className="h-3 w-24 bg-neutral-800 rounded"></div>
              </div>
              <div className="col-span-3">
                <div className="h-5 w-24 bg-neutral-800 rounded"></div>
              </div>
              <div className="col-span-2">
                <div className="h-5 w-20 bg-neutral-800 rounded"></div>
              </div>
              <div className="col-span-2">
                <div className="h-6 w-24 bg-neutral-800 rounded-full"></div>
              </div>
              <div className="col-span-1 flex justify-end">
                <div className="w-8 h-8 bg-neutral-800 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

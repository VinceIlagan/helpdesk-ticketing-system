export default function TicketDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-64 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-5 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="w-24 h-5 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse shrink-0" />
                    <div className="flex-1">
                      <div className="w-32 h-3 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="w-full h-16 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
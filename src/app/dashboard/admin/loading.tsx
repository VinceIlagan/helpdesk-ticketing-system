export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="w-40 h-7 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-56 h-4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="w-8 h-7 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-6">
                <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-5 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-16 h-5 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
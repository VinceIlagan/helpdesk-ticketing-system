import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function UserDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Skeleton */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="w-32 h-7 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-28 h-9 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="w-8 h-7 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Tickets Skeleton */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="w-48 h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="w-72 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-16 h-5 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
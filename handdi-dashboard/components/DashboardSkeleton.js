export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-[120px] h-[120px] bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-48 mx-auto mb-3 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-40 mx-auto animate-pulse" />
        </div>

        {/* Top 3 Cards Skeleton */}
        <section className="mb-12">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded-lg mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-lg w-3/4 mx-auto mb-3 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </section>

        {/* Table Skeleton */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 bg-gray-200 rounded-lg w-40 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
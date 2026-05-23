export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Hero Skeleton — desktop only ── */}
      <div className="hidden md:block h-[470px] w-full bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 relative overflow-hidden">
        <ShimmerBar />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-2 rounded-full bg-slate-300 ${i === 0 ? "w-6" : "w-2"}`} />
          ))}
        </div>
      </div>

      {/* ── Mobile Hero placeholder — mobile only ── */}
      <div className="md:hidden h-40 w-full bg-gradient-to-br from-pink-50 via-slate-50 to-purple-50 relative overflow-hidden flex items-center justify-center">
        <ShimmerBar />
        <div className="flex flex-col items-center gap-3 opacity-30">
          <div className="h-6 w-48 rounded-full bg-slate-300 animate-pulse" />
          <div className="h-4 w-32 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </div>

      {/* ── Pink skincare bar — desktop ── */}
      <div className="hidden md:block h-10 w-full bg-gradient-to-r from-pink-50 via-pink-100 to-pink-50 animate-pulse" />

      {/* ── Category Marquee — desktop ── */}
      <div className="hidden md:flex items-center gap-6 px-8 py-10 bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden min-h-[310px]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[200px] h-[260px] rounded-[20px] bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4 p-4 animate-pulse">
            <div className="w-[90px] h-[90px] rounded-full bg-slate-200" />
            <div className="h-4 w-28 rounded-full bg-slate-200" />
            <div className="h-8 w-24 rounded-full bg-slate-200" />
          </div>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-2 md:py-6 w-full">

        {/* New Arrivals Slider */}
        <div className="bg-white rounded-2xl border border-gray-100 p-3 md:p-6 mb-3 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="h-6 w-36 md:w-44 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-7 w-20 rounded-xl bg-slate-100 animate-pulse" />
          </div>
          <div className="flex gap-3 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[140px] md:w-[220px] rounded-xl bg-slate-50 border border-slate-100 overflow-hidden animate-pulse">
                <div className="h-[140px] md:h-[220px] bg-slate-200 w-full" />
                <div className="p-2 md:p-3 space-y-2">
                  <div className="h-3 w-3/4 rounded-full bg-slate-200" />
                  <div className="h-2.5 w-1/2 rounded-full bg-slate-100" />
                  <div className="h-4 w-1/3 rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Product Sections × 3 */}
        {[...Array(3)].map((_, si) => (
          <div key={si} className="bg-white rounded-2xl border border-gray-100 p-3 md:p-6 mb-3 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="h-6 w-32 md:w-40 rounded-xl bg-slate-200 animate-pulse" />
              <div className="h-7 w-16 md:w-20 rounded-xl bg-slate-100 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {[...Array(si === 0 ? 4 : 5)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}

        {/* Recommended header */}
        <div className="py-3 md:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-2">
          <div className="h-7 md:h-9 w-52 md:w-64 rounded-xl bg-slate-200 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-8 w-20 rounded-xl bg-slate-100 animate-pulse" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 pb-20">
          {[...Array(12)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ShimmerBar() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
        animation: "shimmer-slide 1.6s ease-in-out infinite",
      }}
    />
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-slate-100 overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-slate-200 w-full" />
      <div className="p-2 space-y-1.5">
        <div className="h-2.5 w-4/5 rounded-full bg-slate-200" />
        <div className="h-2 w-3/5 rounded-full bg-slate-100" />
        <div className="flex items-center justify-between mt-1">
          <div className="h-4 w-1/3 rounded-full bg-slate-200" />
          <div className="h-6 w-6 rounded-full bg-slate-100" />
        </div>
        <div className="h-7 w-full rounded-lg bg-slate-100 mt-1" />
      </div>
    </div>
  );
}

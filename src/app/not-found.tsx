import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full bg-linear-to-br from-amber-50 via-white to-emerald-50">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg ring-1 ring-amber-100">
          <span className="text-3xl">🧭</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          The page you’re looking for doesn’t exist or was moved. Let’s get you
          back to shopping.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Back to Home
          </Link>
          <Link
            href="/product"
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
          >
            Browse Products
          </Link>
        </div>

        <div className="mt-10 grid w-full gap-4 rounded-2xl border border-dashed border-amber-200 bg-white/70 p-6 text-left sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              Quick Tips
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>Check the URL for typos</li>
              <li>Use the navigation menu</li>
              <li>Visit the latest arrivals</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              Popular Links
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-emerald-700">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-emerald-700">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-emerald-700">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

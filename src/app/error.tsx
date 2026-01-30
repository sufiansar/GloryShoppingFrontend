"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full bg-linear-to-br from-rose-50 via-white to-sky-50">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg ring-1 ring-rose-100">
          <span className="text-3xl">💥</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          Oops! Something went wrong
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          We hit a snag while loading this page. Try again or head back to the
          home page.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
          >
            Go Home
          </Link>
        </div>

        <div className="mt-10 w-full rounded-2xl border border-dashed border-rose-200 bg-white/70 p-6 text-left">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700">Error ID</p>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
              {error?.digest || "N/A"}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Share this ID with support if the issue persists.
          </p>
        </div>
      </div>
    </div>
  );
}

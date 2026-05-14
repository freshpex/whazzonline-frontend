const skeletons = Array.from({ length: 6 }, (_, index) => index);

export function ProductListSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {skeletons.map((key) => (
        <div key={key} className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-48 w-full animate-pulse bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-20 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

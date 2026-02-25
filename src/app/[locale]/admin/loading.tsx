export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-border/50 bg-card"
          />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl border border-border/50 bg-card" />
        <div className="h-64 animate-pulse rounded-xl border border-border/50 bg-card" />
      </div>
    </div>
  );
}

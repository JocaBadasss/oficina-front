import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center px-4 py-2 border-b border-border">
        <Skeleton className="h-5 w-full max-w-xs" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center px-4 py-3 border-b border-border gap-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}
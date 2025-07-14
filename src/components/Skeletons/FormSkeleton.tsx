import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-1/3 mb-1 max-w-sm" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex justify-end pt-4">
        <Skeleton className="h-10 w-fit min-w-[100px]" />
      </div>
    </div>
  );
}
type SkeletonProps = {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
};

export function Skeleton({ className = "", variant = "rectangular" }: SkeletonProps) {
  const variantClasses = {
    text: "rounded-full",
    circular: "rounded-full",
    rectangular: "rounded-2xl",
  };

  return (
    <div
      className={`animate-pulse bg-white/10 ${variantClasses[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}

export function PostSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" variant="text" />
        <Skeleton className="h-3 w-32" variant="text" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" variant="text" />
        <Skeleton className="h-3 w-3/4" variant="text" />
      </div>
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10" variant="circular" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" variant="text" />
          <Skeleton className="h-2 w-16" variant="text" />
        </div>
      </div>
      <Skeleton className="h-8 w-16" variant="rectangular" />
    </div>
  );
}

export function FeedSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}


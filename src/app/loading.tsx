import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8">
             <Skeleton className="h-10 w-3/4 mx-auto" /> {/* Title Skeleton */}
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                 {[...Array(8)].map((_, i) => (
                 <div key={i} className="space-y-3">
                     <Skeleton className="h-48 w-full" />
                     <Skeleton className="h-6 w-3/4" />
                     <Skeleton className="h-4 w-1/2" />
                     <Skeleton className="h-4 w-5/6" />
                     <Skeleton className="h-10 w-full mt-2" />
                 </div>
                 ))}
             </div>
        </div>
    </div>
  );
}

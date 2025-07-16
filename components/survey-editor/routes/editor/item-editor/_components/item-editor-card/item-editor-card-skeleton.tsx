import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";



// Loading skeleton component that matches the ItemEditorCard structure
const ItemEditorCardSkeleton: React.FC = () => {
    return (
        <div className="w-full flex flex-col md:flex-row gap-4 items-start relative">
            {/* Main Card Skeleton */}
            <div className="w-full md:w-auto flex-1 border-border order-2 md:order-1 bg-background rounded-xl border border-border">

                {/* Header Skeleton */}
                <div className="py-2 border-b border-border h-[37px] flex items-center">
                    <div className="flex items-center justify-between relative w-full">
                        <div className="absolute px-4 rounded-s-lg left-0 top-0 bottom-0 flex items-center gap-2 justify-center bg-white">
                            {/* Icon skeleton */}
                            <Skeleton className="size-5 rounded-full" />
                            {/* Key badge skeleton */}
                            <Skeleton className="h-6 w-16 rounded-lg" />
                        </div>

                        {/* Label skeleton in center */}
                        <div className="text-center grow px-20">
                            <Skeleton className="h-4 w-32 mx-auto" />
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <CardContent className="p-0 m-0">
                    <div className="w-full">
                        <div className="min-h-[400px] p-6 space-y-6">
                            {/* Content area with multiple skeleton elements */}
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-48" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Skeleton className="h-6 w-36" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-32 w-full rounded-lg" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>

            {/* Floating Sidebar Skeleton */}
            <div className="relative md:sticky top-0 order-1 md:order-2 w-full md:w-fit flex justify-end">
                <Card className="shadow-none w-fit border-border p-0">
                    <CardContent className="p-0 flex flex-row md:flex-col">
                        {/* Menu button skeleton */}
                        <div className="border-r border-border md:border-b md:border-r-0">
                            <Skeleton className="size-9 rounded-s-xl md:rounded-s-none md:rounded-t-xl" />
                        </div>

                        {/* Tab buttons skeleton */}
                        <div className="flex flex-row md:flex-col">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className={cn(
                                        "size-9",
                                        i === 5 ? "rounded-e-xl md:rounded-e-none md:rounded-b-xl" : "rounded-none"
                                    )}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ItemEditorCardSkeleton;

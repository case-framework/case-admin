import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentAccess = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const trpc = useTRPC();
    const { data, isLoading, error } = useQuery({
        ...trpc.access.getCurrentAccess.queryOptions(),
        enabled,
    });

    return { data, isLoading, error };
};
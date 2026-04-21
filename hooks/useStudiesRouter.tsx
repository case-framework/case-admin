import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetRecentStudies = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const trpc = useTRPC();
    const { data, isLoading, error } = useQuery({
        ...trpc.studies.getRecentStudies.queryOptions(),
        enabled,
    });
    return { data, isLoading, error };
};

export const useGetStudyByKey = (key: string | null) => {
    const trpc = useTRPC();
    const { data, isLoading, error } = useQuery({
        ...trpc.studies.getStudyByKey.queryOptions({ key: key! }),
        enabled: key !== null,
    });
    return { data, isLoading, error };
};

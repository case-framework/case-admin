import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DbKey } from "@/lib/db/utils";

export const useGetDbIndexStatus = (dbKey: DbKey) => {
	const trpc = useTRPC();
	return useQuery(trpc.databaseIndexes.getIndexStatus.queryOptions({ dbKey }));
};

export const useCreateMissingIndexes = (dbKey: DbKey) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.databaseIndexes.createMissingIndexes.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(
					trpc.databaseIndexes.getIndexStatus.queryFilter({ dbKey }),
				);
			},
		}),
	);
};

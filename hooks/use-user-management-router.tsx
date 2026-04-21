import { SubjectType } from "@/lib/types/permission";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserById = ({
    id,
}: {
    id: string | null;
}) => {
    const trpc = useTRPC();

    const { data, isLoading, error } = useQuery(trpc.userManagement.getUserById.queryOptions({
        id: id!,
    }));

    return { data, isLoading, error };
}

export const useGetUsers = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    const trpc = useTRPC();
    const { data, isLoading, error } = useQuery(trpc.userManagement.getUsers.queryOptions({
        page,
        limit,
    }));
    return { data, isLoading, error };
}

export const useGetPermissions = ({ subjectId, subjectType }: { subjectId: string, subjectType: SubjectType }) => {
    const trpc = useTRPC();
    const { data, isLoading, error } = useQuery(trpc.userManagement.getPermissions.queryOptions({
        subjectId,
        subjectType,
    }));
    return { data, isLoading, error };
}


/**
 * Create a permission
 */
export const useCreatePermission = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(trpc.userManagement.createPermission.mutationOptions(
        {
            onSuccess: (_, { permission }) => {
                queryClient.invalidateQueries(
                    trpc.userManagement.getPermissions.queryFilter({ subjectId: permission.subjectId!, subjectType: permission.subjectType! })
                );
            },
        }
    ));
}


/**
 * Delete a permission
 */
export const useDeletePermission = (
    { subjectId, subjectType }: { subjectId: string, subjectType: SubjectType }
) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(trpc.userManagement.deletePermission.mutationOptions(
        {
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.userManagement.getPermissions.queryFilter({ subjectId, subjectType })
                );
            },
        }));
}
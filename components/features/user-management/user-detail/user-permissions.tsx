"use client";

import { LoadingButton } from "@/components/my-ui/loading-button";
import { useCreatePermission, useDeletePermission, useGetPermissions } from "@/hooks/useUserManagementRouter";
import { SubjectType, UserPermission, UserPermissionActions } from "@/lib/types/permission";
import { toast } from "sonner";


interface UserPermissionsProps {
    userId: string;
}

const UserPermissions = ({ userId }: UserPermissionsProps) => {
    const { data, isLoading, error } = useGetPermissions({
        subjectId: userId,
        subjectType: 'management-user' as SubjectType
    });


    const {
        mutate: createPermission,
        isPending: isCreatingPermission,
    } = useCreatePermission();

    const {
        mutate: deletePermission,
        isPending: isDeletingPermission,
    } = useDeletePermission({
        subjectId: userId,
        subjectType: 'management-user' as SubjectType
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>User Permissions</h1>
            <LoadingButton
                variant="outline"
                isLoading={isCreatingPermission}
                onClick={() => {
                    const p = new UserPermission(
                        UserPermissionActions.deleteUsers,
                        undefined,
                        userId,
                        SubjectType.managementUser,);


                    createPermission({
                        permission: {
                            resourceType: p.resourceType,
                            resourceKey: p.resourceKey,
                            action: p.action,
                            subjectId: p.subjectId!,
                            subjectType: p.subjectType!,
                            limiter: p.limiter,
                        }
                    }, {
                        onSuccess: () => {
                            toast.success("Permission created successfully");
                        },
                        onError: (error) => {
                            toast.error(error.message);
                        },
                    });
                }}>
                Test Permission Creation
            </LoadingButton>

            {
                data?.map((permission) => (
                    <div key={permission.id} className="flex items-center gap-2 border border-border p-2">
                        <p>{permission.resourceType}</p>
                        <p>{permission.resourceKey}</p>
                        <p>{permission.action}</p>
                        <p>{permission.subjectId}</p>
                        <p>{permission.subjectType}</p>
                        <LoadingButton
                            variant="ghost"
                            className="ms-auto"
                            isLoading={isDeletingPermission}
                            onClick={() => {
                                deletePermission({ id: permission.id! });
                            }}>
                            Delete Permission
                        </LoadingButton>

                    </div>
                ))
            }
        </div>
    )
}

export default UserPermissions;
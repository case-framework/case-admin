"use client";

import { LoadingButton } from "@/components/my-ui/loading-button";
import { useCreatePermission, useGetPermissions } from "@/hooks/useUserManagementRouter";
import { SubjectType, UserPermission, UserPermissionActions } from "@/lib/types/permission";
import { toast } from "sonner";
import PermissionItem from "./permission-item";
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "@/components/ui/empty";


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
                    <PermissionItem
                        key={permission.id}
                        permission={permission}
                    />
                ))
            }

            {
                data?.length === 0 && (
                    <Empty className="bg-muted">
                        <EmptyContent>
                            <EmptyTitle>No permissions found</EmptyTitle>
                            <EmptyDescription>No permissions found for this user</EmptyDescription>
                        </EmptyContent>
                    </Empty>
                )
            }
        </div>
    )
}

export default UserPermissions;
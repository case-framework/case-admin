import ConfirmDialog from "@/components/my-ui/confirm-dialog";
import { LoadingButton } from "@/components/my-ui/loading-button";
import { useDeletePermission } from "@/hooks/useUserManagementRouter";
import { PermissionBase, SubjectType } from "@/lib/types/permission";
import { useState } from "react";
import { toast } from "sonner";

interface PermissionItemProps {
    permission: PermissionBase;
}

const PermissionItem = ({ permission }: PermissionItemProps) => {
    const [open, setOpen] = useState(false);
    const {
        mutate: deletePermission,
        isPending: isDeletingPermission,
    } = useDeletePermission({
        subjectId: permission.subjectId!,
        subjectType: 'management-user' as SubjectType
    });


    const handleDeletePermission = () => {
        deletePermission({ id: permission.id! }, {
            onSuccess: () => {
                setOpen(false);
                toast.success('Permission deleted successfully');
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    }


    return (
        <div
            className="flex items-center gap-2 border border-border p-2"
        >
            <ConfirmDialog
                title="Delete Permission"
                description="Are you sure you want to delete this permission?"
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                isOpen={open}
                onConfirm={handleDeletePermission}
                variant="destructive"
                onCancel={() => setOpen(false)}
            />

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
                    setOpen(true);
                }}>
                Delete Permission
            </LoadingButton>
        </div>
    )
}

export default PermissionItem;
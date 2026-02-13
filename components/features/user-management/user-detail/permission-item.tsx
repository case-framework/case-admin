import { LoadingButton } from "@/components/my-ui/loading-button";
import { useConfirm } from "@/components/my-ui/confirm-provider";
import { useDeletePermission } from "@/hooks/useUserManagementRouter";
import { PermissionBase, SubjectType } from "@/lib/types/permission";
import { toast } from "sonner";

interface PermissionItemProps {
    permission: PermissionBase;
}

const PermissionItem = ({ permission }: PermissionItemProps) => {
    const confirm = useConfirm();
    const {
        mutate: deletePermission,
        isPending: isDeletingPermission,
    } = useDeletePermission({
        subjectId: permission.subjectId!,
        subjectType: 'management-user' as SubjectType
    });


    const handleDeletePermission = async () => {
        const confirmed = await confirm({
            title: "Delete Permission",
            description: "Are you sure you want to delete this permission?",
            confirmButtonText: "Delete",
            variant: "destructive",
        });

        if (confirmed) {
            deletePermission({ id: permission.id! }, {
                onSuccess: () => {
                    toast.success('Permission deleted successfully');
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            });
        }
    }


    return (
        <div
            className="flex items-center gap-2 border border-border p-2"
        >
            <p>{permission.resourceType}</p>
            <p>{permission.resourceKey}</p>
            <p>{permission.action}</p>
            <p>{permission.subjectId}</p>
            <p>{permission.subjectType}</p>
            <LoadingButton
                variant="ghost"
                className="ms-auto"
                isLoading={isDeletingPermission}
                onClick={handleDeletePermission}>
                Delete Permission
            </LoadingButton>
        </div>
    )
}

export default PermissionItem;
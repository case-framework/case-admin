import { ContextMenuItem } from "@/components/ui/context-menu";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteItemAlertDialog } from "./delete-item-alert-dialog";

interface DeleteItemContextMenuItemProps {
    itemKey: string;
}

export const DeleteItemContextMenuItem: React.FC<DeleteItemContextMenuItemProps> = ({ itemKey }) => {
    const [open, setOpen] = useState(false);

    return (
        <DeleteItemAlertDialog open={open} onOpenChange={setOpen} itemKey={itemKey}>
            <AlertDialogTrigger asChild>
                <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="size-4 mr-2 text-destructive" />
                    Delete
                </ContextMenuItem>
            </AlertDialogTrigger>
        </DeleteItemAlertDialog>
    );
};

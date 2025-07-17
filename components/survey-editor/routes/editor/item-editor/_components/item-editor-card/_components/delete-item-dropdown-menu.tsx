import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useItemNavigation } from "@/components/survey-editor/store/useItemNavigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteItemAlertDialog } from "./delete-item-alert-dialog";


interface DeleteItemDropdownMenuItemProps {
    overrideItemKey?: string;
}

export const DeleteItemDropdownMenuItem = ({ overrideItemKey }: DeleteItemDropdownMenuItemProps) => {
    const { selectedItemKey } = useItemNavigation();
    const [open, setOpen] = useState(false);

    if (!selectedItemKey && !overrideItemKey) {
        return null;
    }

    const itemKey = overrideItemKey || selectedItemKey;

    return (
        <DeleteItemAlertDialog open={open} onOpenChange={setOpen} itemKey={itemKey!}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="size-4 mr-2 text-destructive" />
                    Delete
                </DropdownMenuItem>
            </AlertDialogTrigger>
        </DeleteItemAlertDialog>
    );
};

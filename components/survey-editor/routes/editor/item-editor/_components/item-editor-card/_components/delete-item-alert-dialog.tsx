import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { useItemNavigation } from "@/components/survey-editor/store/useItemNavigation";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";

interface DeleteItemAlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemKey: string;
    children?: React.ReactNode;
}

export const DeleteItemAlertDialog: React.FC<DeleteItemAlertDialogProps> = ({
    open,
    onOpenChange,
    itemKey,
    children
}) => {
    const { editor } = useSurveyEditor();
    const { navigateToItem } = useItemNavigation();

    // Get the item
    const currentItem = editor?.survey?.surveyItems?.[itemKey];

    // Check for references to this item
    const referencingItems = useMemo(() => {
        if (!currentItem || !editor?.survey) {
            return [];
        }

        const currentFullKey = currentItem.key.fullKey;
        const references = editor.survey.getReferenceUsages(currentFullKey)
        console.log(references);
        return references;
    }, [currentItem, editor?.survey]);

    const handleDelete = () => {
        if (!currentItem || !editor) {
            toast.error("Cannot delete item: item not found");
            return;
        }

        try {
            editor.removeItem(currentItem.key.fullKey);



            // Navigate to parent after deletion
            navigateToItem(currentItem.key.parentFullKey);

            toast.success(`Item "${currentItem.key.fullKey}" deleted successfully`);
            onOpenChange(false);
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        }
    };

    if (!currentItem) {
        return null;
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {children}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Survey Item</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the survey item with key:
                        <code className="block mt-2 px-4 py-2 bg-muted text-center text-muted-foreground rounded font-mono text-sm">
                            {currentItem.key.fullKey}
                        </code>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {referencingItems.length > 0 && (
                    <Alert variant="destructive">
                        <AlertTriangle />
                        <AlertDescription>
                            <strong>Warning:</strong> This item is referenced in other parts of the survey.
                            Deleting it may cause issues. References found in:
                            <ul className="list-disc list-inside mt-2 text-sm">
                                {referencingItems.slice(0, 5).map((ref, index) => (
                                    <li key={index} className="font-mono text-xs">{ref.valueReference.itemKey.fullKey} {ref.valueReference.slotKey?.fullKey} {ref.usageType}</li>
                                ))}
                                {referencingItems.length > 5 && (
                                    <li className="text-muted-foreground">
                                        ...and {referencingItems.length - 5} more
                                    </li>
                                )}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={handleDelete}
                    >
                        Delete Item
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

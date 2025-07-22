import { useSurveyEditor } from "../../../store/useSurveyEditor";
import ItemEditorCard from "./_components/item-editor-card";

import { Loader2 } from "lucide-react";
import { AddItemDialog } from "./_components/item-editor-card/_components/add-items";
import { useItemNavigation } from "../../../store/useItemNavigation";
import { ItemEditorProvider, useItemEditor } from "./_components/item-editor-context";
import ItemEditorToolbar from "./_components/item-editor-toolbar/item-editor-toolbar";

const ItemEditorContent = () => {
    const { isEditorReady, isInitializing, editor } = useSurveyEditor();
    const { selectedItemKey } = useItemNavigation();
    const { addItemDialogOpen, setAddItemDialogOpen, openAddItemDialog } = useItemEditor();

    if (isInitializing || !isEditorReady) {
        return <div className="relative h-full flex items-center justify-center">
            <p className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Loading...
            </p>
        </div>
    }

    return <div className="space-y-4">
        <ItemEditorToolbar />
        <ItemEditorCard />
        <AddItemDialog
            open={addItemDialogOpen}
            onOpenChange={setAddItemDialogOpen}
            parentKey={selectedItemKey}
        />
    </div>
}

const ItemEditor = () => {
    return (
        <ItemEditorProvider>
            <ItemEditorContent />
        </ItemEditorProvider>
    );
}

export default ItemEditor;

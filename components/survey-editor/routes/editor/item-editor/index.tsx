import { useSurveyEditor } from "../../../store/useSurveyEditor";
import ItemEditorCard from "./_components/item-editor-card";

import { Loader2 } from "lucide-react";
import { AddItemDialog } from "./_components/item-editor-card/_components/add-items";
import { ItemEditorProvider } from "./_components/item-editor-context";
import ItemEditorToolbar from "./_components/item-editor-toolbar/item-editor-toolbar";

const ItemEditor = () => {
    const { isEditorReady, isInitializing } = useSurveyEditor();


    if (isInitializing || !isEditorReady) {
        return <div className="relative h-full flex items-center justify-center">
            <p className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Loading...
            </p>
        </div>
    }

    return <ItemEditorProvider>
        <div className="h-full flex flex-col gap-4">
            <ItemEditorToolbar />
            <div className="flex-1 min-h-0">
                <ItemEditorCard />
            </div>
            <AddItemDialog />
        </div>
    </ItemEditorProvider>
}

export default ItemEditor;

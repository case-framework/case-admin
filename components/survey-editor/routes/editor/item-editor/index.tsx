import { useSurveyEditor } from "../../../store/useSurveyEditor";
import BreadcrumbsNav from "./_components/breadcrumbs-nav";
import ItemEditorCard from "./_components/item-editor-card";
import { Loader2 } from "lucide-react";

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

    return <div className="space-y-4">
        <BreadcrumbsNav />
        <ItemEditorCard />
    </div>
}

export default ItemEditor;

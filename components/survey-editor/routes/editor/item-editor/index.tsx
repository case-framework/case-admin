import { useSurveyEditor } from "../../../store/useSurveyEditor";
import BreadcrumbsNav from "./_components/breadcrumbs-nav";
import ItemEditorCard from "./_components/item-editor-card";
import SearchTrigger from "./_components/search-trigger";
import { Loader2 } from "lucide-react";

/**
 * ItemEditor component with integrated search functionality.
 * Features:
 * - Breadcrumbs navigation on the left
 * - Search trigger button on the right with Cmd/Ctrl+K shortcut
 * - Spotlight-like search dialog that searches through:
 *   - Survey item keys (full and partial)
 *   - Translation content (titles, subtitles)
 *   - Component labels and content
 */
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
        <div className="flex items-center justify-between gap-4">
            <BreadcrumbsNav />
            <SearchTrigger />
        </div>
        <ItemEditorCard />
    </div>
}

export default ItemEditor;

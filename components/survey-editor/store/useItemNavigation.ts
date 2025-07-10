import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

/**
 * Custom hook for managing survey item navigation via URL routes
 * Enables browser history navigation and bookmarkable URLs for survey items
 */
export const useItemNavigation = () => {
    const navigate = useNavigate();
    const { itemKey } = useParams<{ itemKey?: string }>();
    const { editor, isEditorReady } = useSurveyEditor();

    useEffect(() => {
        if (!isEditorReady) {
            return;
        }

        if (itemKey && !editor?.survey?.surveyItems?.[itemKey]) {
            navigate("/editor/item-editor", { replace: true });
        }
    }, [editor?.survey?.surveyItems, itemKey, navigate, isEditorReady]);

    // Get the currently selected item key from the URL
    const selectedItemKey = itemKey;

    // Navigate to a specific item
    const navigateToItem = (newItemKey?: string) => {
        if (newItemKey === selectedItemKey) {
            return;
        }

        if (newItemKey) {
            navigate(`/editor/item-editor/${newItemKey}`);
        } else {
            navigate("/editor/item-editor");
        }
    };

    return {
        selectedItemKey,
        navigateToItem,
    };
};

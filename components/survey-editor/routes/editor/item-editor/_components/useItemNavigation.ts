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
    const { editor } = useSurveyEditor();

    useEffect(() => {
        if (itemKey && !editor?.survey.surveyItems[itemKey]) {
            navigate("/editor/item-editor", { replace: true });
        }
    }, [editor?.survey.surveyItems, itemKey, navigate]);

    // Get the currently selected item key from the URL
    const selectedItemKey = itemKey ? decodeURIComponent(itemKey) : null;

    // Navigate to a specific item
    const navigateToItem = (newItemKey?: string) => {
        if (newItemKey === selectedItemKey) {
            return;
        }

        if (newItemKey) {
            const encodedItemKey = encodeURIComponent(newItemKey);
            navigate(`/editor/item-editor/${encodedItemKey}`);
        } else {
            navigate("/editor/item-editor");
        }
    };

    return {
        selectedItemKey,
        navigateToItem,
    };
};

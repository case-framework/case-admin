import { useItemNavigation } from "@/components/survey-editor/store/useItemNavigation";
import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import ItemEditorCardSkeleton from "./item-editor-card-skeleton";
import EditorCardForGroup from "./editor-card-for-group";
import { SurveyItemType } from "survey-engine";
import EditorCardForRoot from "./editor-card-for-root";
import EditorCardForScgMcg from "./editor-card-for-scg-mcg";

const ItemEditorCard: React.FC = () => {

    const { editor } = useSurveyEditor();
    let { selectedItemKey } = useItemNavigation();
    if (!selectedItemKey) {
        selectedItemKey = editor?.survey.surveyKey;
    }

    if (!editor || !selectedItemKey) {
        return null;
    }

    const surveyItem = editor?.survey.surveyItems[selectedItemKey];
    if (!surveyItem) {
        return <ItemEditorCardSkeleton />;
    }

    // Root item is a special case - use to edit global settings:
    if (surveyItem.key.isRoot) {
        return <EditorCardForRoot item={surveyItem} />;
    }

    switch (surveyItem.itemType) {
        case SurveyItemType.Group:
            return <EditorCardForGroup item={surveyItem} />;
        case SurveyItemType.SingleChoiceQuestion:
            return <EditorCardForScgMcg item={surveyItem} />;
        default:
            return <div>
                Editor for {surveyItem.itemType} is not implemented yet.
            </div>
    }
}

export default ItemEditorCard;

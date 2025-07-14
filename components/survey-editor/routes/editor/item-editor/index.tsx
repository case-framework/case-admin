
import { Button } from "@/components/ui/button";
import { ItemComponentType, SingleChoiceQuestionItem, SurveyItemTranslations, SurveyItemType } from "survey-engine";
import { useSurveyEditor } from "../../../store/useSurveyEditor";
import { useItemNavigation } from "../../../store/useItemNavigation";
import BreadcrumbsNav from "./_components/breadcrumbs-nav";
import ItemEditorCard from "./_components/item-editor-card";

const ItemEditor = () => {
    const { editor, isEditorReady, isInitializing } = useSurveyEditor();
    const { selectedItemKey, navigateToItem } = useItemNavigation();

    return <div className="space-y-4">
        <BreadcrumbsNav />

        <div>
            {isEditorReady ? 'Editor ready' : 'Editor not ready'}
        </div>

        <div>
            {isInitializing ? 'Initializing' : 'Not initializing'}
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">Currently selected item:</p>
            <p className="text-sm text-muted-foreground">
                {selectedItemKey || 'No item selected'}
            </p>
        </div>

        <ItemEditorCard />

        <input type="text" defaultValue={editor?.survey.surveyKey} />

        <div>
            {editor?.survey.rootItem.items?.map((item) => (
                <button key={item}
                    className="block"
                    onClick={() => navigateToItem(item)}>
                    {item}
                </button>
            ))}
            <Button
                variant="outline"
                onClick={() => {
                    const newItemKey = editor?.survey.surveyKey + '.' + Object.keys(editor?.survey.surveyItems || {}).length;
                    console.log(newItemKey);
                    editor?.addItem(undefined, SingleChoiceQuestionItem.fromJson(newItemKey, {
                        itemType: SurveyItemType.SingleChoiceQuestion,
                        header: {
                            title: {
                                key: 'title',
                                type: ItemComponentType.Text
                            },
                            subtitle: {
                                key: 'subtitle',
                                type: ItemComponentType.Text
                            }
                        },

                        responseConfig: {
                            type: ItemComponentType.SingleChoice,
                            key: 'scg',
                            properties: {
                                shuffleItems: true
                            },
                            items: [
                                {
                                    key: 'A1',
                                    type: ItemComponentType.ScgMcgOption,
                                },
                                {
                                    key: 'A2',
                                    type: ItemComponentType.ScgMcgOption,
                                },
                            ]
                        }
                    }), new SurveyItemTranslations())
                }}
            >
                Add item
            </Button >
        </div >



        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 flex-1 rounded-xl h-96" />
        <div className="bg-muted/50 flex-1 rounded-xl h-96" />
        <div className="bg-muted/50 flex-1 rounded-xl h-96" />
        <div className="bg-muted/50 flex-1 rounded-xl h-96" />
        <div className="bg-muted/50 flex-1 rounded-xl h-96" />
        <div className=" flex-1 rounded-xl h-96 bg-red-50/50 border border-red-400" />
    </div>
}

export default ItemEditor;

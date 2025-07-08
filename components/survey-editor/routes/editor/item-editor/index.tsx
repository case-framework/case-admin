
import { Button } from "@/components/ui/button";
import { ItemComponentType, SingleChoiceQuestionItem, SurveyItemTranslations, SurveyItemType } from "survey-engine";
import { useSurveyEditor } from "../../../store/useSurveyEditor";

const ItemEditor = () => {
    const { editor, syncEditorWithSession, isEditorReady, isInitializing } = useSurveyEditor();

    console.log(editor?.survey);

    console.log(editor?.survey.surveyItems)

    return <div className="space-y-4">
        <div>
            breadrcumbs
        </div>

        <div>
            {isEditorReady ? 'Editor ready' : 'Editor not ready'}
        </div>

        <div>
            {isInitializing ? 'Initializing' : 'Not initializing'}
        </div>

        <div>
            {editor?.survey.rootItem.items?.map((item) => (
                <div key={item}>
                    {item}
                </div>
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

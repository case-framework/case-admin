import { useItemNavigation } from "@/components/survey-editor/store/useItemNavigation";
import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { Button } from "@/components/ui/button";
import { ItemComponentType, SingleChoiceQuestionItem, SurveyItemTranslations, SurveyItemType } from "survey-engine";


const GroupItems = () => {
    const { editor } = useSurveyEditor();
    const { navigateToItem } = useItemNavigation();

    return <div>
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
        </div>
    </div>
}

export default GroupItems;

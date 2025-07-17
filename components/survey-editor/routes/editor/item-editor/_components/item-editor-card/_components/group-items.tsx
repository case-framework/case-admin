import { useItemNavigation } from "@/components/survey-editor/store/useItemNavigation";
import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GroupItem, ItemComponentType, SingleChoiceQuestionItem, SurveyItemTranslations, SurveyItemType } from "survey-engine";
import ItemPreview from "./item-preview";


const GroupItems = () => {
    const { editor } = useSurveyEditor();
    let { selectedItemKey } = useItemNavigation();
    const { navigateToItem } = useItemNavigation();

    const [itemKeyForPreview, setItemKeyForPreview] = useState<string | null>(null);

    if (!selectedItemKey) {
        selectedItemKey = editor?.survey.surveyKey;
    }

    const surveyItem = editor?.survey.surveyItems[selectedItemKey as string];
    if (!surveyItem) {
        throw new Error("No survey item");
    }

    const groupItem = surveyItem as GroupItem;

    return <div className="flex grow ">
        <div className="flex-1 pt-2 px-4 pb-4 border-r border-border">
            <div>
                {editor?.survey.rootItem.items?.map((item) => (
                    <button key={item}
                        className="block"
                        onClick={() => setItemKeyForPreview(item)}
                        onDoubleClick={() => navigateToItem(item)}

                    >
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

        <div className="flex-1 pt-2 px-4 pb-4">
            <ItemPreview item={editor?.survey.surveyItems[itemKeyForPreview as string]} />
        </div>
    </div>
}

export default GroupItems;

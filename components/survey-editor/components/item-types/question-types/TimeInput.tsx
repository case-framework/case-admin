import React from 'react';
import GenericQuestionPropEditor from '../specific-editors/GenericQuestionPropEditor';
import { SurveyItems } from 'case-editor-tools/surveys/survey-items';
import { BsBraces } from 'react-icons/bs';
import { ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import { surveyItemToGenericProps } from '../utils';
import MonacoResponseGroupContentEditor from '../specific-editors/MonacoResponseGroupContentEditor';

interface TimeInputAttributeEditorProps {
    surveyItem: SurveySingleItem;
    onItemChange: (item: SurveySingleItem) => void;
}


const TimeInputAttributeEditor: React.FC<TimeInputAttributeEditorProps> = ({
    surveyItem,
    onItemChange,
}) => {

    // console.log(surveyItem)
    const itemProps = surveyItemToGenericProps(surveyItem);
    // console.log(itemProps);

    const mainResponseSlot = surveyItem.components?.items.find(i => i.role === 'responseGroup');

    return (<>
        <p className='font-bold py-2 my-2'>
            <span className='me-1 font-normal text-tiny block'>
                Type:
            </span>
            Time input
        </p>
        <GenericQuestionPropEditor
            genericProps={
                itemProps
            }
            specificEditGroup={
                {
                    key: 'body',
                    title: 'Response options',
                    icon: <BsBraces />,
                    content: (
                        <MonacoResponseGroupContentEditor
                            itemComponent={mainResponseSlot ? { ...(mainResponseSlot as ItemGroupComponent).items[0] } : { key: 'time', role: 'dateInput', items: [] }}
                            onChange={(newItemComponent) => {
                                if (!surveyItem || !surveyItem.components) {
                                    console.warn('no survey item or components when trying to save response group content')
                                    return;
                                }
                                const rgI = surveyItem.components?.items.findIndex(i => i.role === 'responseGroup');
                                if (rgI < 0) {
                                    surveyItem.components?.items.push({
                                        key: 'rg',
                                        role: 'responseGroup',
                                        items: [
                                            newItemComponent,
                                        ],
                                    });
                                } else {
                                    (surveyItem.components.items[rgI] as ItemGroupComponent).items = [
                                        { ...newItemComponent },
                                    ]

                                }
                                onItemChange({
                                    ...surveyItem,
                                })
                            }}
                        />
                    )
                }
            }
            onChange={(newProps) => {
                const newItem = SurveyItems.timeInput({
                    ...newProps,
                }) as SurveySingleItem;

                // keep response group
                const rg = surveyItem.components?.items.find(i => i.role === 'responseGroup');

                const rgIndex = (newItem as SurveySingleItem).components?.items.findIndex(i => i.role === 'responseGroup');

                if (rgIndex && rg && newItem.components !== undefined) {
                    newItem.components.items[rgIndex] = rg;
                }

                onItemChange({
                    ...newItem,
                });
            }}
        />
    </>
    );
};

export default TimeInputAttributeEditor;

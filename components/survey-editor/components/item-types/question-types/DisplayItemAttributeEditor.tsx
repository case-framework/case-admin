import React from 'react';
import { SurveyItems } from 'case-editor-tools/surveys/survey-items';
import { BsCardText, BsChevronBarUp, BsEye } from 'react-icons/bs';
import { SurveySingleItem } from 'survey-engine/data_types';
import { surveyItemToGenericProps } from '../utils';
import AttributeGroupsAccordion from '../specific-editors/AttributeGroupsAccordion';
import ItemConditionEditor from '../specific-editors/ItemConditionEditor';
import ItemComponentsEditor from '../specific-editors/ItemComponentsEditor';

interface DisplayItemAttributeEditorProps {
    surveyItem: SurveySingleItem;
    onItemChange: (item: SurveySingleItem) => void;
}


const DisplayItemAttributeEditor: React.FC<DisplayItemAttributeEditorProps> = ({
    surveyItem,
    onItemChange,
}) => {

    // console.log(surveyItem)
    const itemProps = surveyItemToGenericProps(surveyItem);
    console.log(itemProps)
    // console.log(itemProps);

    return (<>
        <p className='font-bold py-2 my-2'>
            <span className='me-1 font-normal text-tiny block'>
                Type:
            </span>
            Display item
        </p>
        <AttributeGroupsAccordion
            attributeGroups={[
                {
                    key: 'content',
                    title: 'Content',
                    defaultOpen: true,
                    icon: <BsCardText />,
                    content: (
                        <ItemComponentsEditor
                            components={itemProps.bottomDisplayCompoments}
                            onChange={(components) => {
                                if (!components) {
                                    return;
                                }
                                const newItem = SurveyItems.display({
                                    parentKey: itemProps.parentKey,
                                    itemKey: itemProps.itemKey,
                                    content: components,
                                    condition: surveyItem.condition,
                                    metadata: surveyItem.metadata,
                                })
                                onItemChange(newItem);
                            }}
                        />
                    )
                },
                {
                    key: 'condition',
                    title: 'Condition',
                    icon: <BsEye />,
                    content: (
                        <ItemConditionEditor
                            condition={surveyItem.condition}
                            onChange={(condition) => {
                                surveyItem.condition = condition;
                                onItemChange(surveyItem);
                            }}
                        />
                    )
                }
            ]}
        />

    </>
    );
};

export default DisplayItemAttributeEditor;

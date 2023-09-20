import React from 'react';
import AttributeGroupsAccordion from './specific-editors/AttributeGroupsAccordion';
import { BsEye } from 'react-icons/bs';
import ItemConditionEditor from './specific-editors/ItemConditionEditor';
import { SurveySingleItem } from 'survey-engine/data_types';

interface PageBreakAttributeEditorProps {
    surveyItem: SurveySingleItem;
    onItemChange: (item: SurveySingleItem) => void;
}

const PageBreakAttributeEditor: React.FC<PageBreakAttributeEditorProps> = ({
    surveyItem,
    onItemChange,
}) => {
    return (
        <AttributeGroupsAccordion
            attributeGroups={[
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
    );
};

export default PageBreakAttributeEditor;

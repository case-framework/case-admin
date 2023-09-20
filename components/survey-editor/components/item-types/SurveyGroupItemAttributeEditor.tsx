import React from 'react';
import AttributeGroupsAccordion from './specific-editors/AttributeGroupsAccordion';
import { BsEye } from 'react-icons/bs';
import ItemConditionEditor from './specific-editors/ItemConditionEditor';
import { SurveyGroupItem } from 'survey-engine/data_types';

interface SurveyGroupItemAttributeEditorProps {
    surveyItem: SurveyGroupItem;
    onItemChange: (item: SurveyGroupItem) => void;
}

const SurveyGroupItemAttributeEditor: React.FC<SurveyGroupItemAttributeEditorProps> = ({
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

export default SurveyGroupItemAttributeEditor;

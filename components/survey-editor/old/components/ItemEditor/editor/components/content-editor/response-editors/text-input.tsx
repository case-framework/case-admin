import React from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import TextInputContentConfig from './text-input-content-config';

interface TextInputProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const TextInput: React.FC<TextInputProps> = (props) => {
    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const textInputCompIndex = rg.items.findIndex(comp => comp.role === 'input' || comp.role === 'multilineTextInput');
    if (textInputCompIndex === undefined || textInputCompIndex === -1) {
        return <p>Text input not found</p>;
    }

    const onChange = (newComp: ItemComponent) => {
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[textInputCompIndex] = newComp;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingComponents,
            }
        });

    };

    return (
        <TextInputContentConfig
            component={rg.items[textInputCompIndex]}
            onChange={onChange}
            allowMultipleLines={true}
        />
    );
};

export default TextInput;

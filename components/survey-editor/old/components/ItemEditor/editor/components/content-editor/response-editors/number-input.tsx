import React from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import NumberInputContentConfig from './number-input-content-config';

interface NumberInputProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const numberInputCompIndex = rg.items.findIndex(comp => comp.role === 'numberInput');
    if (numberInputCompIndex === undefined || numberInputCompIndex === -1) {
        return <p>Number input not found</p>;
    }

    const onChange = (newComp: ItemComponent) => {
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[numberInputCompIndex] = newComp;
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
        <NumberInputContentConfig
            component={rg.items[numberInputCompIndex]}
            onChange={onChange}
        />
    );
};

export default NumberInput;

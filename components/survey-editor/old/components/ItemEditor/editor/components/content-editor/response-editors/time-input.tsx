import React from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import { ItemComponentRole } from '@/components/survey-editor/old/components/types';
import TimeInputContentConfig from './time-input-content-config';

interface TimeInputProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const TimeInput: React.FC<TimeInputProps> = (props) => {
    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const timeInputCompIndex = rg.items.findIndex(comp => comp.role === ItemComponentRole.TimeInput);
    if (timeInputCompIndex === undefined || timeInputCompIndex === -1) {
        return <p>Time input not found</p>;
    }

    const onChange = (newComp: ItemComponent) => {
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[timeInputCompIndex] = newComp;
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
        <TimeInputContentConfig
            component={rg.items[timeInputCompIndex]}
            onChange={onChange}
        />
    );
};

export default TimeInput;

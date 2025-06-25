import React from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import DateInputContentConfig from './date-input-content-config';
import { ItemComponentRole } from '@/components/survey-editor/old/components/types';

interface DateInputProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const DateInput: React.FC<DateInputProps> = (props) => {
    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const dateInputCompIndex = rg.items.findIndex(comp => comp.role === ItemComponentRole.DateInput);
    if (dateInputCompIndex === undefined || dateInputCompIndex === -1) {
        return <p>Date input not found</p>;
    }

    const onChange = (newComp: ItemComponent) => {
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[dateInputCompIndex] = newComp;
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
        <DateInputContentConfig
            component={rg.items[dateInputCompIndex]}
            onChange={onChange}
        />
    );
};

export default DateInput;

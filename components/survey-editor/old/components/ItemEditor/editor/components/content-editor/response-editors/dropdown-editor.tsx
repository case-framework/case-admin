import React from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import DropdownContentConfig from './dropdown-content-config';

interface DropdownEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const DropdownEditor: React.FC<DropdownEditorProps> = (props) => {
    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const dropdownCompIndex = rg.items.findIndex(comp => comp.role === 'dropDownGroup');
    if (dropdownCompIndex === undefined || dropdownCompIndex === -1) {
        return <p>Dropdown not found</p>;
    }

    const onChange = (newComp: ItemComponent) => {
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[dropdownCompIndex] = newComp;
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
        <DropdownContentConfig
            component={rg.items[dropdownCompIndex]}
            onChange={onChange}
        />
    );
};

export default DropdownEditor;

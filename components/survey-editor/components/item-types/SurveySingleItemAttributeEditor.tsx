import React from 'react';
import { ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import NotImplemented from '@/components/NotImplemented';
import SingleChoiceAttributeEditor from './question-types/SingleChoiceAttributeEditor';
import MultipleChoiceAttributeEditor from './question-types/MultipleChoiceAttributeEditor';
import MatrixAttributeEditor from './question-types/MatrixAttributeEditor';
import SliderNumericAttributeEditor from './question-types/SliderNumeric';
import DateInputAttributeEditor from './question-types/DateInput';
import DisplayItemAttributeEditor from './question-types/DisplayItemAttributeEditor';
import TimeInputAttributeEditor from './question-types/TimeInput';
import TextInputAttributeEditor from './question-types/TextInput';
import NumericInputAttributeEditor from './question-types/NumericInput';
import DropdownGroupAttributeEditor from './question-types/DropdownGroup';
import MultilineTextinputAttributeEditor from './question-types/MultilineTextinput';
import ConsentAttributeEditor from './question-types/ConsentAttributeEditor';
import ResponsiveSingleChoiceArrayAttributeEditor from './question-types/ResponsiveSingleChoiceArrayAttributeEditor';
import ResponsiveBipolarLikertScaleArrayAttributeEditor from './question-types/ResponsiveBipolarLikertAttributeEditor';
import ResponsiveMatrixAttributeEditor from './question-types/ResponsiveMatrixAttributeEditor';


interface SurveySingleItemAttributeEditorProps {
    surveyItem?: SurveySingleItem;
    onItemChange: (item: SurveySingleItem) => void;
}

const determineItemType = (item: SurveySingleItem): string => {
    if (!item.components?.items || item.components.items.length === 0) {
        console.warn('No components found for item: ', item.key);
        return 'unknown';
    }

    const responseGroup = item.components.items.find(i => i.role === 'responseGroup');
    if (!responseGroup) {
        return 'display';
    }

    const mainResponseItems = (responseGroup as ItemGroupComponent).items;
    if (!mainResponseItems || mainResponseItems.length === 0) {
        console.warn('No response items found for item: ', item);
        return 'unknown';
    }
    if (mainResponseItems.length > 1) {
        console.warn('More than one response item found for item: ', item);
        return 'unknown';
    }

    const mainResponseItem = mainResponseItems[0];

    // TODO: handle other response item types
    switch (mainResponseItem.role) {
        case 'input':
            return 'textInput';
        case 'multilineTextInput':
            return 'multilineTextInput';
        case 'numberInput':
            return 'numberInput';
        case 'dropDownGroup':
            return 'dropdownGroup';
        case 'singleChoiceGroup':
            return 'singleChoice';
        case 'multipleChoiceGroup':
            return 'multipleChoice';
        case 'responsiveSingleChoiceArray':
            return 'responsiveSingleChoiceArray';
        case 'responsiveSingleChoiceArray':
            return 'responsiveSingleChoiceArray';
        case 'responsiveBipolarLikertScaleArray':
            return 'responsiveBipolarLikertScaleArray';
        case 'responsiveMatrix':
            return 'responsiveMatrix';
        case 'matrix':
            return 'matrix';
        case 'sliderNumeric':
            return 'sliderNumeric';
        case 'dateInput':
            return 'dateInput';
        case 'timeInput':
            return 'timeInput';
        case 'consent':
            return 'consent';
        default:
            console.warn('Unknown response item role: ', mainResponseItem.role);
            return mainResponseItem.role;
    }

}

const SurveySingleItemAttributeEditor: React.FC<SurveySingleItemAttributeEditorProps> = (props) => {
    if (!props.surveyItem) {
        return <p>
            No survey item provided
        </p>
    }

    const itemType = determineItemType(props.surveyItem);

    switch (itemType) {
        case 'display':
            return (<DisplayItemAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'textInput':
            return (<TextInputAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'numberInput':
            return (<NumericInputAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'singleChoice':
            return (<SingleChoiceAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'multipleChoice':
            return (<MultipleChoiceAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'dateInput':
            return (<DateInputAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'timeInput':
            return (<TimeInputAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'sliderNumeric':
            return (<SliderNumericAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'dropdownGroup':
            return (<DropdownGroupAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'multilineTextInput':
            return (<MultilineTextinputAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'responsiveSingleChoiceArray':
            return (<ResponsiveSingleChoiceArrayAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'responsiveBipolarLikertScaleArray':
            return (<ResponsiveBipolarLikertScaleArrayAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'responsiveMatrix':
            return (<ResponsiveMatrixAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'matrix':
            return (<MatrixAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        case 'consent':
            return (<ConsentAttributeEditor
                surveyItem={props.surveyItem}
                onItemChange={props.onItemChange}
            />)
        default:
            return <p className='p-unit-md text-danger'>
                Unknown item type: {itemType}
            </p>
    }
};

export default SurveySingleItemAttributeEditor;

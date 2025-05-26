import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import React from 'react';
import { SurveySingleItem } from 'survey-engine/data_types';
import EditorWrapper from '../editor-wrapper';
import { getItemTypeInfos } from '@/components/survey-editor/utils/utils';
import MultipleChoice from './multiple-choice';
import ValidatedRandomQuestion from './validated-random-question';
import TextInput from './text-input';
import DateInput from './date-input';
import SliderNumeric from './slider-numeric';
import NumberInput from './number-input';
import DropdownEditor from './dropdown-editor';
import Consent from './consent';
import Rsca from './rsca';
import ContactForm from './contact-form';
import ClozeEditor from './cloze-editor';
import TimeInput from './time-input';
import Rblsa from './rblsa';
import MatrixEditor from './matrix';
import CodeValidator from './code-validator';
import ResponsiveMatrixEditor from './responsive-matrix';

interface ResponseGroupEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const ResponseGroupEditor: React.FC<ResponseGroupEditorProps> = (props) => {

    let content: React.ReactNode = null;

    const typeInfos = getItemTypeInfos(props.surveyItem);

    switch (typeInfos.key) {
        case 'singleChoice':
            content = <MultipleChoice surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} isSingleChoice={true} />;
            break;
        case 'multipleChoice':
            content = <MultipleChoice surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'dateInput':
            content = <DateInput surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'timeInput':
            content = <TimeInput surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'textInput':
            content = <TextInput surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'multilineTextInput':
            content = <TextInput surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'numericInput':
            content = <NumberInput surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'sliderNumeric':
            content = <SliderNumeric surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'responsiveSingleChoiceArray':
            content = <Rsca surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'responsiveBipolarLikertScaleArray':
            content = <Rblsa surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'responsiveMatrix':
            content = <ResponsiveMatrixEditor surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'matrix':
            content = <MatrixEditor surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'clozeQuestion':
            content = <ClozeEditor surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'consent':
            content = <Consent surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'contact':
            content = <ContactForm surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'dropdown':
            content = <DropdownEditor surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'validatedRandomQuestion':
            content = <ValidatedRandomQuestion surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        case 'codeValidator':
            content = <CodeValidator surveyItem={props.surveyItem} onUpdateSurveyItem={props.onUpdateSurveyItem} />;
            break;
        default:
            content = (
                <div>
                    <p>Unknown response group type: {typeInfos.key}</p>
                </div>
            );
            break;
    }

    return (
        <EditorWrapper>
            <div className='flex justify-end'>
                <SurveyLanguageToggle />
            </div>

            {content}

        </EditorWrapper>
    );
};

export default ResponseGroupEditor;

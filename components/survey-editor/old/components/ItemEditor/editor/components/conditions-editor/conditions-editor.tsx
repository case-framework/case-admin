import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import React from 'react';
import { SurveyItem } from 'survey-engine/data_types';
import SurveyExpressionEditor from '../survey-expression-editor';

interface ConditionsEditorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}


const ConditionsEditor: React.FC<ConditionsEditorProps> = (props) => {
    const currentCondition = props.surveyItem.condition;


    return (
        <div className='p-4 space-y-4 pb-24' >

            <h3 className='font-semibold text-base flex items-center gap-2'>
                <span
                    className='grow'
                >
                    Condition to display this item
                </span>
            </h3>
            <Alert>
                <AlertDescription className='flex gap-2 items-center'>
                    <span>
                        <InfoIcon className='size-4 text-muted-foreground' />
                    </span>
                    <span>
                        {"If a condition is defined below, this item (and all of it's children for groups) will only be displayed (inlcuded in the questionnaire) if it evaluates to true."}
                    </span>
                </AlertDescription>
            </Alert>

            <SurveyExpressionEditor
                label='Condition'
                expression={currentCondition}
                onChange={(newExpression) => {
                    props.onUpdateSurveyItem({ ...props.surveyItem, condition: newExpression });
                }}
            />

        </div>
    );
};

export default ConditionsEditor;

import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import React from 'react';
import { ExpressionArg, ItemComponent } from 'survey-engine/data_types';
import ExpArgEditorForNum from './exp-arg-editor-for-num';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { ExpArg } from '@/components/expression-editor/utils';

interface TimeInputContentConfigProps {
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
    hideLabel?: boolean;
}

const TimeInputContentConfig: React.FC<TimeInputContentConfigProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const currentLabel = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';
    const currentMin = props.component.style?.find((style) => style.key === 'minTime')?.value as string | undefined;
    const currentMax = props.component.style?.find((style) => style.key === 'maxTime')?.value as string | undefined;
    const currentStep = props.component.properties?.stepSize as ExpressionArg | undefined;

    return (
        <div className='space-y-4'>
            {!props.hideLabel && <div className='space-y-1.5'>
                <Label
                    htmlFor={props.component.key + 'label'}
                >
                    Label
                </Label>
                <Input
                    id={props.component.key + 'label'}
                    value={currentLabel}
                    onChange={(e) => {
                        const updatedComponent = { ...props.component };
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        props.onChange(updatedComponent);
                    }}
                    placeholder='Enter label...'
                />
            </div>}

            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                    <Label
                        htmlFor={props.component.key + 'min'}
                    >
                        Earliest
                    </Label>
                    <Input
                        id={props.component.key + 'min'}
                        type='time'
                        value={currentMin}
                        onChange={(e) => {
                            props.onChange({
                                ...props.component,
                                style: [
                                    ...(props.component.style || []).filter(s => s.key !== 'minTime'),
                                    ...(e.target.value === '' ? [] : [{ key: 'minTime', value: e.target.value }])
                                ]
                            })
                        }}
                        placeholder='Enter min time...'
                    />
                </div>

                <div className='space-y-1.5'>
                    <Label
                        htmlFor={props.component.key + 'max'}
                    >
                        Latest
                    </Label>
                    <Input
                        id={props.component.key + 'max'}
                        type='time'
                        value={currentMax}
                        onChange={(e) => {
                            props.onChange({
                                ...props.component,
                                style: [
                                    ...(props.component.style || []).filter(s => s.key !== 'maxTime'),
                                    ...(e.target.value === '' ? [] : [{ key: 'maxTime', value: e.target.value }])
                                ]
                            })
                        }}
                        placeholder='Enter max time...'
                    />

                </div>
            </div>

            <div>
                <ExpArgEditorForNum
                    label='Step Size (seconds, e.g. 300 = 5 minutes)'
                    expArg={currentStep as ExpArg}
                    onChange={(argValue) => {
                        const currentData = props.component.properties || {};
                        currentData.stepSize = argValue as ExpressionArg;
                        props.onChange({
                            ...props.component,
                            properties: {
                                ...currentData,
                            }
                        })
                    }}
                />
            </div>
        </div>


    );
};

export default TimeInputContentConfig;

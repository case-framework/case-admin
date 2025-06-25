import React from 'react';
import { ExpressionArg, ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import ExpArgEditorForNum from './exp-arg-editor-for-num';
import { localisedObjectToMap } from '@/components/survey-editor/old/utils/localeUtils';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { Input } from '@/components/ui/input';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { ExpArg } from '@/components/expression-editor/utils';
import { Label } from '@/components/ui/label';

interface SliderNumericProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const SliderNumeric: React.FC<SliderNumericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();


    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const sliderCompIndex = rg.items.findIndex(comp => comp.role === 'sliderNumeric');
    if (sliderCompIndex === undefined || sliderCompIndex === -1) {
        return <p>Slider not found</p>;
    }


    const sliderComp = rg.items[sliderCompIndex] as ItemGroupComponent;
    if (!sliderComp) {
        return <p>Slider not found</p>;
    }

    const currentLabel = localisedObjectToMap(sliderComp.content).get(selectedLanguage) || '';
    const currentPlaceholder = localisedObjectToMap(sliderComp.description).get(selectedLanguage) || '';
    const currentMin = sliderComp.properties?.min as ExpressionArg | undefined;
    const currentMax = sliderComp.properties?.max as ExpressionArg | undefined;
    const currentStep = sliderComp.properties?.stepSize as ExpressionArg | undefined;

    const onChange = (newComp: ItemComponent) => {
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[sliderCompIndex] = newComp;
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
        <div className='space-y-4'>
            <div>
                <Label htmlFor={props.surveyItem.key + 'label'}>
                    Label
                </Label>
                <Input
                    id={props.surveyItem.key + 'label'}
                    className='form-control mt-2'
                    type="text"
                    placeholder="Enter label for selected language..."
                    value={currentLabel}
                    onChange={(e) => {
                        const updatedComponent = { ...sliderComp };
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);

                        sliderComp.content = generateLocStrings(updatedContent);
                        onChange(sliderComp);
                    }}
                />
            </div>
            <div>
                <Label htmlFor={props.surveyItem.key + 'placeholder'}>
                    Placeholder text
                </Label>
                <Input
                    id={props.surveyItem.key + 'placeholder'}
                    className='form-control mt-2'
                    type="text"
                    placeholder="Enter placeholder text..."
                    value={currentPlaceholder}
                    onChange={(e) => {
                        const updatedComponent = { ...sliderComp };
                        const updatedContent = localisedObjectToMap(updatedComponent.description);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.description = generateLocStrings(updatedContent);

                        sliderComp.description = generateLocStrings(updatedContent);
                        onChange(sliderComp);
                    }}
                />
            </div>

            <ExpArgEditorForNum
                label='Min'
                expArg={currentMin as ExpArg}
                onChange={(argValue) => {
                    const currentData = sliderComp.properties || {};
                    currentData.min = argValue as ExpressionArg;
                    sliderComp.properties = {
                        ...currentData,
                    }
                    onChange(sliderComp);
                }}
            />

            <ExpArgEditorForNum
                label='Max'
                expArg={currentMax as ExpArg}
                onChange={(argValue) => {
                    const currentData = sliderComp.properties || {};
                    currentData.max = argValue as ExpressionArg;
                    sliderComp.properties = {
                        ...currentData,
                    }
                    onChange(sliderComp);
                }}
            />

            <ExpArgEditorForNum
                label='Step size'
                expArg={currentStep as ExpArg}
                onChange={(argValue) => {
                    const currentData = sliderComp.properties || {};
                    currentData.stepSize = argValue as ExpressionArg;
                    sliderComp.properties = {
                        ...currentData,
                    }
                    onChange(sliderComp);
                }}
            />


        </div>
    );
};

export default SliderNumeric;

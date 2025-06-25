import AddDropdown from '@/components/survey-editor/old/components/general/add-dropdown';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { localisedObjectToMap } from '@/components/survey-editor/old/utils/localeUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { CircleHelp, X } from 'lucide-react';
import React from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';

interface ValidatedRandomQuestionProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const ValidatedRandomQuestion: React.FC<ValidatedRandomQuestionProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    const vrqIndex = rg.items.findIndex(comp => comp.role === 'validatedRandomQuestion');
    if (vrqIndex === undefined || vrqIndex === -1) {
        return <p>Response content not found</p>;
    }

    const vrqDef = (rg.items[vrqIndex] as ItemGroupComponent);

    const onUpdateWithNewResponseComponents = (newVrqDef: ItemGroupComponent) => {
        const newRg = {
            ...rg,
            items: rg.items.map(comp => {
                if (comp.role === 'validatedRandomQuestion') {
                    return newVrqDef;
                }
                return comp;
            }),
        };

        const existingComponents = props.surveyItem.components?.items || [];
        existingComponents[rgIndex] = newRg;

        const newSurveyItem = {
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components as ItemGroupComponent,
                items: existingComponents,
            }
        }
        props.onUpdateSurveyItem(newSurveyItem);
    }

    const renderQuestionListEditor = () => {
        const questionPool = (vrqDef.items.find(comp => comp.role === 'questionPool') as ItemGroupComponent)?.items || [];

        const updateQuestionPool = (newQuestionPool: Array<ItemComponent>) => {
            const items = vrqDef.items.map(comp => {
                if (comp.role === 'questionPool') {
                    return {
                        ...comp,
                        items: newQuestionPool,
                    }
                }
                return comp;
            })
            if (!vrqDef.items.find(comp => comp.role === 'questionPool')) {
                items.push({
                    key: 'questionPool',
                    role: 'questionPool',
                    items: questionPool,
                })
            }
            onUpdateWithNewResponseComponents({
                ...vrqDef,
                items,
            });
        }

        return <div className='flex flex-col'>
            <p className='font-semibold mb-2'>Question pool: <span className='text-muted-foreground'>({questionPool.length})</span></p>

            <ol className='space-y-4'>
                {questionPool.map((question, index) => {
                    const label = localisedObjectToMap(question.content).get(selectedLanguage) || '';
                    const placeholder = localisedObjectToMap(question.description).get(selectedLanguage) || '';

                    const acceptedAnswerComps = (question as ItemGroupComponent).items || [];
                    const acceptedAnswers = (acceptedAnswerComps.map(comp => localisedObjectToMap(comp.content).get(selectedLanguage))).join('\n');

                    return <li key={index}
                        className='border border-neutral-300 p-2 rounded-md space-y-4'
                    >
                        <div className='space-y-1.5'>
                            <Label
                                htmlFor={index + 'label'}
                            >
                                Label
                            </Label>
                            <Input
                                id={index + 'label'}
                                value={label}
                                onChange={(e) => {
                                    const updatedComponent = { ...question };
                                    const updatedContent = localisedObjectToMap(updatedComponent.content);
                                    updatedContent.set(selectedLanguage, e.target.value);
                                    updatedComponent.content = generateLocStrings(updatedContent);

                                    questionPool.splice(index, 1, updatedComponent);

                                    updateQuestionPool(questionPool);
                                }}
                                placeholder='Enter label...'
                            />
                        </div>

                        <div className='space-y-1.5'>
                            <Label
                                htmlFor={index + 'placeholder'}
                            >
                                Placeholder
                            </Label>
                            <Input
                                id={index + 'placeholder'}
                                value={placeholder}
                                onChange={(e) => {
                                    const updatedComponent = { ...question };
                                    const updatedContent = localisedObjectToMap(updatedComponent.description);
                                    updatedContent.set(selectedLanguage, e.target.value);
                                    updatedComponent.description = generateLocStrings(updatedContent);

                                    questionPool.splice(index, 1, updatedComponent);

                                    updateQuestionPool(questionPool);
                                }}
                                placeholder='Placeholder text...'
                            />
                        </div>

                        <div className='space-y-1.5'>
                            <Label
                                htmlFor={index + 'responses'}
                            >
                                Accepted responses (one per line, ignores letter case)
                            </Label>
                            <Textarea
                                id={index + 'responses'}
                                value={acceptedAnswers}
                                onChange={(e) => {
                                    const updatedComponent = { ...question } as ItemGroupComponent;

                                    const updatedAcceptedAnswers = e.target.value.split('\n');
                                    updatedComponent.items = updatedAcceptedAnswers.map((a, i) => {
                                        const item = acceptedAnswerComps.length < i + 1 ? {
                                            key: i.toString(),
                                            role: 'answer',
                                            content: generateLocStrings(new Map([[selectedLanguage, a]]))
                                        } : {
                                            ...acceptedAnswerComps[i],
                                        }

                                        const updatedContent = localisedObjectToMap(item.content);
                                        updatedContent.set(selectedLanguage, a);
                                        item.content = generateLocStrings(updatedContent);
                                        return item;

                                    })

                                    questionPool.splice(index, 1, updatedComponent);

                                    updateQuestionPool(questionPool);
                                }}
                                placeholder='Enter responses...'
                            />
                        </div>

                        <div className='flex justify-center'>
                            <Button
                                size={'sm'}
                                variant={'ghost'}
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this question?')) {
                                        questionPool.splice(index, 1);
                                        updateQuestionPool(questionPool);
                                    }
                                }}
                            >
                                <span>Remove question</span>
                                <X className='size-4 ms-2' />
                            </Button>
                        </div>
                    </li>
                })}

            </ol>
            <div className='flex justify-center mt-4'>
                <AddDropdown
                    onAddItem={(type) => {
                        if (type === 'question') {
                            const newQuestion: ItemComponent = {
                                key: questionPool.length.toString(),
                                role: 'question',
                            }
                            questionPool.push(newQuestion);
                        }
                        updateQuestionPool(questionPool);

                    }}
                    options={[
                        { key: 'question', label: 'Question', icon: <CircleHelp className='size-4 me-2 text-muted-foreground' /> },
                    ]}
                />
            </div>
        </div>
    }

    const renderButtonLabelEditor = () => {
        let buttonLabelComp = vrqDef.items.find(comp => comp.role === 'buttonLabel');

        const buttonLabel = localisedObjectToMap(buttonLabelComp?.content);


        return <div>
            <div className='space-y-1.5'>
                <Label
                    htmlFor={'button-label'}
                >
                    Request new question button label
                </Label>
                <Input
                    id={'button-label'}
                    value={buttonLabel.get(selectedLanguage) || ''}
                    onChange={(e) => {
                        buttonLabel.set(selectedLanguage, e.target.value);

                        const newVRQDef = {
                            ...vrqDef,
                        }

                        if (!buttonLabelComp) {
                            buttonLabelComp = {
                                key: Math.random().toString(36).substring(9),
                                role: 'buttonLabel',
                                content: generateLocStrings(buttonLabel),
                            }
                            newVRQDef.items.push(buttonLabelComp);
                        } else {
                            buttonLabelComp.content = generateLocStrings(buttonLabel);
                            newVRQDef.items = newVRQDef.items.map(comp => {
                                if (comp.role === 'buttonLabel') {
                                    return buttonLabelComp!;
                                }
                                return comp;
                            })
                        }
                        onUpdateWithNewResponseComponents(newVRQDef);
                    }}
                    placeholder='Button label for the selected language...'
                />
            </div>
        </div>
    }


    return (
        <div className='space-y-6'>
            {renderQuestionListEditor()}

            {renderButtonLabelEditor()}
        </div>
    );
};

export default ValidatedRandomQuestion;

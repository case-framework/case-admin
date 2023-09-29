import React from 'react';
import GenericQuestionPropEditor from '../specific-editors/GenericQuestionPropEditor';
import { SurveyItems } from 'case-editor-tools/surveys/survey-items';
import { BsBraces } from 'react-icons/bs';
import { ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import { surveyItemToGenericProps } from '../utils';
import MonacoResponseGroupContentEditor from '../specific-editors/MonacoResponseGroupContentEditor';
import { SimpleQuestionEditor } from 'case-editor-tools/surveys/utils/simple-question-editor';
import { generateHelpGroupComponent, generateTitleComponent } from 'case-editor-tools/surveys/utils/simple-generators';
import { ComponentGenerators } from 'case-editor-tools/surveys/utils/componentGenerators';

interface MatrixAttributeEditorProps {
    surveyItem: SurveySingleItem;
    onItemChange: (item: SurveySingleItem) => void;
}


const MatrixAttributeEditor: React.FC<MatrixAttributeEditorProps> = ({
    surveyItem,
    onItemChange,
}) => {

    // console.log(surveyItem)
    const itemProps = surveyItemToGenericProps(surveyItem);
    // console.log(itemProps);

    const mainResponseSlot = surveyItem.components?.items.find(i => i.role === 'responseGroup');

    return (<>
        <p className='font-bold py-2 my-2'>
            <span className='me-1 font-normal text-tiny block'>
                Type:
            </span>
            Matrix
        </p>
        <GenericQuestionPropEditor
            genericProps={
                itemProps
            }
            specificEditGroup={
                {
                    key: 'body',
                    title: 'Response options',
                    icon: <BsBraces />,
                    content: (
                        <MonacoResponseGroupContentEditor
                            itemComponent={mainResponseSlot ? { ...(mainResponseSlot as ItemGroupComponent).items[0] } : { key: 'mat', role: 'matrix', items: [] }}
                            onChange={(newItemComponent) => {
                                if (!surveyItem || !surveyItem.components) {
                                    console.warn('no survey item or components when trying to save response group content')
                                    return;
                                }
                                const rgI = surveyItem.components?.items.findIndex(i => i.role === 'responseGroup');
                                if (rgI < 0) {
                                    surveyItem.components?.items.push({
                                        key: 'rg',
                                        role: 'responseGroup',
                                        items: [
                                            newItemComponent,
                                        ],
                                    });
                                } else {
                                    (surveyItem.components.items[rgI] as ItemGroupComponent).items = [
                                        { ...newItemComponent },
                                    ]

                                }
                                onItemChange({
                                    ...surveyItem,
                                })
                            }}
                        />
                    )
                }
            }
            onChange={(newProps) => {
                const simpleEditor = new SimpleQuestionEditor(newProps.parentKey, newProps.itemKey, newProps.confidentialMode, newProps.metadata);

                // QUESTION TEXT
                simpleEditor.setTitle(newProps.questionText, newProps.questionSubText, newProps.titleClassName);
                if (newProps.condition) {
                    simpleEditor.setCondition(newProps.condition);
                }


                if (newProps.helpGroupContent) {
                    simpleEditor.editor.setHelpGroupComponent(
                        generateHelpGroupComponent(newProps.helpGroupContent)
                    )
                }

                if (newProps.topDisplayCompoments) {
                    newProps.topDisplayCompoments.forEach(comp => simpleEditor.addDisplayComponent(comp))
                }
                const rg = surveyItem.components?.items.find(i => i.role === 'responseGroup');
                if (rg && (rg as ItemGroupComponent).items && (rg as ItemGroupComponent).items.length > 0) {
                    simpleEditor.setResponseGroupWithContent((rg as ItemGroupComponent).items[0]);
                }


                if (newProps.bottomDisplayCompoments) {
                    newProps.bottomDisplayCompoments.forEach(comp => simpleEditor.addDisplayComponent(comp))
                }

                if (newProps.isRequired) {
                    simpleEditor.addHasResponseValidation();
                }
                if (newProps.customValidations) {
                    newProps.customValidations.forEach(v => simpleEditor.editor.addValidation(v));
                }

                if (newProps.footnoteText) {
                    simpleEditor.addDisplayComponent(ComponentGenerators.footnote({ content: newProps.footnoteText }))
                }

                onItemChange(simpleEditor.getItem() as SurveySingleItem)

                // TODO
                /*
                                const newItem = SurveyItems.customQuestion ({
                                    ...newProps,

                                }) as SurveySingleItem;

                                // keep response group
                                const rg = surveyItem.components?.items.find(i => i.role === 'responseGroup');

                                const rgIndex = (newItem as SurveySingleItem).components?.items.findIndex(i => i.role === 'responseGroup');

                                if (rgIndex && rg && newItem.components !== undefined) {
                                    newItem.components.items[rgIndex] = rg;
                                }

                                onItemChange({
                                    ...newItem,
                                });*/
            }}
        />
    </>
    );
};

export default MatrixAttributeEditor;

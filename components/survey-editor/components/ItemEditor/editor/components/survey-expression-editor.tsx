import ExpArgEditor from "@/components/expression-editor/exp-arg-editor";
import { ContextArrayItem, ExpArg, Expression } from "@/components/expression-editor/utils";
import { Survey, SurveyItem, SurveySingleItem, isSurveyGroupItem } from "survey-engine/data_types";
import { ItemComponent } from "survey-engine/data_types";
import { isItemGroupComponent } from "survey-engine/data_types";
import { ItemGroupComponent } from "survey-engine/data_types";
import { supportedBuiltInSlotTypes, surveyEngineRegistry, surveyExpressionCategories } from '@/components/expression-editor/registries/surveyEngineRegistry';
import { useSurveyEditorCtx } from "@/components/survey-editor/surveyEditorContext";
import { Expression as CaseExpression } from 'survey-engine/data_types';
import React from "react";

interface SurveyExpressionEditorProps {
    label: string;
    expression?: CaseExpression;
    onChange: (expression?: CaseExpression) => void;
}

export function extractSurveyKeys(surveyData?: Survey): {
    singleChoiceKeys: ContextArrayItem[];
    multipleChoiceKeys: ContextArrayItem[];
    allItemKeys: ContextArrayItem[];
} {
    const singleChoiceKeys: ContextArrayItem[] = [];
    const multipleChoiceKeys: ContextArrayItem[] = [];
    const allItemKeys: ContextArrayItem[] = [];

    if (!surveyData) return {
        singleChoiceKeys,
        multipleChoiceKeys,
        allItemKeys
    };

    /**
     * Helper function to recursively process survey items
     * @param item - A survey item that might contain components or nested items
     */
    function processSurveyItem(item: SurveyItem): void {
        // Skip if no items property
        if (!isSurveyGroupItem(item)) return;

        // Process each item in the array
        item.items.forEach((subItem: SurveyItem) => {
            // Process sub-items if they exist
            if (isSurveyGroupItem(subItem)) {
                processSurveyItem(subItem);
            } else {
                // Add item key to allItemKeys if it exists
                if (subItem.key) {
                    allItemKeys.push({
                        key: subItem.key,
                        label: subItem.key,
                        // TODO: extract question type
                    });
                }
                // Check if this item has a key and contains components
                if (subItem.key && (subItem as SurveySingleItem).components) {
                    const itemKey = subItem.key;
                    processComponents(itemKey, subItem.components);
                }
            }
        });
    }

    /**
     * Helper function to process components
     * @param itemKey - The parent item key
     * @param components - The components object to process
     */
    function processComponents(itemKey: string, components: ItemGroupComponent | undefined): void {

        if (!components || !isItemGroupComponent(components)) return;

        components.items.forEach((component: ItemComponent) => {
            // Check if the component is a responseGroup
            if (component.role === 'responseGroup') {
                (component as ItemGroupComponent).items.forEach((responseItem: ItemComponent) => {
                    // Process single choice groups
                    if (responseItem.role === 'singleChoiceGroup' ||
                        responseItem.role === 'multipleChoiceGroup'
                    ) {
                        (responseItem as ItemGroupComponent).items.forEach((option: ItemComponent) => {
                            let type = 'without-value';
                            if (option.role === 'input' || option.role === 'dateInput' || option.role === 'timeInput' || option.role === 'numberInput') {
                                type = 'with-value';
                            }
                            // Only include options, not other components like dateInput
                            const v = `${itemKey}-${option.key}`;

                            if (responseItem.role === 'singleChoiceGroup') {
                                singleChoiceKeys.push({
                                    key: v,
                                    label: v,
                                    type: type
                                });
                            } else if (responseItem.role === 'multipleChoiceGroup') {
                                multipleChoiceKeys.push({
                                    key: v,
                                    label: v,
                                    type: type
                                });
                            }
                        });
                    }
                });
            }

        });
    }

    // Start processing from the survey definition
    if (surveyData.surveyDefinition && surveyData.surveyDefinition.items) {
        processSurveyItem(surveyData.surveyDefinition);
    }

    return {
        singleChoiceKeys,
        multipleChoiceKeys,
        allItemKeys: Array.from(allItemKeys)
    };
}

const SurveyExpressionEditor: React.FC<SurveyExpressionEditorProps> = (props) => {
    const { survey } = useSurveyEditorCtx();

    const { singleChoiceKeys, multipleChoiceKeys, allItemKeys } = extractSurveyKeys(survey);
    const [isHidden, setIsHidden] = React.useState(false);


    return <ExpArgEditor
        availableExpData={props.expression ?
            [
                { dtype: 'exp', exp: props.expression as Expression }
            ] : []}
        availableMetadata={{
            slotTypes: props.expression ? [props.expression.name] : []
        }}
        expRegistry={{
            expressionDefs: surveyEngineRegistry,
            builtInSlotTypes: supportedBuiltInSlotTypes,
            categories: surveyExpressionCategories,
        }}
        context={{
            singleChoiceOptions: singleChoiceKeys,
            multipleChoiceOptions: multipleChoiceKeys,
            allItemKeys: allItemKeys,
            dateUnitPicker: [
                { key: 'years', label: 'Years' },
                { key: 'months', label: 'Months' },
                { key: 'days', label: 'Days' },
                { key: 'hours', label: 'Hours' },
                { key: 'minutes', label: 'Minutes' },
                { key: 'seconds', label: 'Seconds' },
            ],
        }}
        currentIndex={0}
        slotDef={{
            label: props.label,
            required: false,
            allowedTypes: [
                {
                    id: 'exp-slot',
                    type: 'expression',
                    allowedExpressionTypes: ['boolean']
                }
            ],

        }}
        onChange={(newArgs,) => {
            if (!newArgs || newArgs.length < 1 || newArgs[0] === undefined) {

                props.onChange(undefined)
            } else {
                props.onChange((newArgs[0] as ExpArg).exp as CaseExpression);
            }
        }}
        isHidden={isHidden}
        onToggleHide={setIsHidden}
    />
}

export default SurveyExpressionEditor;
import { ItemComponent, SurveyItem, SurveySingleItem, ItemGroupComponent, isItemGroupComponent, LocalizedObject, ComponentProperties, Expression, ConfidentialMode } from "survey-engine/data_types"
import { ItemComponentRole } from "../../../types"
import { ItemTypeKey, getParentKeyFromFullKey } from "@/components/survey-editor/utils/utils";
import { generateNewItemForType } from "@/components/survey-editor/utils/new-item-init";

export enum SurveyItemFeatures {
    EditorItemColor = 'editorItemColor',
    ComponentOrdering = 'componentOrdering',
    Title = 'title',
    Subtitle = 'subtitle',
    HelpGroup = 'helpGroup',
    TopContent = 'topContent',
    BottomContent = 'bottomContent',
    Footnote = 'footnote',
    DisplayCondition = 'displayCondition',
    ResponseGroup = 'responseGroup',
    MarkdownTexts = 'markdownTexts',
    ErrorTexts = 'errorTexts',
    WarningTexts = 'warningTexts',
    SimpleTexts = 'simpleTexts',
    ChoiceOptions = 'choiceOptions',
    ChoiceRows = 'choiceRows',
    InputLabel = 'inputLabel',
    InputPlaceholder = 'inputPlaceholder',
    InputProperties = 'inputProperties',
    InputStyling = 'inputStyling',
    ValidationRules = 'validationRules',
    ConfidentialityMode = 'confidentialityMode',
}

export const surveyItemFeaturesLabels: Record<SurveyItemFeatures, string> = {
    [SurveyItemFeatures.Title]: 'Title',
    [SurveyItemFeatures.Subtitle]: 'Subtitle',
    [SurveyItemFeatures.TopContent]: 'Top Content',
    [SurveyItemFeatures.BottomContent]: 'Bottom Content',
    [SurveyItemFeatures.Footnote]: 'Footnote',
    [SurveyItemFeatures.HelpGroup]: 'Help Group',
    [SurveyItemFeatures.EditorItemColor]: 'Editor Item Color',
    [SurveyItemFeatures.ComponentOrdering]: 'Component Ordering',
    [SurveyItemFeatures.DisplayCondition]: 'Display Condition',
    [SurveyItemFeatures.ResponseGroup]: 'Response Options',
    [SurveyItemFeatures.MarkdownTexts]: 'Markdown Text',
    [SurveyItemFeatures.ErrorTexts]: 'Error Texts',
    [SurveyItemFeatures.WarningTexts]: 'Warning Texts',
    [SurveyItemFeatures.SimpleTexts]: 'Simple Texts',
    [SurveyItemFeatures.ChoiceOptions]: "Choice Options",
    [SurveyItemFeatures.ChoiceRows]: "Choice Rows",
    [SurveyItemFeatures.InputLabel]: "Input Label",
    [SurveyItemFeatures.InputPlaceholder]: "Input Placeholder",
    [SurveyItemFeatures.InputProperties]: "Input Properties (Min/Max/Step)",
    [SurveyItemFeatures.InputStyling]: "Input Styling (Width)",
    [SurveyItemFeatures.ValidationRules]: "Validation Rules",
    [SurveyItemFeatures.ConfidentialityMode]: "Confidentiality Mode",
}

export const surveyItemFeaturesList: () => Array<SurveyItemFeatures> = () => Object.values(SurveyItemFeatures);

export const possibleSurveyItemFeatureConversions: Record<SurveyItemFeatures, SurveyItemFeatures[]> = {
    [SurveyItemFeatures.Title]: [SurveyItemFeatures.Title, SurveyItemFeatures.Subtitle, SurveyItemFeatures.Footnote],
    [SurveyItemFeatures.Subtitle]: [SurveyItemFeatures.Subtitle, SurveyItemFeatures.Title, SurveyItemFeatures.Footnote],
    [SurveyItemFeatures.TopContent]: [SurveyItemFeatures.TopContent, SurveyItemFeatures.BottomContent],
    [SurveyItemFeatures.BottomContent]: [SurveyItemFeatures.BottomContent, SurveyItemFeatures.TopContent],
    [SurveyItemFeatures.Footnote]: [SurveyItemFeatures.Footnote, SurveyItemFeatures.Title, SurveyItemFeatures.Subtitle],
    [SurveyItemFeatures.HelpGroup]: [SurveyItemFeatures.HelpGroup],
    [SurveyItemFeatures.EditorItemColor]: [SurveyItemFeatures.EditorItemColor],
    [SurveyItemFeatures.ComponentOrdering]: [SurveyItemFeatures.ComponentOrdering],
    [SurveyItemFeatures.DisplayCondition]: [SurveyItemFeatures.DisplayCondition],
    [SurveyItemFeatures.ResponseGroup]: [SurveyItemFeatures.ResponseGroup],
    [SurveyItemFeatures.MarkdownTexts]: [SurveyItemFeatures.MarkdownTexts],
    [SurveyItemFeatures.ErrorTexts]: [SurveyItemFeatures.ErrorTexts],
    [SurveyItemFeatures.WarningTexts]: [SurveyItemFeatures.WarningTexts],
    [SurveyItemFeatures.SimpleTexts]: [SurveyItemFeatures.SimpleTexts],
    [SurveyItemFeatures.ChoiceOptions]: [SurveyItemFeatures.ChoiceOptions],
    [SurveyItemFeatures.ChoiceRows]: [SurveyItemFeatures.ChoiceRows],
    [SurveyItemFeatures.InputLabel]: [SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder, SurveyItemFeatures.Title, SurveyItemFeatures.Subtitle, SurveyItemFeatures.Footnote],
    [SurveyItemFeatures.InputPlaceholder]: [SurveyItemFeatures.InputPlaceholder, SurveyItemFeatures.InputLabel, SurveyItemFeatures.Title, SurveyItemFeatures.Subtitle, SurveyItemFeatures.Footnote],
    [SurveyItemFeatures.InputProperties]: [SurveyItemFeatures.InputProperties],
    [SurveyItemFeatures.InputStyling]: [SurveyItemFeatures.InputStyling],
    [SurveyItemFeatures.ValidationRules]: [SurveyItemFeatures.ValidationRules],
    [SurveyItemFeatures.ConfidentialityMode]: [SurveyItemFeatures.ConfidentialityMode],
}

const commonSurveyItemFeatures = [
    SurveyItemFeatures.Title,
    SurveyItemFeatures.Subtitle,
    SurveyItemFeatures.TopContent,
    SurveyItemFeatures.BottomContent,
    SurveyItemFeatures.Footnote,
    SurveyItemFeatures.HelpGroup,
    SurveyItemFeatures.DisplayCondition,
    SurveyItemFeatures.ResponseGroup,
    SurveyItemFeatures.ValidationRules,
    SurveyItemFeatures.ConfidentialityMode,
];

export const supportedSurveyItemFeaturesByType: Record<ItemTypeKey, SurveyItemFeatures[]> = {
    'custom': [],
    'pageBreak': [],
    'surveyEnd': [],
    'group': [SurveyItemFeatures.ComponentOrdering, SurveyItemFeatures.DisplayCondition],
    'display': [SurveyItemFeatures.DisplayCondition, SurveyItemFeatures.MarkdownTexts, SurveyItemFeatures.ErrorTexts, SurveyItemFeatures.WarningTexts, SurveyItemFeatures.SimpleTexts, SurveyItemFeatures.ConfidentialityMode],
    'singleChoice': [...commonSurveyItemFeatures, SurveyItemFeatures.ChoiceOptions],
    'multipleChoice': [...commonSurveyItemFeatures, SurveyItemFeatures.ChoiceOptions],
    'dropdown': [...commonSurveyItemFeatures, SurveyItemFeatures.ChoiceOptions, SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder],
    'textInput': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder, SurveyItemFeatures.InputStyling],
    'timeInput': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel],
    'dateInput': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder],
    'numericInput': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder, SurveyItemFeatures.InputProperties, SurveyItemFeatures.InputStyling],
    'sliderNumeric': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel, SurveyItemFeatures.InputPlaceholder, SurveyItemFeatures.InputProperties],
    'codeValidator': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel],
    'matrix': [...commonSurveyItemFeatures],
    'responsiveMatrix': [...commonSurveyItemFeatures],
    'responsiveBipolarLikertScaleArray': [...commonSurveyItemFeatures, SurveyItemFeatures.ChoiceOptions, SurveyItemFeatures.ChoiceRows],
    'responsiveSingleChoiceArray': [...commonSurveyItemFeatures, SurveyItemFeatures.ChoiceOptions, SurveyItemFeatures.ChoiceRows],
    'clozeQuestion': [...commonSurveyItemFeatures],
    'consent': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel],
    'validatedRandomQuestion': [...commonSurveyItemFeatures],
    'contact': [...commonSurveyItemFeatures, SurveyItemFeatures.InputLabel],
}

const topBottomContentRoles = [ItemComponentRole.TextContent, ItemComponentRole.Warning, ItemComponentRole.Error, ItemComponentRole.Markdown];


const findItemComponentsWithRole = (surveyItem: SurveySingleItem, role: ItemComponentRole): ItemComponent[] => {
    if (surveyItem.components !== undefined && surveyItem.components.items.length > 0) {
        const matches = surveyItem.components.items.filter(item => {
            return item.role === role;
        });
        return matches;
    } else {
        return [];
    }
}

const applyItemComponentByRole = (surveyItem: SurveySingleItem, role: ItemComponentRole, newComponent: ItemComponent) => {
    if (surveyItem.components !== undefined && surveyItem.components.items.length > 0) {
        let overwrite = false;
        surveyItem.components.items = surveyItem.components.items.map(item => {
            if (item.role === role) {
                overwrite = true;
                return newComponent;
            } else {
                return item;
            }
        });
        if (!overwrite) {
            surveyItem.components.items.push(newComponent);
        }
    } else {
        surveyItem.components = {
            items: [newComponent],
            role: ItemComponentRole.Root,
        };
    }
    return surveyItem;
}

const findTextContent = (surveyItem: SurveySingleItem, textType: SurveyItemFeatures.TopContent | SurveyItemFeatures.BottomContent): ItemComponent[] => {
    if (surveyItem.components !== undefined && surveyItem.components.items.length > 0) {
        const rgIndex = surveyItem.components.items.findIndex(item => {
            return item.role === ItemComponentRole.ResponseGroup;
        });
        if (rgIndex === -1) {
            return [];
        }
        const beforeResponseGroup = surveyItem.components.items.slice(0, rgIndex);
        const afterResponseGroup = surveyItem.components.items.slice(rgIndex + 1);
        const relevantGroupSlice = textType === SurveyItemFeatures.TopContent ? beforeResponseGroup : afterResponseGroup;
        return relevantGroupSlice.filter(item => {
            return topBottomContentRoles.includes(item.role as ItemComponentRole);
        });
    } else {
        return [];
    }
}

const applyTextContent = (targetItem: SurveySingleItem, textType: SurveyItemFeatures.TopContent | SurveyItemFeatures.BottomContent, sourceItem: SurveySingleItem): SurveySingleItem => {
    const textContent = surveyItemFeatureLookup[textType](sourceItem);
    if (targetItem.components !== undefined && targetItem.components.items.length > 0) {
        const rgIndex = targetItem.components.items.findIndex(item => {
            return item.role === ItemComponentRole.ResponseGroup;
        });
        let beforeResponseGroup = targetItem.components.items.slice(0, rgIndex);
        const rg = targetItem.components.items[rgIndex];
        let afterResponseGroup = targetItem.components.items.slice(rgIndex + 1);
        if (textType === SurveyItemFeatures.TopContent) {
            beforeResponseGroup = beforeResponseGroup.filter(item => {
                return !topBottomContentRoles.includes(item.role as ItemComponentRole);
            });
            beforeResponseGroup.push(...textContent);
        }
        if (textType === SurveyItemFeatures.BottomContent) {
            afterResponseGroup = afterResponseGroup.filter(item => {
                return !topBottomContentRoles.includes(item.role as ItemComponentRole);
            });
            afterResponseGroup.push(...textContent);
        }
        return {
            ...targetItem,
            components: {
                ...targetItem.components,
                items: [
                    ...beforeResponseGroup,
                    rg,
                    ...afterResponseGroup,
                ],
            },
        } as SurveyItem;
    } else {
        return targetItem;
    }
}

const findComponentGroup = (surveyItem: SurveySingleItem): ItemGroupComponent | undefined => {
    if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
        return surveyItem.components;
    } else {
        return undefined;
    }
}

const findOptions = (surveyItem: SurveySingleItem): ItemComponent[] | undefined => {
    const rg = findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup);
    const firstRg = rg != undefined ? (Array.isArray(rg) ? rg[0] : rg) as ItemGroupComponent : undefined;
    if (firstRg !== undefined && firstRg.items !== undefined && firstRg.items.length > 0) {
        // Find the first choice group or dropdown group
        const cg = firstRg.items.find(item => {
            return item.role === ItemComponentRole.SingleChoiceGroup || item.role === ItemComponentRole.MultipleChoiceGroup || item.role === ItemComponentRole.DropdownGroup;
        });
        if (cg != undefined && isItemGroupComponent(cg)) {
            return cg.items;
        }

        // If no choice group found, check for responsive single choice or bipolar likert scale array
        const sg = firstRg.items.find(item => {
            return item.role === ItemComponentRole.ResponsiveSingleChoiceArray || item.role === ItemComponentRole.ResponsiveBipolarLikertScaleArray;
        });
        if (sg != undefined && isItemGroupComponent(sg)) {
            const options = sg.items.find(i => i.role === ItemComponentRole.Options) as ItemGroupComponent | undefined;
            return options ? options.items : [];
        }

    }
    return undefined;
}

const findRows = (surveyItem: SurveySingleItem): ItemComponent[] | undefined => {
    const rg = findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup);
    const firstRg = rg != undefined ? (Array.isArray(rg) ? rg[0] : rg) as ItemGroupComponent : undefined;
    if (firstRg !== undefined && firstRg.items !== undefined && firstRg.items.length > 0) {
        const sg = firstRg.items.find(item => {
            return item.role === ItemComponentRole.ResponsiveSingleChoiceArray || item.role === ItemComponentRole.ResponsiveBipolarLikertScaleArray;
        });
        if (sg != undefined && isItemGroupComponent(sg)) {
            const rows = sg.items.filter(i => i.role === ItemComponentRole.Row) as ItemComponent[];
            return rows;
        }

    }
    return undefined;
}

const findInputLabel = (surveyItem: SurveySingleItem): LocalizedObject[] | undefined => {
    const rgs = findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup);
    for (const rg of rgs) {
        if (isItemGroupComponent(rg) && rg.items.some((i) => i.content != undefined)) {
            return rg.items.find(i => i.content != undefined)?.content;
        }
    }
    return undefined;
}

const findInputPlaceholder = (surveyItem: SurveySingleItem): LocalizedObject[] | undefined => {
    const rgs = findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup);
    for (const rg of rgs) {
        if (isItemGroupComponent(rg) && rg.items.some((i) => i.description != undefined)) {
            return rg.items.find(i => i.description != undefined)?.description;
        }
    }
    return undefined;
}

const findInputProperties = (surveyItem: SurveySingleItem): ComponentProperties | undefined => {
    const rgs = findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup);
    for (const rg of rgs) {
        if (isItemGroupComponent(rg) && rg.items.some((i) => i.properties != undefined)) {
            return rg.items.find(i => i.properties != undefined)?.properties;
        }
    }
    return undefined;
}

const findInputStyling = (surveyItem: SurveySingleItem) => {
    const rgs = findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup);
    for (const rg of rgs) {
        if (isItemGroupComponent(rg) && rg.items.some((i) => i.style != undefined)) {
            return rg.items.find(i => i.style != undefined)?.style;
        }
    }
    return undefined;
}

const findConfidentialityMode = (surveyItem: SurveySingleItem): ConfidentialMode | undefined => surveyItem.confidentialMode;
const findValidationRules = (surveyItem: SurveySingleItem) => surveyItem.validations;

const applyConfidentialityMode = (surveyItem: SurveySingleItem, sourceItem: SurveyItem): SurveySingleItem => {
    const mode = findConfidentialityMode(sourceItem as SurveySingleItem);
    if (mode !== undefined) {
        return {
            ...surveyItem,
            confidentialMode: mode,
        };
    } else {
        return surveyItem;
    }
}

const applyValidationRules = (surveyItem: SurveySingleItem, sourceItem: SurveyItem): SurveySingleItem => {
    const rules = findValidationRules(sourceItem as SurveySingleItem);
    if (rules !== undefined) {
        return {
            ...surveyItem,
            validations: rules,
        };
    } else {
        return surveyItem;
    }
}


export const surveyItemFeatureLookup = {
    [SurveyItemFeatures.Title]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Title),
    [SurveyItemFeatures.Subtitle]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Subtitle),
    [SurveyItemFeatures.TopContent]: (surveyItem: SurveyItem) => findTextContent(surveyItem, SurveyItemFeatures.TopContent),
    [SurveyItemFeatures.BottomContent]: (surveyItem: SurveyItem) => findTextContent(surveyItem, SurveyItemFeatures.BottomContent),
    [SurveyItemFeatures.Footnote]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Footnote),
    [SurveyItemFeatures.HelpGroup]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.HelpGroup),
    [SurveyItemFeatures.EditorItemColor]: (surveyItem: SurveyItem) => surveyItem.metadata?.editorItemColor,
    [SurveyItemFeatures.ComponentOrdering]: (surveyItem: SurveyItem) => findComponentGroup(surveyItem)?.order as Expression | undefined,
    [SurveyItemFeatures.DisplayCondition]: (surveyItem: SurveyItem) => surveyItem.condition as Expression || undefined,
    [SurveyItemFeatures.ResponseGroup]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.ResponseGroup),
    [SurveyItemFeatures.MarkdownTexts]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Markdown),
    [SurveyItemFeatures.ErrorTexts]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Error),
    [SurveyItemFeatures.WarningTexts]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.Warning),
    [SurveyItemFeatures.SimpleTexts]: (surveyItem: SurveyItem) => findItemComponentsWithRole(surveyItem, ItemComponentRole.TextContent),
    [SurveyItemFeatures.ChoiceOptions]: (surveyItem: SurveyItem) => findOptions(surveyItem),
    [SurveyItemFeatures.ChoiceRows]: (surveyItem: SurveyItem) => findRows(surveyItem),
    [SurveyItemFeatures.InputLabel]: (surveyItem: SurveyItem) => findInputLabel(surveyItem),
    [SurveyItemFeatures.InputPlaceholder]: (surveyItem: SurveyItem) => findInputPlaceholder(surveyItem),
    [SurveyItemFeatures.InputProperties]: (surveyItem: SurveyItem) => findInputProperties(surveyItem),
    [SurveyItemFeatures.InputStyling]: (surveyItem: SurveyItem) => findInputStyling(surveyItem),
    [SurveyItemFeatures.ValidationRules]: (surveyItem: SurveyItem) => findValidationRules(surveyItem as SurveySingleItem),
    [SurveyItemFeatures.ConfidentialityMode]: (surveyItem: SurveyItem) => findConfidentialityMode(surveyItem as SurveySingleItem),
}

export const applySurveyItemFeature: Record<SurveyItemFeatures, (newSurveyItem: SurveyItem, sourceItem: SurveyItem) => SurveyItem> = {
    [SurveyItemFeatures.Title]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.Title, (surveyItemFeatureLookup[SurveyItemFeatures.Title](sourceItem) as ItemComponent[])[0]),
    [SurveyItemFeatures.Subtitle]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.Subtitle, (surveyItemFeatureLookup[SurveyItemFeatures.Subtitle](sourceItem) as ItemComponent[])[0]),
    [SurveyItemFeatures.TopContent]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyTextContent(surveyItem as SurveySingleItem, SurveyItemFeatures.TopContent, sourceItem as SurveySingleItem),
    [SurveyItemFeatures.BottomContent]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyTextContent(surveyItem as SurveySingleItem, SurveyItemFeatures.BottomContent, sourceItem as SurveySingleItem),
    [SurveyItemFeatures.Footnote]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.Footnote, (surveyItemFeatureLookup[SurveyItemFeatures.Footnote](sourceItem) as ItemComponent[])[0]),
    [SurveyItemFeatures.HelpGroup]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.HelpGroup, (surveyItemFeatureLookup[SurveyItemFeatures.HelpGroup](sourceItem) as ItemComponent[])[0]),
    [SurveyItemFeatures.EditorItemColor]: (surveyItem: SurveyItem, sourceItem: SurveyItem) => {
        surveyItem.metadata = {
            ...surveyItem.metadata,
            editorItemColor: surveyItemFeatureLookup[SurveyItemFeatures.EditorItemColor](sourceItem)!,
        }
        return surveyItem;
    },
    [SurveyItemFeatures.ComponentOrdering]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            const order = surveyItemFeatureLookup[SurveyItemFeatures.ComponentOrdering](sourceItem);
            surveyItem.components.order = order;
            return surveyItem;
        } else {
            return surveyItem;
        }
    },
    [SurveyItemFeatures.DisplayCondition]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        surveyItem.condition = surveyItemFeatureLookup[SurveyItemFeatures.DisplayCondition](sourceItem);
        return surveyItem;
    },
    [SurveyItemFeatures.ResponseGroup]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => applyItemComponentByRole(surveyItem, ItemComponentRole.ResponseGroup, (surveyItemFeatureLookup[SurveyItemFeatures.ResponseGroup](sourceItem) as ItemComponent[])[0]),
    [SurveyItemFeatures.MarkdownTexts]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const markdown = surveyItemFeatureLookup[SurveyItemFeatures.MarkdownTexts](sourceItem);
        if (markdown && surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.filter(item => item.role !== ItemComponentRole.Markdown);
            surveyItem.components.items.push(...markdown);
        }
        return surveyItem;
    },
    [SurveyItemFeatures.ErrorTexts]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const error = surveyItemFeatureLookup[SurveyItemFeatures.ErrorTexts](sourceItem);
        if (error && surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.filter(item => item.role !== ItemComponentRole.Error);
            surveyItem.components.items.push(...error);
        }
        return surveyItem;
    },
    [SurveyItemFeatures.WarningTexts]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const warning = surveyItemFeatureLookup[SurveyItemFeatures.WarningTexts](sourceItem);
        if (warning && surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.filter(item => item.role !== ItemComponentRole.Warning);
            surveyItem.components.items.push(...warning);
        }
        return surveyItem;
    },
    [SurveyItemFeatures.SimpleTexts]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const simpleText = surveyItemFeatureLookup[SurveyItemFeatures.SimpleTexts](sourceItem);
        if (simpleText && surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.filter(item => item.role !== ItemComponentRole.TextContent);
            surveyItem.components.items.push(...simpleText);
        }
        return surveyItem;
    },
    [SurveyItemFeatures.ChoiceOptions]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const options = surveyItemFeatureLookup[SurveyItemFeatures.ChoiceOptions](sourceItem)!;
        const simpleOptions = options.map(option => {
            return {
                role: ItemComponentRole.Option,
                key: option.key,
                content: option.content ?? []
            }
        });
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.map(item => {
                if (item.role === ItemComponentRole.ResponseGroup) {
                    const rg = item as ItemGroupComponent;
                    rg.items = rg.items.map(rgItem => {
                        if (rgItem.role === ItemComponentRole.SingleChoiceGroup || rgItem.role === ItemComponentRole.MultipleChoiceGroup || rgItem.role === ItemComponentRole.DropdownGroup) {
                            const cg = rgItem as ItemGroupComponent;
                            if (rgItem.role === ItemComponentRole.DropdownGroup) {
                                cg.items = simpleOptions;
                            } else {
                                cg.items = options;
                            }
                        } else if (rgItem.role == ItemComponentRole.ResponsiveSingleChoiceArray || rgItem.role == ItemComponentRole.ResponsiveBipolarLikertScaleArray) {
                            const scaleItem = rgItem as ItemGroupComponent;
                            scaleItem.items = scaleItem.items.map(i => {
                                if (i.role === ItemComponentRole.Options) {
                                    (i as ItemGroupComponent).items = simpleOptions;
                                }
                                return i;
                            });
                        }
                        return rgItem;
                    });
                    return rg
                } else {
                    return item;
                }
            });
        }
        return surveyItem;
    },
    [SurveyItemFeatures.ChoiceRows]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const rows = surveyItemFeatureLookup[SurveyItemFeatures.ChoiceRows](sourceItem);
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.map(item => {
                if (item.role === ItemComponentRole.ResponseGroup) {
                    const rg = item as ItemGroupComponent;
                    rg.items = rg.items.map(rgItem => {
                        if (rgItem.role === ItemComponentRole.ResponsiveSingleChoiceArray || rgItem.role === ItemComponentRole.ResponsiveBipolarLikertScaleArray) {
                            const scaleItem = rgItem as ItemGroupComponent;
                            scaleItem.items = scaleItem.items.filter(i => i.role !== ItemComponentRole.Row);
                            if (rows) {
                                if (rgItem.role === ItemComponentRole.ResponsiveBipolarLikertScaleArray) {
                                    const convertedRows = rows.map(row => {
                                        return {
                                            role: ItemComponentRole.Row,
                                            key: row.key,
                                            content: [],
                                            items: [{
                                                role: ItemComponentRole.StartLabel,
                                                content: row.content ?? [],
                                            }, {
                                                role: ItemComponentRole.EndLabel,
                                                content: [],
                                            }],
                                            displayCondition: row.displayCondition,
                                        }
                                    });
                                    scaleItem.items.push(...convertedRows);
                                } else if (rgItem.role === ItemComponentRole.ResponsiveSingleChoiceArray) {
                                    const convertedRows = rows.map(row => {
                                        const groupRow = row as ItemGroupComponent;
                                        const label = groupRow.items.find(i => i.role === ItemComponentRole.StartLabel);
                                        return {
                                            role: ItemComponentRole.Row,
                                            key: row.key,
                                            content: label?.content ?? [],
                                            displayCondition: groupRow.displayCondition,
                                        };
                                    });
                                    scaleItem.items.push(...convertedRows);
                                }
                            }
                        }
                        return rgItem;
                    });
                    return rg
                } else {
                    return item;
                }
            });
        }
        return surveyItem;
    },
    [SurveyItemFeatures.InputLabel]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const label = surveyItemFeatureLookup[SurveyItemFeatures.InputLabel](sourceItem);
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.map(item => {
                if (item.role === ItemComponentRole.ResponseGroup) {
                    const rg = item as ItemGroupComponent;
                    rg.items = rg.items.map(i => {
                        i.content = label;
                        return i;
                    });
                    return rg;
                } else {
                    return item;
                }
            });
        }
        return surveyItem;
    },
    [SurveyItemFeatures.InputPlaceholder]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const placeholder = surveyItemFeatureLookup[SurveyItemFeatures.InputPlaceholder](sourceItem);
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.map(item => {
                if (item.role === ItemComponentRole.ResponseGroup) {
                    const rg = item as ItemGroupComponent;
                    rg.items = rg.items.map(i => {
                        i.description = placeholder;
                        return i;
                    });
                    return rg;
                } else {
                    return item;
                }
            });
        }
        return surveyItem;
    },
    [SurveyItemFeatures.InputProperties]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const properties = surveyItemFeatureLookup[SurveyItemFeatures.InputProperties](sourceItem);
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.map(item => {
                if (item.role === ItemComponentRole.ResponseGroup) {
                    const rg = item as ItemGroupComponent;
                    rg.items = rg.items.map(i => {
                        i.properties = properties;
                        return i;
                    });
                    return rg;
                } else {
                    return item;
                }
            });
        }
        return surveyItem;
    },
    [SurveyItemFeatures.InputStyling]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => {
        const styling = surveyItemFeatureLookup[SurveyItemFeatures.InputStyling](sourceItem);
        if (surveyItem.components !== undefined && isItemGroupComponent(surveyItem.components)) {
            surveyItem.components.items = surveyItem.components.items.map(item => {
                if (item.role === ItemComponentRole.ResponseGroup) {
                    const rg = item as ItemGroupComponent;
                    rg.items = rg.items.map(i => {
                        i.style = styling;
                        return i;
                    });
                    return rg;
                } else {
                    return item;
                }
            });
        }
        return surveyItem;
    },
    [SurveyItemFeatures.ValidationRules]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => applyValidationRules(surveyItem, sourceItem),
    [SurveyItemFeatures.ConfidentialityMode]: (surveyItem: SurveySingleItem, sourceItem: SurveyItem) => applyConfidentialityMode(surveyItem, sourceItem),
}

export const createAndApplyFeatures = (sourceItem: SurveyItem, featuresToApply: SurveyItemFeatures[], targetType: ItemTypeKey, targetKey: string): SurveyItem | null => {
    const parentKey = getParentKeyFromFullKey(sourceItem.key);

    let newItem = generateNewItemForType({
        itemType: targetType,
        parentKey: parentKey,
        otherKeys: [],
    });

    if (newItem) {
        // Apply Key
        newItem.key = targetKey;
        // Apply Features
        for (const feature of featuresToApply) {
            //console.log("Applying feature: ", feature);
            //console.log("New Item before applying feature: ", JSON.stringify(newItem, null, 2));
            newItem = applySurveyItemFeature[feature](newItem, sourceItem);
            //console.log("New Item after applying feature: ", JSON.stringify(newItem, null, 2));
        }
    }
    return newItem;
}

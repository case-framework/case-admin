export interface Expression {
    name: string;
    returnType?: string;
    data?: Array<undefined | ExpressionArg>;
    metadata?: {
        slotTypes: Array<string | undefined>;
    }
}

type BaseArg = {
    dtype?: string;
}

export type ExpArg = BaseArg & {
    dtype: 'exp';
    exp: Expression;
}

export type NumArg = BaseArg & {
    dtype: 'num';
    num: number;
}

export type StrArg = BaseArg & {
    dtype: 'str';
    str: string;
}

export type ExpressionArg = ExpArg | NumArg | StrArg;


type ExpressionTypes = 'action' | 'num' | 'str' | 'boolean' | 'object';


interface SlotTypeBase {
    id: string;
}

interface SimpleSlotType extends SlotTypeBase {
    type: 'num' | 'str' | 'date' | 'time-delta';
};


export interface SelectSlotType extends SlotTypeBase {
    type: 'select',
    options: {
        key: string;
        label: string;
    }[]
}

interface FormSlotType extends SlotTypeBase {
    type: 'key-value' | 'list-selector' | 'key-value-list'
}

interface ExpressionSlotType extends SlotTypeBase {
    type: 'expression',
    allowedExpressionTypes?: Array<ExpressionTypes>;
    excludedExpressions?: Array<string>;
}


export type AllowedSlotType = SimpleSlotType | ExpressionSlotType | SelectSlotType | FormSlotType;


export interface SlotDef {
    label: string;
    required: boolean;
    argIndexes?: number[]; // to override how the order of the arguments is mapped to slots
    isListSlot?: boolean;
    allowedTypes?: AllowedSlotType[];
}



export type ColorVariant = 'blue' | 'green' | 'yellow' | 'purple' | 'teal' | 'cyan' | 'dark' | 'lime' | 'orange';
export type IconVariant = 'braces' | 'function' | 'code' | 'box' | 'variable' | 'brackets' | 'regex' | 'square-code' | 'terminal' | 'signpost' | 'layout-list' |
    'tag' | 'calendar' | 'text-cursor' | 'form-input' | 'parentheses' | 'pyramid' | 'triangle' | 'square' | 'diamond' | 'database' | 'split' | 'circle-slash' | 'blocks' |
    'ampersands' | 'tally' | 'clipboard-check' | 'tags' | 'user-check' | 'badge-check' | 'package-check' | 'copy-check' | 'copy-x' | 'copy-plus' | 'circle-check-big'
    | 'chevron-left' | 'chevrons-left' | 'chevron-right' | 'chevrons-right' | 'equal'


interface SlotInputDefBase {
    id: string;
    type: string;
    categories: string[];
    label: string;
    color?: ColorVariant;
    icon?: IconVariant;
}

export interface SlotInputDefSimple extends SlotInputDefBase {
    type: 'num' | 'str' | 'date' | 'time-delta';
}

export interface SlotInputDefFormKeyValueFromContext extends SlotInputDefBase {
    type: 'key-value';
    contextObjectKey: string,
    filterForObjectType?: string,
    allowExpressionsForValue?: boolean;
}

export interface SlotInputDefSelectorFromContext extends SlotInputDefBase {
    type: 'list-selector'
    contextArrayKey: string,
    filterForItemType?: string, // array items only if they have this type
}

export interface SlotInputDefKeyValueList extends SlotInputDefBase {
    type: 'key-value-list'
    contextArrayKey?: string,
    filterForItemType?: string, // array items only if they have this type
    withFixedKey?: string; // if defined, the key will be fixed to this value and no key selector will be shown
    withFixedValue?: string; // if defined, the value will be fixed to this value and no value selector will be shown
}

export type SlotInputDef = SlotInputDefSimple | SlotInputDefFormKeyValueFromContext | SlotInputDefSelectorFromContext | SlotInputDefKeyValueList;


export interface ExpressionDef {
    id: string;
    categories: string[];
    label: string;
    slots: SlotDef[];
    returnType: ExpressionTypes;
    color?: ColorVariant;
    icon?: IconVariant;
    // expression return type: action, num, str, boolean
    defaultValue?: ExpressionArg;
    isTemplateFor?: string;
}


export interface ExpressionCategory {
    id: string;
    label: string;
}


export const lookupExpressionDef = (name: string, registry: ExpressionDef[]): ExpressionDef | undefined => {
    return registry.find(def => def.id === name);
}


export interface ContextObjectItem {
    [key: string]: {
        values: string[];
        type?: string;
    }
}

export interface ContextArrayItem {
    key: string;
    label: string;
    type?: string; // can be used to make items filterable
}

export interface ExpEditorContext {
    [key: string]: ContextObjectItem | ContextArrayItem[];
}

interface SlotType {
    id: string;
    label: string;
    icon?: IconVariant;
    color?: ColorVariant;
}


export interface SlotTypeGroup {
    id: string;
    label: string;
    slotTypes: SlotType[];
}


export const getRecommendedSlotTypes = (
    slotDef: SlotDef,
    expRegistry: {
        expressionDefs: ExpressionDef[],
        categories: ExpressionCategory[]
        builtInSlotTypes: SlotInputDef[],
    }
): Array<SlotTypeGroup> => {
    const groups: Array<SlotTypeGroup> = []

    // add expression types:
    const allowExpressionTypes: string[] = [];
    const excludedExpressions: string[] = [];
    let allowsExpressions = false;
    slotDef.allowedTypes?.forEach((at) => {
        if (at.type === 'expression') {
            allowsExpressions = true;
            if (at.allowedExpressionTypes !== undefined) {
                allowExpressionTypes.push(...at.allowedExpressionTypes)
            }
            if (at.excludedExpressions !== undefined) {
                excludedExpressions.push(...at.excludedExpressions)
            }
        }
    })

    expRegistry.categories.forEach((category) => {
        const currentGroup: SlotTypeGroup = {
            id: category.id,
            label: category.label,
            slotTypes: []
        }

        expRegistry.builtInSlotTypes.forEach((builtIn) => {
            if (slotDef.allowedTypes?.find(at => at.type === builtIn.type && at.id === builtIn.id)
                && builtIn.categories?.includes(category.id)
            ) {
                currentGroup.slotTypes.push({
                    id: builtIn.id,
                    label: builtIn.label || builtIn.type,
                    icon: builtIn.icon,
                    color: builtIn.color,
                })
            }
        })

        if (allowsExpressions) {
            // collect allowed types into groups from registry
            expRegistry.expressionDefs.forEach((expDef) => {
                if (
                    expDef.categories.includes(category.id)
                    && allowExpressionTypes.includes(expDef.returnType)
                    && excludedExpressions.indexOf(expDef.id) === -1
                ) {
                    currentGroup.slotTypes.push({
                        id: expDef.id,
                        label: expDef.label,
                        icon: expDef.icon,
                        color: expDef.color
                    })
                }
            })
        }

        if (currentGroup.slotTypes.length > 0) {
            groups.push(currentGroup)
        }
    })


    return groups;
}

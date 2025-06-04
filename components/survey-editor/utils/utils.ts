import {
    AlertTriangle,
    Binary, Calendar, CheckCircle2, CheckSquare2, ChevronDownSquare, Clock,
    CornerDownLeft,
    Folder,
    GanttChart, Grid3X3, Info, LucideIcon, MessageCircleQuestion, Send, Settings2, SquareStack,
    TextCursorInput, UnfoldHorizontal, BotOff,
    Contact,
    ShieldIcon,
    TableIcon
} from "lucide-react";
import { ItemGroupComponent, Survey, SurveyGroupItem, SurveyItem, SurveySingleItem, isSurveyGroupItem } from "survey-engine/data_types";

export const isValidSurveyItemGroup = (item: SurveyItem): item is SurveyGroupItem => {
    return isSurveyGroupItem(item) || (item as SurveyGroupItem).items !== undefined;
}


export const getItemTypeInfos = (item: SurveyItem): { key: ItemTypeKey, label: string, description: string, defaultItemClassName: string, icon: LucideIcon } => {
    if (isValidSurveyItemGroup(item)) {
        return SpecialSurveyItemTypeInfos.groupItem;
    }
    else if (item.type === 'pageBreak') {
        return SpecialSurveyItemTypeInfos.pageBreak;
    } else if (item.type === 'surveyEnd') {
        return SpecialSurveyItemTypeInfos.surveyEnd;
    }

    const itemType = determineItemType(item);
    const itemInfos = SurveyItemTypeRegistry.find(i => i.key === itemType);
    if (itemInfos) {
        return {
            key: itemInfos.key,
            label: itemInfos.label,
            description: itemInfos.description,
            defaultItemClassName: itemInfos.className,
            icon: itemInfos.icon,
        };
    }

    return {
        key: 'custom',
        label: 'Custom',
        description: 'Not a standard item type.',
        icon: AlertTriangle,
        defaultItemClassName: 'text-yellow-700',
    };
}

export const determineItemType = (item: SurveySingleItem): string => {
    if (!item.components?.items || item.components.items.length === 0) {
        console.warn('No components found for item: ', item.key);
        return 'display';
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
            return 'textInput';
        case 'numberInput':
            return 'numericInput';
        case 'dropDownGroup':
            return 'dropdown';
        case 'singleChoiceGroup':
            return 'singleChoice';
        case 'multipleChoiceGroup':
            return 'multipleChoice';
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
        case 'cloze':
            return 'clozeQuestion';
        case 'consent':
            return 'consent';
        case 'contact':
            return 'contact';
        case 'validatedRandomQuestion':
            return 'validatedRandomQuestion';
        case 'codeValidator':
            return 'codeValidator';
        default:
            console.warn('Unknown response item role: ', mainResponseItem.role);
            return mainResponseItem.role;
    }

}

export type SurveyItemTypeKey = 'custom' | 'display' | 'singleChoice' | 'multipleChoice' | 'dropdown' | 'textInput' | 'timeInput' | 'dateInput' | 'numericInput' | 'sliderNumeric' | 'codeValidator' | 'matrix' | 'responsiveMatrix' | 'responsiveBipolarLikertScaleArray' | 'responsiveSingleChoiceArray' | 'clozeQuestion' | 'consent' | 'validatedRandomQuestion' | 'contact';
export type SpecialItemTypeKey = 'group' | 'pageBreak' | 'surveyEnd';
export type ItemTypeKey = SurveyItemTypeKey | SpecialItemTypeKey;

export const SpecialSurveyItemTypeInfos: Record<string, { key: SpecialItemTypeKey, label: string, description: string, defaultItemClassName: string, icon: LucideIcon }> = {
    groupItem: {
        key: 'group',
        label: 'Group',
        description: 'A container for a group of items.',
        defaultItemClassName: 'text-sky-600',
        icon: Folder,
    },
    pageBreak: {
        key: 'pageBreak',
        label: 'Page break',
        description: 'Items after this will be displayed on a new page.',
        defaultItemClassName: 'text-red-800',
        icon: CornerDownLeft,
    },
    surveyEnd: {
        key: 'surveyEnd',
        label: 'Survey end content',
        description: 'Content displayed next to the submit button.',
        defaultItemClassName: 'text-red-800',
        icon: Send,
    }
}

export const SurveyItemTypeRegistry: { key: SurveyItemTypeKey, label: string, description: string, className: string, icon: LucideIcon }[] = [
    {
        key: 'display',
        label: 'Display',
        description: 'Displays text, without response slots. For information or instructions.',
        className: 'text-neutral-700',
        icon: Info,
    },
    {
        key: 'singleChoice',
        label: 'Single choice',
        description: 'Allows the participant to select one option from a radio group.',
        className: 'text-fuchsia-800',
        icon: CheckCircle2
    },
    {
        key: 'multipleChoice',
        label: 'Multiple choice',
        description: 'Allows the participant to select multiple options from a list of checkboxes.',
        className: 'text-indigo-800',
        icon: CheckSquare2
    },
    {
        key: 'dateInput',
        label: 'Date input',
        description: 'Allows the participant to enter a date.',
        className: 'text-lime-700',
        icon: Calendar,
    },
    {
        key: 'timeInput',
        label: 'Time input',
        description: 'Allows the participant to enter a time.',
        className: 'text-lime-700',
        icon: Clock
    },
    {
        key: 'textInput',
        label: 'Text input',
        description: 'Allows the participant to enter text.',
        className: 'text-sky-700',
        icon: TextCursorInput,
    },
    {
        key: 'codeValidator',
        label: 'Code validator',
        description: 'Validates a code entered by the participant.',
        className: 'text-purple-800',
        icon: ShieldIcon,
    },
    {
        key: 'numericInput',
        label: 'Numeric input',
        description: 'Allows the participant to enter a number.',
        className: 'text-green-700',
        icon: Binary,
    },
    {
        key: 'sliderNumeric',
        label: 'Slider',
        description: 'Allows the participant to select a value from a range.',
        className: 'text-green-700',
        icon: Settings2,
    },
    {
        key: 'responsiveSingleChoiceArray',
        label: 'Single choice array',
        description: 'A list of single choice questions (likert scale). Different view modes are available per screen size.',
        className: 'text-teal-800',
        icon: GanttChart,
    },
    {
        key: 'responsiveBipolarLikertScaleArray',
        label: 'Bipolar likert array',
        description: 'A list of bipolar likert scale questions. Different view modes are available per screen size.',
        className: 'text-teal-800',
        icon: UnfoldHorizontal,
    },
    {
        key: 'responsiveMatrix',
        label: 'Adaptive Question Grid',
        description: 'Same response slots arranged in a grid. Different view modes are available per screen size.',
        className: 'text-purple-800',
        icon: TableIcon,
    },
    {
        key: 'matrix',
        label: 'Matrix',
        description: 'Rows and columns of response slots can be used for more complex questions.',
        className: 'text-purple-800',
        icon: Grid3X3,
    },
    {
        key: 'clozeQuestion',
        label: 'Cloze question',
        description: 'A cloze question with a mix of text and response slots.',
        className: 'text-purple-800',
        icon: SquareStack,
    },
    {
        key: 'consent',
        label: 'Consent',
        description: 'Displays a consent form.',
        className: 'text-rose-800',
        icon: MessageCircleQuestion,
    },
    {
        key: 'dropdown',
        label: 'Dropdown',
        description: 'Allows the participant to select one option from a list of options.',
        className: 'text-fuchsia-800',
        icon: ChevronDownSquare,
    },
    {
        key: 'validatedRandomQuestion',
        label: 'Validated Random Question',
        description: 'Selects a random question from a list of questions and accept only valid responses.',
        className: 'text-blue-800',
        icon: BotOff,
    },
    {
        key: 'contact',
        label: 'Contact Form Question',
        description: 'Name, email, phone or address of the participant.',
        className: 'text-blue-800',
        icon: Contact,
    },
]

export const builtInItemColors = [
    '#404040',
    '#b91c1c',
    '#c2410c',
    '#a16207',
    '#4d7c0f',
    '#047857',
    '#0369a1',
    '#4338ca',
    '#7e22ce',
    '#86198f',
    '#be123c',
]

export const getItemColorFromID = (id: string): string => {
    // Convert the user ID to an ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(id);

    const hashArray = data;

    // an int number from hashArray
    const hashNumber = hashArray.reduce((acc, curr) => acc + curr, 0);

    // Select a color combination based on the first byte of the hash
    const selectedColor = builtInItemColors[hashNumber % builtInItemColors.length];
    return selectedColor;
}

export const getItemColor = (surveyItem: SurveyItem): string | undefined => {
    if ((surveyItem as SurveySingleItem).type === 'pageBreak') {
        return '#991b1b';
    } else if ((surveyItem as SurveySingleItem).type === 'surveyEnd') {
        return '#991b1b';
    }

    const itemColor = surveyItem.metadata?.editorItemColor || getItemColorFromID(surveyItem.key);
    return itemColor;
}


export const getParentKeyFromFullKey = (fullKey: string): string => {
    return fullKey.split('.').slice(0, -1).join('.') || '';
}

export const getItemKeyFromFullKey = (fullKey: string): string => {
    return fullKey.split('.').pop() || '';
}

export const getSurveyItemsAsFlatList = (item: SurveyItem): Array<{ key: string; isGroup: boolean }> => {
    let result: Array<{ key: string, isGroup: boolean }> = [];
    if ((item as SurveyGroupItem).items === undefined) {
        return [{ key: item.key, isGroup: false }];
    }
    result.push({ key: item.key, isGroup: true });
    (item as SurveyGroupItem).items.forEach(item => {
        result = result.concat(getSurveyItemsAsFlatList(item))
    });
    return result;
}

export const getSurveyIdentifier = (survey: Survey): string => (survey.surveyDefinition.key ?? "noKey") + ' | ' + Math.random().toString(36).substring(2, 9);

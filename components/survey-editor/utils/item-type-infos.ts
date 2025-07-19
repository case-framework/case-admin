import { AlertTriangle, Binary, BotOff, Calendar, CheckCircle2, CheckSquare2, ChevronDownSquare, Clock, Contact, CornerDownLeft, Folder, FolderTree, GanttChart, Grid3X3, Info, LucideIcon, MessageCircleQuestion, Send, Settings2, ShieldIcon, SquareStack, TableIcon, TextCursorInput, UnfoldHorizontal } from "lucide-react"
import { SurveyItem, SurveyItemType } from "survey-engine"


export const SurveyItemTypeRegistry = [
    {
        key: 'root',
        label: 'Root',
        description: 'Survey root item.',
        defaultItemClassName: 'text-sky-800',
        icon: FolderTree,
    },
    {
        key: SurveyItemType.Group,
        label: 'Group',
        description: 'A container for a group of items.',
        defaultItemClassName: 'text-sky-600',
        icon: Folder,
    },
    {
        key: SurveyItemType.PageBreak,
        label: 'Page break',
        description: 'Items after this will be displayed on a new page.',
        defaultItemClassName: 'text-red-800',
        icon: CornerDownLeft,
    },
    {
        key: SurveyItemType.SurveyEnd,
        label: 'Survey end content',
        description: 'Content displayed next to the submit button.',
        defaultItemClassName: 'text-red-800',
        icon: Send,
    },
    {
        key: SurveyItemType.Display,
        label: 'Display',
        description: 'Displays text, without response slots. For information or instructions.',
        className: 'text-neutral-700',
        icon: Info,
    },
    {
        key: SurveyItemType.SingleChoiceQuestion,
        label: 'Single choice',
        description: 'Allows the participant to select one option from a radio group.',
        className: 'text-fuchsia-800',
        icon: CheckCircle2
    },
    {
        key: SurveyItemType.MultipleChoiceQuestion,
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

    if (surveyItem.itemType === SurveyItemType.PageBreak) {
        return '#991b1b';
    } else if (surveyItem.itemType === SurveyItemType.SurveyEnd) {
        return '#991b1b';
    }

    const itemColor = surveyItem.metadata?.editorItemColor || getItemColorFromID(surveyItem.key.itemKey);
    return itemColor;
}

export interface ItemTypeInfos {
    key: string;
    label: string;
    description: string;
    defaultItemClassName?: string;
    icon: LucideIcon;
}

export const getItemTypeInfos = (item: SurveyItem): { key: string, label: string, description: string, defaultItemClassName?: string, icon: LucideIcon } => {
    if (item.key.isRoot) {
        return SurveyItemTypeRegistry.find(i => i.key === 'root')!;
    }

    const itemInfos = SurveyItemTypeRegistry.find(i => i.key === item.itemType);
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

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

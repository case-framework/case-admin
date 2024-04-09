import { SurveyGroupItem, SurveyItem } from "survey-engine/data_types";
import { getItemColorFromID } from "./utils";
import { generatePageBreak, generateTitleComponent } from "case-editor-tools/surveys/utils/simple-generators";
import { Group } from "case-editor-tools/surveys/types";
import { ItemEditor } from "case-editor-tools/surveys/survey-editor/item-editor";
import { SurveyItems } from "case-editor-tools/surveys/survey-items";
import { ComponentGenerators } from "case-editor-tools/surveys/utils/componentGenerators";

// generate random 3 letter string
const randomString = (targetLength: number = 3) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumbers = Math.random().toString(36).substring(2, targetLength + 1).toUpperCase();
    return randomLetter + randomNumbers;
}

const getUniqueRandomKey = (existingKeys: string[], parentKey: string) => {
    let newKey = randomString();
    while (existingKeys.includes([parentKey, newKey].join('.'))) {
        newKey = randomString();
    }
    return newKey;
}

class SimpleGroup extends Group {
    constructor(parentKey: string, key: string, metadata?: { [key: string]: string }) {
        super(parentKey, key);
        this.groupEditor.setMetadata(metadata)
    }

    buildGroup(): void {
    }
}


export const generateNewItemForType = (props: {
    itemType: string;
    parentGroup: SurveyGroupItem;
}): SurveyItem | null => {
    const keysInGroupAlready = props.parentGroup.items.map(i => i.key);

    const parentKey = props.parentGroup.key;
    const newItemType = props.itemType;

    const newItemKey = getUniqueRandomKey(keysInGroupAlready, parentKey);

    const editorItemColor = getItemColorFromID(newItemKey);

    let newSurveyItem: SurveyItem | null = null;

    switch (newItemType) {
        case 'pageBreak':
            newSurveyItem = generatePageBreak(parentKey);
            break;
        case 'group':
            const newGroup = new SimpleGroup(parentKey, newItemKey, {
                editorItemColor: editorItemColor
            })
            newSurveyItem = newGroup.get();
            break
        case 'surveyEnd':
            const editor = new ItemEditor(undefined, { itemKey: parentKey + '.' + newItemKey, type: 'surveyEnd', isGroup: false });

            editor.setTitleComponent(
                generateTitleComponent(new Map<string, string>())
            );
            newSurveyItem = editor.getItem();
            break;
        case 'display':
            newSurveyItem = SurveyItems.display({
                parentKey: parentKey,
                itemKey: newItemKey,
                content: [
                    ComponentGenerators.markdown({
                        content: new Map(),
                    })
                ],
                metadata: {
                    editorItemColor: editorItemColor
                }
            })
            break;
        case 'singleChoice':
            newSurveyItem = SurveyItems.singleChoice({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                responseOptions: [],
                metadata: {
                    editorItemColor: editorItemColor
                },
            })
            break;
        case 'multipleChoice':
            newSurveyItem = SurveyItems.multipleChoice({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                responseOptions: [],
                metadata: {
                    editorItemColor: editorItemColor
                }
            })
            break;
        case 'dateInput':
            newSurveyItem = SurveyItems.dateInput({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                dateInputMode: 'YMD',
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;
        case 'timeInput':
            newSurveyItem = SurveyItems.timeInput({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;
        case 'textInput':
            newSurveyItem = SurveyItems.textInput({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;
        case 'multilineTextInput':
            newSurveyItem = SurveyItems.multilineTextInput({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;
        case 'numericInput':
            newSurveyItem = SurveyItems.numericInput({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                inputLabel: new Map(),
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;
        case 'sliderNumeric':
            newSurveyItem = SurveyItems.numericSlider({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                noResponseLabel: new Map(),
                sliderLabel: new Map(),
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
        case 'responsiveSingleChoiceArray':
            newSurveyItem = SurveyItems.responsiveSingleChoiceArray({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                defaultMode: 'table',
                rows: [],
                scaleOptions: [],
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;
        case 'responsiveBipolarLikertArray':
            newSurveyItem = SurveyItems.responsiveBipolarLikertArray({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                defaultMode: 'table',
                rows: [],
                scaleOptions: [],
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;
        case 'responsiveMatrix':
            newSurveyItem = SurveyItems.responsiveMatrix({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                columns: [],
                rows: [],
                responseType: 'dropdown',
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;
        case 'clozeQuestion':
            newSurveyItem = SurveyItems.clozeQuestion({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                items: [],
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;
        case 'dropdown':
            newSurveyItem = SurveyItems.dropDown({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                responseOptions: [],
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;
        case 'consent':
            newSurveyItem = SurveyItems.consent({
                parentKey: parentKey,
                itemKey: newItemKey,
                questionText: new Map(),
                acceptBtn: new Map(),
                checkBoxLabel: new Map(),
                dialogContent: new Map(),
                dialogTitle: new Map(),
                rejectBtn: new Map(),
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;

        default:
            console.warn('Unknown item type', newItemType);
            return null;
    }
    return newSurveyItem;
}
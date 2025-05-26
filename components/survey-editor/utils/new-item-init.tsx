import { SurveyGroupItem, SurveyItem } from "survey-engine/data_types";
import { getItemColorFromID } from "./utils";
import { generatePageBreak, generateTitleComponent } from "case-editor-tools/surveys/utils/simple-generators";
import { Group } from "case-editor-tools/surveys/types";
import { ItemEditor } from "case-editor-tools/surveys/survey-editor/item-editor";
import { SurveyItems } from "case-editor-tools/surveys/survey-items";
import { ComponentGenerators } from "case-editor-tools/surveys/utils/componentGenerators";
import { initMatrixQuestion } from "case-editor-tools/surveys/responseTypeGenerators/matrixGroupComponent";

// generate random 3 letter string
const randomString = (targetLength: number = 3) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumbers = Math.random().toString(36).substring(2, targetLength + 1).toUpperCase();
    return randomLetter + randomNumbers;
}

export const getUniqueRandomKey = (existingKeys: string[], parentKey: string) => {
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
            break;
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
        case 'responsiveBipolarLikertScaleArray':
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
                columns: [{
                    key: 'col1',
                    label: new Map(),
                }],
                rows: [{
                    key: 'row1',
                    label: new Map(),
                    role: 'row'
                }],
                responseType: 'input',
                metadata: {
                    editorItemColor: editorItemColor
                }
            });
            break;
        case 'matrix':
            const matrixEditor = new ItemEditor(undefined, { itemKey: parentKey + '.' + newItemKey, isGroup: false });

            matrixEditor.setTitleComponent(
                generateTitleComponent(new Map<string, string>())
            );
            const rg = matrixEditor.addNewResponseComponent({ role: 'responseGroup' });
            const rg_inner = initMatrixQuestion('mat', [], { name: 'sequential' })
            rg_inner.items.push({
                key: 'headerRow',
                role: 'headerRow',
                items: [
                    { key: 'col1', role: 'text' },
                ]
            })
            rg_inner.items.push({
                key: 'row1',
                role: 'responseRow',
                items: [
                    { key: 'col1', role: 'dropDownGroup' },
                ]
            })

            matrixEditor.addExistingResponseComponent(rg_inner, rg?.key);

            newSurveyItem = matrixEditor.getItem();
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
        case 'validatedRandomQuestion':
            const vrqKey = parentKey + '.' + newItemKey;
            const vrQEditor = new ItemEditor(undefined, { itemKey: vrqKey, isGroup: false });

            vrQEditor.setTitleComponent(
                generateTitleComponent(new Map<string, string>())
            );

            vrQEditor.addExistingResponseComponent({
                key: 'vrq',
                role: 'validatedRandomQuestion',
                items: [],
            },
                vrQEditor.addNewResponseComponent({ role: 'responseGroup' })?.key
            );

            vrQEditor.addValidation({
                key: 'v1',
                type: 'hard',
                rule: {
                    name: 'hasResponse',
                    data: [
                        { str: vrqKey },
                        { str: 'rg' }
                    ]
                }
            })

            newSurveyItem = vrQEditor.getItem();
            newSurveyItem.metadata = {
                editorItemColor: editorItemColor
            }
            break;
        case 'codeValidator':
            const cvKey = parentKey + '.' + newItemKey;
            const cvQEditor = new ItemEditor(undefined, { itemKey: cvKey, isGroup: false });

            cvQEditor.setTitleComponent(
                generateTitleComponent(new Map<string, string>())
            );

            cvQEditor.addExistingResponseComponent({
                key: 'ic',
                role: 'codeValidator',
                items: [
                    {
                        key: 'codeList',
                        role: 'studyCode',
                    },
                    {
                        key: 'codeInput',
                        role: 'codeInput',
                    }
                ],
            },
                cvQEditor.addNewResponseComponent({ role: 'responseGroup' })?.key
            );

            cvQEditor.addValidation({
                key: 'v1',
                type: 'hard',
                rule: {
                    name: 'hasResponse',
                    data: [
                        { str: cvKey },
                        { str: 'rg' }
                    ]
                }
            })

            newSurveyItem = cvQEditor.getItem();
            newSurveyItem.metadata = {
                editorItemColor: editorItemColor
            }
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
        case 'contact':
            const contactKey = parentKey + '.' + newItemKey;
            const contactQEditor = new ItemEditor(undefined, { itemKey: contactKey, isGroup: false });

            contactQEditor.setTitleComponent(
                generateTitleComponent(new Map<string, string>())
            );

            contactQEditor.addExistingResponseComponent({
                key: 'contact',
                role: 'contact',
                items: [],
            },
                contactQEditor.addNewResponseComponent({ role: 'responseGroup' })?.key
            );

            newSurveyItem = contactQEditor.getItem();
            break;

        default:
            console.warn('Unknown item type', newItemType);
            return null;
    }
    return newSurveyItem;
}

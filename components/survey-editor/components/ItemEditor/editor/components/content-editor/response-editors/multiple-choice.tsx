import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { Binary, Calendar, Check, CheckSquare, ClipboardCopyIcon, ClipboardPasteIcon, Clock, Copy, FormInput, Heading, SquareStack, Trash2 } from 'lucide-react';
import React from 'react';
import { Expression, ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import TextViewContentEditor, { SimpleTextViewContentEditor } from './text-view-content-editor';
import TextInputContentConfig from './text-input-content-config';
import NumberInputContentConfig from './number-input-content-config';
import DateInputContentConfig from './date-input-content-config';
import ClozeContentConfig from './cloze-content-config';
import TimeInputContentConfig from './time-input-content-config';
import { ChoiceResponseOptionType } from '@/components/survey-renderer/SurveySingleItemView/ResponseComponent/InputTypes/MultipleChoiceGroup';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { ItemComponentRole } from '@/components/survey-editor/components/types';
import { useCopyToClipboard } from 'usehooks-ts';
import ComponentEditor, { ComponentEditorGenericProps } from '../component-editor';
import { PopoverKeyBadge } from '../../KeyBadge';
import SurveyExpressionEditor from '../../survey-expression-editor';
import { Separator } from '@/components/ui/separator';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';

interface MultipleChoiceProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
    isSingleChoice?: boolean;
}

const getOptionType = (option: ItemComponent): ChoiceResponseOptionType => {
    const optionType = option.role as keyof typeof ChoiceResponseOptionType;
    return optionType as ChoiceResponseOptionType;
}

const icons = {
    [ChoiceResponseOptionType.SimpleText]: <CheckSquare className='size-4 text-muted-foreground' />,
    [ChoiceResponseOptionType.FormattedText]: <CheckSquare className='size-4 text-muted-foreground' />,
    [ChoiceResponseOptionType.TextInput]: <FormInput className='size-4 text-muted-foreground' />,
    [ChoiceResponseOptionType.NumberInput]: <Binary className='size-4 text-muted-foreground' />,
    [ChoiceResponseOptionType.TimeInput]: <Clock className='size-4 text-muted-foreground' />,
    [ChoiceResponseOptionType.DateInput]: <Calendar className='size-4 text-muted-foreground' />,
    [ChoiceResponseOptionType.Cloze]: <SquareStack className='size-4 text-muted-foreground' />,
    [ChoiceResponseOptionType.DisplayText]: <Heading className='size-4 text-muted-foreground' />,
};

const mcgItemIconLookup = (item: ItemComponent): React.ReactNode => {
    return icons[getOptionType(item)] || <Check className='size-4 text-muted-foreground' />;
}

const typeHints = {
    [ChoiceResponseOptionType.SimpleText]: 'With simple label',
    [ChoiceResponseOptionType.FormattedText]: 'With formatted label',
    [ChoiceResponseOptionType.TextInput]: 'With text input',
    [ChoiceResponseOptionType.NumberInput]: 'With number input',
    [ChoiceResponseOptionType.TimeInput]: 'With time input',
    [ChoiceResponseOptionType.DateInput]: 'With date input',
    [ChoiceResponseOptionType.Cloze]: 'With embedded cloze items',
    [ChoiceResponseOptionType.DisplayText]: 'Subheading',
};

const mcgItemDescriptiveTextLookup = (item: ItemComponent, lang: string): React.ReactNode => {
    const itemType = getOptionType(item);

    const content = localisedObjectToMap(item.content).get(lang);

    switch (itemType) {
        case ChoiceResponseOptionType.SimpleText:
        case ChoiceResponseOptionType.TextInput:
        case ChoiceResponseOptionType.NumberInput:
        case ChoiceResponseOptionType.TimeInput:
        case ChoiceResponseOptionType.DateInput:
        case ChoiceResponseOptionType.DisplayText:
            return <p className='text-sm text-start'>
                {content}
                {!content && <span className='text-muted-foreground text-xs text-start font-mono uppercase'>
                    {'- No label defined -'}
                </span>}
            </p>
        case ChoiceResponseOptionType.FormattedText:
            return <p className='text-muted-foreground text-xs text-start font-mono uppercase'>
                {'- formatted text -'}
            </p>
        case ChoiceResponseOptionType.Cloze:
            return <p className='text-muted-foreground text-xs text-start font-mono uppercase'>
                {'- cloze items -'}
            </p>
    }
}

const OptionPreview: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();


    return <div className='flex items-center gap-4'>
        <span>
            {mcgItemIconLookup(props.component)}
        </span>

        <div className='min-w-14 flex justify-center'>
            <PopoverKeyBadge
                headerText='Row Key'
                className='w-full'
                allOtherKeys={props.usedKeys?.filter(k => k !== props.component.key) ?? []}
                isHighlighted={props.isSelected}
                itemKey={props.component.key ?? ''}
                onKeyChange={(newKey) => {
                    props.onChange?.({
                        ...props.component,
                        key: newKey
                    })
                }} />
        </div>
        {mcgItemDescriptiveTextLookup(props.component, selectedLanguage)}

    </div>
}


const OptionQuickEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    const itemType = getOptionType(props.component);

    switch (itemType) {
        case ChoiceResponseOptionType.Cloze:
        case ChoiceResponseOptionType.Cloze:
            return null;
        default:
            return <div>
                <SimpleTextViewContentEditor
                    component={props.component}
                    onChange={(newComp) => props.onChange?.(newComp)}
                    label='Option label'
                />
            </div>
    }
}

const getQuickEditor = (component: ItemComponent) => {
    const itemType = getOptionType(component);
    if (itemType === ChoiceResponseOptionType.Cloze
        || itemType === ChoiceResponseOptionType.FormattedText
    ) {
        return undefined;
    }

    return OptionQuickEditor;

}

const OptionAdvancedEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    const itemType = getOptionType(props.component);

    let typeSpecificEditorContent: React.ReactNode;
    switch (itemType) {
        case ChoiceResponseOptionType.SimpleText:
            typeSpecificEditorContent = <SimpleTextViewContentEditor
                component={props.component}
                onChange={(newComp) => props.onChange?.(newComp)}
                label='Option label'
            />
            break;
        case ChoiceResponseOptionType.DisplayText:
            typeSpecificEditorContent = <SimpleTextViewContentEditor
                component={props.component}
                onChange={(newComp) => props.onChange?.(newComp)}
                label='Option label'
                hideStyling={false}
            />
            break;
        case ChoiceResponseOptionType.FormattedText:
            typeSpecificEditorContent = <TextViewContentEditor
                component={props.component}
                onChange={(newComp) => props.onChange?.(newComp)}
                label='Option label'
            />
            break;
        case ChoiceResponseOptionType.TextInput:
            typeSpecificEditorContent = <TextInputContentConfig
                component={props.component}
                onChange={(newComp) => props.onChange?.(newComp)}
            />
            break;
        case ChoiceResponseOptionType.NumberInput:
            typeSpecificEditorContent = <NumberInputContentConfig
                component={props.component}
                onChange={(newComp) => props.onChange?.(newComp)}
            />
            break;
        case ChoiceResponseOptionType.TimeInput:
            typeSpecificEditorContent = <TimeInputContentConfig
                component={props.component as ItemGroupComponent}
                onChange={(newComp) => props.onChange?.(newComp)}
            />
            break;
        case ChoiceResponseOptionType.DateInput:
            typeSpecificEditorContent = <DateInputContentConfig
                component={props.component}
                onChange={(newComp) => props.onChange?.(newComp)}
            />
            break;
        case ChoiceResponseOptionType.Cloze:
            typeSpecificEditorContent = <ClozeContentConfig
                component={props.component as ItemGroupComponent}
                onChange={(newComp) => props.onChange?.(newComp)}
            />
            break;
        default:
            typeSpecificEditorContent = <p>Option Advanced Editor</p>;
            break;
    }


    return <div className='space-y-4 pt-2 pb-8 min-w-[600px]'>
        <div className='flex justify-between'>
            <div className='min-w-14 w-fit flex justify-center'>
                <PopoverKeyBadge
                    headerText='Row Key'
                    className='w-full'
                    allOtherKeys={props.usedKeys?.filter(k => k !== props.component.key) ?? []}
                    isHighlighted={props.isSelected}
                    itemKey={props.component.key ?? ''}
                    onKeyChange={(newKey) => {
                        props.onChange?.({
                            ...props.component,
                            key: newKey
                        })
                    }} />
            </div>
            <div className='flex justify-end'>
                <SurveyLanguageToggle />
            </div>
        </div>
        <Separator />

        <div className='space-y-4'>
            <h3 className='font-semibold'>Config for option  <span className='text-primary lowercase'>{typeHints[itemType]}</span></h3>
            {typeSpecificEditorContent}
        </div>

        <Separator />

        <div className='space-y-4'>
            <h3 className='font-semibold'>Conditions</h3>

            <div>
                <SurveyExpressionEditor
                    label='Display condition'
                    expression={props.component.displayCondition as Expression | undefined}
                    onChange={(newExpression) => {
                        props.onChange?.({ ...props.component, displayCondition: newExpression });
                    }}
                />
            </div>
            <Separator />
            <div>
                <SurveyExpressionEditor
                    label='Disabled condition'
                    expression={props.component.disabled as Expression | undefined}
                    onChange={(newExpression) => {
                        props.onChange?.({ ...props.component, disabled: newExpression });
                    }}
                />
            </div>
        </div>
    </div>
}

const MultipleChoice: React.FC<MultipleChoiceProps> = (props) => {
    const [draggedKey, setDraggedKey] = React.useState<string | null>();
    const [clipboardContent, setClipboardContent] = useCopyToClipboard();

    const relevantResponseGroupRoleString = props.isSingleChoice ? ItemComponentRole.SingleChoiceGroup : ItemComponentRole.MultipleChoiceGroup;
    const rgIndex = props.surveyItem.components!.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    const rg = props.surveyItem.components!.items[rgIndex ?? 0] as ItemGroupComponent;
    const choiceGroupIndex = rg.items.findIndex(comp => comp.role === relevantResponseGroupRoleString);
    const choiceGroup = rg.items[choiceGroupIndex] as ItemGroupComponent;
    const responseItems: ItemComponent[] = choiceGroup.items || [];

    const draggedItem = responseItems.find(item => item.key === draggedKey);

    const sortableResponseItems = responseItems.map((component, index) => {
        return {
            id: component.key || index.toString()
        }
    });

    const onAddItem = (keyOfSelectedOption: string) => {
        const randomKey = Math.random().toString(36).substring(9);
        const optionType = keyOfSelectedOption as keyof typeof ChoiceResponseOptionType;

        // Create empty option of given type.
        const newOption = {
            key: randomKey,
            role: optionType,
        }

        const newItems = [...responseItems, newOption];
        updateSurveyItemWithNewOptions(newItems);
    };

    const updateSurveyItemWithNewOptions = (options: ItemComponent[]) => {
        const newChoiceGroup = {
            ...choiceGroup,
            items: options,
        };

        const newRg = {
            ...rg,
            items: rg.items.map(comp => {
                if (comp.role === relevantResponseGroupRoleString) {
                    return newChoiceGroup;
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

    const onChange = (key: string, updatedComponent: ItemComponent) => {
        const newItems = responseItems.map(item => {
            if (item.key === key) {
                return updatedComponent;
            }
            return item;
        });
        updateSurveyItemWithNewOptions(newItems);
    }

    const onDuplicate = (responseItem: ItemComponent, index: number) => {
        const newItems = [...responseItems];
        const newItem = {
            ...responseItem,
            key: Math.random().toString(36).substring(9),
        }
        newItems.splice(index + 1, 0, newItem);
        updateSurveyItemWithNewOptions(newItems);
    }

    const onCopyItem = (responseItem: ItemComponent) => {
        setClipboardContent(JSON.stringify(responseItem));
    }

    const hasValidClipboardContent = () => {
        const clipboardValue = clipboardContent?.toString() ?? "";
        if (clipboardValue.length === 0) {
            return false;
        }
        try {
            const parsedItem = JSON.parse(clipboardValue) as ItemComponent;
            return parsedItem.role !== undefined;
        } catch {
            return false;
        }
    }

    const onPasteContent = (responseItem: ItemComponent) => {
        if (!hasValidClipboardContent()) {
            return;
        }
        const clipboardValue = clipboardContent?.toString() ?? "";
        const copiedItem = JSON.parse(clipboardValue) as ItemComponent;

        const newItems = responseItems.map(item => {
            if (item.key === responseItem.key) {
                return {
                    ...copiedItem,
                    key: item.key
                }
            }
            return item;
        });
        updateSurveyItemWithNewOptions(newItems);
    }

    const onDelete = (responseItem: ItemComponent) => {
        if (!confirm('Are you sure you want to delete this option?')) {
            return;
        }
        const newItems = responseItems.filter(item => item.key !== responseItem.key);
        updateSurveyItemWithNewOptions(newItems);
    }

    return (
        <div className='space-y-6'>
            <div>
                <h3 className='font-semibold pb-2'>Options: <span className='text-muted-foreground'>({sortableResponseItems.length})</span></h3>

                <SortableWrapper
                    sortableID={'response-group-editor'}
                    items={sortableResponseItems}
                    onDraggedIdChange={(id) => {
                        setDraggedKey(id);
                    }}
                    onReorder={(activeIndex, overIndex) => {
                        const newItems = [...responseItems];
                        newItems.splice(activeIndex, 1);
                        newItems.splice(overIndex, 0, responseItems[activeIndex]);
                        updateSurveyItemWithNewOptions(newItems);
                    }}
                    dragOverlayItem={(draggedKey && draggedItem) &&
                        <ComponentEditor
                            isSortable={true}
                            component={draggedItem}
                            previewContent={OptionPreview}
                        />
                    }
                >
                    <ol className='space-y-1'>
                        {responseItems.map((responseItem, index) => (<ComponentEditor
                            key={responseItem.key}
                            isSortable={true}
                            component={responseItem}
                            isDragged={draggedKey === responseItem.key}
                            previewContent={OptionPreview}
                            quickEditorContent={getQuickEditor(responseItem)}
                            advancedEditorContent={OptionAdvancedEditor}
                            usedKeys={responseItems.map(item => item.key!)}
                            onChange={(updatedComponent) => onChange(responseItem.key!, updatedComponent)}
                            contextMenuItems={[
                                {
                                    type: 'item',
                                    label: 'Duplicate',
                                    icon: <Copy className='size-4' />,
                                    onClick: () => onDuplicate(responseItem, index)
                                },
                                {
                                    type: 'separator'
                                },
                                {
                                    type: 'item',
                                    label: 'Copy content',
                                    icon: <ClipboardCopyIcon className='size-4' />,
                                    onClick: () => onCopyItem(responseItem)
                                },
                                {
                                    type: 'item',
                                    label: 'Paste content',
                                    disabled: !hasValidClipboardContent(),
                                    icon: <ClipboardPasteIcon className='size-4' />,
                                    onClick: () => onPasteContent(responseItem)
                                },
                                {
                                    type: 'separator'
                                },
                                {
                                    type: 'item',
                                    label: 'Delete',
                                    icon: <Trash2 className='size-4' />,
                                    onClick: () => onDelete(responseItem)
                                }
                            ]}
                        />
                        ))}
                    </ol>
                    <div className='flex justify-center w-full mt-2'>
                        <AddDropdown
                            options={[
                                { key: ChoiceResponseOptionType.SimpleText, label: typeHints[ChoiceResponseOptionType.SimpleText], icon: icons[ChoiceResponseOptionType.SimpleText] },
                                { key: ChoiceResponseOptionType.FormattedText, label: typeHints[ChoiceResponseOptionType.FormattedText], icon: icons[ChoiceResponseOptionType.FormattedText] },
                                { key: ChoiceResponseOptionType.TextInput, label: typeHints[ChoiceResponseOptionType.TextInput], icon: icons[ChoiceResponseOptionType.TextInput] },
                                { key: ChoiceResponseOptionType.NumberInput, label: typeHints[ChoiceResponseOptionType.NumberInput], icon: icons[ChoiceResponseOptionType.NumberInput] },
                                { key: ChoiceResponseOptionType.TimeInput, label: typeHints[ChoiceResponseOptionType.TimeInput], icon: icons[ChoiceResponseOptionType.TimeInput] },
                                { key: ChoiceResponseOptionType.DateInput, label: typeHints[ChoiceResponseOptionType.DateInput], icon: icons[ChoiceResponseOptionType.DateInput] },
                                { key: ChoiceResponseOptionType.Cloze, label: typeHints[ChoiceResponseOptionType.Cloze], icon: icons[ChoiceResponseOptionType.Cloze] },
                                { key: ChoiceResponseOptionType.DisplayText, label: typeHints[ChoiceResponseOptionType.DisplayText], icon: icons[ChoiceResponseOptionType.DisplayText] },
                            ]}
                            onAddItem={onAddItem}
                        />
                    </div>
                </SortableWrapper>
            </div>
        </div>
    );
};

export default MultipleChoice;

import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { Binary, Calendar, Check, CheckSquare, Clock, FormInput, Heading, LetterText, SquareStack } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
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
import { ItemOverviewRow } from './item-overview-row';
import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import { useCopyToClipboard } from 'usehooks-ts';
import { TabbedItemEditor } from './tabbed-item-editor';

interface MultipleChoiceProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
    isSingleChoice?: boolean;
}

const getOptionType = (option: ItemComponent): ChoiceResponseOptionType => {
    const optionType = option.role as keyof typeof ChoiceResponseOptionType;
    return optionType as ChoiceResponseOptionType;
}


export const ContentItem = (props: {
    component: ItemComponent,
    onUpdateComponent: (component: ItemComponent) => void
}) => {
    const optionType = getOptionType(props.component);
    const renderContent = () => {
        switch (optionType) {
            case ChoiceResponseOptionType.SimpleText:
                return <SimpleTextViewContentEditor
                    component={props.component}
                    onChange={props.onUpdateComponent}
                    label='Option label'
                />;
            case ChoiceResponseOptionType.FormattedText:
                return <TextViewContentEditor
                    component={props.component}
                    onChange={props.onUpdateComponent}
                    hideToggle={true}
                    useAdvancedMode={true}
                />;
            case ChoiceResponseOptionType.TextInput:
                return <TextInputContentConfig
                    component={props.component}
                    onChange={props.onUpdateComponent}
                    allowMultipleLines={false}
                />;
            case ChoiceResponseOptionType.NumberInput:
                return <NumberInputContentConfig
                    component={props.component}
                    onChange={props.onUpdateComponent}
                />;
            case ChoiceResponseOptionType.DateInput:
                return <DateInputContentConfig
                    component={props.component}
                    onChange={props.onUpdateComponent}
                />;
            case ChoiceResponseOptionType.Cloze:
                return <ClozeContentConfig
                    component={props.component as ItemGroupComponent}
                    onChange={props.onUpdateComponent}
                />;
            case ChoiceResponseOptionType.TimeInput:
                return <TimeInputContentConfig
                    component={props.component as ItemGroupComponent}
                    onChange={props.onUpdateComponent}
                    hideLabel={false}
                />;
            case ChoiceResponseOptionType.DisplayText:
                return <SimpleTextViewContentEditor
                    component={props.component}
                    onChange={props.onUpdateComponent}
                    label='Display text'
                    hideStyling={false}
                />;
            default:
                console.warn('Unknown / unimplemented choice option type:', optionType);
                return <div>Unknown option type</div>;
        }
    }
    return renderContent();
}

const mcgItemIconLookup = (item: ItemComponent): React.ReactNode => {
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
    return icons[getOptionType(item)] || <Check className='size-4 text-muted-foreground' />;
}

const mcgItemDescriptiveTextLookup = (item: ItemComponent, lang: string): string => {
    const typeHints = {
        [ChoiceResponseOptionType.SimpleText]: 'Text',
        [ChoiceResponseOptionType.FormattedText]: 'Formatted Text',
        [ChoiceResponseOptionType.TextInput]: 'Text Input',
        [ChoiceResponseOptionType.NumberInput]: 'Number Input',
        [ChoiceResponseOptionType.TimeInput]: 'Time Input',
        [ChoiceResponseOptionType.DateInput]: 'Date Input',
        [ChoiceResponseOptionType.Cloze]: 'Cloze',
        [ChoiceResponseOptionType.DisplayText]: 'Display Text',
    };

    const itemType = getOptionType(item);
    const typeText = typeHints[itemType] ?? 'Unknown Type';
    return itemType == ChoiceResponseOptionType.SimpleText ? (localisedObjectToMap(item.content).get(lang) ?? typeText) : typeText;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const [draggedKey, setDraggedKey] = React.useState<string | null>();
    const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
    const lastItem = useRef<HTMLDivElement | null>(null);
    const [clipboardContent, setClipboardContent] = useCopyToClipboard();

    const relevantResponseGroupRoleString = props.isSingleChoice ? ItemComponentRole.SingleChoiceGroup : ItemComponentRole.MultipleChoiceGroup;
    const rgIndex = props.surveyItem.components!.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    const rg = props.surveyItem.components!.items[rgIndex ?? 0] as ItemGroupComponent;
    const choiceGroupIndex = rg.items.findIndex(comp => comp.role === relevantResponseGroupRoleString);
    const choiceGroup = rg.items[choiceGroupIndex] as ItemGroupComponent;
    const responseItems: ItemComponent[] = choiceGroup.items || [];

    const selectedItem = responseItems.find(item => item.key === selectedKey);
    const draggedItem = responseItems.find(item => item.key === draggedKey);

    const sortableResponseItems = responseItems.map((component, index) => {
        return {
            id: component.key || index.toString(), ...component
        }
    });

    // Hacky way to scroll to the last item when it is newly added
    useEffect(() => {
        const lastResponseItem = sortableResponseItems.at(-1);
        if (lastItem.current && lastResponseItem?.key == selectedKey) {
            lastItem.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [selectedKey, sortableResponseItems]);

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
        setSelectedKey(randomKey);
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

    return (
        <div className=''>
            <p className='font-semibold pb-2'>Options: <span className='text-muted-foreground'>({sortableResponseItems.length})</span></p>
            <SortableWrapper
                sortableID={'response-group-editor'}
                items={sortableResponseItems}
                onDraggedIdChange={(id) => {
                    setDraggedKey(id);
                }}
                onReorder={(activeIndex, overIndex) => {
                    const newItems = [...responseItems];
                    newItems.splice(overIndex, 0, newItems.splice(activeIndex, 1)[0]);
                    updateSurveyItemWithNewOptions(newItems);
                }}
                dragOverlayItem={(draggedKey && draggedItem) ?
                    <ItemOverviewRow
                        i={sortableResponseItems.findIndex(item => item.id === draggedKey)}
                        isDragOverlay={true}
                        isSelected={draggedItem.key === selectedKey}
                        isBeingDragged={true}
                        itemIconLookup={mcgItemIconLookup}
                        itemDescriptiveTextLookup={(item) => mcgItemDescriptiveTextLookup(item, selectedLanguage)}
                        itemList={responseItems} />
                    : null}
            >
                <div className='space-y-2'>
                    <ol className='max-h-64 overflow-y-auto space-y-1'>
                        {sortableResponseItems.map((sortableResponseItem, i) => (
                            <SortableItem
                                id={sortableResponseItem.id}
                                key={sortableResponseItem.id}>
                                <div ref={i == sortableResponseItems.length - 1 ? lastItem : null}>
                                    <ItemOverviewRow
                                        i={i}
                                        isDragOverlay={false}
                                        isSelected={selectedKey === sortableResponseItem.key}
                                        isBeingDragged={draggedKey === sortableResponseItem.key}
                                        itemIconLookup={mcgItemIconLookup}
                                        itemDescriptiveTextLookup={(item) => mcgItemDescriptiveTextLookup(item, selectedLanguage)}
                                        itemList={responseItems}
                                        getClipboardValue={() => clipboardContent?.toString() ?? ""}
                                        setClipboardValue={(value) => setClipboardContent(value)}
                                        onSelectionUpdate={(key) => {
                                            setSelectedKey(key);
                                            setDraggedKey(null);
                                        }}
                                        onListUpdate={(newItemList) => {
                                            updateSurveyItemWithNewOptions(newItemList);
                                        }}
                                    />
                                </div>
                            </SortableItem>
                        ))}
                    </ol>
                    <div className='flex justify-center w-full'>
                        <AddDropdown
                            options={[
                                { key: ChoiceResponseOptionType.SimpleText, label: 'Text', icon: <Heading className='size-4 text-muted-foreground me-2' /> },
                                { key: ChoiceResponseOptionType.FormattedText, label: 'Formatted Text', icon: <LetterText className='size-4 text-muted-foreground me-2' /> },
                                { key: ChoiceResponseOptionType.TextInput, label: 'Text Input', icon: <FormInput className='size-4 text-muted-foreground me-2' /> },
                                { key: ChoiceResponseOptionType.NumberInput, label: 'Number Input', icon: <Binary className='size-4 text-muted-foreground me-2' /> },
                                { key: ChoiceResponseOptionType.TimeInput, label: 'Time Input', icon: <Clock className='size-4 text-muted-foreground me-2' /> },
                                { key: ChoiceResponseOptionType.DateInput, label: 'Date Input', icon: <Calendar className='size-4 text-muted-foreground me-2' /> },
                                { key: ChoiceResponseOptionType.Cloze, label: 'Cloze', icon: <SquareStack className='size-4 text-muted-foreground me-2' /> },
                                { key: ChoiceResponseOptionType.DisplayText, label: 'Display Text', icon: <Heading className='size-4 text-muted-foreground me-2' /> },
                            ]}
                            onAddItem={onAddItem}
                        />
                    </div>
                </div>
            </SortableWrapper>

            <TabbedItemEditor isActive={selectedItem != undefined} contentEditor={selectedItem && <ContentItem
                component={selectedItem}
                onUpdateComponent={(updatedComponent: ItemComponent) => {
                    const newItems = [...responseItems];
                    const itemToUpdate = newItems.find(item => item.key === selectedItem.key);
                    if (itemToUpdate) {
                        Object.assign(itemToUpdate, updatedComponent);
                        updateSurveyItemWithNewOptions(newItems);
                    }
                }} />} conditionsEditor={selectedItem && <p className="text-sm">Condition Editor.</p>} title={'Selected Option:'} />
        </div>
    );
};

export default MultipleChoice;

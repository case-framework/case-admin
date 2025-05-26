import SortableWrapper from "@/components/survey-editor/components/general/SortableWrapper";
import AddDropdown from "@/components/survey-editor/components/general/add-dropdown";
import { localisedObjectToMap } from "@/components/survey-editor/utils/localeUtils";
import { generateLocStrings } from "case-editor-tools/surveys/utils/simple-generators";
import { Binary, Calendar, Clock, CornerDownLeft, FormInput, Heading, SquareChevronDown, TypeIcon, TypeOutlineIcon, Copy, Trash2 } from "lucide-react";
import React from "react";
import { ItemComponent, ItemGroupComponent, Expression } from "survey-engine/data_types";
import TextInputContentConfig from "./text-input-content-config";
import NumberInputContentConfig from "./number-input-content-config";
import DateInputContentConfig from "./date-input-content-config";
import MarkdownContentEditor from "../markdown-content-editor";
import TimeInputContentConfig from "./time-input-content-config";
import { ClozeItemType } from "@/components/survey-renderer/SurveySingleItemView/ResponseComponent/InputTypes/ClozeQuestion";
import DropdownContentConfig from "./dropdown-content-config";
import { SimpleTextViewContentEditor } from "./text-view-content-editor";
import { useSurveyEditorCtx } from "@/components/survey-editor/surveyEditorContext";
import { Separator } from "@/components/ui/separator";
import ComponentEditor, { ComponentEditorGenericProps } from '../component-editor';
import { PopoverKeyBadge } from '../../KeyBadge';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import SurveyExpressionEditor from '../../survey-expression-editor';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


interface ClozeContentConfigProps {
    component: ItemGroupComponent;
    onChange: (newComp: ItemGroupComponent) => void;
}

const getClozeItemType = (item: ItemComponent): ClozeItemType => {
    const itemType = item.role as keyof typeof ClozeItemType;
    return itemType as ClozeItemType;
}

const getItemPreviewLabel = (item: ItemComponent, lang: string): React.ReactNode => {
    const itemType = getClozeItemType(item);

    const content = localisedObjectToMap(item.content).get(lang);

    switch (itemType) {
        case ClozeItemType.SimpleText:
        case ClozeItemType.TextInput:
        case ClozeItemType.NumberInput:
        case ClozeItemType.TimeInput:
        case ClozeItemType.DateInput:
            return <p className='text-sm text-start'>
                {content}
                {!content && <span className='text-muted-foreground text-xs text-start font-mono uppercase'>
                    {'- No label defined -'}
                </span>}
            </p>
        case ClozeItemType.Markdown:
            return <p className='text-muted-foreground text-xs text-start font-mono uppercase'>
                {'- markdown content -'}
            </p>
        case ClozeItemType.Dropdown:
            return <p className='text-muted-foreground text-xs text-start font-mono uppercase'>
                {'- dropdown -'}
            </p>
        case ClozeItemType.LineBreak:
            return <p className='text-muted-foreground text-xs text-start font-mono uppercase'>
                {'- line break -'}
            </p>
    }
}

const ClozeItemPreview: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();


    return <div className='flex items-center gap-4'>
        <span>
            {clozeItemIconLookup(props.component)}
        </span>
        <div className='min-w-14 flex justify-center'>
            <PopoverKeyBadge
                headerText='Item Key'
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

        {getItemPreviewLabel(props.component, selectedLanguage)}

    </div>
}

const ClozeItemQuickEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const clozeItemType = getClozeItemType(props.component);

    const renderQuickEditor = () => {
        switch (clozeItemType) {
            case ClozeItemType.SimpleText:
                return <SimpleTextViewContentEditor
                    component={props.component}
                    onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
                    label='Text Content'
                    placeholder='Enter text content...'
                />;
            case ClozeItemType.Dropdown:
                return <div className="px-1">
                    <DropdownContentConfig
                        component={props.component}
                        onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
                        hideContentInput={false}
                        hideDescriptionInput={false}
                    />
                </div>;
            case ClozeItemType.TextInput:
            case ClozeItemType.NumberInput:
            case ClozeItemType.DateInput:
                const description = localisedObjectToMap(props.component.description).get(selectedLanguage) || '';
                return <div className='space-y-1.5'>
                    <Label>Placeholder</Label>
                    <Input
                        value={description}
                        placeholder='Enter placeholder...'
                        onChange={(e) => {
                            const descriptionMap = localisedObjectToMap(props.component.description);
                            descriptionMap.set(selectedLanguage, e.target.value);
                            props.onChange?.({
                                ...props.component,
                                description: generateLocStrings(descriptionMap),
                            })
                        }}
                    />
                </div>
        }
    }

    return <div>{renderQuickEditor()}</div>
}

const ClozeItemAdvancedEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const clozeItemType = getClozeItemType(props.component);

    const renderAdvancedEditor = () => {
        switch (clozeItemType) {
            case ClozeItemType.SimpleText:
                return <SimpleTextViewContentEditor
                    component={props.component}
                    onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
                    label='Text Content'
                    hideStyling={false}
                    placeholder='Enter text content...'
                />;
            case ClozeItemType.Dropdown:
                return <DropdownContentConfig
                    component={props.component}
                    onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
                    hideContentInput={false}
                    hideDescriptionInput={false}
                />
            case ClozeItemType.TextInput:
                return <TextInputContentConfig
                    component={props.component}
                    onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
                    allowMultipleLines={true}
                    hideLabel={false}
                />;
            case ClozeItemType.NumberInput:
                return <NumberInputContentConfig
                    component={props.component}
                    onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
                    hideLabel={false}
                />;
            case ClozeItemType.DateInput:
                return <DateInputContentConfig
                    component={props.component}
                    onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
                    hideLabel={false}
                />;
            case ClozeItemType.TimeInput:
                return <TimeInputContentConfig
                    component={props.component as ItemGroupComponent}
                    onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
                    hideLabel={false}
                />;
            case ClozeItemType.Markdown:
                return <div className='space-y-1.5' data-no-dnd="true">
                    <MarkdownContentEditor
                        content={localisedObjectToMap(props.component.content).get(selectedLanguage) || ''}
                        onUpdateContent={(content) => {
                            const updatedComponent = { ...props.component };
                            const updatedContent = localisedObjectToMap(updatedComponent.content);
                            updatedContent.set(selectedLanguage, content);
                            updatedComponent.content = generateLocStrings(updatedContent);
                            props.onChange?.(updatedComponent);
                        }}
                    />
                </div>;
            case ClozeItemType.LineBreak:
                return <div className="text-sm text-muted-foreground">Line break - no configuration needed.</div>;
            default:
                console.warn('Unknown / unimplemented item type:', clozeItemType);
                return <div className="text-danger text-sm">Unknown / unimplemented cloze item type: {clozeItemType}</div>;
        }
    }

    return (
        <div className='space-y-4 pt-2 pb-8 min-w-[600px]'>
            <div className='flex justify-between'>
                <div className='min-w-14 w-fit flex justify-center'>
                    <PopoverKeyBadge
                        headerText='Item Key'
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

            {renderAdvancedEditor()}

            <Separator />

            <div className='space-y-2'>
                <h3 className='text-sm font-semibold'>
                    Conditions
                </h3>
                <div>
                    <SurveyExpressionEditor
                        label='Display condition'
                        expression={props.component.displayCondition as Expression | undefined}
                        onChange={(newExpression) => {
                            props.onChange?.({ ...props.component, displayCondition: newExpression });
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

const icons = {
    [ClozeItemType.SimpleText]: <TypeIcon className='size-4 text-muted-foreground' />,
    [ClozeItemType.Dropdown]: <SquareChevronDown className='size-4 text-muted-foreground' />,
    [ClozeItemType.TextInput]: <FormInput className='size-4 text-muted-foreground' />,
    [ClozeItemType.NumberInput]: <Binary className='size-4 text-muted-foreground' />,
    [ClozeItemType.TimeInput]: <Clock className='size-4 text-muted-foreground' />,
    [ClozeItemType.DateInput]: <Calendar className='size-4 text-muted-foreground' />,
    [ClozeItemType.Markdown]: <TypeOutlineIcon className='size-4 text-muted-foreground' />,
    [ClozeItemType.LineBreak]: <CornerDownLeft className='size-4 text-muted-foreground' />,
};

const clozeItemIconLookup = (item: ItemComponent): React.ReactNode => {
    const clozeItemType = getClozeItemType(item);
    return icons[clozeItemType] || <Heading className='size-4 text-muted-foreground' />;
}


const typeHints = {
    [ClozeItemType.SimpleText]: 'Simple Text',
    [ClozeItemType.Markdown]: 'Markdown Text',
    [ClozeItemType.Dropdown]: 'Dropdown',
    [ClozeItemType.TextInput]: 'Text Input',
    [ClozeItemType.NumberInput]: 'Number Input',
    [ClozeItemType.TimeInput]: 'Time Input',
    [ClozeItemType.DateInput]: 'Date Input',
    [ClozeItemType.LineBreak]: 'Line Break',
};

const getQuickEditor = (item: ItemComponent) => {
    const clozeItemType = getClozeItemType(item);
    switch (clozeItemType) {
        case ClozeItemType.LineBreak:
        case ClozeItemType.Markdown:
        case ClozeItemType.TimeInput:
            return undefined;
        default:
            return ClozeItemQuickEditor;
    }
}

const getAdvancedEditor = (item: ItemComponent) => {
    const clozeItemType = getClozeItemType(item);
    switch (clozeItemType) {
        case ClozeItemType.LineBreak:
            return undefined;
        default:
            return ClozeItemAdvancedEditor;
    }
}

const ClozeItemEditor = (props: {
    item: ItemComponent;
    existingKeys?: string[];
    onChange: (newItem: ItemComponent) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    isBeingDragged?: boolean;
}) => {
    return <ComponentEditor
        isSortable={true}
        isDragged={props.isBeingDragged}
        previewContent={ClozeItemPreview}
        component={props.item}
        usedKeys={props.existingKeys}
        onChange={(newItem) => props.onChange(newItem)}
        quickEditorContent={getQuickEditor(props.item)}
        advancedEditorContent={getAdvancedEditor(props.item)}
        contextMenuItems={[
            {
                type: 'item',
                label: 'Duplicate',
                icon: <Copy className='size-4' />,
                onClick: props.onDuplicate
            },
            {
                type: 'separator'
            },
            {
                type: 'item',
                label: 'Delete',
                icon: <Trash2 className='size-4' />,
                onClick: props.onDelete
            }
        ]}
    />
}

const ClozeContentConfig: React.FC<ClozeContentConfigProps> = (props) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const clozeItems = props.component.items || [];
    const draggedItem = clozeItems.find(item => item.key === draggedId);

    const updateComponent = (newItems: ItemComponent[]) => {
        props.onChange({
            ...props.component,
            items: newItems,
        });
    }

    const onChangeItem = (key: string, newItem: ItemComponent) => {
        const newItems = clozeItems.map(item => {
            if (item.key === key) {
                return newItem;
            }
            return item;
        });
        updateComponent(newItems);
    }

    const onDuplicateItem = (item?: ItemComponent, index?: number) => {
        if (!item) {
            return;
        }
        const newItem = { ...item, key: Math.random().toString(36).substring(9) };
        const newItems = [...clozeItems];
        newItems.splice(index !== undefined ? index + 1 : clozeItems.length, 0, newItem);
        updateComponent(newItems);
    }

    const onDeleteItem = (item?: ItemComponent) => {
        if (!item) {
            return;
        }
        if (!confirm('Are you sure you want to delete this cloze item?')) {
            return;
        }
        const newItems = clozeItems.filter((i) => {
            return i.key !== item.key;
        });
        updateComponent(newItems);
    }

    const onAddItem = (keyOfSelectedItem: string) => {
        const randomKey = Math.random().toString(36).substring(9);
        const itemType = keyOfSelectedItem as keyof typeof ClozeItemType;
        const newItem = {
            key: randomKey,
            role: itemType,
        }

        const newItems = [...clozeItems, newItem];
        updateComponent(newItems);
    };

    const usedKeys = clozeItems.map(item => item.key!) ?? [];

    return (
        <div className='space-y-4'>
            <div>
                <p className='font-semibold pb-2'>Cloze Items: <span className='text-muted-foreground'>({clozeItems.length})</span></p>
                <p className='text-xs text-muted-foreground pb-2'>
                    Drag items to reorder
                </p>

                <SortableWrapper
                    sortableID={'cloze-items-editor'}
                    items={clozeItems.map((item, index) => {
                        return {
                            id: item.key || index.toString(),
                        }
                    })}
                    onDraggedIdChange={(id) => {
                        setDraggedId(id);
                    }}
                    onReorder={(activeIndex, overIndex) => {
                        const newItems = [...clozeItems];
                        newItems.splice(activeIndex, 1);
                        newItems.splice(overIndex, 0, clozeItems[activeIndex]);
                        updateComponent(newItems);
                    }}
                    dragOverlayItem={(draggedId && draggedItem) ?
                        <ClozeItemEditor
                            item={draggedItem}
                            onChange={() => { }}
                            onDelete={() => { }}
                            onDuplicate={() => { }}
                        />
                        : null}
                >
                    <ol className='px-1 space-y-1 py-2'>
                        {clozeItems.length === 0 && <p className='text-sm text-primary'>
                            No cloze items defined.
                        </p>}
                        {clozeItems.map((item, index) => {
                            return <ClozeItemEditor
                                key={item.key || index}
                                item={item}
                                existingKeys={usedKeys}
                                onChange={(newItem) => onChangeItem(item.key!, newItem)}
                                onDelete={() => onDeleteItem(item)}
                                onDuplicate={() => onDuplicateItem(item, index)}
                                isBeingDragged={draggedId === item.key}
                            />
                        })}
                    </ol>
                </SortableWrapper>

                <div className='w-full flex items-center justify-center'>
                    <AddDropdown
                        options={[
                            { key: ClozeItemType.SimpleText, label: typeHints[ClozeItemType.SimpleText], icon: icons[ClozeItemType.SimpleText] },
                            { key: ClozeItemType.Markdown, label: typeHints[ClozeItemType.Markdown], icon: icons[ClozeItemType.Markdown] },
                            { key: ClozeItemType.Dropdown, label: typeHints[ClozeItemType.Dropdown], icon: icons[ClozeItemType.Dropdown] },
                            { key: ClozeItemType.TextInput, label: typeHints[ClozeItemType.TextInput], icon: icons[ClozeItemType.TextInput] },
                            { key: ClozeItemType.NumberInput, label: typeHints[ClozeItemType.NumberInput], icon: icons[ClozeItemType.NumberInput] },
                            { key: ClozeItemType.TimeInput, label: typeHints[ClozeItemType.TimeInput], icon: icons[ClozeItemType.TimeInput] },
                            { key: ClozeItemType.DateInput, label: typeHints[ClozeItemType.DateInput], icon: icons[ClozeItemType.DateInput] },
                            { key: ClozeItemType.LineBreak, label: typeHints[ClozeItemType.LineBreak], icon: icons[ClozeItemType.LineBreak] },
                        ]}
                        onAddItem={onAddItem}
                    />
                </div>
            </div>
        </div>
    );
};

export default ClozeContentConfig;

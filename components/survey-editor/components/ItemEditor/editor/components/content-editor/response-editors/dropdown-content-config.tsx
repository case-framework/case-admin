import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { Circle, Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { ItemComponent, ItemGroupComponent } from 'survey-engine/data_types';
import ComponentEditor, { ComponentEditorGenericProps } from '../component-editor';
import { PopoverKeyBadge } from '../../KeyBadge';

interface DropdownContentConfigProps {
    hideContentInput?: boolean;
    contentInputLabel?: string;
    contentInputPlaceholder?: string;
    hideDescriptionInput?: boolean;
    descriptionInputLabel?: string;
    descriptionInputPlaceholder?: string;
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
}

const DropdownOptionPreview: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const currentContent = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';

    return (
        <div className='flex items-center gap-4'>
            <div className='min-w-10 flex justify-center'>
                <PopoverKeyBadge
                    headerText='Option Key'
                    className='w-full'
                    allOtherKeys={props.usedKeys?.filter(k => k !== props.component.key) ?? []}
                    isHighlighted={props.isSelected}
                    itemKey={props.component.key ?? ''}
                    onKeyChange={(newKey) => {
                        if (newKey.length < 1) {
                            toast.error('Key cannot be empty');
                            return;
                        }
                        if (props.usedKeys?.includes(newKey)) {
                            toast.error('Key already in use');
                            return;
                        }
                        props.onChange?.({
                            ...props.component,
                            key: newKey
                        })
                    }} />
            </div>
            <Input
                value={currentContent}
                className='grow h-8'
                data-no-dnd={true}
                onChange={(e) => {
                    const updatedContent = localisedObjectToMap(props.component.content);
                    updatedContent.set(selectedLanguage, e.target.value);
                    const updatedComponent = {
                        ...props.component,
                        content: generateLocStrings(updatedContent)
                    };
                    props.onChange?.(updatedComponent);
                }}
                placeholder={'Enter option content...'}
            />
        </div>
    );
};

const DropdownContentConfig: React.FC<DropdownContentConfigProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const currentLabel = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';
    const currentPlaceholder = localisedObjectToMap(props.component.description).get(selectedLanguage) || '';
    const currentItems = (props.component as ItemGroupComponent).items || [];

    const draggedItem = currentItems.find(ri => ri.key === draggedId);

    const usedKeys = currentItems.map(comp => comp.key || '');


    return (
        <div className='space-y-4'>
            {!props.hideContentInput && <div className='space-y-1.5'>
                <Label
                    htmlFor={props.component.key + 'label'}
                >
                    {props.contentInputLabel || 'Label'}
                </Label>
                <Input
                    id={props.component.key + 'label'}
                    value={currentLabel}
                    onChange={(e) => {
                        const updatedComponent = { ...props.component };
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        props.onChange(updatedComponent);
                    }}
                    placeholder={props.contentInputPlaceholder || 'Enter label...'}
                />
            </div>}

            {!props.hideDescriptionInput && <div className='space-y-1.5'>
                <Label
                    htmlFor={props.component.key + 'placeholder'}
                >
                    {props.descriptionInputLabel || 'Placeholder text'}
                </Label>
                <Input
                    id={props.component.key + 'placeholder'}
                    value={currentPlaceholder}
                    onChange={(e) => {
                        const updatedComponent = { ...props.component };
                        const updatedContent = localisedObjectToMap(updatedComponent.description);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.description = generateLocStrings(updatedContent);
                        props.onChange(updatedComponent);
                    }}
                    placeholder={props.descriptionInputPlaceholder || 'Enter placeholder...'}
                />
            </div>}


            <div>
                <SortableWrapper
                    sortableID={props.component.key + 'options'}
                    direction='vertical'
                    onDraggedIdChange={(id) => {
                        setDraggedId(id);
                    }}
                    items={currentItems.map((item, index) => {
                        return {
                            id: item.key || index.toString(),
                        }
                    })}
                    onReorder={(activeIndex, overIndex) => {
                        const newItems = [...currentItems];
                        newItems.splice(overIndex, 0, newItems.splice(activeIndex, 1)[0]);
                        props.onChange({
                            ...props.component,
                            items: newItems,
                        })
                    }}
                    dragOverlayItem={(draggedId && draggedItem) ?
                        <ComponentEditor
                            component={draggedItem}
                            previewContent={DropdownOptionPreview}
                            onChange={() => { }}
                        />
                        : null}
                >
                    <h3 className='text-sm font-semibold'>
                        Options: <span className='text-muted-foreground'>({currentItems.length})</span>
                    </h3>
                    <p className='text-xs text-muted-foreground mb-2'>
                        Drag options to reorder them.
                    </p>

                    <ol className='gap-1 flex flex-col items-center min-w-full' >
                        {currentItems.length === 0 && <p className='text-muted-foreground w-full text-center font-mono text-xs p-2 border border-border border-dashed rounded-md'>No options yet</p>}
                        {currentItems.map((item, index) => {
                            return <ComponentEditor
                                key={item.key || index}
                                isSortable={true}
                                component={item}
                                isDragged={draggedId === item.key}
                                usedKeys={usedKeys}
                                previewContent={DropdownOptionPreview}
                                onChange={(newComp) => {
                                    const newItems = [...currentItems];
                                    newItems[index] = newComp;
                                    props.onChange({
                                        ...props.component,
                                        items: newItems,
                                    })
                                }}
                                contextMenuItems={[
                                    {
                                        type: 'item',
                                        label: 'Delete',
                                        icon: <Trash2 className='size-4' />,
                                        onClick: () => {
                                            if (confirm('Are you sure you want to delete this option?')) {
                                                const newItems = [...currentItems];
                                                newItems.splice(index, 1);
                                                props.onChange({
                                                    ...props.component,
                                                    items: newItems,
                                                })
                                            }
                                        }
                                    },
                                ]}
                            />
                        })}

                        <div className="mt-2">
                            <AddDropdown
                                options={[
                                    { key: 'option', label: 'Option', icon: <Circle className='size-4 text-muted-foreground me-2' /> },
                                ]}
                                onAddItem={(type) => {
                                    if (type === 'option') {
                                        const newOption: ItemComponent = {
                                            key: currentItems.length.toString(),
                                            role: 'option',
                                        }
                                        props.onChange({
                                            ...props.component,
                                            items: [...currentItems, newOption],
                                        })
                                    }
                                }}
                            />
                        </div>
                    </ol>

                </SortableWrapper>

            </div>
        </div >


    );
};

export default DropdownContentConfig;

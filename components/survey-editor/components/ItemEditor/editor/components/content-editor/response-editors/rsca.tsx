import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { Circle, Copy, Rows, Trash2 } from 'lucide-react';
import React from 'react';
import { Expression, ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import { Separator } from '@/components/ui/separator';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { PopoverKeyBadge } from '../../KeyBadge';
import { ItemComponentRole } from '@/components/survey-editor/components/types';
import { SimpleTextViewContentEditor } from './text-view-content-editor';
import { StyleClassNameEditor } from './style-class-name-editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ComponentEditor, { ComponentEditorGenericProps } from '../component-editor';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import SurveyExpressionEditor from '../../survey-expression-editor';


interface RscaProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const ModeSelector = (props: {
    size: string,
    mode?: string,
    onChange: (size: string, mode: string) => void
}) => {
    return <div className='flex items-center gap-2'>
        <p className='w-20 font-semibold text-sm'>{props.size}</p>
        <Select value={props.mode || ''}
            onValueChange={(value) => {
                props.onChange(props.size, value);
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select a render mode..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='vertical'>Vertical</SelectItem>
                <SelectItem value='horizontal'>Horizontal</SelectItem>
                <SelectItem value='table'>Table</SelectItem>
            </SelectContent>
        </Select>
    </div>
}


const RscaCompPreview: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const rowLabel = localisedObjectToMap(props.component.content).get(selectedLanguage);

    return <div className='flex items-center gap-4'>
        <div className='min-w-14 flex justify-center'>
            <PopoverKeyBadge
                headerText='Key'
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
        {rowLabel && <p className='text-sm text-start'>
            {rowLabel}
        </p>}
        {!rowLabel && <p className='text-muted-foreground text-xs text-start font-mono uppercase'>
            {'- No label defined -'}
        </p>}
    </div>
}

const OptionQuickEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    return <div>
        <SimpleTextViewContentEditor
            component={props.component}
            onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
            hideLabel={false}
            label='Option Label'
            placeholder='Enter option label...'
        />
    </div>
}


const OptionEditor = (props: {
    option: ItemComponent;
    existingKeys?: string[];
    hideEditor?: boolean;
    onChange: (newOption: ItemComponent) => void;
    onDelete: () => void;
    isBeingDragged?: boolean;
}) => {

    return <ComponentEditor
        isSortable={true}
        isDragged={props.isBeingDragged}
        previewContent={RscaCompPreview}
        component={props.option}
        usedKeys={props.existingKeys}
        onChange={(newOption) => props.onChange(newOption)}
        quickEditorContent={props.hideEditor ? undefined : OptionQuickEditor}
        contextMenuItems={[
            {
                type: 'item',
                label: 'Delete',
                icon: <Trash2 className='size-4' />,
                onClick: props.onDelete
            }
        ]}

    />
}

export const OptionsEditor = (props: {
    options: ItemComponent[],
    hideEditor?: boolean,
    onChange: (newOptions: ItemComponent[]) => void
}) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const draggedItem = props.options.find(option => option.key === draggedId);

    return <div>
        <p className='font-semibold'>
            Options ({props.options.length})
        </p>
        <p className='text-xs text-muted-foreground'>
            These options will be used for each row
            (drag items to reorder)
        </p>

        <SortableWrapper
            sortableID={`options-for-rsca`}
            items={props.options.map((option, index) => {
                return {
                    id: option.key || index.toString(),
                }
            })}
            onDraggedIdChange={(id) => {
                setDraggedId(id);
            }}
            onReorder={(activeIndex, overIndex) => {
                const newItems = [...props.options];
                newItems.splice(activeIndex, 1);
                newItems.splice(overIndex, 0, props.options[activeIndex]);
                props.onChange(newItems);

            }}
            dragOverlayItem={(draggedId && draggedItem) ?
                <OptionEditor
                    option={draggedItem}
                    onChange={() => { }}
                    onDelete={() => { }}
                />
                : null}
        >

            <ol className='px-1 space-y-1 py-2'>
                {props.options.length === 0 && <p className='text-sm text-primary'>
                    No options defined.
                </p>}
                {props.options.map((option, index) => {
                    return <OptionEditor
                        key={option.key || index}
                        option={option}
                        hideEditor={props.hideEditor}
                        existingKeys={props.options.map(o => o.key || index.toString())}
                        onChange={(newOption) => {
                            const newOptions = props.options.map((o) => {
                                if (o.key === option.key) {
                                    return newOption;
                                }
                                return o;
                            });
                            props.onChange(newOptions);
                        }}
                        onDelete={() => {
                            const newOptions = props.options.filter((o) => {
                                return o.key !== option.key;
                            });
                            props.onChange(newOptions);
                        }}
                        isBeingDragged={draggedId === option.key}
                    />
                })}
            </ol>
        </SortableWrapper>

        <div className='w-full flex items-center justify-center'>
            <AddDropdown
                options={[
                    { key: ItemComponentRole.Option, label: 'Option', icon: <Circle className='size-4 text-neutral-500 me-2' /> },
                ]}
                onAddItem={(type) => {
                    if (type === ItemComponentRole.Option) {
                        const newOption: ItemComponent = {
                            key: Math.random().toString(36).substring(9),
                            role: ItemComponentRole.Option,
                        }
                        props.onChange([...props.options, newOption]);
                    }
                }}
            />
        </div>
    </div>
}

enum RscaStyleKeys {
    horizontalModeLabelPlacement = 'horizontalModeLabelPlacement',
    horizontalModeClassName = 'horizontalModeClassName',
    verticalModeClassName = 'verticalModeClassName',
    tableModeClassName = 'tableModeClassName',
    verticalModeReverseOrder = 'verticalModeReverseOrder',
}



const RowQuickEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    return <div>
        <SimpleTextViewContentEditor
            component={props.component}
            onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
            hideLabel={false}
            label='Row Label'
            placeholder='Enter row label...'
        />
    </div>
}

const RowAdvancedEditor: React.FC<ComponentEditorGenericProps> = (props) => {

    const horizontalModeLabelPlacement = props.component.style?.find(s => s.key === RscaStyleKeys.horizontalModeLabelPlacement)?.value || 'bottom';

    const onRowStyleChange = (key: string, newValue: string | undefined) => {
        const existingStyles = [...props.component.style || []];
        const index = existingStyles.findIndex(st => st.key === key);
        if (newValue) {
            if (index > -1) {
                existingStyles[index] = { key, value: newValue };
            } else {
                existingStyles.push({ key, value: newValue });
            }
        } else {
            if (index > -1) {
                existingStyles.splice(index, 1);
            }
        }
        props.onChange?.({ ...props.component, style: existingStyles });
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

        <SimpleTextViewContentEditor
            component={props.component}
            onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
            hideLabel={false}
            label='Row Label'
            placeholder='Enter row label...'
        />

        <Separator />

        <div className='space-y-2'>
            <h3 className='text-sm font-semibold'>
                View mode specific settings
            </h3>

            <div className='flex items-center gap-2 w-full'>
                <Label className='text-xs w-1/3'>Horizontal Mode Label Placement</Label>
                <div className='w-2/3'>
                    <Select
                        value={horizontalModeLabelPlacement}
                        onValueChange={(value) => {
                            const existingStyles = [...props.component.style || []];
                            const index = existingStyles.findIndex(st => st.key === RscaStyleKeys.horizontalModeLabelPlacement);
                            if (value === 'bottom') {
                                if (index > -1) {
                                    existingStyles.splice(index, 1);
                                }
                            } else {
                                if (index > -1) {
                                    existingStyles[index] = { key: RscaStyleKeys.horizontalModeLabelPlacement, value };
                                } else {
                                    existingStyles.push({ key: RscaStyleKeys.horizontalModeLabelPlacement, value });
                                }
                            }

                            props.onChange?.({
                                ...props.component,
                                style: existingStyles
                            })
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a label placement..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='bottom'>Bottom</SelectItem>
                            <SelectItem value='top'>Top</SelectItem>
                            <SelectItem value='none'>Hidden</SelectItem>
                        </SelectContent>
                    </Select>


                </div>


            </div>

            <StyleClassNameEditor
                styles={props.component.style || []}
                styleKey={RscaStyleKeys.horizontalModeClassName}
                label={"Horizontal Mode Class Name"}
                onChange={onRowStyleChange} />

            <StyleClassNameEditor
                styles={props.component.style || []}
                styleKey={RscaStyleKeys.verticalModeClassName}
                label={"Vertical Mode Class Name"}
                onChange={onRowStyleChange} />

            <StyleClassNameEditor
                styles={props.component.style || []}
                styleKey={RscaStyleKeys.tableModeClassName}
                label={"Table Mode Class Name"}
                onChange={onRowStyleChange} />
        </div>

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
    </div >
}

const RowsEditor = (props: {
    rows: ItemComponent[],
    onChange: (newRows: ItemComponent[]) => void
}) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const draggedItem = props.rows.find(row => row.key === draggedId);

    const onChangeRow = (key: string, newRow: ItemComponent) => {
        const newRows = props.rows.map(row => {
            if (row.key === key) {
                return newRow;
            }
            return row;
        });
        props.onChange(newRows);
    }

    const onDuplicateRow = (row?: ItemComponent, index?: number) => {
        if (!row) {
            return;
        }
        const newRow = { ...row, key: Math.random().toString(36).substring(9) };
        const newRows = [...props.rows];
        newRows.splice(index !== undefined ? index + 1 : props.rows.length, 0, newRow);
        props.onChange(newRows);
    }

    const onDeleteRow = (row?: ItemComponent) => {
        if (!row) {
            return;
        }
        if (!confirm('Are you sure you want to delete this row?')) {
            return;
        }
        const newRows = props.rows.filter((o) => {
            return o.key !== row.key;
        });
        props.onChange(newRows);
    }


    return <div>
        <p className='font-semibold'>
            Rows ({props.rows.length})
        </p>
        <p className='text-xs text-muted-foreground'>
            Drag items to reorder
        </p>

        <SortableWrapper
            sortableID={`rows-for-rsca`}
            items={props.rows.map((option, index) => {
                return {
                    id: option.key || index.toString(),
                }
            })}
            onDraggedIdChange={(id) => {
                setDraggedId(id);
            }}
            onReorder={(activeIndex, overIndex) => {
                const newItems = [...props.rows];
                newItems.splice(activeIndex, 1);
                newItems.splice(overIndex, 0, props.rows[activeIndex]);
                props.onChange(newItems);

            }}
            dragOverlayItem={(draggedId && draggedItem) ?
                <ComponentEditor
                    isDragged={true}
                    component={draggedItem}
                    previewContent={RscaCompPreview}
                />
                : null}
        >

            <ol className='px-1 space-y-1 py-2'>
                {props.rows.length === 0 && <p className='text-sm text-primary'>
                    No rows defined.
                </p>}
                {props.rows.map((row, index) => {
                    return <ComponentEditor
                        key={row.key || index}
                        isSortable={true}
                        isDragged={draggedId === row.key}
                        component={row}
                        usedKeys={props.rows.map(o => o.key!)}
                        onChange={(newComponent) => onChangeRow(row.key!, newComponent)}
                        contextMenuItems={[
                            {
                                type: 'item',
                                label: 'Duplicate',
                                icon: <Copy className='size-4' />,
                                onClick: () => onDuplicateRow(row, index)
                            },
                            {
                                type: 'separator'
                            },
                            {
                                type: 'item',
                                label: 'Delete',
                                icon: <Trash2 className='size-4' />,
                                onClick: onDeleteRow
                            }
                        ]}
                        previewContent={RscaCompPreview}
                        quickEditorContent={RowQuickEditor}
                        advancedEditorContent={RowAdvancedEditor}
                    />
                })}
            </ol>
        </SortableWrapper>

        <div className='w-full flex items-center justify-center'>
            <AddDropdown
                options={[
                    { key: ItemComponentRole.Row, label: 'Row', icon: <Rows className='size-4 text-neutral-500 me-2' /> },
                ]}
                onAddItem={(type) => {
                    if (type === ItemComponentRole.Row) {
                        const newRow: ItemComponent = {
                            key: Math.random().toString(36).substring(9),
                            role: ItemComponentRole.Row,
                        }
                        props.onChange([...props.rows, newRow]);
                    }
                }}
            />
        </div>
    </div>
}

const Rsca: React.FC<RscaProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const rscaGroupIndex = rg.items.findIndex(comp => comp.role === ItemComponentRole.ResponsiveSingleChoiceArray);
    if (rscaGroupIndex === undefined || rscaGroupIndex === -1) {
        return <p>Responsive single choice array not found</p>;
    }
    const rscaGroup = rg.items[rscaGroupIndex] as ItemGroupComponent;
    if (!rscaGroup || !rscaGroup.items) {
        return <p>Single choice group not found</p>;
    }

    const styles = rscaGroup.style || [];

    const defaultMode = styles?.find(st => st.key === 'defaultMode')?.value;
    const smMode = styles?.find(st => st.key === 'smMode')?.value;
    const mdMode = styles?.find(st => st.key === 'mdMode')?.value;
    const lgMode = styles?.find(st => st.key === 'lgMode')?.value;
    const xlMode = styles?.find(st => st.key === 'xlMode')?.value;

    const useVerticalModeReverseOrder = styles?.find(st => st.key === RscaStyleKeys.verticalModeReverseOrder)?.value === 'true';

    const options = (rscaGroup.items.find(comp => comp.role === ItemComponentRole.Options) as ItemGroupComponent)?.items || [];
    const rows = (rscaGroup.items.filter(comp => comp.role === ItemComponentRole.Row) as ItemGroupComponent[]) || [];
    const errorHintComp = rscaGroup.items.find(comp => comp.role === ItemComponentRole.RowErrorHint) as ItemComponent;

    const onChangeRSCA = (newRSCA: ItemGroupComponent) => {
        const existingItems = props.surveyItem.components?.items || [];
        (existingItems[rgIndex] as ItemGroupComponent).items[rscaGroupIndex] = newRSCA;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingItems,
            }
        });
    };

    const onModeChange = (size: string, mode: string) => {
        const existingStyles = [...styles];
        const modeKey = `${size}Mode`;

        const index = existingStyles.findIndex(st => st.key === modeKey);
        if (index > -1) {
            existingStyles[index] = { key: modeKey, value: mode };
        } else {
            existingStyles.push({ key: modeKey, value: mode });
        }

        rscaGroup.style = existingStyles;
        onChangeRSCA(rscaGroup);
    }

    const triggerClassName = "text-sm data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:border data-[state=active]:border-slate-200 data-[state=active]:text-accent-foreground data-[state=active]:[box-shadow:none]";

    return (
        <div className='space-y-4'>
            <Tabs defaultValue="options-rows" className="mt-2">
                <div className="flex flex-row justify-end">
                    <TabsList className="bg-muted p-0.5 rounded-md border border-neutral-200 gap-1">
                        <TabsTrigger className={triggerClassName} value="options-rows">Options & Rows</TabsTrigger>
                        <TabsTrigger className={triggerClassName} value="extras">Extras</TabsTrigger>
                        {/* Use Badge here to indicate if there are any conditions */}
                    </TabsList>
                </div>
                <TabsContent value="options-rows">
                    <OptionsEditor
                        options={options}
                        onChange={(newOptions) => {
                            const optionsIndex = rscaGroup.items.findIndex(comp => comp.role === ItemComponentRole.Options);
                            if (optionsIndex === -1) {
                                rscaGroup.items.push({
                                    role: ItemComponentRole.Options,
                                    items: newOptions
                                });
                            } else {
                                rscaGroup.items[optionsIndex] = {
                                    role: ItemComponentRole.Options,
                                    items: newOptions
                                };
                            }
                            onChangeRSCA(rscaGroup);
                        }}
                    />
                    <RowsEditor
                        rows={rows}
                        onChange={(r) => {
                            const newRows = rscaGroup.items.filter(comp => comp.role !== ItemComponentRole.Row);
                            newRows.push(...r);
                            rscaGroup.items = newRows;
                            onChangeRSCA(rscaGroup);
                        }}
                    />
                </TabsContent>
                <TabsContent value="extras" className='space-y-4'>
                    <div className='space-y-2'>
                        <p className='font-semibold'>
                            Render mode for screen sizes:
                        </p>
                        <ModeSelector
                            size='default'
                            mode={defaultMode}
                            onChange={onModeChange}
                        />

                        <ModeSelector
                            size='sm'
                            mode={smMode}
                            onChange={onModeChange}
                        />

                        <ModeSelector
                            size='md'
                            mode={mdMode}
                            onChange={onModeChange}
                        />

                        <ModeSelector
                            size='lg'
                            mode={lgMode}
                            onChange={onModeChange}
                        />

                        <ModeSelector
                            size='xl'
                            mode={xlMode}
                            onChange={onModeChange}
                        />
                    </div>

                    <div className='space-y-2'>
                        <p className='font-semibold'>
                            Reverse option order in vertical mode:
                        </p>

                        <Label
                            className='flex items-center gap-2'
                            htmlFor='vertical-mode-reverse-order'
                        >
                            <Switch
                                id='vertical-mode-reverse-order'
                                checked={useVerticalModeReverseOrder}
                                onCheckedChange={(checked) => {
                                    let existingStyles = [...styles];

                                    const verticalModeReverseOrderKey = RscaStyleKeys.verticalModeReverseOrder;

                                    if (checked) {
                                        const index = existingStyles.findIndex(st => st.key === verticalModeReverseOrderKey);

                                        if (index > -1) {
                                            existingStyles[index] = { key: verticalModeReverseOrderKey, value: 'true' };
                                        } else {
                                            existingStyles.push({ key: verticalModeReverseOrderKey, value: 'true' });
                                        }
                                    } else {
                                        existingStyles = existingStyles.filter(st => st.key !== verticalModeReverseOrderKey);
                                    }

                                    rscaGroup.style = existingStyles;
                                    onChangeRSCA(rscaGroup);
                                }}
                            />

                            <span>
                                {useVerticalModeReverseOrder ? 'Yes' : 'No'}
                            </span>
                        </Label>

                    </div>

                    <div className='space-y-2'>

                        <Label
                            htmlFor='row-error-hint'
                            className='space-y-1.5'
                        >
                            <span className='font-semibold text-base'>
                                Error message if row is empty:
                            </span>

                            <Input
                                id='row-error-hint'
                                className='w-full'
                                value={errorHintComp ? localisedObjectToMap(errorHintComp.content).get(selectedLanguage) || '' : ''}
                                onChange={(e) => {
                                    const updatedComponent = errorHintComp ? { ...errorHintComp } : {
                                        key: Math.random().toString(36).substring(9),
                                        role: ItemComponentRole.RowErrorHint,
                                    };
                                    const updatedContent = localisedObjectToMap(updatedComponent.content);
                                    updatedContent.set(selectedLanguage, e.target.value);
                                    updatedComponent.content = generateLocStrings(updatedContent);


                                    const index = rscaGroup.items.findIndex(comp => comp.role === ItemComponentRole.RowErrorHint);
                                    if (index === -1) {
                                        rscaGroup.items.push(updatedComponent);
                                    } else {
                                        rscaGroup.items[index] = updatedComponent;
                                    }
                                    onChangeRSCA(rscaGroup);
                                }}
                                placeholder='Enter error message...'
                            />
                        </Label>

                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Rsca;

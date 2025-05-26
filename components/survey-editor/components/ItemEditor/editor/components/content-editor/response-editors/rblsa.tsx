import SortableWrapper from "@/components/survey-editor/components/general/SortableWrapper";
import AddDropdown from "@/components/survey-editor/components/general/add-dropdown";
import { ItemComponentRole } from "@/components/survey-editor/components/types";
import { localisedObjectToMap } from "@/components/survey-editor/utils/localeUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ResponsiveBipolarLikertArrayVariant } from "case-editor-tools/surveys/types";
import { generateLocStrings } from "case-editor-tools/surveys/utils/simple-generators";
import { Copy, Rows, Trash2 } from "lucide-react";
import { Expression, ItemGroupComponent, SurveySingleItem } from "survey-engine/data_types";
import { useSurveyEditorCtx } from "@/components/survey-editor/surveyEditorContext";
import { PopoverKeyBadge } from "../../KeyBadge";
import { StyleClassNameEditor } from "./style-class-name-editor";
import { OptionsEditor } from "./rsca";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import ComponentEditor, { ComponentEditorGenericProps } from "../component-editor";
import SurveyLanguageToggle from "@/components/survey-editor/components/general/SurveyLanguageToggle";
import SurveyExpressionEditor from "../../survey-expression-editor";

// TODO: Expected name would collide with existing def. Should be ...EditorProps to avoid conflicts, but wouldn't be consistent with others atm.
interface RblsaProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

enum RblsaStyleKeys {
    tableModeClassName = 'tableModeClassName',
    labelRowModeClassName = 'withLabelRowModeClassName',
    verticalModeClassName = 'verticalModeClassName',
}

const ModeSelector = (props: {
    size: string,
    mode?: ResponsiveBipolarLikertArrayVariant | undefined,
    onChange: (size: string, mode: ResponsiveBipolarLikertArrayVariant | undefined) => void
}) => {
    return <div className='flex items-center gap-2'>
        <p className='w-20 font-semibold text-sm'>{props.size}</p>
        <Select value={props.mode || ''}
            onValueChange={(value) => {
                props.onChange(props.size, value == 'default' ? undefined : value as ResponsiveBipolarLikertArrayVariant);
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select a render mode..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='default'>Default</SelectItem>
                <SelectItem value='withLabelRow'>With Label Row</SelectItem>
                <SelectItem value='vertical'>Vertical</SelectItem>
                <SelectItem value='table'>Table</SelectItem>
            </SelectContent>
        </Select>
    </div>
}

const RowPreview: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const rowStartLabelItem = (props.component as ItemGroupComponent).items.find(comp => comp.role == ItemComponentRole.StartLabel);
    const startLabel = localisedObjectToMap(rowStartLabelItem?.content).get(selectedLanguage) || '';
    const endLabelItem = (props.component as ItemGroupComponent).items.find(comp => comp.role == ItemComponentRole.EndLabel);
    const endLabel = localisedObjectToMap(endLabelItem?.content).get(selectedLanguage) || '';

    return <div className='flex items-center gap-4'>
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
        <div className="space-y-1 grow">
            <p className='text-sm text-start'>
                <span className='text-xs font-medium me-1 text-muted-foreground inline-block w-20'>
                    Start Label:
                </span>
                {startLabel}
                {!startLabel && <span className='text-muted-foreground text-xs text-start font-mono uppercase'>
                    {'- No label defined -'}
                </span>}
            </p>
            <Separator />
            <p className='text-sm text-start'>
                <span className='text-xs font-medium me-1 text-muted-foreground inline-block w-20'>
                    End Label:
                </span>
                {endLabel}
                {!endLabel && <span className='text-muted-foreground text-xs text-start font-mono uppercase'>
                    {'- No label defined -'}
                </span>}
            </p>
        </div>
    </div>
}

const RowQuickEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const rowStartLabelItem = (props.component as ItemGroupComponent).items.find(comp => comp.role == ItemComponentRole.StartLabel);
    const startLabel = localisedObjectToMap(rowStartLabelItem?.content).get(selectedLanguage) || '';
    const endLabelItem = (props.component as ItemGroupComponent).items.find(comp => comp.role == ItemComponentRole.EndLabel);
    const endLabel = localisedObjectToMap(endLabelItem?.content).get(selectedLanguage) || '';

    return <div
        className="space-y-2"
    >
        <div
            data-no-dnd="true"
            className='space-y-1.5'
        >
            <Label
                className="text-xs"
                htmlFor={`row-startlabel-${props.component.key}`}>
                Start Label
            </Label>
            <Input
                id={`row-startlabel-${props.component.key}`}
                className='w-full'
                value={startLabel || ''}
                placeholder='Enter row start label...'
                onChange={(e) => {
                    const value = e.target.value;
                    const rowStartLabelItem = (props.component as ItemGroupComponent).items.find(comp => comp.role == ItemComponentRole.StartLabel);
                    const newStartLabelItem = { ...rowStartLabelItem, content: generateLocStrings(localisedObjectToMap(rowStartLabelItem?.content).set(selectedLanguage, value)), role: ItemComponentRole.StartLabel };
                    const updatedComponent = { ...props.component, items: (props.component as ItemGroupComponent).items.map(comp => comp.role == ItemComponentRole.StartLabel ? newStartLabelItem : comp) } as ItemGroupComponent;
                    props.onChange?.(updatedComponent);
                }}
            />
        </div>
        <div
            data-no-dnd="true"
            className='space-y-1.5'
        >
            <Label
                className="text-xs"
                htmlFor={`row-endlabel-${props.component.key}`}>
                End Label
            </Label>
            <Input
                id={`row-endlabel-${props.component.key}`}
                className='w-full'
                value={endLabel || ''}
                placeholder='Enter row end label...'
                onChange={(e) => {
                    const value = e.target.value;
                    const rowEndLabelItem = (props.component as ItemGroupComponent).items.find(comp => comp.role == ItemComponentRole.EndLabel);
                    const newEndLabelItem = { ...rowEndLabelItem, content: generateLocStrings(localisedObjectToMap(rowEndLabelItem?.content).set(selectedLanguage, value)) };
                    const updatedComponent = { ...props.component, items: (props.component as ItemGroupComponent).items.map(comp => comp.role == ItemComponentRole.EndLabel ? newEndLabelItem : comp) } as ItemGroupComponent;
                    props.onChange?.(updatedComponent);
                }}
            />
        </div>
    </div>
}

const RowAdvancedEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const rowStartLabelItem = (props.component as ItemGroupComponent).items.find(comp => comp.role == ItemComponentRole.StartLabel);
    const startLabel = localisedObjectToMap(rowStartLabelItem?.content).get(selectedLanguage) || '';
    const endLabelItem = (props.component as ItemGroupComponent).items.find(comp => comp.role == ItemComponentRole.EndLabel);
    const endLabel = localisedObjectToMap(endLabelItem?.content).get(selectedLanguage) || '';

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

        <div
            className="space-y-2"
        >
            <div
                data-no-dnd="true"
                className='space-y-1.5'
            >
                <Label
                    className="text-xs"
                    htmlFor={`row-startlabel-${props.component.key}`}>
                    Start Label
                </Label>
                <Input
                    id={`row-startlabel-${props.component.key}`}
                    className='w-full'
                    value={startLabel || ''}
                    placeholder='Enter row start label...'
                    onChange={(e) => {
                        const value = e.target.value;
                        const rowStartLabelItem = (props.component as ItemGroupComponent).items.find(comp => comp.role == ItemComponentRole.StartLabel);
                        const newStartLabelItem = { ...rowStartLabelItem, content: generateLocStrings(localisedObjectToMap(rowStartLabelItem?.content).set(selectedLanguage, value)), role: ItemComponentRole.StartLabel };
                        const updatedComponent = { ...props.component, items: (props.component as ItemGroupComponent).items.map(comp => comp.role == ItemComponentRole.StartLabel ? newStartLabelItem : comp) } as ItemGroupComponent;
                        props.onChange?.(updatedComponent);
                    }}
                />
            </div>
            <div
                data-no-dnd="true"
                className='space-y-1.5'
            >
                <Label
                    className="text-xs"
                    htmlFor={`row-endlabel-${props.component.key}`}>
                    End Label
                </Label>
                <Input
                    id={`row-endlabel-${props.component.key}`}
                    className='w-full'
                    value={endLabel || ''}
                    placeholder='Enter row end label...'
                    onChange={(e) => {
                        const value = e.target.value;
                        const rowEndLabelItem = (props.component as ItemGroupComponent).items.find(comp => comp.role == ItemComponentRole.EndLabel);
                        const newEndLabelItem = { ...rowEndLabelItem, content: generateLocStrings(localisedObjectToMap(rowEndLabelItem?.content).set(selectedLanguage, value)) };
                        const updatedComponent = { ...props.component, items: (props.component as ItemGroupComponent).items.map(comp => comp.role == ItemComponentRole.EndLabel ? newEndLabelItem : comp) } as ItemGroupComponent;
                        props.onChange?.(updatedComponent);
                    }}
                />
            </div>
        </div>

        <Separator />
        <div className='space-y-2'>
            <h3 className='text-sm font-semibold'>
                View mode specific settings
            </h3>

            <StyleClassNameEditor
                styles={props.component.style || []}
                styleKey={RblsaStyleKeys.tableModeClassName}
                label={"Table Mode Class Name"}
                onChange={onRowStyleChange} />
            <Separator />
            <StyleClassNameEditor
                styles={props.component.style || []}
                styleKey={RblsaStyleKeys.labelRowModeClassName}
                label={"Label Row Mode Class Name"}
                onChange={onRowStyleChange} />
            <Separator />
            <StyleClassNameEditor
                styles={props.component.style || []}
                styleKey={RblsaStyleKeys.verticalModeClassName}
                label={"Vertical Mode Class Name"}
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
    </div>
}

const RowsEditor = (props: {
    rows: ItemGroupComponent[],
    onChange: (newRows: ItemGroupComponent[]) => void
}) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);
    const draggedItem = props.rows.find(row => row.key === draggedId);


    const onDeleteRow = (row: ItemGroupComponent) => {
        const newRows = props.rows.filter(r => r.key !== row.key);
        props.onChange(newRows);
    }

    const onChangeRow = (key: string, newRow: ItemGroupComponent) => {
        const newRows = props.rows.map((o) => {
            if (o.key === key) {
                return newRow;
            }
            return o;
        });
        props.onChange(newRows);
    }

    const onDuplicateRow = (row: ItemGroupComponent, index: number) => {
        const newRow = { ...row, key: Math.random().toString(36).substring(9) };
        const newRows = [...props.rows];
        newRows.splice(index + 1, 0, newRow);
        props.onChange(newRows);
    }

    return <div>
        <p className='font-semibold'>
            Rows ({props.rows.length})
        </p>
        <p className='text-xs text-muted-foreground'>
            Drag items to reorder rows.
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
                    component={draggedItem}
                    onChange={() => { }}
                    isDragged={true}
                    previewContent={RowPreview}
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
                        component={row}
                        isDragged={draggedId === row.key}
                        usedKeys={props.rows.map(o => o.key!)}
                        previewContent={RowPreview}
                        quickEditorContent={RowQuickEditor}
                        advancedEditorContent={RowAdvancedEditor}
                        onChange={(newRow) => onChangeRow(row.key!, newRow as ItemGroupComponent)}
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
                                onClick: () => onDeleteRow(row)
                            },

                        ]}
                    />
                })}
            </ol>
        </SortableWrapper>


        <div className="flex justify-center w-full">
            <AddDropdown
                options={[
                    { key: 'row', label: 'New row', icon: <Rows className='size-4 text-neutral-500 me-2' /> },
                ]}
                onAddItem={(type) => {
                    if (type === 'row') {
                        const newRow: ItemGroupComponent = {
                            key: Math.random().toString(36).substring(9),
                            role: 'row',
                            items: [{ role: ItemComponentRole.StartLabel, content: [] }, { role: ItemComponentRole.EndLabel, content: [] }]
                        }
                        props.onChange([...props.rows as ItemGroupComponent[], newRow as ItemGroupComponent]);
                    }
                }}
            />
        </div>
    </div>
}

const Rblsa: React.FC<RblsaProps> = (props) => {
    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const rblsaGroupIndex = rg.items.findIndex(comp => comp.role === ItemComponentRole.ResponsiveBipolarLikertScaleArray);
    if (rblsaGroupIndex === undefined || rblsaGroupIndex === -1) {
        return <p>Responsive bipolar likert scale array not found</p>;
    }
    const rblsaGroup = rg.items[rblsaGroupIndex] as ItemGroupComponent;
    if (!rblsaGroup || !rblsaGroup.items) {
        return <p>Responsive bipolar likert scale array group not found or has no items</p>;
    }

    const styles = rblsaGroup.style || [];

    //console.log('rblsaGroup', rblsaGroup);

    const defaultMode = styles?.find(st => st.key === 'defaultMode')?.value as ResponsiveBipolarLikertArrayVariant | undefined;
    const smMode = styles?.find(st => st.key === 'smMode')?.value as ResponsiveBipolarLikertArrayVariant | undefined;
    const mdMode = styles?.find(st => st.key === 'mdMode')?.value as ResponsiveBipolarLikertArrayVariant | undefined;
    const lgMode = styles?.find(st => st.key === 'lgMode')?.value as ResponsiveBipolarLikertArrayVariant | undefined;
    const xlMode = styles?.find(st => st.key === 'xlMode')?.value as ResponsiveBipolarLikertArrayVariant | undefined;

    const options = (rblsaGroup.items.find(comp => comp.role === ItemComponentRole.Options) as ItemGroupComponent)?.items || [];
    const rows = (rblsaGroup.items.filter(comp => comp.role === ItemComponentRole.Row) as ItemGroupComponent[]) || [];

    const onChangeRBLSA = (newRBLSA: ItemGroupComponent) => {
        const existingItems = props.surveyItem.components?.items || [];
        (existingItems[rgIndex] as ItemGroupComponent).items[rblsaGroupIndex] = newRBLSA;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingItems,
            }
        });
    };

    const onModeChange = (size: string, mode: ResponsiveBipolarLikertArrayVariant | undefined) => {
        const existingStyles = [...styles];
        const modeKey = `${size}Mode`;

        if (mode) {
            const index = existingStyles.findIndex(st => st.key === modeKey);
            if (index > -1) {
                existingStyles[index] = { key: modeKey, value: mode ?? '' };
            } else {
                existingStyles.push({ key: modeKey, value: mode });
            }
        } else {
            const index = existingStyles.findIndex(st => st.key === modeKey);
            if (index > -1) {
                existingStyles.splice(index, 1);
            }
        }

        rblsaGroup.style = existingStyles;
        onChangeRBLSA(rblsaGroup);
    }

    const onStyleChange = (key: string, value: string | undefined) => {
        if (!key) {
            return;
        }
        const existingStyles = [...styles];
        const index = existingStyles.findIndex(st => st.key === key);
        if (value) {
            if (index > -1) {
                existingStyles[index] = { key, value };
            } else {
                existingStyles.push({ key, value });
            }
        } else {
            if (index > -1) {
                existingStyles.splice(index, 1);
            }
        }

        rblsaGroup.style = existingStyles;
        onChangeRBLSA(rblsaGroup);
    }

    const triggerClassName = "text-sm data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:border data-[state=active]:border-slate-200 data-[state=active]:text-accent-foreground data-[state=active]:[box-shadow:none]";

    return (
        <div className="space-y-4">
            <Tabs defaultValue="options-rows" className="mt-2">
                <div className="flex flex-row justify-end items-center">
                    <TabsList className="bg-muted p-0.5 rounded-md border border-neutral-200 gap-1">
                        <TabsTrigger className={triggerClassName} value="options-rows">Options & Rows</TabsTrigger>
                        <TabsTrigger className={triggerClassName} value="extras">Extras</TabsTrigger>
                        {/* Use Badge here to indicate if there are any conditions */}
                    </TabsList>
                </div>
                <TabsContent value="options-rows">
                    <OptionsEditor
                        options={options}
                        hideEditor={true}
                        onChange={(newOptions) => {
                            const optionsIndex = rblsaGroup.items.findIndex(comp => comp.role === ItemComponentRole.Options);
                            if (optionsIndex === -1) {
                                rblsaGroup.items.push({
                                    role: ItemComponentRole.Options,
                                    items: newOptions
                                });
                            } else {
                                rblsaGroup.items[optionsIndex] = {
                                    role: ItemComponentRole.Options,
                                    items: newOptions
                                };
                            }
                            onChangeRBLSA(rblsaGroup);
                        }}
                    />
                    <RowsEditor
                        rows={rows}
                        onChange={(r) => {
                            const newRows = rblsaGroup.items.filter(comp => comp.role !== ItemComponentRole.Row);
                            newRows.push(...r);
                            rblsaGroup.items = newRows;
                            onChangeRBLSA(rblsaGroup);
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
                            Styling attributes:
                        </p>
                        <StyleClassNameEditor
                            styles={styles}
                            styleKey="labelRowPosition"
                            label="labelRowPosition"
                            onChange={(key, newValue) => onStyleChange(key, newValue)} />
                        <StyleClassNameEditor
                            styles={styles}
                            styleKey="labelRowMaxLabelWidth"
                            label="labelRowMaxLabelWidth"
                            onChange={(key, newValue) => onStyleChange(key, newValue)} />
                        <StyleClassNameEditor
                            styles={styles}
                            styleKey="tableModeLayout"
                            label="tableModeLayout"
                            onChange={(key, newValue) => onStyleChange(key, newValue)} />
                        <StyleClassNameEditor
                            styles={styles}
                            styleKey="tableModeLabelColWidth"
                            label="tableModeLabelColWidth"
                            onChange={(key, newValue) => onStyleChange(key, newValue)} />
                        <StyleClassNameEditor
                            styles={styles}
                            styleKey="tableModeClassName"
                            label="tableModeClassName"
                            onChange={(key, newValue) => onStyleChange(key, newValue)} />
                    </div>
                </TabsContent>
            </Tabs>


        </div>

    );
};

export default Rblsa;

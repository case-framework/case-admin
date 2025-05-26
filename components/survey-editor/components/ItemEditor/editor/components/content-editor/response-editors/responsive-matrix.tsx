import React from 'react';
import { SurveySingleItem, ItemGroupComponent, ItemComponent } from 'survey-engine/data_types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ItemComponentRole } from '@/components/survey-editor/components/types';
import DropdownContentConfig from './dropdown-content-config';
import TextInputContentConfig from './text-input-content-config';
import NumberInputContentConfig from './number-input-content-config';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import ComponentEditor, { ComponentEditorGenericProps } from '../component-editor';
import { PopoverKeyBadge } from '../../KeyBadge';
import { SimpleTextViewContentEditor } from './text-view-content-editor';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Columns, Trash2, Copy, Rows, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ResponsiveMatrixEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const BreakpointSelector: React.FC<{
    currentBreakpoint?: string;
    onChange: (breakpoint: string) => void;
}> = ({ currentBreakpoint, onChange }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="breakpoint-select" className="text-sm font-medium">
                Responsive Breakpoint
            </Label>
            <Select value={currentBreakpoint || 'md'} onValueChange={onChange}>
                <SelectTrigger id="breakpoint-select">
                    <SelectValue placeholder="Select breakpoint" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sm">Small (sm)</SelectItem>
                    <SelectItem value="md">Medium (md)</SelectItem>
                    <SelectItem value="lg">Large (lg)</SelectItem>
                    <SelectItem value="xl">Extra Large (xl)</SelectItem>
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
                Screen size threshold where the matrix switches from mobile to desktop layout
            </p>
        </div>
    );
};

const ResponseTypeSelector: React.FC<{
    currentResponseType?: string;
    onChange: (responseType: string) => void;
}> = ({ currentResponseType, onChange }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="response-type-select" className="text-sm font-medium">
                Response Type
            </Label>
            <Select value={currentResponseType || 'dropdown'} onValueChange={onChange}>
                <SelectTrigger id="response-type-select">
                    <SelectValue placeholder="Select response type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                    <SelectItem value="input">Text Input</SelectItem>
                    <SelectItem value="numberInput">Number Input</SelectItem>
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
                Type of input control used in each matrix cell
            </p>
        </div>
    );
};

const ColumnPreview: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const columnLabel = localisedObjectToMap(props.component.content).get(selectedLanguage);

    return <div className='flex items-center gap-4'>
        <div className='min-w-14 flex justify-center'>
            <PopoverKeyBadge
                headerText='Column Key'
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
        {columnLabel && <p className='text-sm text-start'>
            {columnLabel}
        </p>}
        {!columnLabel && <p className='text-muted-foreground text-xs text-start font-mono uppercase'>
            {'- No label defined -'}
        </p>}
    </div>
};

const ColumnQuickEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    return (
        <div className='space-y-4 pt-2 pb-4'>
            <SimpleTextViewContentEditor
                component={props.component}
                onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
                hideLabel={false}
                label='Column Label'
                placeholder='Enter column label...'
            />
        </div>
    );
};

const ColumnsEditor = (props: {
    columns: ItemComponent[],
    onChange: (newColumns: ItemComponent[]) => void
}) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const draggedItem = props.columns.find(column => column.key === draggedId);

    const onChangeColumn = (columnKey: string, newColumn: ItemComponent) => {
        const newColumns = props.columns.map(col => {
            if (col.key === columnKey) {
                return newColumn;
            }
            return col;
        });
        props.onChange(newColumns);
    };

    const onDeleteColumn = (columnToDelete: ItemComponent) => {
        if (confirm('Are you sure you want to delete this column?')) {
            const newColumns = props.columns.filter(col => col.key !== columnToDelete.key);
            props.onChange(newColumns);
        }
    };

    const onDuplicateColumn = (columnToDuplicate: ItemComponent, index: number) => {
        const duplicatedColumn = {
            ...columnToDuplicate,
            key: Math.random().toString(36).substring(9),
        };
        const newColumns = [...props.columns];
        newColumns.splice(index + 1, 0, duplicatedColumn);
        props.onChange(newColumns);
    };

    return <div>
        <h3 className='font-semibold'>
            Columns ({props.columns.length})
        </h3>
        <p className='text-xs text-muted-foreground mb-2'>
            Drag items to reorder columns.
        </p>

        <SortableWrapper
            sortableID={`columns-for-responsive-matrix`}
            items={props.columns.map((column, index) => {
                return {
                    id: column.key || index.toString(),
                }
            })}
            onDraggedIdChange={(id) => {
                setDraggedId(id);
            }}
            onReorder={(activeIndex, overIndex) => {
                const newItems = [...props.columns];
                newItems.splice(activeIndex, 1);
                newItems.splice(overIndex, 0, props.columns[activeIndex]);
                props.onChange(newItems);
            }}
            dragOverlayItem={(draggedId && draggedItem) ?
                <ComponentEditor
                    component={draggedItem}
                    onChange={() => { }}
                    isDragged={true}
                    previewContent={ColumnPreview}
                />
                : null}
        >
            <ol className='px-1 space-y-1 py-2'>
                {props.columns.length === 0 && <p className='text-sm text-primary'>
                    No columns defined.
                </p>}
                {props.columns.map((column, index) => {
                    return <ComponentEditor
                        key={column.key || index}
                        isSortable={true}
                        component={column}
                        isDragged={draggedId === column.key}
                        usedKeys={props.columns.map(o => o.key!)}
                        previewContent={ColumnPreview}
                        quickEditorContent={ColumnQuickEditor}
                        onChange={(newColumn) => onChangeColumn(column.key!, newColumn)}
                        contextMenuItems={[
                            {
                                type: 'item',
                                label: 'Duplicate',
                                icon: <Copy className='size-4' />,
                                onClick: () => onDuplicateColumn(column, index)
                            },
                            {
                                type: 'separator'
                            },
                            {
                                type: 'item',
                                label: 'Delete',
                                icon: <Trash2 className='size-4' />,
                                onClick: () => onDeleteColumn(column)
                            },
                        ]}
                    />
                })}
            </ol>
        </SortableWrapper>

        <div className="flex justify-center w-full">
            <AddDropdown
                options={[
                    { key: 'column', label: 'New column', icon: <Columns className='size-4 text-muted-foreground me-2' /> },
                ]}
                onAddItem={(type) => {
                    if (type === 'column') {
                        const newColumn: ItemComponent = {
                            key: Math.random().toString(36).substring(9),
                            role: 'category',
                            content: []
                        }
                        props.onChange([...props.columns, newColumn]);
                    }
                }}
            />
        </div>
    </div>
};

const RowPreview: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();
    const rowLabel = localisedObjectToMap(props.component.content).get(selectedLanguage);

    return <div className='flex items-center gap-4'>
        <span>
            {props.component.role === 'category' ? <Tag className='size-4 text-blue-600' /> : <Rows className='size-4 text-green-600' />}
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
        {rowLabel && <p className='text-sm text-start'>
            {rowLabel}
        </p>}
        {!rowLabel && <p className='text-muted-foreground text-xs text-start font-mono uppercase'>
            {'- No label defined -'}
        </p>}
    </div>
};

const RowQuickEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    const classNameIndex = props.component.style?.findIndex(style => style.key === 'className');
    const className = (props.component.style !== undefined && classNameIndex !== undefined && classNameIndex > -1) ? props.component.style[classNameIndex].value : '';

    const handleClassNameChange = (newClassName: string) => {
        const newStyle = [...props.component.style || []];
        const index = newStyle.findIndex(s => s.key === 'className');
        if (index > -1) {
            newStyle[index] = { key: 'className', value: newClassName };
        } else {
            newStyle.push({ key: 'className', value: newClassName });
        }

        props.onChange?.({
            ...props.component,
            style: newStyle,
        });
    };

    return (
        <div className='space-y-4 pt-2 pb-4'>
            <SimpleTextViewContentEditor
                component={props.component}
                onChange={(updatedComponent) => props.onChange?.(updatedComponent)}
                hideLabel={false}
                label='Row Label'
                placeholder='Enter row label...'
            />
            <div className='space-y-1.5'>
                <Label htmlFor={props.component.key + 'className'}>
                    CSS Classes
                </Label>
                <Input
                    id={props.component.key + 'className'}
                    value={className}
                    onChange={(e) => handleClassNameChange(e.target.value)}
                    placeholder='Enter optional CSS classes...'
                />
            </div>
        </div>
    );
};

const RowsEditor = (props: {
    rows: ItemComponent[],
    onChange: (newRows: ItemComponent[]) => void
}) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const draggedItem = props.rows.find(row => row.key === draggedId);

    const onChangeRow = (rowKey: string, newRow: ItemComponent) => {
        const newRows = props.rows.map(row => {
            if (row.key === rowKey) {
                return newRow;
            }
            return row;
        });
        props.onChange(newRows);
    };

    const onDeleteRow = (rowToDelete: ItemComponent) => {
        if (confirm('Are you sure you want to delete this row?')) {
            const newRows = props.rows.filter(row => row.key !== rowToDelete.key);
            props.onChange(newRows);
        }
    };

    const onDuplicateRow = (rowToDuplicate: ItemComponent, index: number) => {
        const duplicatedRow = {
            ...rowToDuplicate,
            key: Math.random().toString(36).substring(9),
        };
        const newRows = [...props.rows];
        newRows.splice(index + 1, 0, duplicatedRow);
        props.onChange(newRows);
    };

    return <div>
        <h3 className='font-semibold'>
            Rows ({props.rows.length})
        </h3>
        <p className='text-xs text-muted-foreground mb-2'>
            Drag items to reorder rows.
        </p>

        <SortableWrapper
            sortableID={`rows-for-responsive-matrix`}
            items={props.rows.map((row, index) => {
                return {
                    id: row.key || index.toString(),
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
                        onChange={(newRow) => onChangeRow(row.key!, newRow)}
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
                    { key: 'category', label: 'New category', icon: <Tag className='size-4 text-muted-foreground me-2' /> },
                    { key: 'row', label: 'New row', icon: <Rows className='size-4 text-muted-foreground me-2' /> },
                ]}
                onAddItem={(type) => {
                    if (type === 'category' || type === 'row') {
                        const newRow: ItemComponent = {
                            key: Math.random().toString(36).substring(9),
                            role: type,
                            content: []
                        }
                        props.onChange([...props.rows, newRow]);
                    }
                }}
            />
        </div>
    </div>
};

const ResponsiveMatrixEditor: React.FC<ResponsiveMatrixEditorProps> = ({ surveyItem, onUpdateSurveyItem }) => {
    const rgIndex = surveyItem.components?.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }

    const rg = surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const responsiveMatrixIndex = rg.items.findIndex(comp => comp.role === 'responsiveMatrix');
    if (responsiveMatrixIndex === undefined || responsiveMatrixIndex === -1) {
        return <p>Responsive matrix not found</p>;
    }

    const responsiveMatrixComponent = rg.items[responsiveMatrixIndex] as ItemGroupComponent;
    const styles = responsiveMatrixComponent.style || [];

    const updateSurveyItemWithNewRg = (updatedComponent: ItemComponent) => {

        const newRg = {
            ...rg,
            items: rg.items.map(comp => {
                if (comp.role === 'responsiveMatrix') {
                    return updatedComponent;
                }
                return comp;
            }),
        };

        const existingComponents = surveyItem.components?.items || [];
        existingComponents[rgIndex] = newRg;

        const newSurveyItem = {
            ...surveyItem,
            components: {
                ...surveyItem.components as ItemGroupComponent,
                items: existingComponents,
            }
        }
        onUpdateSurveyItem(newSurveyItem);
    }

    const getStyleValue = (key: string): string | undefined => {
        return styles.find(st => st.key === key)?.value;
    };

    const currentBreakpoint = getStyleValue('breakpoint');
    const currentResponseType = getStyleValue('responseType') || 'dropdown';

    const getConfigComponent = (role: string): ItemComponent | undefined => {
        return responsiveMatrixComponent.items?.find(item => item.role === role);
    };

    const updateConfigComponent = (role: string, updatedComponent: ItemComponent) => {
        const updatedResponsiveMatrix = { ...responsiveMatrixComponent };

        if (!updatedResponsiveMatrix.items) {
            updatedResponsiveMatrix.items = [];
        }

        const existingIndex = updatedResponsiveMatrix.items.findIndex(item => item.role === role);

        if (existingIndex > -1) {
            updatedResponsiveMatrix.items[existingIndex] = updatedComponent;
        } else {
            updatedResponsiveMatrix.items.push(updatedComponent);
        }

        updateSurveyItemWithNewRg(updatedResponsiveMatrix);
    };

    const handleStyleChange = (key: string, value: string) => {
        const existingStyles = [...styles];
        const index = existingStyles.findIndex(st => st.key === key);

        if (index > -1) {
            existingStyles[index] = { key, value };
        } else {
            existingStyles.push({ key, value });
        }

        // Update the component style
        const newResponsiveMatrixComponent = {
            ...responsiveMatrixComponent,
            style: existingStyles,
        };

        // Update the survey item
        updateSurveyItemWithNewRg(newResponsiveMatrixComponent);
        return newResponsiveMatrixComponent;
    };

    // Get current columns from the matrix component
    const colsItems = responsiveMatrixComponent.items?.find(item => item.role === 'columns');
    const currentColumns = colsItems ? (colsItems as ItemGroupComponent).items : [];

    const handleColumnsChange = (newColumns: ItemComponent[]) => {
        const updatedResponsiveMatrix = { ...responsiveMatrixComponent };

        if (!updatedResponsiveMatrix.items) {
            updatedResponsiveMatrix.items = [];
        }

        // Remove existing columns and add new ones
        updatedResponsiveMatrix.items = updatedResponsiveMatrix.items.filter(item => item.role !== 'columns');
        updatedResponsiveMatrix.items.push({
            key: 'cols',
            role: 'columns',
            items: newColumns
        });

        updateSurveyItemWithNewRg(updatedResponsiveMatrix);
    };

    // Get current rows from the matrix component
    const rowsItems = responsiveMatrixComponent.items?.find(item => item.role === 'rows');
    const currentRows = rowsItems ? (rowsItems as ItemGroupComponent).items : [];

    const handleRowsChange = (newRows: ItemComponent[]) => {
        const updatedResponsiveMatrix = { ...responsiveMatrixComponent };

        if (!updatedResponsiveMatrix.items) {
            updatedResponsiveMatrix.items = [];
        }

        // Remove existing rows and add new ones
        updatedResponsiveMatrix.items = updatedResponsiveMatrix.items.filter(item => item.role !== 'rows');
        updatedResponsiveMatrix.items.push({
            key: 'rows',
            role: 'rows',
            items: newRows
        });

        updateSurveyItemWithNewRg(updatedResponsiveMatrix);
    };

    const renderTypeSpecificEditor = () => {
        switch (currentResponseType) {
            case 'dropdown': {
                const dropdownConfig = getConfigComponent('dropdownOptions') || {
                    key: 'dropdownOptions',
                    role: 'dropdownOptions',
                    items: []
                };
                return (
                    <DropdownContentConfig
                        component={dropdownConfig}
                        onChange={(updatedComponent) => updateConfigComponent('dropdownOptions', updatedComponent)}
                        contentInputLabel='Placeholder text'
                        contentInputPlaceholder='Enter placeholder...'
                        descriptionInputLabel='Clear option text'
                        descriptionInputPlaceholder='Enter clear option...'
                    />
                );
            }
            case 'input': {
                const inputConfig = getConfigComponent('inputOptions') || {
                    key: 'inputOptions',
                    role: 'inputOptions'
                };
                return (
                    <TextInputContentConfig
                        component={inputConfig}
                        onChange={(updatedComponent) => updateConfigComponent('inputOptions', updatedComponent)}
                        allowMultipleLines={false}
                    />
                );
            }
            case 'numberInput': {
                const numberInputConfig = getConfigComponent('numberInputOptions') || {
                    key: 'numberInputOptions',
                    role: 'numberInputOptions'
                };
                return (
                    <NumberInputContentConfig
                        component={numberInputConfig}
                        onChange={(updatedComponent) => updateConfigComponent('numberInputOptions', updatedComponent)}
                    />
                );
            }
            default:
                return (
                    <div className="text-sm text-gray-500">
                        Unknown response type: {currentResponseType}
                    </div>
                );
        }
    };

    const handleResponseTypeChange = (newResponseType: string) => {
        const currentType = getStyleValue('responseType');

        // If type is not actually changing, just update normally
        if (currentType === newResponseType) {
            return;
        }

        // Check if there are existing configuration components that will be lost
        const hasDropdownOptions = responsiveMatrixComponent.items?.some(item => item.role === 'dropdownOptions');
        const hasInputOptions = responsiveMatrixComponent.items?.some(item => item.role === 'inputOptions');
        const hasNumberInputOptions = responsiveMatrixComponent.items?.some(item => item.role === 'numberInputOptions');

        const hasExistingConfig = hasDropdownOptions || hasInputOptions || hasNumberInputOptions;

        if (hasExistingConfig) {
            const confirmMessage = `Changing the response type will remove existing configuration for the current type. This may result in data loss. Are you sure you want to continue?`;
            if (!confirm(confirmMessage)) {
                return;
            }
        }

        // Update the response type style
        const updatedResponsiveMatrixComponent = handleStyleChange('responseType', newResponseType);

        // Remove existing configuration components
        if (updatedResponsiveMatrixComponent.items) {
            updatedResponsiveMatrixComponent.items = updatedResponsiveMatrixComponent.items.filter(item =>
                item.role !== 'dropdownOptions' &&
                item.role !== 'inputOptions' &&
                item.role !== 'numberInputOptions'
            );
            // Update the survey item
            updateSurveyItemWithNewRg(updatedResponsiveMatrixComponent);
        }
    };

    return (
        <div className="space-y-4">

            <div className="space-y-4">
                <BreakpointSelector
                    currentBreakpoint={currentBreakpoint}
                    onChange={(newBreakpoint) => handleStyleChange('breakpoint', newBreakpoint)}
                />

                <ResponseTypeSelector
                    currentResponseType={currentResponseType}
                    onChange={handleResponseTypeChange}
                />

                {/* Matrix structure editors */}
                <div className="space-y-3 pt-4 border-t">
                    <ColumnsEditor
                        columns={currentColumns}
                        onChange={handleColumnsChange}
                    />

                    <RowsEditor
                        rows={currentRows}
                        onChange={handleRowsChange}
                    />

                </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
                <div>
                    <h3 className="font-semibold mb-3">
                        {currentResponseType === 'dropdown' && 'Dropdown Configuration'}
                        {currentResponseType === 'input' && 'Text Input Configuration'}
                        {currentResponseType === 'numberInput' && 'Number Input Configuration'}
                    </h3>
                    {renderTypeSpecificEditor()}
                </div>
            </div>

        </div>
    );
};

export default ResponsiveMatrixEditor;

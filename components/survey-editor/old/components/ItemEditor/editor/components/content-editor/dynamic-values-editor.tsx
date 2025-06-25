import React, { useState } from "react";
import { ItemComponent, DynamicValue } from "survey-engine/data_types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, FunctionSquare, PlusIcon, EditIcon, TrashIcon, Copy, Pen, PenIcon } from "lucide-react";
import { format } from "date-fns";
import { PopoverKeyBadge } from "../KeyBadge";
import ExpressionPreview from "@/components/expression-preview/expression-preview";

// Common date-fns format codes
const FORMAT_CODES = [
    'P',
    'PP',
    'PPP',
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'MM/dd/yyyy',
    'dd.MM.yyyy',
    'dd MMM yyyy',
    'MMMM dd, yyyy',
    'EEE, MMM dd, yyyy',
    'yyyy-MM-dd HH:mm',
    'dd/MM/yyyy HH:mm:ss',
    'HH:mm',
    'h:mm a',
    'e',
    'ee',
    'eee',
    'eeee',
];

// Generate DATE_FORMATS with current date examples
const DATE_FORMATS = FORMAT_CODES.map(code => ({
    code,
    label: code,
    example: format(new Date(), code)
}));

interface DynamicValueEditorProps {
    dynamicValue: DynamicValue | null;
    isNew: boolean;
    existingKeys: string[];
    onSave: (dynamicValue: DynamicValue) => void;
    onCancel: () => void;
}

const DynamicValueEditor: React.FC<DynamicValueEditorProps> = ({ dynamicValue, isNew, existingKeys, onSave, onCancel }) => {
    const [key, setKey] = useState(dynamicValue?.key || '');
    const [type, setType] = useState<'expression' | 'date'>(dynamicValue?.type || 'expression');
    const [dateFormat, setDateFormat] = useState((dynamicValue?.type === 'date' ? dynamicValue.dateFormat : '') || 'yyyy-MM-dd');
    const [expression, setExpression] = useState(dynamicValue?.expression || undefined);
    const [keyError, setKeyError] = useState('');

    const handleKeyChange = (newKey: string) => {
        setKey(newKey);
        if (!newKey.trim()) {
            setKeyError('Key is required');
        } else if (existingKeys.includes(newKey) && (isNew || newKey !== dynamicValue?.key)) {
            setKeyError('Key must be unique');
        } else {
            setKeyError('');
        }
    };

    const handleSave = () => {
        if (!key.trim() || keyError) return;

        let newDynamicValue: DynamicValue;

        if (type === 'date') {
            newDynamicValue = {
                key: key.trim(),
                type: 'date',
                dateFormat,
            };
        } else {
            newDynamicValue = {
                key: key.trim(),
                type: 'expression',
                expression,
            };
        }

        onSave(newDynamicValue);
    };

    const getSelectedDateFormat = () => DATE_FORMATS.find(f => f.code === dateFormat);
    const currentDate = new Date();

    return (
        <div className="space-y-4 p-4">
            <div className="space-y-2">
                <Label htmlFor="dynamic-key">Key *</Label>
                <Input
                    id="dynamic-key"
                    placeholder="Enter unique key (e.g., currentDate, userName)"
                    value={key}
                    onChange={(e) => handleKeyChange(e.target.value)}
                    className={keyError ? "border-red-500" : ""}
                />
                {keyError && <p className="text-sm text-red-500">{keyError}</p>}
            </div>

            <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(value: 'expression' | 'date') => setType(value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="expression">Expression</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {type === 'date' && (
                <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {DATE_FORMATS.map((fmt) => (
                                <SelectItem key={fmt.code}
                                    value={fmt.code}
                                >
                                    <div className="space-x-4">

                                        <span className="font-mono text-sm grow">{fmt.label}</span>
                                        <span className="text-muted-foreground text-xs">e.g. {fmt.example}</span>

                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}


            <div className="space-y-2">
                <Label>Expression</Label>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="select-none relative group cursor-pointer">
                            <div className="hidden group-hover:flex items-center justify-end absolute -top-8 right-0 ">
                                <Button variant="ghost" size="sm"
                                    className="text-xs"
                                >
                                    <PenIcon className="size-3! mr-1 text-muted-foreground" />
                                    Edit Expression
                                </Button >
                            </div>

                            <ExpressionPreview expressions={expression ? [expression] : []} />
                        </div>


                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Expression Editor</DialogTitle>
                            <DialogDescription>
                                Edit the survey expression for this dynamic value.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="p-4 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground mb-2">Expression Editor (Mockup)</p>
                            <div className="font-mono text-sm bg-background p-2 rounded border">
                                {expression ? JSON.stringify(expression, null, 2) : 'No expression defined'}
                            </div>
                            <Button
                                className="mt-2"
                                onClick={() => setExpression({ name: 'mockExpression', data: [] })}
                            >
                                Set Mock Expression
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>


            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={handleSave} disabled={!key.trim() || !!keyError}>
                    {isNew ? 'Add' : 'Save'}
                </Button>
            </div>
        </div>
    );
};

interface DynamicValuesEditorProps {
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
}

const DynamicValuesEditor: React.FC<DynamicValuesEditorProps> = ({ component, onChange }) => {
    const [editingValue, setEditingValue] = useState<DynamicValue | null>(null);
    const [isNewPopoverOpen, setIsNewPopoverOpen] = useState(false);
    const [editPopoverStates, setEditPopoverStates] = useState<Record<string, boolean>>({});

    const dynamicValues = component.dynamicValues || [];
    const existingKeys = dynamicValues.map(dv => dv.key);

    const handleSaveDynamicValue = (dynamicValue: DynamicValue) => {
        let updatedDynamicValues: DynamicValue[];

        if (isNewPopoverOpen) {
            updatedDynamicValues = [...dynamicValues, dynamicValue];
        } else {
            updatedDynamicValues = dynamicValues.map(dv =>
                dv.key === editingValue?.key ? dynamicValue : dv
            );
        }

        onChange({
            ...component,
            dynamicValues: updatedDynamicValues
        });

        setIsNewPopoverOpen(false);
        setEditPopoverStates({});
        setEditingValue(null);
    };

    const handleDeleteDynamicValue = (key: string) => {
        const updatedDynamicValues = dynamicValues.filter(dv => dv.key !== key);
        onChange({
            ...component,
            dynamicValues: updatedDynamicValues
        });
    };

    const handleDuplicateDynamicValue = (originalDynamicValue: DynamicValue) => {
        // Generate a unique key
        let newKey = `${originalDynamicValue.key}_copy`;
        let counter = 1;
        while (existingKeys.includes(newKey)) {
            newKey = `${originalDynamicValue.key}_copy_${counter}`;
            counter++;
        }

        const duplicatedValue: DynamicValue = {
            ...originalDynamicValue,
            key: newKey,
        };

        onChange({
            ...component,
            dynamicValues: [...dynamicValues, duplicatedValue]
        });
    };

    const handleStartCreating = () => {
        setEditingValue(null);
        setEditPopoverStates({});
        setIsNewPopoverOpen(true);
    };

    const handleStartEditing = (dynamicValue: DynamicValue) => {
        setEditingValue(dynamicValue);
        setIsNewPopoverOpen(false);
        setEditPopoverStates({ [dynamicValue.key]: true });
    };

    const handleCancel = () => {
        setIsNewPopoverOpen(false);
        setEditPopoverStates({});
        setEditingValue(null);
    };

    const handleKeyChange = (oldKey: string, newKey: string) => {
        const updatedDynamicValues = dynamicValues.map(dv =>
            dv.key === oldKey ? { ...dv, key: newKey } : dv
        );
        onChange({
            ...component,
            dynamicValues: updatedDynamicValues
        });
    };

    const getTypeIcon = (type: 'date' | 'expression') => {
        return type === 'date' ? (
            <Calendar className="size-4 text-blue-600" />
        ) : (
            <FunctionSquare className="size-4 text-green-600" />
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Dynamic Values</CardTitle>
                <div className="flex gap-2">
                    <Popover open={isNewPopoverOpen} onOpenChange={setIsNewPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size={'icon'}
                                onClick={handleStartCreating}
                                className="text-xs size-8"
                            >
                                <PlusIcon className="size-3 mr-1" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 p-0" align="end">
                            <DynamicValueEditor
                                dynamicValue={null}
                                isNew={true}
                                existingKeys={existingKeys}
                                onSave={handleSaveDynamicValue}
                                onCancel={handleCancel}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <Card>
                <CardContent className="p-2">

                    {dynamicValues.length === 0 ? (
                        <div className="text-center py-2 text-muted-foreground text-sm">
                            No dynamic values defined. Click "+" to get started.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {dynamicValues.map((dynamicValue) => (
                                <ContextMenu key={dynamicValue.key}>
                                    <ContextMenuTrigger asChild>
                                        <div className="group relative">
                                            <Popover
                                                open={editPopoverStates[dynamicValue.key] || false}
                                                onOpenChange={(open) => {
                                                    if (open) {
                                                        handleStartEditing(dynamicValue);
                                                    } else {
                                                        handleCancel();
                                                    }
                                                }}
                                            >
                                                <PopoverTrigger asChild>
                                                    <div
                                                        className="flex items-center justify-between px-4 py-2 border rounded-md hover:bg-muted/50 cursor-pointer"
                                                        onClick={() => handleStartEditing(dynamicValue)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {getTypeIcon(dynamicValue.type)}
                                                            <PopoverKeyBadge
                                                                allOtherKeys={existingKeys.filter(k => k !== dynamicValue.key)}
                                                                itemKey={dynamicValue.key}
                                                                headerText="Dynamic Value Key"
                                                                onKeyChange={(newKey: string) => handleKeyChange(dynamicValue.key, newKey)}
                                                            />
                                                        </div>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Pen className="size-3 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-96 p-0" align="end">
                                                    <DynamicValueEditor
                                                        dynamicValue={editingValue}
                                                        isNew={false}
                                                        existingKeys={existingKeys.filter(k => k !== editingValue?.key)}
                                                        onSave={handleSaveDynamicValue}
                                                        onCancel={handleCancel}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem
                                            onClick={() => handleDuplicateDynamicValue(dynamicValue)}
                                            className="flex items-center gap-2"
                                        >
                                            <Copy className="size-4" />
                                            Duplicate
                                        </ContextMenuItem>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <ContextMenuItem
                                                    className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                                    onSelect={(e) => e.preventDefault()}
                                                >
                                                    <TrashIcon className="size-4" />
                                                    Delete
                                                </ContextMenuItem>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete dynamic value?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete the dynamic value "{dynamicValue.key}". This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteDynamicValue(dynamicValue.key)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </ContextMenuContent>
                                </ContextMenu>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

    );
};

export default DynamicValuesEditor;

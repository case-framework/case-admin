import React, { useEffect, useRef, useState } from 'react';
import { ContextArrayItem, ExpEditorContext, SlotDef, SlotInputDefKeyValueList } from '../utils';
import BuiltInSlotWrapper from './BuiltInSlotWrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface ItemSlotOption {
    itemKey?: string;
    slotKey?: string;
    listValues?: Array<string | undefined>;
}

interface KeyValueListFromContextProps {
    slotDef: SlotDef;
    slotTypeDef: SlotInputDefKeyValueList;
    context?: ExpEditorContext;
    depth?: number;
    currentValue: ItemSlotOption;
    onChange: (newValue: ItemSlotOption) => void;
    onClearSlot: () => void;
}

interface ParseResult {
    uniqueFirstParts: string[];
    matchingSecondParts: string[];
}

function parseSuggestionsFromContext(array: string[], itemKey: string | undefined = undefined): ParseResult {
    // Set to store unique first parts
    const uniqueFirstPartsSet = new Set<string>();

    // Map to store second parts grouped by first parts
    const secondPartsByFirstPart = new Map<string, string[]>();

    // Process each string in the array
    array.forEach((item: string) => {
        // Split the string by dash
        const parts: string[] = item.split('-');

        if (parts.length > 0) {
            const firstPart: string = parts[0];
            // Add first part to the set
            uniqueFirstPartsSet.add(firstPart);

            if (parts.length === 2) {
                const secondPart: string = parts[1];

                // Add second part to the map, grouped by first part
                if (!secondPartsByFirstPart.has(firstPart)) {
                    secondPartsByFirstPart.set(firstPart, []);
                }

                const secondParts = secondPartsByFirstPart.get(firstPart);
                if (secondParts) {
                    secondParts.push(secondPart);
                }
            }
        };


    });

    // Convert set to array
    const uniqueFirstParts: string[] = Array.from(uniqueFirstPartsSet);

    // Get matching second parts if itemKey is provided
    const matchingSecondParts: string[] = (itemKey && secondPartsByFirstPart.has(itemKey))
        ? secondPartsByFirstPart.get(itemKey) || []
        : [];

    return {
        uniqueFirstParts,
        matchingSecondParts
    };
}

const KeyValueListFromContext: React.FC<KeyValueListFromContextProps> = (props) => {
    const [newOptionKey, setNewOptionKey] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const addOptionKey = () => {
        if (newOptionKey.trim() === "") return

        // Split by comma and space
        const newOptionKeys = newOptionKey.trim().split(/[,\s]+/)

        const currentOptionKeys = props.currentValue.listValues !== undefined ? [...props.currentValue.listValues] : []
        // Check for duplicates and invalid keys
        let changeCount = 0
        for (const newKey of newOptionKeys) {
            const trimmedKey = newKey.trim()
            if (trimmedKey === "") continue
            if (currentOptionKeys.includes(newKey.trim())) {
                toast.error("Duplicate option key: " + newKey)
                continue
            }

            changeCount++
            currentOptionKeys.push(trimmedKey)
        }
        setNewOptionKey("")
        if (changeCount < 1) {
            return
        }

        props.onChange({
            ...props.currentValue,
            listValues: currentOptionKeys
        })
    }

    const removeOptionKey = (keyToRemove: string) => {
        const updatedKeys = props.currentValue.listValues?.filter((key) => key !== keyToRemove)
        props.onChange({
            ...props.currentValue,
            listValues: updatedKeys
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const hasOptionKeys = props.currentValue.listValues !== undefined && props.currentValue.listValues.length > 0
        if (e.key === "Enter") {
            e.preventDefault()
            addOptionKey()
        } else if (e.key === "Backspace" && newOptionKey === "" && hasOptionKeys) {
            // Remove the last tag when backspace is pressed and input is empty
            const updatedKeys = [...props.currentValue.listValues!]
            updatedKeys.pop()
            props.onChange({
                ...props.currentValue,
                listValues: updatedKeys
            })
        }
    }

    const focusInput = () => {
        inputRef.current?.focus()
    }

    // Focus the input when clicking anywhere in the container
    useEffect(() => {
        if (props.slotTypeDef.withFixedValue !== undefined || props.slotTypeDef.withFixedKey !== undefined) {
            const updatedValue = {
                ...props.currentValue,
            }
            if (props.slotTypeDef.withFixedValue !== undefined) {
                updatedValue.slotKey = props.slotTypeDef.withFixedValue
            }
            if (props.slotTypeDef.withFixedKey !== undefined) {
                updatedValue.itemKey = props.slotTypeDef.withFixedKey
            }
            if (updatedValue.itemKey !== props.currentValue.itemKey || updatedValue.slotKey !== props.currentValue.slotKey) {
                props.onChange(updatedValue);
            }
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener("click", focusInput)
            return () => {
                container.removeEventListener("click", focusInput)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // get list from context
    let contextValues: Array<ContextArrayItem> | undefined = [];
    if (props.slotTypeDef.contextArrayKey !== undefined) {
        contextValues = props.context?.[props.slotTypeDef.contextArrayKey] as Array<ContextArrayItem> | undefined;
    }
    if (!Array.isArray(contextValues)) {
        contextValues = undefined;
    }
    if (contextValues !== undefined && props.slotTypeDef.filterForItemType !== undefined) {
        contextValues = contextValues.filter((cv) => cv.type === props.slotTypeDef.filterForItemType)
    }

    const { uniqueFirstParts, matchingSecondParts } = parseSuggestionsFromContext(contextValues?.map(cv => cv.key) || [], props.currentValue.itemKey)
    const itemKeySuggestions: Array<string> = uniqueFirstParts;
    const optionKeySuggestions: Array<string> = matchingSecondParts.filter(suggestion => !props.currentValue.listValues?.includes(suggestion))



    const isInvalid = () => {
        if (props.currentValue === undefined) {
            return true
        }
        if (props.currentValue.itemKey === undefined || props.currentValue.itemKey === '') {
            return true
        }

        if (props.currentValue.slotKey === undefined || props.currentValue.slotKey === '') {
            return true
        }

        if (props.currentValue.listValues === undefined || props.currentValue.listValues.length === 0) {
            return true
        }
    }

    const slotInputUUID = uuidv4()

    const itemKeyInputSuggestionsId = slotInputUUID + 'item-key-suggestions'
    const itemKeyInputID = slotInputUUID + 'item-key-input'
    const slotKeyInputSuggestionsId = slotInputUUID + 'slot-key-suggestions'
    const slotKeyInputID = slotInputUUID + 'slot-key-input'
    const optionKeyInputSuggestionsId = slotInputUUID + 'option-keys-suggestions'
    const optionKeyInputID = slotInputUUID + 'option-keys-input'

    return (
        <BuiltInSlotWrapper
            slotLabel={{
                label: props.slotDef.label,
                required: props.slotDef.required
            }}
            slotTypeDef={{
                color: props.slotTypeDef.color,
                icon: props.slotTypeDef.icon,
                label: props.slotTypeDef.label
            }}
            depth={props.depth}
            isInvalid={isInvalid()}
            onClearSlot={props.onClearSlot}
        >
            <>
                <div className='px-2 py-2 flex flex-wrap gap-2'>
                    {props.slotTypeDef.withFixedKey === undefined && <div className="space-y-1 grow">
                        <Label htmlFor={itemKeyInputID} className='text-xs'>Item Key</Label>
                        <div className="relative">
                            <Input
                                id={itemKeyInputID}
                                list={itemKeyInputSuggestionsId}
                                className='text-xs md:text-xs font-mono'
                                value={props.currentValue.itemKey || ''}
                                autoComplete='off'
                                onChange={(e) => {
                                    const newValue = e.target.value.trim()
                                    if (newValue === "") {
                                        props.onChange({
                                            ...props.currentValue,
                                            itemKey: undefined
                                        })
                                    } else {
                                        props.onChange({
                                            ...props.currentValue,
                                            itemKey: newValue
                                        })
                                    }
                                }}
                                placeholder="Enter item key"
                            />
                            <datalist id={itemKeyInputSuggestionsId}>
                                {itemKeySuggestions.map((suggestion) => (
                                    <option key={suggestion} value={suggestion} />
                                ))}
                            </datalist>
                        </div>
                    </div>}

                    {props.slotTypeDef.withFixedValue === undefined && <div className="space-y-1">
                        <Label htmlFor={slotKeyInputID} className='text-xs'>Slot Key</Label>
                        <div className="relative">
                            <Input
                                id={slotKeyInputID}
                                value={props.currentValue.slotKey || ''}
                                className='text-xs md:text-xs font-mono'
                                autoComplete='off'
                                onChange={(e) => {
                                    const newValue = e.target.value.trim()
                                    if (newValue === "") {
                                        props.onChange({
                                            ...props.currentValue,
                                            slotKey: undefined
                                        })
                                    } else {
                                        props.onChange({
                                            ...props.currentValue,
                                            slotKey: newValue
                                        })
                                    }
                                }}
                                placeholder="Enter slot key"
                                list={slotKeyInputSuggestionsId}
                            />
                            <datalist id={slotKeyInputSuggestionsId}>
                                {['rg.mcg', 'rg.scg'].map((suggestion) => (
                                    <option key={suggestion} value={suggestion} />
                                ))}
                            </datalist>
                        </div>
                    </div>}
                </div>

                <div className="space-y-1 px-2 py-2">

                    <Label htmlFor={optionKeyInputID}
                        className='text-xs'
                    >Option Keys</Label>
                    <div
                        ref={containerRef}
                        className={cn(
                            "flex flex-wrap items-center gap-2 p-2 border rounded-md min-h-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                            "bg-background",
                        )}
                    >
                        {props.currentValue.listValues?.map((key) => {
                            if (key === undefined) {
                                return null;
                            }

                            return (
                                <Badge key={key} variant="secondary" className="flex items-center gap-1 h-6">
                                    {key}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 p-0 hover:bg-transparent"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeOptionKey(key)
                                        }}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground" />
                                        <span className="sr-only">Remove {key}</span>
                                    </Button>
                                </Badge>
                            )
                        })}
                        <input
                            ref={inputRef}
                            id={optionKeyInputID}
                            list={optionKeyInputSuggestionsId}
                            value={newOptionKey || ''}
                            onChange={(e) => setNewOptionKey(e.target.value)}
                            autoComplete='off'
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent border-none outline-hidden min-w-[120px] p-0 text-xs font-mono"
                            placeholder={"Type and press Enter to add"}
                        />
                        <datalist id={optionKeyInputSuggestionsId}>
                            {optionKeySuggestions.map((suggestion) => (
                                <option key={suggestion} value={suggestion} />
                            ))}
                        </datalist>
                    </div>
                    <p>
                        <small className='text-muted-foreground text-xs'>
                            {"To add multiple keys at once use comma or space to separate them."}
                        </small>
                    </p>
                </div>
            </>

        </BuiltInSlotWrapper>
    );
};

export default KeyValueListFromContext;

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useSurveyEditor } from '@/components/survey-editor/store/useSurveyEditor';
import { useClipboardValue } from '@/hooks/useClipboardValue';
import { SurveyItemTypeRegistry } from '@/components/survey-editor/utils/item-type-infos';
import { SurveyItemType, SingleChoiceQuestionItem, GroupItem, MultipleChoiceQuestionItem, SurveyItemTranslations, ItemComponentType } from 'survey-engine';
import { Clipboard, Folder, Users, CornerDownLeft, Info } from 'lucide-react';
import { toast } from 'sonner';

interface AddItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    parentKey?: string;
    targetIndex?: number;
}

interface ItemTypeOption {
    id: string;
    label: string;
    description: string;
    icon: React.ComponentType<any>;
    category: 'structure' | 'questions' | 'inputs' | 'special';
    action: () => void;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({
    open,
    onOpenChange,
    parentKey,
    targetIndex
}) => {
    const { editor } = useSurveyEditor();
    const [search, setSearch] = useState('');
    const [clipboardValue, updateClipboardValue] = useClipboardValue();

    // Check if clipboard contains valid survey item
    const hasValidClipboardItem = useMemo(() => {
        if (!clipboardValue) return false;
        try {
            const parsed = JSON.parse(clipboardValue);
            return parsed && parsed.key && (parsed.itemType || parsed.type);
        } catch {
            return false;
        }
    }, [clipboardValue]);

    const generateNewItemKey = useCallback((itemType: string) => {
        const surveyKey = editor?.survey.surveyKey || 'survey';
        const parentKeyToUse = parentKey || surveyKey;
        const timestamp = Date.now().toString().slice(-6); // Last 6 digits for shorter key
        const itemCount = Object.keys(editor?.survey.surveyItems || {}).length;
        return `${parentKeyToUse}.${itemType}_${itemCount}_${timestamp}`;
    }, [editor, parentKey]);

    const createSingleChoiceQuestion = useCallback(() => {
        try {
            const newItemKey = generateNewItemKey('scq');
            const item = SingleChoiceQuestionItem.fromJson(newItemKey, {
                itemType: SurveyItemType.SingleChoiceQuestion,
                header: {
                    title: {
                        key: 'title',
                        type: ItemComponentType.Text
                    }
                },
                responseConfig: {
                    type: ItemComponentType.SingleChoice,
                    key: 'scg',
                    items: [
                        {
                            key: 'option1',
                            type: ItemComponentType.ScgMcgOption,
                        },
                        {
                            key: 'option2',
                            type: ItemComponentType.ScgMcgOption,
                        },
                    ]
                }
            });
            editor?.addItem(parentKey, item, new SurveyItemTranslations(), targetIndex);
            toast.success('Single choice question added');
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to create single choice question:', error);
            toast.error('Failed to add single choice question');
        }
    }, [editor, parentKey, targetIndex, generateNewItemKey, onOpenChange]);

    const createMultipleChoiceQuestion = useCallback(() => {
        try {
            const newItemKey = generateNewItemKey('mcq');
            const item = MultipleChoiceQuestionItem.fromJson(newItemKey, {
                itemType: SurveyItemType.MultipleChoiceQuestion,
                header: {
                    title: {
                        key: 'title',
                        type: ItemComponentType.Text
                    }
                },
                responseConfig: {
                    type: ItemComponentType.MultipleChoice,
                    key: 'mcg',
                    items: [
                        {
                            key: 'option1',
                            type: ItemComponentType.ScgMcgOption,
                        },
                        {
                            key: 'option2',
                            type: ItemComponentType.ScgMcgOption,
                        },
                    ]
                }
            });
            editor?.addItem(parentKey, item, new SurveyItemTranslations(), targetIndex);
            toast.success('Multiple choice question added');
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to create multiple choice question:', error);
            toast.error('Failed to add multiple choice question');
        }
    }, [editor, parentKey, targetIndex, generateNewItemKey, onOpenChange]);

    const createGroup = useCallback(() => {
        try {
            const newItemKey = generateNewItemKey('group');
            const item = GroupItem.fromJson(newItemKey, {
                itemType: SurveyItemType.Group,
                header: {
                    title: {
                        key: 'title',
                        type: ItemComponentType.Text
                    }
                }
            });
            editor?.addItem(parentKey, item, new SurveyItemTranslations(), targetIndex);
            toast.success('Group added');
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to create group:', error);
            toast.error('Failed to add group');
        }
    }, [editor, parentKey, targetIndex, generateNewItemKey, onOpenChange]);

    const createPageBreak = useCallback(() => {
        try {
            const newItemKey = generateNewItemKey('pageBreak');
            // Create a basic page break item using the fromJson pattern
            const item = SingleChoiceQuestionItem.fromJson(newItemKey, {
                itemType: SurveyItemType.PageBreak
            });
            editor?.addItem(parentKey, item, new SurveyItemTranslations(), targetIndex);
            toast.success('Page break added');
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to add page break:', error);
            toast.error('Failed to add page break');
        }
    }, [editor, parentKey, targetIndex, generateNewItemKey, onOpenChange]);

    const createSurveyEnd = useCallback(() => {
        try {
            const newItemKey = generateNewItemKey('surveyEnd');
            // Create a basic survey end item
            const item = SingleChoiceQuestionItem.fromJson(newItemKey, {
                itemType: SurveyItemType.SurveyEnd
            });
            editor?.addItem(parentKey, item, new SurveyItemTranslations(), targetIndex);
            toast.success('Survey end content added');
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to add survey end:', error);
            toast.error('Failed to add survey end content');
        }
    }, [editor, parentKey, targetIndex, generateNewItemKey, onOpenChange]);

    const createDisplay = useCallback(() => {
        try {
            const newItemKey = generateNewItemKey('display');
            // Create a basic display item
            const item = SingleChoiceQuestionItem.fromJson(newItemKey, {
                itemType: SurveyItemType.Display,
                header: {
                    title: {
                        key: 'title',
                        type: ItemComponentType.Text
                    }
                }
            });
            editor?.addItem(parentKey, item, new SurveyItemTranslations(), targetIndex);
            toast.success('Display item added');
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to add display item:', error);
            toast.error('Failed to add display item');
        }
    }, [editor, parentKey, targetIndex, generateNewItemKey, onOpenChange]);

    const pasteFromClipboard = useCallback(async () => {
        try {
            if (!clipboardValue) {
                updateClipboardValue();
                return;
            }
            
            const content = JSON.parse(clipboardValue);
            
            if (!content || !content.key || content.key === '') {
                toast.error('Clipboard content is not valid survey item');
                return;
            }

            const oldKey = content.key as string;
            let copiedItemKey = oldKey.split('.').pop();
            
            if (copiedItemKey === undefined) {
                toast.error('Clipboard content is not valid');
                return;
            }

            // Check if item already exists and modify key if needed
            const surveyKey = editor?.survey.surveyKey || 'survey';
            const parentKeyToUse = parentKey || surveyKey;
            const existingItems = editor?.survey.rootItem.items || [];
            
            if (existingItems.includes(`${parentKeyToUse}.${copiedItemKey}`)) {
                copiedItemKey = copiedItemKey + '_copy';
            }

            const newKey = `${parentKeyToUse}.${copiedItemKey}`;

            // Replace all instances of the old key with the new key in the JSON
            const keyRegex = new RegExp(`"${oldKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\.|")`, 'g');
            const newClipboardContent = clipboardValue.replace(keyRegex, (_match, suffix) => {
                return `"${newKey}${suffix}`;
            });

            const contentToInsert = JSON.parse(newClipboardContent);
            
            // Use the SurveyEditor API to add the item
            editor?.addItem(parentKey, contentToInsert, new SurveyItemTranslations(), targetIndex);
            
            toast.success('Item pasted from clipboard');
            onOpenChange(false);
        } catch (error) {
            console.error('Error pasting from clipboard:', error);
            toast.error('Error reading clipboard content');
        }
    }, [clipboardValue, updateClipboardValue, onOpenChange, editor, parentKey, targetIndex]);

    const itemTypeOptions: ItemTypeOption[] = useMemo(() => {
        const options: ItemTypeOption[] = [];

        // Add paste option if clipboard has valid content
        if (hasValidClipboardItem) {
            options.push({
                id: 'paste',
                label: 'Paste from clipboard',
                description: 'Paste a previously copied survey item',
                icon: Clipboard,
                category: 'special',
                action: pasteFromClipboard
            });
        }

        // Add structure items
        options.push(
            {
                id: 'group',
                label: 'Group',
                description: 'A container for organizing survey items',
                icon: Folder,
                category: 'structure',
                action: createGroup
            }
        );

        // Add question types
        options.push(
            {
                id: 'singleChoice',
                label: 'Single Choice Question',
                description: 'Radio buttons - participant can select one option',
                icon: SurveyItemTypeRegistry.find(i => i.key === SurveyItemType.SingleChoiceQuestion)?.icon || Users,
                category: 'questions',
                action: createSingleChoiceQuestion
            },
            {
                id: 'multipleChoice',
                label: 'Multiple Choice Question',
                description: 'Checkboxes - participant can select multiple options',
                icon: SurveyItemTypeRegistry.find(i => i.key === SurveyItemType.MultipleChoiceQuestion)?.icon || Users,
                category: 'questions',
                action: createMultipleChoiceQuestion
            }
        );

        // Add other types
        options.push(
            {
                id: 'display',
                label: 'Display Item',
                description: 'Show text or instructions without collecting responses',
                icon: Info,
                category: 'special',
                action: createDisplay
            },
            {
                id: 'pageBreak',
                label: 'Page Break',
                description: 'Force items after this to appear on a new page',
                icon: CornerDownLeft,
                category: 'structure',
                action: createPageBreak
            },
            {
                id: 'surveyEnd',
                label: 'Survey End Content',
                description: 'Content shown next to the submit button',
                icon: SurveyItemTypeRegistry.find(i => i.key === SurveyItemType.SurveyEnd)?.icon || Users,
                category: 'special',
                action: createSurveyEnd
            }
        );

        return options;
    }, [hasValidClipboardItem, pasteFromClipboard, createGroup, createPageBreak, createSingleChoiceQuestion, createMultipleChoiceQuestion, createDisplay, createSurveyEnd]);

    const filteredOptions = useMemo(() => {
        if (!search.trim()) return itemTypeOptions;
        
        const searchTerm = search.toLowerCase();
        return itemTypeOptions.filter(option => 
            option.label.toLowerCase().includes(searchTerm) ||
            option.description.toLowerCase().includes(searchTerm) ||
            option.category.toLowerCase().includes(searchTerm)
        );
    }, [itemTypeOptions, search]);

    const groupedOptions = useMemo(() => {
        const groups: Record<string, ItemTypeOption[]> = {
            special: [],
            structure: [],
            questions: [],
            inputs: []
        };

        filteredOptions.forEach(option => {
            groups[option.category].push(option);
        });

        return Object.entries(groups).filter(([, options]) => options.length > 0);
    }, [filteredOptions]);

    const handleSelectOption = useCallback((option: ItemTypeOption) => {
        option.action();
        onOpenChange(false);
        setSearch('');
    }, [onOpenChange]);

    const getCategoryLabel = (category: string): string => {
        switch (category) {
            case 'special': return 'Special Items';
            case 'structure': return 'Structure';
            case 'questions': return 'Questions';
            case 'inputs': return 'Input Components';
            default: return category;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 max-w-2xl">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle>Add Survey Item</DialogTitle>
                    <DialogDescription>
                        Search and select the type of survey item to add
                    </DialogDescription>
                </DialogHeader>
                
                <Command className="border-none">
                    <CommandInput
                        placeholder="Search item types..."
                        value={search}
                        onValueChange={setSearch}
                        className="border-none focus:ring-0"
                    />
                    <CommandList className="max-h-96">
                        <CommandEmpty>No item types found.</CommandEmpty>
                        
                        {groupedOptions.map(([category, options]) => (
                            <CommandGroup key={category} heading={getCategoryLabel(category)}>
                                {options.map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                        <CommandItem
                                            key={option.id}
                                            value={option.label}
                                            onSelect={() => handleSelectOption(option)}
                                            className="flex items-center gap-3 p-3 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded bg-muted">
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium">{option.label}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {option.description}
                                                </div>
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
};
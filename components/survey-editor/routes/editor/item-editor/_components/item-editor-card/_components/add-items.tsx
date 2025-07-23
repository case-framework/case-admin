'use client';

import { useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useSurveyEditor } from '@/components/survey-editor/store/useSurveyEditor';
import { useItemNavigation } from '@/components/survey-editor/store/useItemNavigation';
import { useClipboardValue } from '@/hooks/useClipboardValue';
import { ItemTypeInfos, SurveyItemTypeRegistry } from '@/components/survey-editor/utils/item-type-infos';
import { SurveyItemType, GroupItem } from 'survey-engine';
import { ItemInitHelper } from 'survey-engine/editor';
import { Folder } from 'lucide-react';
import { toast } from 'sonner';
import { useItemEditor } from '../../item-editor-context';
import { cn } from '@/lib/utils';


interface ItemTypeOption extends ItemTypeInfos {
    categories: Array<'structure' | 'display' | 'question' | 'special'>;
}

const itemTypeOptions: ItemTypeOption[] = [
    {
        ...SurveyItemTypeRegistry.find(i => i.key === SurveyItemType.Group)!,
        categories: ['structure']
    },
    {
        ...SurveyItemTypeRegistry.find(i => i.key === SurveyItemType.PageBreak)!,
        categories: ['structure']
    },
    {
        ...SurveyItemTypeRegistry.find(i => i.key === SurveyItemType.SurveyEnd)!,
        categories: ['structure']
    },
    {
        ...SurveyItemTypeRegistry.find(i => i.key === SurveyItemType.Display)!,
        categories: ['display']
    },
    {
        ...SurveyItemTypeRegistry.find(i => i.key === SurveyItemType.SingleChoiceQuestion)!,
        categories: ['question']
    },
    {
        ...SurveyItemTypeRegistry.find(i => i.key === SurveyItemType.MultipleChoiceQuestion)!,
        categories: ['question']
    }
]


export const AddItemDialog: React.FC = () => {
    const { addItemDialogOpen, setAddItemDialogOpen, targetParentKey } = useItemEditor();
    const { editor } = useSurveyEditor();
    const { selectedItemKey } = useItemNavigation();
    const [search, setSearch] = useState('');
    const [clipboardValue, updateClipboardValue] = useClipboardValue();

    // Determine the target group where the item would be added
    const targetGroupInfo = useMemo(() => {
        if (!editor) {
            return null;
        }

        if (targetParentKey) {
            const targetItem = editor.survey.surveyItems[targetParentKey];
            if (targetItem) {
                return {
                    key: targetItem.key.fullKey,
                    label: targetItem.key.isRoot ? 'Survey Root' : targetItem.key.itemKey,
                    isRoot: targetItem.key.isRoot,
                    itemCount: targetItem.itemType === SurveyItemType.Group ? (targetItem as GroupItem).items?.length || 0 : 0
                };
            }
        }

        if (!selectedItemKey) {
            const itemCount = editor.survey.rootItem.items?.length || 0;
            return {
                key: editor.survey.surveyKey,
                label: 'Survey Root',
                isRoot: true,
                itemCount: itemCount
            };
        }

        const selectedItem = editor.survey.surveyItems[selectedItemKey];
        if (!selectedItem) {
            return null;
        }

        // If the selected item is a group or root, use it as the target
        if (selectedItem.key.isRoot || selectedItem.itemType === SurveyItemType.Group) {
            return {
                key: selectedItem.key.fullKey,
                label: selectedItem.key.isRoot ? 'Survey Root' : selectedItem.key.itemKey,
                isRoot: selectedItem.key.isRoot,
                itemCount: selectedItem.itemType === SurveyItemType.Group ? (selectedItem as GroupItem).items?.length || 0 : 0
            };
        }

        // If the selected item is not a group, use its parent as the target
        const parentKey = selectedItem.key.parentFullKey;
        if (!parentKey) {
            return null;
        }

        const parentItem = editor.survey.surveyItems[parentKey];
        if (!parentItem) {
            return null;
        }

        return {
            key: parentItem.key.fullKey,
            label: parentItem.key.isRoot ? 'Survey Root' : parentItem.key.itemKey,
            isRoot: parentItem.key.isRoot,
            itemCount: parentItem.itemType === SurveyItemType.Group ? (parentItem as GroupItem).items?.length || 0 : 0
        };
    }, [editor, selectedItemKey, targetParentKey]);



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


    const pasteFromClipboard = useCallback(async () => {
        /*  try {
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
             const targetParentKey = parentKey || targetGroupInfo?.key || surveyKey;
             const existingItems = editor?.survey.rootItem.items || [];

             if (existingItems.includes(`${targetParentKey}.${copiedItemKey}`)) {
                 copiedItemKey = copiedItemKey + '_copy';
             }

             const newKey = `${targetParentKey}.${copiedItemKey}`;

             // Replace all instances of the old key with the new key in the JSON
             const keyRegex = new RegExp(`"${oldKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\.|")`, 'g');
             const newClipboardContent = clipboardValue.replace(keyRegex, (_match, suffix) => {
                 return `"${newKey}${suffix}`;
             });

             const contentToInsert = JSON.parse(newClipboardContent);

             // Use the SurveyEditor API to add the item
             editor?.addItem(targetParentKey ? { parentKey: targetParentKey } : undefined, contentToInsert, new SurveyItemTranslations());

             toast.success('Item pasted from clipboard');
             onOpenChange(false);
         } catch (error) {
             console.error('Error pasting from clipboard:', error);
             toast.error('Error reading clipboard content');
         } */
    }, [clipboardValue, updateClipboardValue, editor, targetGroupInfo]);

    const filteredOptions = useMemo(() => {
        if (!search.trim()) return itemTypeOptions;

        const searchTerm = search.toLowerCase();
        itemTypeOptions.forEach(option => {
            console.log(option.label, option.description, option.categories);
            console.log(option.description.toLowerCase().includes(searchTerm))
        });
        console.log(searchTerm, itemTypeOptions.filter(option =>
            option.label.toLowerCase().includes(searchTerm) ||
            option.description.toLowerCase().includes(searchTerm) ||
            option.categories.some(category => category.toLowerCase().includes(searchTerm))
        ));
        return itemTypeOptions.filter(option =>
            option.label.toLowerCase().includes(searchTerm) ||
            option.description.toLowerCase().includes(searchTerm) ||
            option.categories.some(category => category.toLowerCase().includes(searchTerm))
        );


    }, [itemTypeOptions, search]);

    const groupedOptions = useMemo(() => {
        const groups: Record<string, ItemTypeOption[]> = {
            structure: [],
            display: [],
            question: [],
            special: []
        };

        filteredOptions.forEach(option => {
            option.categories.forEach(category => {
                groups[category].push(option);
            });
        });

        return Object.entries(groups).filter(([, options]) => options.length > 0);
    }, [filteredOptions]);

    const handleSelectOption = (option: ItemTypeOption) => {
        if (option.key === 'clipboard') {
            alert('TODO: paste')

        } else {
            if (!editor) {
                return;
            }
            const addAndInit = new ItemInitHelper(editor)
            let newKey = '';
            switch (option.key) {
                case SurveyItemType.Display:
                    newKey = addAndInit.displayItem({ parentFullKey: targetGroupInfo?.key || editor.survey.surveyKey })
                    break;
                case SurveyItemType.Group:
                    newKey = addAndInit.group({ parentFullKey: targetGroupInfo?.key || editor.survey.surveyKey })
                    break;
                case SurveyItemType.PageBreak:
                    newKey = addAndInit.pageBreak({ parentFullKey: targetGroupInfo?.key || editor.survey.surveyKey })
                    break;
                case SurveyItemType.SurveyEnd:
                    newKey = addAndInit.surveyEnd({ parentFullKey: targetGroupInfo?.key || editor.survey.surveyKey })
                    break;
                case SurveyItemType.SingleChoiceQuestion:
                    newKey = addAndInit.singleChoiceQuestion({ parentFullKey: targetGroupInfo?.key || editor.survey.surveyKey })
                    break;
                case SurveyItemType.MultipleChoiceQuestion:
                    newKey = addAndInit.multipleChoiceQuestion({ parentFullKey: targetGroupInfo?.key || editor.survey.surveyKey })
                    break;
                default:
                    alert('TODO: init item')
                    break;
            }
            toast.success(`Item added: ${newKey}`);
        }


        setAddItemDialogOpen(false);
        setSearch('');
    }

    const getCategoryLabel = (category: string): string => {
        switch (category) {
            case 'special': return 'Special Items';
            case 'display': return 'Display';
            case 'question': return 'Questions';
            case 'structure': return 'Structure';
            default: return category;
        }
    };

    return (
        <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
            <DialogContent className="p-0 max-w-2xl border-border bg-muted">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Add Survey Item</DialogTitle>
                    <DialogDescription>
                        {targetGroupInfo ? (
                            <span className="flex items-center gap-2 p-2 mt-1 bg-white/50 rounded-lg border border-border">
                                <Folder className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs">
                                    Adding to: <span className="font-medium">{targetGroupInfo.label}</span>
                                    {targetGroupInfo.itemCount > 0 && (
                                        <span className="text-muted-foreground"> ({targetGroupInfo.itemCount} items)</span>
                                    )}
                                </span>
                            </span>
                        ) : (
                            'Search and select the type of survey item to add'
                        )}
                    </DialogDescription>
                </DialogHeader>

                <Command className="border-none rounded-t-none"
                    shouldFilter={false}
                >
                    <CommandInput
                        placeholder="Search item types..."
                        value={search}
                        onValueChange={setSearch}
                        className="border-none rounded-none focus:ring-0"
                        containerClassName="h-11 bg-white drop-shadow-xs"
                    />

                    <CommandList className="max-h-96 border-border">
                        <CommandEmpty>No item types found.</CommandEmpty>

                        {groupedOptions.map(([category, options]) => (
                            <CommandGroup key={category} heading={getCategoryLabel(category)}>
                                {options.map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                        <CommandItem
                                            key={option.key}
                                            value={option.label}
                                            onSelect={() => handleSelectOption(option)}
                                            className="flex items-center gap-3 px-2 py-1.5 cursor-pointer border border-border mb-1"
                                        >
                                            <div className="flex items-center justify-center size-7">
                                                <IconComponent className={cn("w-4 h-4", option.defaultItemClassName)} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium">{option.label}</div>
                                                <div className="text-xs text-muted-foreground">
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

import React from 'react';
import { SurveyGroupItem, SurveyItem, SurveySingleItem } from 'survey-engine/data_types';
import ItemCreator from '../../../explorer/ItemCreator';
import { Button } from '@/components/ui/button';
import { ClipboardCopyIcon, GripHorizontal, Plus, Shield, TrashIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import { getItemColor, getItemTypeInfos, isValidSurveyItemGroup } from '@/components/survey-editor/utils/utils';
import { cn } from '@/lib/utils';
import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import { generateNewItemForType } from '@/components/survey-editor/utils/new-item-init';
import { toast } from 'sonner';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useCopyToClipboard } from 'usehooks-ts';
import { useItemEditorCtx } from '../../../item-editor-context';

interface ItemListEditorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
    onDeleteItem: (itemKey: string) => void;
}

const ItemListEditor: React.FC<ItemListEditorProps> = (props) => {
    const { setSelectedItemKey, setCurrentPath } = useItemEditorCtx();

    const groupItem = props.surveyItem as SurveyGroupItem;
    const [draggedId, setDraggedId] = React.useState<string | null>(null);
    const [, copy] = useCopyToClipboard()


    const currentItems = groupItem.items.map(surveyItem => {
        const isActive = false;
        const { icon, defaultItemClassName } = getItemTypeInfos(surveyItem);
        const isPageBreak = (surveyItem as SurveySingleItem).type === 'pageBreak';
        const isGroup = isValidSurveyItemGroup(surveyItem);
        const itemKey = surveyItem.key?.split('.').pop();
        const isPathActive = false;
        const itemColor = getItemColor(surveyItem);
        const itemLabel = surveyItem.metadata?.itemLabel;

        return {
            id: surveyItem.key,
            icon: icon,
            className: isActive ? undefined : defaultItemClassName,
            textColor: isActive ? undefined : itemColor,
            isActive,
            isPathActive,
            isGroup,
            itemKey: isPageBreak ? '' : itemKey,
            label: isPageBreak ? 'Page break' : itemLabel,
            isConfidential: (surveyItem as SurveySingleItem).confidentialMode !== undefined,
        }
    })

    const draggedItem = draggedId ? currentItems.find(item => item.id === draggedId) : null;

    const onAddNewSurveyItem = (newItemInfos: { itemType: string; parentKey: string; }) => {

        const newSurveyItem = generateNewItemForType({
            itemType: newItemInfos.itemType,
            parentGroup: groupItem,
        });

        if (newSurveyItem) {
            groupItem.items.push(newSurveyItem);
        }
        toast.success('New item added');
        props.onUpdateSurveyItem(groupItem);
    }

    const onInsertFromClipboard = async (parentKey: string) => {
        try {
            const clipboardContent = await navigator.clipboard.readText();
            const content = JSON.parse(clipboardContent);

            if (!content || !content.key || content.key === '') {
                toast.error('Clipboard content is not valid');
                return;
            }

            const oldKey = content.key as string;
            if (oldKey === parentKey) {
                toast.error("Can't insert item into itself");
                return;
            }

            let copiedItemKey = oldKey.split('.').pop();
            if (copiedItemKey === undefined) {
                toast.error('Clipboard content is not valid');
                return;
            }



            // check if item already exists
            const existingItem = groupItem.items?.find(item => {
                const itemKey = item.key.split('.').pop();
                return itemKey === copiedItemKey;
            })
            if (existingItem) {
                copiedItemKey = copiedItemKey + '_copy';
            }

            const newKey = parentKey + '.' + copiedItemKey;
            let newClipboardContent = clipboardContent.replaceAll(`"${oldKey}"`, `"${newKey}"`);
            newClipboardContent = newClipboardContent.replaceAll(`"${oldKey}.`, `"${newKey}.`);
            const contentToInsert = JSON.parse(newClipboardContent);

            groupItem.items.push(contentToInsert);
            toast.success('New item inserted');
            props.onUpdateSurveyItem(groupItem);
        } catch (error) {
            toast.error('Error reading clipboard content');
            console.error(error);
        }

    }

    const ItemRowButton = (i: number, isDragOverlay: boolean) => {
        const item = currentItems[i];
        return <div>
            <ContextMenu>
                <ContextMenuTrigger disabled={isDragOverlay}>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'w-full gap-2 py-3 h-auto px-3 text-start',
                            item.className,
                            (draggedId === item.id && !isDragOverlay) && 'invisible',
                            {
                                'font-bold': item.isPathActive,
                            })}
                        style={{
                            color: item.textColor,
                            borderColor: item.textColor,
                        }}
                        onDoubleClick={isDragOverlay ? undefined : () => {
                            setCurrentPath(groupItem.key);
                            setSelectedItemKey(item.id);
                        }}
                    >
                        <div>
                            <item.icon className='size-4' />
                        </div>
                        <span className={cn(
                            'grow space-x-2',
                        )}>
                            {item.itemKey &&
                                <span className={cn(
                                    'font-mono',
                                )}
                                    style={{
                                        borderColor: item.textColor,
                                    }}
                                >{item.itemKey}</span>}
                            <span className='font-semibold italic'>{item.label}</span>
                        </span>
                        {item.isConfidential && <span className='p-1'>
                            <Shield color={item.textColor} className='size-4' />
                        </span>}
                        <span className='p-1'>
                            <GripHorizontal className='size-4' />
                        </span>
                    </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem
                        onClick={() => {
                            const surveyItemToCopy = (props.surveyItem as SurveyGroupItem).items.find(i => i.key === item.id);
                            if (!surveyItemToCopy) {
                                toast.error('Item not found');
                                return;
                            }
                            const surveyItemJSON = JSON.stringify(surveyItemToCopy, null, 2);
                            copy(surveyItemJSON);
                            toast('Item copied to clipboard');
                        }}
                    >
                        <ClipboardCopyIcon className='size-4' />
                        <span className='ml-2'>Copy</span>
                    </ContextMenuItem>

                    <ContextMenuSeparator />
                    <ContextMenuItem
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this item?')) {
                                props.onDeleteItem(item.id);
                            }
                        }}
                    >
                        <TrashIcon className='size-4' />
                        <span className='ml-2'>Delete</span>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>;
    }

    return (
        <div className='flex-1 pb-6'>
            <h3 className='font-semibold text-base'>Items of {groupItem.key} </h3>
            <p className='text-sm text-neutral-600'>Double click on item to open it, drag and drop to reorder.</p>

            {groupItem.items.length === 0 &&
                <p className='text-sm text-neutral-600'>No items found.</p>
            }

            <SortableWrapper
                sortableID={`items-of-${groupItem.key}`}
                items={currentItems}
                onDraggedIdChange={(id) => {
                    setDraggedId(id);
                }}
                onReorder={(activeIndex, overIndex) => {
                    const newItems = [...groupItem.items];
                    newItems.splice(activeIndex, 1);
                    newItems.splice(overIndex, 0, groupItem.items[activeIndex]);
                    const newGroup: SurveyGroupItem = {
                        ...groupItem,
                        items: newItems,
                    }
                    props.onUpdateSurveyItem(newGroup);
                }}
                dragOverlayItem={(draggedId && draggedItem) ? ItemRowButton(currentItems.findIndex(item => item.id === draggedId), true) : null}>
                <ol className='px-1 space-y-2 py-4'>
                    {currentItems.map((item, i) => (
                        <SortableItem
                            id={item.id}
                            key={item.id}
                        >
                            {ItemRowButton(i, false)}
                        </SortableItem>
                    ))}
                </ol>
            </SortableWrapper>

            <Separator className='bg-border' />
            <div className='px-1 py-1'>
                <ItemCreator
                    trigger={
                        <Button
                            variant='ghost'
                            className='w-full gap-2'
                            size={'sm'}
                        >
                            <Plus className='size-4' />
                            Add a new item
                        </Button>
                    }
                    parentKey={groupItem.key}
                    onAddItem={onAddNewSurveyItem}
                    onInsertFromClipboard={onInsertFromClipboard}
                />
            </div>
        </div>
    );
};

export default ItemListEditor;

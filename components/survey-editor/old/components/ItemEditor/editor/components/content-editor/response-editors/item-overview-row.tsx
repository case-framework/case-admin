import { Button } from "@/components/ui/button";
import { ItemComponent } from "survey-engine/data_types";
import { PopoverKeyBadge } from "../../KeyBadge";
import { ClipboardCopy, ClipboardPaste, Copy, GripVertical, Heading, MoreHorizontalIcon, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import React from "react";

interface ItemOverviewRowProps {
    i: number;
    itemList: ItemComponent[];
    isDragOverlay: boolean;
    isSelected: boolean;
    isBeingDragged: boolean;
    itemIconLookup: (item: ItemComponent) => React.ReactNode;
    itemDescriptiveTextLookup: (item: ItemComponent) => string;
    onSelectionUpdate?: (key: string) => void;
    onListUpdate?: (newList: ItemComponent[]) => void;
    setClipboardValue?: (value: string) => void;
    getClipboardValue?: () => string;
}


export const ItemOverviewRow: React.FC<ItemOverviewRowProps> = (props) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const item = props.itemList[props.i];
    const allOtherKeys = props.itemList.map(i => i.key ?? '').filter(i => i !== item.key);

    const onPaste = () => {
        const copiedValue = props.getClipboardValue?.();
        if (!copiedValue) return;
        const copiedItem = JSON.parse(copiedValue) as ItemComponent;
        const newItems = [...props.itemList];
        newItems[props.i] = copiedItem;
        newItems[props.i].key = item.key;
        props.onListUpdate?.(newItems);
    }


    const onKeyChange = (oldKey: string, newKey: string) => {
        const newItemList = [...props.itemList];
        const itemToUpdate = newItemList.find(listItem => listItem.key === oldKey);
        if (itemToUpdate) {
            itemToUpdate.key = newKey;
            props.onListUpdate?.(newItemList);
            props.onSelectionUpdate?.(newKey);
        }
    }

    const onDelete = () => {
        if (confirm('Are you sure you want to delete this item?')) {
            props.onListUpdate?.(props.itemList.filter(i => i.key !== item.key));
            props.onSelectionUpdate?.('');
        }
    }

    const onDuplicate = () => {
        const itemToDuplicate = props.itemList.find(i => i.key === item.key);
        if (itemToDuplicate != undefined) {
            const newItem = { ...itemToDuplicate, key: Math.random().toString(36).substring(9) };
            const newItems = [...props.itemList];
            newItems.splice(props.i + 1, 0, newItem);
            props.onListUpdate?.(newItems);
            props.onSelectionUpdate?.(newItem.key);
        }
    }

    const onCopy = () => {
        props.setClipboardValue?.(JSON.stringify(item));
    }

    return <div
        className={cn(
            'group relative w-full gap-2 py-2 h-auto px-3 text-start flex flex-row items-center rounded-md border text-sm font-medium transition-colors user-select-none',
            { 'bg-gray-100 text-accent-foreground shadow-sm': props.isSelected },
            { 'bg-white hover:shadow-sm hover:bg-gray-50': !props.isSelected },
            (props.isBeingDragged && !props.isDragOverlay) && 'invisible')}
        onClick={props.isDragOverlay ? undefined : () => { props.onSelectionUpdate?.(item.key ?? ''); }}
        onContextMenu={(e) => {
            e.preventDefault();
            if (!props.isSelected) props.onSelectionUpdate?.(item.key ?? '');
            setIsMenuOpen(true);
        }}
        tabIndex={-1}
    >
        <div>
            {props.itemIconLookup(item) || <Heading className='size-4 text-muted-foreground' />}
        </div>
        <div className={cn('flex flex-row grow space-x-2',)}>
            <PopoverKeyBadge
                itemKey={item.key ?? ''}
                isHighlighted={props.isSelected}
                allOtherKeys={allOtherKeys}
                onKeyChange={(newKey) => { onKeyChange(item.key ?? '', newKey); }}
            />

            <span className='text-muted-foreground'>
                {props.itemDescriptiveTextLookup(item)}
            </span>
        </div>
        <div className='flex flex-row gap-2 items-center'>
            {props.isSelected && <>
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button className='h-[20px] flex items-center px-2 justify-center hover:bg-slate-300 rounded-full' variant={'ghost'} onClick={onDelete}>
                            <MoreHorizontalIcon className='size-4 text-muted-foreground' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={onDuplicate} onClick={(e) => e.stopPropagation()}><span className="text-muted-foreground mr-2" ><Copy size={16} /></span>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onSelect={onCopy} onClick={(e) => e.stopPropagation()}><span className="text-muted-foreground mr-2" ><ClipboardCopy size={16} /></span>Copy Contents</DropdownMenuItem>
                        <DropdownMenuItem onSelect={onPaste} onClick={(e) => e.stopPropagation()}><span className="text-muted-foreground mr-2" ><ClipboardPaste size={16} /></span>Paste Contents</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={onDelete} onClick={(e) => e.stopPropagation()}><span className="text-muted-foreground mr-2" ><Trash size={16} /></span>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </>}
            <span className='absolute -left-4 top-0 hidden group-hover:flex items-center h-full'>
                <GripVertical className='size-4 text-muted-foreground' />
            </span>
        </div>
    </div>;
}

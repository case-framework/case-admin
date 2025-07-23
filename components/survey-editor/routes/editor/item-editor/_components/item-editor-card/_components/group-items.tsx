import { useItemNavigation } from "@/components/survey-editor/store/useItemNavigation";
import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GroupItem, QuestionItem, SurveyItemType } from "survey-engine";
import {
    GroupItemEditor
} from "survey-engine/editor";
import ItemPreview from "./item-preview";
import SortableWrapper from "@/components/survey-editor/_components/sortable/sortable-wrapper";
import SortableItem from "@/components/survey-editor/_components/sortable/sortable-item";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { ClipboardCopyIcon, Edit3, GripVertical, PlusIcon, Shield } from "lucide-react";
import { DeleteItemContextMenuItem } from "./delete-item-context-menu";
import { getItemColor, getItemTypeInfos } from "@/components/survey-editor/utils/item-type-infos";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useItemEditor } from "../../item-editor-context";


const GroupItems = () => {
    const { editor } = useSurveyEditor();
    let { selectedItemKey } = useItemNavigation();
    const { navigateToItem } = useItemNavigation();
    const { openAddItemDialog } = useItemEditor();

    const [itemKeyForPreview, setItemKeyForPreview] = useState<string | null>(null);

    if (!selectedItemKey) {
        selectedItemKey = editor?.survey.surveyKey;
    }

    const surveyItem = editor?.survey.surveyItems[selectedItemKey as string];
    if (!surveyItem) {
        throw new Error("No survey item");
    }

    const groupItem = surveyItem as GroupItem;

    const currentItems = groupItem.items?.map((item) => ({ id: item })) ?? [];

    const [draggedId, setDraggedId] = useState<string | null>(null);

    const draggedItem = draggedId ? currentItems.find(item => item.id === draggedId) : null;

    const renderRowItem = (i: number, isDragOverlay: boolean) => {
        const itemKey = currentItems[i].id;
        const item = editor?.survey.surveyItems[itemKey];
        if (!item) {
            return null;
        }

        const itemInfos = {
            typeInfos: getItemTypeInfos(item),
            color: getItemColor(item)
        }

        return <ContextMenu>
            <ContextMenuTrigger disabled={isDragOverlay}
                asChild
            >
                <button
                    className={cn(
                        'flex items-center w-full gap-2 py-2 h-auto px-3 text-start group relative',
                        'hover:bg-muted/10 backdrop-blur-xl transition-colors border rounded-lg',
                        itemInfos.typeInfos.defaultItemClassName,
                        (draggedId === item.key.fullKey && !isDragOverlay) && 'invisible',
                        {
                            'font-bold ring-4 ring-ring/50': item.key.fullKey === itemKeyForPreview,
                        })}
                    style={{
                        color: itemInfos.color,
                        borderColor: itemInfos.color,
                    }}
                    onClick={isDragOverlay ? undefined : () => {
                        setItemKeyForPreview(item.key.fullKey);
                    }}
                    onDoubleClick={isDragOverlay ? undefined : () => {
                        if (item.itemType === SurveyItemType.PageBreak) {
                            return;
                        }
                        setItemKeyForPreview(null);
                        navigateToItem(item.key.fullKey);
                    }}
                >
                    <div>
                        <itemInfos.typeInfos.icon className='size-4' />
                    </div>
                    <span className={cn(
                        'grow space-x-2',
                    )}>

                        <span className={cn(
                            'font-mono',
                        )}
                            style={{
                                borderColor: itemInfos.color,
                            }}
                        >{
                                item.itemType === SurveyItemType.PageBreak ? 'Page Break' :
                                    item.key.itemKey}</span>
                        <span className='font-semibold italic'>{item.metadata?.itemLabel}</span>
                    </span>
                    {(item as QuestionItem).confidentiality?.mode !== undefined && <span className='p-1'>
                        <Shield color={itemInfos.color} className='size-4' />
                    </span>}
                    <span className='absolute -left-4 top-0 hidden group-hover:flex items-center h-full'>
                        <GripVertical className='size-4 text-muted-foreground' />
                    </span>
                </button>
            </ContextMenuTrigger>
            <ContextMenuContent className="border-border">
                {item.itemType !== SurveyItemType.PageBreak && <ContextMenuItem
                    onClick={() => {
                        navigateToItem(item.key.fullKey);
                    }}
                >
                    <span className='flex items-center gap-2'>
                        <Edit3 className='size-4' />
                        <span className="ml-2">Open</span>
                    </span>
                </ContextMenuItem>}

                <ContextMenuItem
                    onClick={() => {
                        alert('copy');
                    }}
                >
                    <ClipboardCopyIcon className='size-4' />
                    <span className='ml-2'>Copy</span>
                </ContextMenuItem>

                <ContextMenuSeparator />
                <DeleteItemContextMenuItem
                    itemKey={item.key.fullKey}
                />
            </ContextMenuContent>
        </ContextMenu >

    }

    return <div className="flex grow ">
        <div className="flex-1 pt-2 px-4 pb-4 border-r border-border">
            <div>

                <div className="flex items-start justify-between gap-2">
                    <div>


                        <div>
                            <h3 className='font-semibold text-sm'>
                                Items
                                <span className='text-sm text-muted-foreground ml-2'>
                                    ({groupItem.items?.length ?? 0})
                                </span>
                            </h3>
                        </div>
                        <p className='text-xs text-muted-foreground italic'>Double click on item to open it, drag and drop to reorder.</p>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon"
                                className="-mr-2"
                                onClick={() => openAddItemDialog()}>
                                <PlusIcon className="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Add new item
                        </TooltipContent>
                    </Tooltip>
                </div>

                {(groupItem.items?.length ?? 0) < 1 &&
                    <p className='text-sm text-center my-32 text-muted-foreground'>This group is empty. Start adding items now...</p>
                }

                <SortableWrapper
                    sortableID={`items-of-${groupItem.key.fullKey}`}
                    items={currentItems}
                    onDraggedIdChange={(id) => {
                        setDraggedId(id);
                    }}
                    onReorder={(activeIndex, overIndex) => {
                        new GroupItemEditor(editor, groupItem.key.fullKey).moveItem(activeIndex, overIndex);
                    }}
                    dragOverlayItem={(draggedId && draggedItem) ? renderRowItem(currentItems.findIndex(item => item.id === draggedId), true) : null}>
                    <ol className='space-y-1.5 py-4'>
                        {currentItems.map((item, i) => (
                            <SortableItem
                                id={item.id}
                                key={item.id}
                            >
                                {renderRowItem(i, false)}
                            </SortableItem>
                        ))}
                    </ol>
                </SortableWrapper>

                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => openAddItemDialog()}
                    >
                        <PlusIcon className="size-4" />
                        Add item
                    </Button >
                </div>
            </div>
        </div>

        <div className="flex-1 pt-2 px-4 pb-4">
            <ItemPreview item={editor?.survey.surveyItems[itemKeyForPreview as string]} />
        </div>
    </div>
}

export default GroupItems;

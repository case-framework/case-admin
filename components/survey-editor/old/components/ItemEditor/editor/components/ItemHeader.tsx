import React from 'react';
import { SurveyItem, SurveySingleItem } from 'survey-engine/data_types';
import { builtInItemColors, getItemColor, getItemKeyFromFullKey, getItemTypeInfos, getParentKeyFromFullKey } from '../../../../utils/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { PopoverClose, PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from '@/components/ui/button';
import { ClipboardCopy, CodeSquare, CornerDownRight, MoreVertical, Move, ShieldCheck, SquarePen, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useCopyToClipboard } from 'usehooks-ts';
import { toast } from 'sonner';
import MoveItemDialog from './MoveItemDialog';
import ItemLabelPreviewAndEditor from './item-label-preview-and-editor';
import { PopoverKeyBadge } from './KeyBadge';
import { useItemEditorCtx } from '../../item-editor-context';

interface ItemHeaderProps {
    surveyItem: SurveyItem;
    surveyItemList: Array<{ key: string, isGroup: boolean }>;
    currentMode: 'source' | 'normal';
    hideMoveToOtherGroup: boolean;
    onChangeMode: (mode: 'source' | 'normal') => void;
    onChangeItemColor: (newColor: string) => void;
    onMoveItem: (newParentKey: string, oldItemKey: string) => void;
    onDeleteItem: () => void;
    onChangeKey: (oldKey: string, newKey: string) => void;
    onChangeItemLabel: (newLabel: string) => void;
}

const KeyPathDisplay: React.FC<{ fullKey: string; color: string }> = ({ fullKey, color }) => {
    const { setSelectedItemKey, setCurrentPath } = useItemEditorCtx();
    const keyParts = fullKey.split('.');

    if (keyParts.length <= 1) {
        return null;
    } else {
        const handleClick = (index: number) => {
            const partialKey = keyParts.slice(0, index + 1).join('.');
            setCurrentPath(getParentKeyFromFullKey(partialKey));
            setSelectedItemKey(partialKey);
        };

        return (
            <span className='text-xs font-semibold cursor-default' style={{ color: color }}>
                {keyParts.slice(0, keyParts.length - 1).map((keyPart, partIndex) => (
                    <React.Fragment key={partIndex}>
                        <span
                            className="cursor-pointer hover:underline hover:opacity-80"
                            onClick={() => handleClick(partIndex)}
                        >
                            {keyPart}
                        </span>
                        {partIndex < keyParts.length - 2 && <span> . </span>}
                    </React.Fragment>
                ))}
            </span>
        );
    }
};

const ItemHeader: React.FC<ItemHeaderProps> = (props) => {
    const popoverCloseRef = React.useRef<HTMLButtonElement>(null);
    const [, copy] = useCopyToClipboard()
    const [moveItemDialogOpen, setMoveItemDialogOpen] = React.useState(false);

    const item = {
        parentKey: getParentKeyFromFullKey(props.surveyItem.key),
        itemKey: getItemKeyFromFullKey(props.surveyItem.key),
        typeInfos: getItemTypeInfos(props.surveyItem),
        color: getItemColor(props.surveyItem)
    }

    const hideColorPicker = item.typeInfos.key === 'pageBreak' || item.typeInfos.key === 'surveyEnd';

    const confidentialSymbol = () => {
        const confidentialMode = (props.surveyItem as SurveySingleItem).confidentialMode;
        if (!confidentialMode) {
            return null;
        }
        return <Tooltip>
            <TooltipTrigger asChild>
                <span className='px-2'>
                    <ShieldCheck className='size-5' />
                </span>
            </TooltipTrigger>
            <TooltipContent className='max-w-64'>
                {`This item is confidential with mode "${confidentialMode}" . Responses will be saved in the confidential data store.`}
            </TooltipContent>
        </Tooltip>
    }


    const colorPicker = hideColorPicker ? null : (<Popover>
        <PopoverTrigger
            className="rounded-lg p-0 hover:opacity-80"
            style={{
                color: item.color,
                backgroundColor: item.color,
            }}
        >
            <div className="size-6 p-0">
                {' '}
            </div>

        </PopoverTrigger>
        <PopoverContent className='grid grid-cols-4 p-2 gap-2 w-auto'>
            {builtInItemColors.map(color => (
                <Button
                    key={color}
                    value={color}
                    style={{
                        backgroundColor: color,
                        color: color
                    }}
                    className={cn(
                        "size-8 rounded-lg p-0 hover:opacity-80",
                        {
                            'ring ring-slate-600 ring-offset-2': color === item.color
                        }
                    )}
                    size='icon'
                    onClick={() => {
                        props.onChangeItemColor(color);
                        popoverCloseRef.current?.click();
                    }}
                >
                    {' '}
                </Button>
            )
            )}
            <PopoverClose
                ref={popoverCloseRef}
                className='flex items-center justify-center'
            >
                <X className='size-6' />
            </PopoverClose>

        </PopoverContent>
    </Popover>)

    const itemMenu = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size='icon'
                    variant={'ghost'}

                >
                    <div className='siz'>
                        <MoreVertical />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuRadioGroup
                    value={props.currentMode}
                >
                    <DropdownMenuRadioItem
                        value='normal'
                        onClick={() => {
                            props.onChangeMode('normal');
                        }}
                    >
                        <div className='flex items-center gap-2 justify-between w-full'>
                            <p>Normal mode</p>
                            <SquarePen className='text-neutral-500 size-5' />
                        </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        value='source'
                        onClick={() => {
                            props.onChangeMode('source');
                        }}
                    >
                        <div className='flex items-center gap-2 justify-between w-full'>
                            <p>Source code</p>
                            <CodeSquare className='text-neutral-500 size-5' />
                        </div>
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>


                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => {
                        const surveyItemJSON = JSON.stringify(props.surveyItem, null, 2);
                        copy(surveyItemJSON);
                        toast('Item copied to clipboard');
                    }}
                >
                    <div className='flex items-center gap-2'>
                        <ClipboardCopy className='text-neutral-500 size-5' />
                        <p>Copy</p>
                    </div>
                </DropdownMenuItem>
                {!props.hideMoveToOtherGroup && <DropdownMenuItem
                    onClick={() => setMoveItemDialogOpen(true)}
                >
                    <div className='flex items-center gap-2'>
                        <Move className='text-neutral-500 size-5' />
                        <p>Move to other group</p>
                    </div>
                </DropdownMenuItem>}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => {
                        if (confirm(`Are you sure you want to delete the item "${props.surveyItem.key}"?`)) {
                            props.onDeleteItem();
                        }
                    }}
                >
                    <div className='flex items-center gap-2'>
                        <Trash2 className='text-red-500 size-5' />
                        <p>Delete item</p>
                    </div>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );

    const moveItemDialog = (
        <MoveItemDialog
            open={moveItemDialogOpen}
            onClose={() => setMoveItemDialogOpen(false)}
            surveyItemList={props.surveyItemList}
            currentItemKey={props.surveyItem.key}
            onMoveItem={(newParentKey, oldItemKey) => {
                props.onMoveItem(newParentKey, oldItemKey);
            }}
        />
    )

    const itemLabel = props.surveyItem.metadata?.itemLabel;
    const isRoot = item.parentKey === '';

    const relevantKeys = props.surveyItemList.filter(i => getParentKeyFromFullKey(i.key) == getParentKeyFromFullKey(props.surveyItem.key)).map(i => getItemKeyFromFullKey(i.key));

    return (
        <TooltipProvider>
            <div className='px-3 py-2 flex gap-3 items-center bg-secondary'>
                <Tooltip
                    delayDuration={0}
                >
                    <TooltipTrigger>
                        <div
                            className={item.typeInfos.defaultItemClassName}
                            style={{
                                color: item.color
                            }}>
                            <item.typeInfos.icon
                                className='size-8'
                            />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent align='start' side='bottom'

                    >
                        {item.typeInfos.label}
                    </TooltipContent>
                </Tooltip>

                <div className='flex flex-col items-start gap-0.5'>
                    <div className='flex'>
                        <KeyPathDisplay fullKey={props.surveyItem.key} color={item.color ?? ''} />
                    </div>
                    <div className='flex-grow flex flex-row gap-1 items-center'>
                        {!isRoot && <CornerDownRight size={16} color={item.color} />}
                        <PopoverKeyBadge
                            allOtherKeys={relevantKeys.filter(i => i !== item.itemKey)}
                            itemKey={item.itemKey}
                            headerText={isRoot ? 'Root Group Key' : 'Item Key'}
                            isHighlighted={true}
                            highlightColor={item.color}
                            onKeyChange={(newSubKey) => {
                                const keyParts = props.surveyItem.key.split('.');
                                keyParts.pop();
                                keyParts.push(newSubKey);
                                const newFullKey = keyParts.join('.');
                                props.onChangeKey(props.surveyItem.key, newFullKey);
                            }}
                        />
                    </div>
                </div>
                <div className='grow flex justify-center'>
                    <ItemLabelPreviewAndEditor
                        key={props.surveyItem.key}
                        itemLabel={itemLabel || ''}
                        onChangeItemLabel={(newLabel: string) => {
                            props.onChangeItemLabel(newLabel);
                        }}
                    />
                </div>

                {confidentialSymbol()}
                {colorPicker}
                {itemMenu}
            </div>
            {moveItemDialog}

        </TooltipProvider>
    );
};

export default ItemHeader;

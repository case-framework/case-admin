'use client';

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ClipboardPaste, PlusSquare } from 'lucide-react';
import React from 'react';
import { SpecialSurveyItemTypeInfos, SurveyItemTypeRegistry } from '../../../utils/utils';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Fuse from 'fuse.js';

interface ItemCreatorProps {
    trigger: React.ReactNode;
    parentKey: string;
    onAddItem: (newItemInfos: {
        itemType: string;
        parentKey: string;
    }) => void;
    onInsertFromClipboard: (parentKey: string) => void;
}


const ItemCreator: React.FC<ItemCreatorProps> = (props) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {props.trigger}
                </DropdownMenuTrigger>
                <DropdownMenuContent side='right'>
                    <DropdownMenuGroup>
                        <DropdownMenuItemWithContent
                            icon={<ClipboardPaste />}
                            iconClassName={'text-neutral-600'}
                            label={'Paste'}
                            description={'Paste a copied item.'}
                            onClick={() => {
                                props.onInsertFromClipboard(
                                    props.parentKey
                                );
                            }}
                        />
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Built-in types</DropdownMenuLabel>
                        <DropdownMenuItemWithContent
                            icon={<PlusSquare />}
                            iconClassName={'text-green-600'}
                            label={'Question or Info item'}
                            description={'Item type will be selected in the next step.'}
                            onClick={() => {
                                setIsDialogOpen(true);
                            }}
                        />
                        <DropdownMenuItemWithContent
                            icon={<SpecialSurveyItemTypeInfos.groupItem.icon />}
                            iconClassName={SpecialSurveyItemTypeInfos.groupItem.defaultItemClassName}
                            label={SpecialSurveyItemTypeInfos.groupItem.label}
                            description={SpecialSurveyItemTypeInfos.groupItem.description}
                            onClick={() => {
                                props.onAddItem({
                                    itemType: 'group',
                                    parentKey: props.parentKey,
                                });
                            }}
                        />
                        <DropdownMenuItemWithContent
                            icon={<SpecialSurveyItemTypeInfos.pageBreak.icon />}
                            iconClassName={SpecialSurveyItemTypeInfos.pageBreak.defaultItemClassName}
                            label={SpecialSurveyItemTypeInfos.pageBreak.label}
                            description={SpecialSurveyItemTypeInfos.pageBreak.description}
                            onClick={() => {
                                props.onAddItem({
                                    itemType: 'pageBreak',
                                    parentKey: props.parentKey,
                                });
                            }}
                        />
                        <DropdownMenuItemWithContent
                            icon={<SpecialSurveyItemTypeInfos.surveyEnd.icon />}
                            iconClassName={SpecialSurveyItemTypeInfos.surveyEnd.defaultItemClassName}
                            label={SpecialSurveyItemTypeInfos.surveyEnd.label}
                            description={SpecialSurveyItemTypeInfos.surveyEnd.description}
                            onClick={() => {
                                props.onAddItem({
                                    itemType: 'surveyEnd',
                                    parentKey: props.parentKey,
                                });
                            }}
                        />

                    </DropdownMenuGroup>

                </DropdownMenuContent>
            </DropdownMenu >
            <SingleItemTypeSelectorDialog
                open={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                }}
                onAddItem={(itemType) => {
                    setIsDialogOpen(false);
                    props.onAddItem({
                        itemType,
                        parentKey: props.parentKey,
                    });

                }}
            />
        </>
    );
};

interface SingleItemTypeSelectorDialogProps {
    open: boolean;
    onClose: () => void;
    onAddItem: (itemType: string) => void;
}

const options = {
    includeScore: true,
    ignoreLocation: true,
    keys: [{ name: 'label', weight: 0.7 }, { name: 'description', weight: 0.5 }]
}

const fuse = new Fuse(SurveyItemTypeRegistry, options)

const SingleItemTypeSelectorDialog: React.FC<SingleItemTypeSelectorDialogProps> = (props) => {
    const [searchValue, setSearchValue] = React.useState('');

    let filteredItemTypes = SurveyItemTypeRegistry;
    if (searchValue) {
        const result = fuse.search(searchValue);
        filteredItemTypes = result.map(r => r.item);

    }

    return (
        <Dialog
            open={props.open}
            onOpenChange={(open) => {
                if (!open) {
                    props.onClose();
                }
            }}>

            <DialogContent className='max-h-full flex flex-col'
                closeBtnAriaLabel='Close'
            >
                <DialogHeader>
                    <DialogTitle>
                        What type of item do you want to add?
                    </DialogTitle>
                </DialogHeader>
                <Input
                    id='item-type-search'
                    placeholder='Search for item type...'
                    className='w-full'
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                />
                <ul className='mt-2 h-96 grow overflow-y-scroll'>
                    {filteredItemTypes.length === 0 && (
                        <p className='text-center text-sm'>
                            No item types found. Try another search term.
                        </p>
                    )}
                    {filteredItemTypes.map((itemType, index) => {
                        return (
                            <li key={itemType.key}>
                                <Button
                                    className='w-full justify-start text-start h-auto px-3 py-2'
                                    variant='ghost'
                                    onClick={() => {
                                        props.onAddItem(itemType.key);
                                    }}
                                    disabled={!props.open}
                                >
                                    <div className='flex gap-4 items-start'>
                                        <div className={cn(
                                            'flex items-center justify-center pt-1',
                                            itemType.className
                                        )}>
                                            <itemType.icon
                                                className='size-6'
                                            />
                                        </div>
                                        <div>
                                            <p>{itemType.label}</p>
                                            <p className='text-xs text-muted-foreground text-wrap'>
                                                {itemType.description}
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                                {index < filteredItemTypes.length - 1 && <Separator className='my-2' />}
                            </li>
                        );
                    })}
                </ul>
            </DialogContent>
        </Dialog>

    )
}

interface DropdownMenuItemWithContentProps {
    icon: React.ReactNode;
    iconClassName?: string;
    label: string;
    description: string;
    disabled?: boolean;
    onClick?: () => void;

}

const DropdownMenuItemWithContent: React.FC<DropdownMenuItemWithContentProps> = (props) => {
    return (
        <DropdownMenuItem
            disabled={props.disabled}
            onClick={props.onClick}
        >
            <div className='flex gap-2'>
                <div className={cn(
                    'flex items-center justify-center',
                    props.iconClassName
                )}>
                    {props.icon}
                </div>
                <div>

                </div>
                <div>
                    <p>{props.label}</p>
                    <p className='text-xs text-muted-foreground'>
                        {props.description}
                    </p>
                </div>
            </div>
        </DropdownMenuItem>
    );
}

export default ItemCreator;

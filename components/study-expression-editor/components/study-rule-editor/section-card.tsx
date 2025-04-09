import React from 'react';
import AddPopover from './add-popover';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ExpressionArg } from '@/components/expression-editor/utils';
import HandlerListItem from './handler-list-item';

interface SectionCardProps {
    title: string;
    description: string;
    count?: number;

    // add new handler:
    usedKeys?: string[];
    keySuggestions?: string[];
    addWithoutKey?: boolean;
    onAddNewEntry?: (key?: string) => void;

    // items:
    items?: Array<{
        key?: string;
        actions?: ExpressionArg[];
    }>;
    onSelectItem?: (index: number) => void;
    onRemoveItem?: (index: number) => void;

    // children
    children?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = (props) => {
    const renderAddNew = () => {

        if (props.addWithoutKey) {
            return <Button
                variant={'ghost'}
                size='icon'
                onClick={() => { props.onAddNewEntry?.() }}
            >
                <PlusIcon className='size-4' />
            </Button>
        }

        return <AddPopover
            trigger={
                <Button
                    variant={'ghost'}
                    size='icon'
                >
                    <PlusIcon className='size-4' />
                </Button>
            }
            usedKeys={props.usedKeys ?? []}
            suggestions={props.keySuggestions ?? []}
            align='end'
            onAddNewKey={(key: string) => {
                props.onAddNewEntry?.(key)
            }}
        />
    }

    const hasItems = props.items !== undefined && props.items.length > 0;
    const isEmpty = props.items !== undefined && props.items.length === 0 && !props.children

    return (
        <Card className='flex flex-col'>
            <div className='flex justify-between gap-2 items-start border-b border-border px-4 py-2'>
                <div>
                    <h3 className='font-bold text-lg tracking-wide'>
                        {props.title}

                        {props.count !== undefined && <span
                            className='font-normal ms-1 text-muted-foreground'
                        >
                            ({props.count})
                        </span>}
                    </h3>
                    <p className='text-xs text-muted-foreground mt-1'>
                        {props.description}
                    </p>
                </div>
                {props.onAddNewEntry && <div className='-mt-1 -me-3'>
                    {renderAddNew()}
                </div>}
            </div>

            <div className='grow'>
                {hasItems && <ul className='w-full divide-y divide-border pb-6 min-h-40 max-h-64 overflow-y-auto'>
                    {props.items?.map((item, index) => (<li
                        key={'item-' + index}
                    >
                        <HandlerListItem
                            label={item.key}
                            actions={item.actions}
                            onRemove={() => {
                                console.log('remove item', index)
                            }}
                            onSelect={() => {
                                console.log('select item', index)
                            }}
                        />
                    </li>))}
                </ul>}
                {isEmpty && <div className='h-full flex items-center w-full justify-center'><p className='text-center text-xs text-muted-foreground my-6'>No items</p></div>}
                {props.children}
            </div>
        </Card>
    );
};

export default SectionCard;

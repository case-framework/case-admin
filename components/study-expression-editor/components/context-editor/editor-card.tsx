import React from 'react';
import { KeyValuePairDefs } from '../../types';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import AddPopover from './add-popover';
import ListItemView from './list-item-view';
import { cn } from '@/lib/utils';

interface EditorCardProps {
    label: string;
    description: string;
    type: 'string' | 'key-value-pair';
    data?: string[] | KeyValuePairDefs[];
    selectedIndex?: number;
    onChange?: (data: string[] | KeyValuePairDefs[]) => void;
    onSelectIndex?: (index: number | undefined) => void;
}


const EditorCard: React.FC<EditorCardProps> = (props) => {
    const getUsedKeys = (): string[] => {
        if (!props.data) {
            return [];
        }

        if (props.type === 'string') {
            return props.data as string[];
        }

        if (props.type === 'key-value-pair') {
            return (props.data as KeyValuePairDefs[]).map(kv => kv.key);
        }

        return [];
    }
    const usedKeys = getUsedKeys();


    const addNewKey = (key: string) => {
        if (!key) {
            return;
        }
        if (props.type === 'string') {
            const newData = props.data !== undefined ? [...(props.data as string[]), key] : [key];
            if (props.onChange) {
                props.onChange(newData);
            }
        } else if (props.type === 'key-value-pair') {
            const newData = props.data !== undefined ? [...(props.data as KeyValuePairDefs[]), { key, possibleValues: [] }] : [{ key, possibleValues: [] }];
            if (props.onChange) {
                props.onChange(newData);
            }
            props.onSelectIndex?.(newData.length - 1);
        }
    }

    const removeItem = (item: string | KeyValuePairDefs) => {
        if (!confirm('Are you sure you want to delete this entry? All unsaved changes will be lost.')) {
            return;
        }

        if (props.type === 'string') {
            const newData = props.data !== undefined ? [...(props.data as string[])] : [];
            newData.splice(newData.indexOf(item as string), 1);
            if (props.onChange) {
                props.onChange(newData);
            }
        } else if (props.type === 'key-value-pair') {
            const newData = props.data !== undefined ? [...(props.data as KeyValuePairDefs[])] : [];
            if (props.onChange) {
                props.onChange(newData.filter(e => e.key !== (item as KeyValuePairDefs).key));
            }
        }
        if (props.selectedIndex !== undefined) {
            props.onSelectIndex?.(undefined);
        }
    }

    const hasItems = props.data !== undefined && props.data?.length > 0;

    return (
        <div
            className={cn('border border-border rounded-lg flex flex-col bg-white',
                {
                    'border-primary/50': props.selectedIndex !== undefined,
                }
            )}
        >
            <div className='flex justify-between gap-2 items-start border-b border-border px-4 py-2'>
                <div>
                    <h3 className='font-bold text-lg tracking-wide'>
                        {props.label}
                        <span
                            className='font-normal ms-1 text-muted-foreground'
                        >
                            ({props.data?.length ?? 0})
                        </span>
                    </h3>
                    <p className='text-xs text-muted-foreground mt-1'>
                        {props.description}
                    </p>
                </div>

                <div className='-mt-1 -me-1'>
                    <AddPopover
                        trigger={
                            <Button
                                variant={'ghost'}
                                size='icon'
                            >
                                <PlusIcon className='size-4' />
                            </Button>
                        }
                        usedKeys={usedKeys}
                        align='end'
                        onAddNewKey={addNewKey}
                    />
                </div>

            </div>

            {!hasItems && (<div className='grow flex flex-col justify-center items-center py-4  h-40'>
                <AddPopover
                    trigger={
                        <Button
                            variant={'outline'}
                        >
                            <PlusIcon className='size-4' />
                            <span>Add first entry</span>
                        </Button>
                    }
                    usedKeys={usedKeys}
                    onAddNewKey={addNewKey}
                />
            </div>)}
            {hasItems && (<ul className='w-full divide-y divide-border pb-6 min-h-40 max-h-64 overflow-y-auto'>
                {props.data?.map((item, index) => (
                    <li key={index} className=''>
                        <ContextMenu>
                            <ContextMenuTrigger asChild>
                                <Button variant={props.selectedIndex === index ? 'secondary' : 'ghost'}
                                    className='w-full h-auto rounded-none'
                                    onClick={() => {
                                        if (props.selectedIndex === index) {
                                            props.onSelectIndex?.(undefined);
                                            return;
                                        }
                                        props.onSelectIndex?.(index)
                                    }}
                                >
                                    <ListItemView
                                        entry={item}
                                    />
                                </Button>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem onClick={() => removeItem(item)}>
                                    Delete entry
                                </ContextMenuItem>

                            </ContextMenuContent>
                        </ContextMenu>
                    </li>))}
            </ul>)}
        </div>
    );
};

export default EditorCard;

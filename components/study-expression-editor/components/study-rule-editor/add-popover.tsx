import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PopoverClose } from '@radix-ui/react-popover';
import React from 'react';
import { Button } from '@/components/ui/button';

interface AddPopoverProps {
    trigger: React.ReactNode;
    usedKeys: string[];
    suggestions: string[];
    align?: 'end';
    onAddNewKey: (key: string) => void;
}

const AddPopover: React.FC<AddPopoverProps> = (props) => {
    const [newKey, setNewKey] = React.useState('');
    const closeRef = React.useRef<HTMLButtonElement>(null);


    const isUsed = (key: string) => {
        return props.usedKeys.includes(key);
    }

    const addNewKey = (key: string) => {
        if (!key || isUsed(key)) {
            return;
        }
        props.onAddNewKey(key);
        setNewKey('');
        closeRef.current?.click();
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {props.trigger}
            </PopoverTrigger>
            <PopoverContent
                align={props.align}
            >
                <PopoverClose className='hidden'
                    ref={closeRef}
                >

                </PopoverClose>
                <Label className='space-y-1.5'>
                    <span>Add new entry for:</span>
                    <div className='flex gap-2 items-center'>
                        <Input
                            placeholder='Enter key'
                            value={newKey}
                            list='key-suggestions'
                            onChange={(e) => setNewKey(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addNewKey(newKey);
                                }
                            }}
                        />
                        <datalist id='key-suggestions'>
                            {props.suggestions.map((key) => (
                                <option key={key} value={key} />
                            ))}
                        </datalist>
                        <Button
                            variant={'default'}
                            disabled={!newKey || isUsed(newKey)}
                            onClick={() => addNewKey(newKey)}
                        >
                            Add
                        </Button>
                    </div>
                </Label>
                {isUsed(newKey) && (
                    <p className='text-xs text-destructive mt-2'>
                        Key already exists
                    </p>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default AddPopover;

import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';

interface ItemLabelPreviewAndEditorProps {
    itemLabel: string;
    onChangeItemLabel: (newLabel: string) => void;
}

const ItemLabelPreviewAndEditor: React.FC<ItemLabelPreviewAndEditorProps> = (props) => {
    const [editMode, setEditMode] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);


    if (!editMode) {
        return (
            <Tooltip delayDuration={350}>
                <TooltipTrigger asChild>
                    <button
                        type='button'
                        className='font-medium text-lg w-full text-center hover:underline'
                        onClick={() => {
                            setEditMode(true)
                        }}
                    >
                        {props.itemLabel}
                        {props.itemLabel.length < 1 && <span className='text-muted-foreground text-xs'>
                            {'(click here to add item label)'}
                        </span>}
                    </button>
                </TooltipTrigger>
                <TooltipContent side='bottom' align='center'>
                    Click to edit
                </TooltipContent>
            </Tooltip>
        );
    }


    return (
        <Input
            defaultValue={props.itemLabel}
            ref={inputRef}
            onChange={(e) => {
                const value = e.target.value;
                props.onChangeItemLabel(value);
            }}
            id='new-item-label'
            autoComplete='off'
            className='w-full text-center focus:border-none px-1 py-0 h-auto font-medium !text-lg bg-transparent border-none'
            placeholder='Enter item label'
            onBlur={() => {
                console.log('blur');
                setEditMode(false);
            }}

        />
    );
};

export default ItemLabelPreviewAndEditor;

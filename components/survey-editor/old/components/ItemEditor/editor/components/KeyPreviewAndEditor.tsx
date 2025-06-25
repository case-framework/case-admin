import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Check, X } from 'lucide-react';

import React, { useEffect } from 'react';

interface KeyPreviewAndEditorProps {
    parentKey: string;
    itemKey: string;
    surveyItemList: Array<{ key: string, isGroup: boolean }>;
    onChangeKey: (newKey: string) => void;
}

const KeyPreviewAndEditor: React.FC<KeyPreviewAndEditorProps> = (props) => {
    const [editMode, setEditMode] = React.useState(false);
    const [newKey, setNewKey] = React.useState(props.itemKey);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
    const [touched, setTouched] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        setNewKey(props.itemKey);
        setEditMode(false);
        setErrorMsg(null);
    }, [props.itemKey, props.parentKey, props.surveyItemList]);

    useEffect(() => {
        if (editMode) {
            setErrorMsg(null);
            setTouched(false);
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [editMode]);

    useEffect(() => {
        if (!touched) {
            return
        }

        if (newKey === props.itemKey) {
            return
        }
        if (newKey.length === 0) {
            setErrorMsg('Key cannot be empty');
            return;
        }
        if (newKey.includes('.')) {
            setErrorMsg('Key cannot contain a dot');
            return;
        }
        const newFullKey = [props.parentKey, newKey].join('.');
        if (props.surveyItemList.find(item => item.key === newFullKey)) {
            setErrorMsg('Key already exists');
            return;
        }
    }, [newKey, touched, props.itemKey, props.parentKey, props.surveyItemList]);

    if (!editMode) {
        return (
            <div className=''>
                <p className='text-xs font-mono'>
                    {props.parentKey}
                </p>
                <Tooltip delayDuration={350}>
                    <TooltipTrigger asChild>
                        <button
                            type='button'
                            className='font-bold w-full text-start hover:underline'
                            onClick={() => {
                                setEditMode(true)
                            }}
                        >
                            {props.itemKey}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='bottom' align='start'>
                        Click to edit
                    </TooltipContent>
                </Tooltip>

            </div>
        );
    }

    const validNewKey = (newKey: string): boolean => {
        if (newKey === props.itemKey) {
            return false;
        }
        if (newKey.length === 0) {
            return false;
        }
        if (newKey.includes('.')) {
            return false;
        }
        const newFullKey = [props.parentKey, newKey].join('.');
        if (props.surveyItemList.find(item => item.key === newFullKey)) {
            return false;
        }

        return true;
    }

    return (
        <div className='flex gap-3 items-center relative'>
            <div className='grow'>
                <p className='text-xs font-mono'>
                    {props.parentKey}
                </p>
                <Input
                    value={newKey}
                    ref={inputRef}
                    onChange={(e) => {
                        setNewKey(e.target.value);
                        setErrorMsg(null);
                        setTouched(true);
                    }}
                    id='new-key'
                    autoComplete='off'
                    className='w-full focus:border-none text-base px-1 py-0 h-auto font-bold bg-transparent border-none'
                />
            </div>
            <div className='flex gap-1'>
                <Button
                    variant='ghost'
                    size='icon'
                    className='text-red-600'
                    onClick={() => {
                        setNewKey(props.itemKey);
                        setErrorMsg(null);
                        setEditMode(false)
                    }}
                >
                    <X />
                </Button>
                <Button
                    variant='ghost'
                    size='icon'
                    className='text-green-600'
                    disabled={!validNewKey(newKey)}
                    onClick={() => {
                        let newFullKey = [props.parentKey, newKey].join('.');
                        if (props.parentKey === '') {
                            newFullKey = newKey;
                        }
                        props.onChangeKey(newFullKey);
                        setEditMode(false)
                    }}
                >
                    <Check />
                </Button>
            </div>
            {errorMsg && <p className='absolute -bottom-10 text-red-600 bg-white/90 px-3 py-1 rounded-lg'>
                {errorMsg}
            </p>}

        </div>
    );
};

export default KeyPreviewAndEditor;

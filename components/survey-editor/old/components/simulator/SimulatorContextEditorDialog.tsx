import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SurveyContext as ContextValues } from 'survey-engine/data_types';

import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SurveyContextEditorDialog: React.FC<{
    contextValues: ContextValues;
    onContextChange: (context: ContextValues) => void;
    onClose: () => void;
    isOpen: boolean;
}> = (props) => {
    const [keyValuePairs, setKeyValuePairs] = React.useState<[string, string][]>([]);

    //  Pull keyValuePairs when contextValues change / dialog opens
    useEffect(() => {
        if (props.isOpen) {
            setKeyValuePairs(Object.entries(props.contextValues.participantFlags ?? {}));
        }

    }, [props.contextValues.participantFlags, props.isOpen]);


    const errorDuplicate = new Set(keyValuePairs.map(([key]) => key)).size !== keyValuePairs.length;
    const errorEmptyKey = keyValuePairs.some(([key]) => key.length === 0);
    const error = errorDuplicate || errorEmptyKey;


    return (<Dialog open={props.isOpen} onOpenChange={props.onClose}>
        <DialogContent className='max-w-screen-sm'>
            <DialogHeader>
                <DialogTitle>
                    Survey Context Variables
                </DialogTitle>
            </DialogHeader>

            <div className='space-y-4 w-full overflow-hidden p-1'>
                <div className='my-2'>
                    <div key='isLoggedIn' className='flex items-center gap-2 max-w-full'>
                        <Input
                            className='font-mono text-sm '
                            type='text'
                            contentEditable={false}
                            readOnly={true}
                            value={"isLoggedIn"}
                            disabled={true}
                        />
                        <Select onValueChange={
                            (value) => {
                                props.onContextChange({
                                    ...props.contextValues,
                                    isLoggedIn: value === 'true'
                                });
                            }
                        } value={props.contextValues.isLoggedIn?.toString()}>
                            <SelectTrigger className='font-mono text-sm'>
                                <SelectValue placeholder="Please select something." />
                            </SelectTrigger>
                            <SelectContent className='font-mono text-sm'>
                                <SelectGroup>
                                    <SelectItem value="true">true</SelectItem>
                                    <SelectItem value="false">false</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button
                            className='p-3'
                            variant='outline'
                            disabled={true}
                        >
                            <Trash2 className='size-4' />
                        </Button>
                    </div>
                    {
                        keyValuePairs.map(([key, value], index) => (
                            <div key={"key_" + index} className='flex items-center gap-2 mt-2 max-w-full'>
                                <Input
                                    className='font-mono text-sm'
                                    type='text'
                                    value={key}
                                    minLength={1}
                                    required
                                    placeholder='Name'
                                    onChange={(e) => {
                                        setKeyValuePairs((prev) => {
                                            const newPairs = [...prev];
                                            newPairs[index][0] = e.target.value;
                                            return newPairs;
                                        });
                                    }}
                                />
                                <Input
                                    className='font-mono text-sm'
                                    type='text'
                                    value={String(value)}
                                    placeholder='Value'
                                    onChange={(e) => {
                                        setKeyValuePairs((prev) => {
                                            const newPairs = [...prev];
                                            newPairs[index][1] = e.target.value;
                                            return newPairs;
                                        });
                                    }}
                                />
                                <Button
                                    variant='outline'
                                    className='p-3'
                                    onClick={() => {
                                        setKeyValuePairs((prev) => {
                                            prev.splice(index, 1);
                                            return [...prev];
                                        });
                                    }}
                                >
                                    <Trash2 className='size-4' />
                                </Button>
                            </div>

                        ))
                    }
                </div>

                <Separator />

                <div className='flex flex-row justify-end gap-2 max-w-full'>
                    <Button
                        className='p-3'
                        variant='outline'
                        disabled={keyValuePairs.some(([key]) => key.length === 0)}
                        onClick={() => {
                            setKeyValuePairs((prev) => {
                                prev.push(['', '']);
                                return [...prev];
                            });
                        }}
                    >
                        <Plus className='size-4' />
                    </Button>
                </div>

            </div>
            <DialogFooter>
                <p className='text-sm text-red-700 text-center m-auto '>{(errorDuplicate ? "Keys must be unique. " : "") + (errorEmptyKey ? "Keys must not be empty. " : "")}</p>
                <DialogClose asChild>
                    <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button disabled={error}
                    onClick={() => {
                        const newValues = { ...props.contextValues, participantFlags: Object.fromEntries(keyValuePairs) };
                        props.onContextChange(newValues);
                        props.onClose();
                    }}
                >
                    Save
                </Button>
            </DialogFooter>

        </DialogContent>
    </Dialog>)
}

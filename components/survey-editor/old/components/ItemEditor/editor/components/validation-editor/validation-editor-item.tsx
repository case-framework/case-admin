import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Trash2, X } from 'lucide-react';
import React from 'react';
import { Validation } from 'survey-engine/data_types';

interface ValidationEditorItemProps {
    validation: Validation;
    existingKeys: string[];
    onChange: (newValidation: Validation) => void;
    onDelete: () => void;
}

const ValidationEditorItem: React.FC<ValidationEditorItemProps> = (props) => {
    const [currentKey, setCurrentKey] = React.useState(props.validation.key || '');
    const { validation, onChange } = props;


    const hasValidKey = (key: string): boolean => {
        if (key.length < 1) {
            return false;
        }
        if (props.existingKeys.includes(key)) {
            return false;
        }
        return true;
    }

    return (
        <div className='border border-border rounded-md'>
            <div className='flex items-center gap-4 p-4'>
                <div className='flex items-center gap-2'>
                    <Label htmlFor={'validation-key-' + props.validation.key}>
                        Key
                    </Label>
                    <Input
                        id={'validation-key-' + props.validation.key}
                        className='w-full'
                        value={currentKey}
                        onChange={(e) => {
                            const value = e.target.value;

                            setCurrentKey(value);
                        }}
                    />
                    {currentKey !== validation.key &&
                        <div className='flex items-center'>
                            <Button
                                variant='ghost'
                                className='text-destructive'
                                size='icon'
                                onClick={() => {
                                    setCurrentKey(props.validation.key);
                                }}
                            >
                                <X className='size-4' />
                            </Button>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='text-primary'
                                disabled={!hasValidKey(currentKey)}
                                onClick={() => {
                                    onChange({
                                        ...props.validation,
                                        key: currentKey
                                    })
                                }}
                            >
                                <Check className='size-4' />
                            </Button>
                        </div>}
                </div>

                <div>
                    <Select
                        value={props.validation.type}
                        onValueChange={(value) => {
                            props.onChange({
                                ...props.validation,
                                type: value as 'soft' | 'hard'
                            })
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a type..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='hard'>
                                Hard validation
                            </SelectItem>
                            <SelectItem value='soft'>
                                Soft validation
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className='grow'>

                </div>

                <div>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                            if (!confirm('Are you sure you want to delete this validation?')) {
                                return;
                            }
                            props.onDelete();
                        }}
                    >
                        <Trash2 className='size-4' />
                    </Button>
                </div>

            </div>

            <div className='p-4 pt-0'>
                TODO: expression editor: {JSON.stringify(props.validation.rule)}

            </div>

        </div>
    );
};

export default ValidationEditorItem;

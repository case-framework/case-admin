import React, { useEffect } from 'react';
import { KeyValuePairDefs } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


interface ItemEditorProps {
    selection?: string | KeyValuePairDefs;
    type: string;
    onChange: (item: string | KeyValuePairDefs) => void;
    usedKeys: string[];
}

const ItemEditor: React.FC<ItemEditorProps> = (props) => {
    const [newKey, setNewKey] = React.useState(typeof props.selection === 'string' ? props.selection : props.selection?.key || '');

    useEffect(() => {
        if (typeof props.selection === 'string') {
            setNewKey(props.selection);
        } else {
            setNewKey(props.selection?.key || '');
        }
    }, [props.selection]);


    if (props.selection === undefined) {
        return null;
    }

    const showKeyError = () => {
        if (typeof props.selection === 'string') {
            if (newKey === props.selection) {
                return false;
            }
        } else {
            if (newKey === props.selection?.key) {
                return false;
            }
        }

        return newKey === '' || props.usedKeys.includes(newKey);
    }

    let content: React.ReactNode;
    if (typeof props.selection === 'string') {
        content = <Label className='space-y-1.5'>
            <span>Key</span>
            <Input
                value={newKey}
                onChange={(e) => {
                    const val = e.target.value;
                    setNewKey(val);
                    if (val.length === 0) {
                        return;
                    }
                    if (props.usedKeys.includes(val)) {
                        return;
                    }
                    props.onChange(val);
                }}
            />
            {showKeyError() && (
                <p className='text-destructive text-xs'>Wrong key - object cannot be updated</p>
            )}
        </Label>
    } else {
        content = <div className='space-y-4'>
            <div>
                <Label className='space-y-1.5'>
                    <span>Key</span>
                    <Input
                        value={newKey}
                        onChange={(e) => {
                            const val = e.target.value;
                            setNewKey(val);
                            if (val.length === 0) {
                                return;
                            }
                            if (props.usedKeys.includes(val)) {
                                return;
                            }
                            props.onChange({
                                ...props.selection as KeyValuePairDefs,
                                key: e.target.value,
                            });
                        }}
                    />
                    {showKeyError() && (
                        <p className='text-destructive text-xs'>Wrong key - object cannot be updated</p>
                    )}
                </Label>
            </div>

            <div>
                <Label
                    className='space-y-1.5 content-fit'
                >
                    <span>
                        Possible values
                    </span>
                    <Textarea
                        defaultValue={props.selection?.possibleValues?.join('\n') ?? ''}
                        rows={10}
                        placeholder='Enter possible values'
                        onChange={(e) => {
                            const val = e.target.value;
                            props.onChange({
                                ...props.selection as KeyValuePairDefs,
                                possibleValues: val.split('\n').map(e => e.trim()).filter(e => e.length > 0),
                            });
                        }}
                    />
                    <p className='text-xs text-muted-foreground'>
                        Enter one possible value per line.
                    </p>
                </Label>
            </div>
        </div>
    }

    return (
        <div className='px-4 space-y-6'>
            <Badge>
                {props.type}
            </Badge>
            <div>
                {content}
            </div>
        </div>

    );
};

export default ItemEditor;

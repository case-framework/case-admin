import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useEffect } from 'react';
import { getItemKeyFromFullKey, getParentKeyFromFullKey } from '../../../../utils/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface MoveItemDialogProps {
    open: boolean;
    currentItemKey: string;
    surveyItemList: Array<{ key: string, isGroup: boolean }>;
    onClose: () => void;
    onMoveItem: (newParentKey: string, oldItemKey: string) => void;
}

const MoveItemDialog: React.FC<MoveItemDialogProps> = (props) => {
    const currentParentKey = getParentKeyFromFullKey(props.currentItemKey);
    const itemKey = getItemKeyFromFullKey(props.currentItemKey);

    const [newParentKey, setNewParentKey] = React.useState<string | null>(null);

    const validTargets = props.surveyItemList.filter(item => item.isGroup && item.key !== currentParentKey && !item.key.includes(props.currentItemKey));

    useEffect(() => {
        setNewParentKey(null);
    }, [props.open]);

    return (
        <Dialog
            open={props.open}
            onOpenChange={(open) => {
                if (!open) {
                    props.onClose();
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Move item:
                        <span className='ms-2 font-mono'>
                            {itemKey}
                        </span>

                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-3'>
                    <div>
                        <p className='text-sm mb-1'>
                            From
                        </p>
                        <p className='font-mono border  rounded-lg px-3 py-1.5'>
                            {currentParentKey}
                        </p>
                    </div>
                    <div>
                        <ArrowDown className='size-6 mx-auto' />
                    </div>
                    <div>
                        <p className='text-sm mb-1'>
                            To
                        </p>
                        <Select

                            value={newParentKey || undefined}
                            onValueChange={(value) => {
                                setNewParentKey(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select new parent" />
                            </SelectTrigger>
                            <SelectContent>
                                {validTargets.length < 1 &&
                                    <SelectItem value='none'
                                        disabled
                                    >
                                        No valid targets
                                    </SelectItem>}
                                {validTargets.map(target => (
                                    <SelectItem
                                        key={target.key}
                                        value={target.key}
                                    >
                                        {target.key}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant={'outline'}
                        onClick={() => { props.onClose() }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!newParentKey}
                        onClick={() => {
                            if (newParentKey) {
                                props.onMoveItem(newParentKey, props.currentItemKey);
                                props.onClose();
                            }
                        }}
                    >
                        Move
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default MoveItemDialog;

import Filepicker from '@/components/inputs/Filepicker';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useStudyExpressionEditor } from '../../study-expression-editor-context';

import { toast } from 'sonner';
import { ExpArg, Expression } from '@/components/expression-editor/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LoadRulesFromDiskProps {
    open: boolean;
    onClose: () => void;
}


type SelectedFileInfo = 'invalid' | 'rules' | 'actions';

const isStudyRuleContent = (rules: Expression[]) => {
    if (rules.at(0)?.name !== 'IFTHEN') {
        return false;
    }
    if ((rules.at(0)?.data?.at(0) as ExpArg)?.exp?.name !== 'checkEventType') {
        return false;
    }
    return true;
}

const LoadRulesFromDisk: React.FC<LoadRulesFromDiskProps> = (props) => {
    const {
        changeMode,
        updateCurrentRules,
    } = useStudyExpressionEditor();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);
    const [newRulesToLoad, setNewRulesToLoad] = React.useState<Expression[] | undefined>(undefined);


    let selectedFileType: SelectedFileInfo | undefined;

    if (!newRulesToLoad) {
        if (errorMsg) {
            selectedFileType = 'invalid'
        } else {
            selectedFileType = undefined;
        }
    } else {
        if (errorMsg) {
            selectedFileType = 'invalid'
        } else {
            if (newRulesToLoad.length > 0) {
                if (isStudyRuleContent(newRulesToLoad)) {
                    selectedFileType = 'rules';
                } else {
                    selectedFileType = 'actions';
                }
            }
        }
    }




    const filePickerHint = (selectedFileInfo?: SelectedFileInfo) => {
        switch (selectedFileInfo) {
            case 'rules':
                return <p className='text-xs text-muted-foreground'>
                    Selected file appears to be a rule file.
                </p>
            case 'actions':
                return <p className='text-xs text-muted-foreground'>
                    Selected file appears to be an action file.
                </p>
            case 'invalid':
                return null;
            default:
                return <p className='text-xs text-muted-foreground'>
                    Select an action or rule JSON file to load.
                </p>;
        }
    }

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
                        Load study expressions from disk
                    </DialogTitle>
                    <DialogDescription>
                        Select a study expression JSON file to load.
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-2'>
                    <Filepicker
                        id='rules upload'
                        accept={{
                            'application/json': ['.json'],
                        }}
                        onChange={(files) => {
                            setNewRulesToLoad(undefined);
                            setErrorMsg(undefined);

                            if (files.length > 0) {
                                // read file as a json
                                const reader = new FileReader();

                                reader.onload = (e) => {
                                    const text = e.target?.result;
                                    if (typeof text === 'string') {
                                        const data = JSON.parse(text);

                                        if (!Array.isArray(data) ||
                                            data.some(e => !e.name)
                                        ) {
                                            setErrorMsg('The selected file is not a valid rule file.');
                                            toast.error('The selected file is not a valid rule file.');
                                            return;
                                        }

                                        setNewRulesToLoad(data as Expression[]);
                                    } else {
                                        setNewRulesToLoad(undefined);
                                        setErrorMsg('Error reading file');
                                        toast.error('Error reading file');
                                    }

                                }
                                reader.readAsText(files[0]);
                            }
                        }}
                    />
                    {filePickerHint(selectedFileType)}
                    {errorMsg && (
                        <p className='text-destructive mt-3'>{errorMsg}</p>
                    )}
                </div>
                <DialogFooter>
                    <Button variant={'outline'}
                        onClick={() => props.onClose()}
                    >Cancel</Button>
                    <Button
                        disabled={!newRulesToLoad}
                        onClick={() => {
                            updateCurrentRules(newRulesToLoad);
                            if (selectedFileType === 'rules') {
                                changeMode('study-rules');
                            } else {
                                changeMode('action');
                            }
                            props.onClose();
                        }}
                        variant={'default'}>
                        Load
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};

export default LoadRulesFromDisk;

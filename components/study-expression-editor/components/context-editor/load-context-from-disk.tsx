import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react';
import { useStudyExpressionEditor } from '../../study-expression-editor-context';
import { Button } from '@/components/ui/button';
import { StudyContext } from '../../types';
import Filepicker from '@/components/inputs/Filepicker';
import { toast } from 'sonner';

interface LoadContextFromDiskProps {
    open: boolean;
    onClose: () => void;
}

const LoadContextFromDisk: React.FC<LoadContextFromDiskProps> = (props) => {
    const {
        updateCurrentStudyContext,
    } = useStudyExpressionEditor();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);
    const [newCtxToLoad, setNewCtxToLoad] = React.useState<StudyContext | undefined>(undefined);

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
                        Load context from disk
                    </DialogTitle>
                    <DialogDescription>
                        Select a context JSON file to load.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Filepicker
                        id='context_from_disk'
                        accept={{
                            'application/json': ['.json'],
                        }}
                        onChange={(files) => {
                            setNewCtxToLoad(undefined);
                            setErrorMsg(undefined);

                            if (files.length > 0) {
                                // read file as a json
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const text = e.target?.result;
                                    let err: string | undefined;
                                    if (typeof text === 'string') {
                                        const data = JSON.parse(text);
                                        if (Array.isArray(data)) {
                                            err = 'The selected file is not a valid context file.';
                                        } else {
                                            setNewCtxToLoad(data as StudyContext);
                                        }
                                    }

                                    if (err) {
                                        setNewCtxToLoad(undefined);
                                        setErrorMsg(err);
                                        toast.error('Error reading file', { description: err });
                                    }

                                }
                                reader.readAsText(files[0]);
                            }
                        }}
                    />

                    {errorMsg && (
                        <p className='text-destructive mt-3'>{errorMsg}</p>
                    )}

                </div>
                <DialogFooter>
                    <Button variant={'outline'}
                        onClick={() => props.onClose()}
                    >Cancel</Button>
                    <Button
                        disabled={!newCtxToLoad}
                        onClick={() => {
                            updateCurrentStudyContext(newCtxToLoad);
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

export default LoadContextFromDisk;

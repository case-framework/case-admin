'use client';

import React, { useState, useTransition } from 'react';
import Filepicker from '@/components/inputs/Filepicker';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LoadingButton from '@/components/loading-button';
import { toast } from 'sonner';
import { Expression, isExpression } from 'survey-engine/data_types';
import { saveStudyRules } from '@/actions/study/studyRules';

interface UploadStudyRulesDialogProps {
    studyKey: string;
}

const checkIfValidStudyRule = (rules: unknown): boolean => {
    // check if an array and if all items are expressions
    if (!Array.isArray(rules)) {
        return false;
    }
    for (const rule of rules) {
        if (!isExpression(rule)) {
            return false;
        }
        if (rule.name !== 'IFTHEN') {
            return false;
        }
        if (!Array.isArray(rule.data) || rule.data.length < 1) {
            return false;
        }
        if (rule.data[0].exp?.name !== 'checkEventType') {
            return false;
        }
    }
    return true;
}

const UploadStudyRulesDialog: React.FC<UploadStudyRulesDialogProps> = (props) => {
    const [isPending, startTransition] = useTransition();
    const [newStudyRules, setNewStudyRules] = useState<Expression[] | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = useState<string | undefined>(undefined);
    const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

    const submit = async () => {
        setErrorMsg(undefined);
        setSuccessMsg(undefined);
        if (newStudyRules) {
            startTransition(async () => {
                try {
                    const response = await saveStudyRules(props.studyKey, newStudyRules)
                    if (response.error) {
                        setErrorMsg('Failed to upload study rules.');
                        toast.error('Failed to upload study rules.', {
                            description: response.error
                        });
                        return;
                    }
                    setSuccessMsg('Study rules uploaded successfully.');
                    toast.success('Study rules uploaded successfully.');

                    // close dialog
                    if (dialogCloseRef.current) {
                        dialogCloseRef.current.click();
                    }
                }
                catch (e: unknown) {
                    setErrorMsg((e as Error).message);
                    console.error(e);
                }
            })
        };
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Upload className='size-4 me-2' />
                    Upload a new version
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-1.5'>
                        Upload new version of the study rules
                    </DialogTitle>
                    <DialogDescription>
                        Use a JSON file from your computer to publish a new study rules
                    </DialogDescription>
                </DialogHeader>

                <div className='py-4 flex flex-col'>
                    <Filepicker
                        id='upload-study-rules-filepicker'
                        label='Select a file'
                        accept={{
                            'application/json': ['.json'],
                        }}
                        onChange={(files) => {
                            setErrorMsg(undefined);
                            setSuccessMsg(undefined);
                            if (files.length > 0) {
                                // read file as a json
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const text = e.target?.result;
                                    if (typeof text === 'string') {
                                        const data = JSON.parse(text);

                                        if (!checkIfValidStudyRule(data)) {
                                            setErrorMsg('Selected file does not appear to be a valid study rule file. Please check if you have selected the correct file.');
                                            return;
                                        }
                                        setNewStudyRules(data as Expression[]);
                                    } else {
                                        setNewStudyRules(undefined);
                                        console.error('error');
                                    }
                                }
                                reader.readAsText(files[0]);
                            } else {
                                setNewStudyRules(undefined);
                            }
                        }}
                    />
                    {errorMsg && <p className='text-red-600 mt-2'>{errorMsg}</p>}
                    {successMsg && <p className='text-green-600 mt-2'>{successMsg}</p>}
                </div>
                <DialogFooter>
                    <DialogClose
                        ref={dialogCloseRef}
                        asChild
                    >
                        <Button
                            variant={'outline-solid'}
                        >
                            Cancel
                        </Button>
                    </DialogClose>

                    <LoadingButton
                        isLoading={isPending}
                        onClick={() => {
                            submit();
                        }}
                        disabled={newStudyRules === undefined}
                    >
                        Upload
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UploadStudyRulesDialog;

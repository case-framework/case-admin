'use client';

import React, { useState, useTransition } from 'react';
import { Survey } from 'survey-engine/data_types';
import { uploadSurvey } from '../../../../../../../../actions/study/surveys';
import Filepicker from '@/components/inputs/Filepicker';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LoadingButton from '@/components/loading-button';
import { toast } from 'sonner';

interface UploadSurveyDialogProps {
    surveyKey: string;
    studyKey: string;
}

const UploadSurveyDialog: React.FC<UploadSurveyDialogProps> = ({
    surveyKey,
    studyKey,
}) => {
    const [isPending, startTransition] = useTransition();
    const [newSurvey, setNewSurvey] = useState<Survey | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = useState<string | undefined>(undefined);
    const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

    const submit = async () => {
        setErrorMsg(undefined);
        setSuccessMsg(undefined);
        if (newSurvey) {
            startTransition(async () => {
                try {
                    const response = await uploadSurvey(studyKey, surveyKey, newSurvey)
                    if (response.error) {
                        setErrorMsg('Failed to upload survey.');
                        toast.error('Failed to upload survey.', {
                            description: response.error
                        });
                        return;
                    }
                    setSuccessMsg('Survey uploaded successfully.');
                    toast.success('Survey uploaded successfully.');

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
                        Upload new version for <span className='font-mono text-cyan-800'>{surveyKey}</span>
                    </DialogTitle>
                    <DialogDescription>
                        Use a JSON file from your computer to publish a new survey version
                    </DialogDescription>
                </DialogHeader>

                <div className='py-4 flex flex-col'>
                    <Filepicker
                        id='upload-survey-filepicker'
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

                                        let surveyKeyFromData = '';
                                        if (data && data.surveyDefinition && data.surveyDefinition.key) {
                                            surveyKeyFromData = data.surveyDefinition.key;
                                        }

                                        if (!surveyKeyFromData) {
                                            setErrorMsg('Survey key not found in the uploaded file.');
                                            return;
                                        }

                                        if (surveyKey.length > 0 && surveyKeyFromData !== surveyKey) {
                                            setErrorMsg('Survey key in the uploaded file does not match the current survey key. Should be "' + surveyKey + '".');
                                            return;
                                        }
                                        const newSurvey = data as Survey;
                                        newSurvey.id = undefined;
                                        newSurvey.published = undefined;
                                        newSurvey.unpublished = undefined;
                                        newSurvey.versionId = ''
                                        setNewSurvey(data as Survey);
                                    } else {
                                        setNewSurvey(undefined);
                                        console.error('error');
                                    }
                                }
                                reader.readAsText(files[0]);
                            } else {
                                setNewSurvey(undefined);
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
                        disabled={newSurvey === undefined}
                    >
                        Upload
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

export default UploadSurveyDialog;

'use client';

import React, { useState, useTransition } from 'react';
import Filepicker from '@/components/inputs/Filepicker';
import { Survey } from 'survey-engine/data_types';
import { useRouter } from 'next/navigation';
import { createNewSurvey } from '../../../../../../../../actions/study/surveys';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/loading-button';
import { PenSquare, Upload } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';


interface CreateSurveyActionsCardProps {
    studyKey: string;
    existingSurveyKeys: string[];
}

const CreateSurveyActionsCard: React.FC<CreateSurveyActionsCardProps> = (props) => {
    const [isPending, startTransition] = useTransition();
    const [newSurvey, setNewSurvey] = useState<Survey | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
    const router = useRouter();

    const submit = async () => {
        setErrorMsg(undefined);
        if (newSurvey) {
            startTransition(async () => {
                try {
                    const resp = await createNewSurvey(props.studyKey, newSurvey)
                    if (resp.error) {
                        toast.error('Error uploading survey', {
                            description: resp.error
                        });
                        return;
                    }

                    toast.success('Survey uploaded successfully');
                    router.push(`/tools/study-configurator/${props.studyKey}/surveys/${newSurvey.surveyDefinition.key}`);
                }
                catch (e: unknown) {
                    toast.error('Error uploading survey', { description: (e as Error).message });
                    setErrorMsg((e as Error).message);
                }
            })
        };
    };

    return (
        <Card
            variant={'opaque'}
        >
            <CardHeader>
                <CardTitle className='text-xl font-bold'>Upload new survey</CardTitle>
            </CardHeader>

            <CardContent className='max-h-[400px] overflow-y-scroll'>
                <div className='flex flex-col gap-1'>
                    <Filepicker
                        id='upload-survey-filepicker'
                        label='Upload survey'
                        accept={{
                            'application/json': ['.json'],
                        }}
                        onChange={(files) => {
                            setErrorMsg(undefined);
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
                                            setNewSurvey(undefined);
                                            return;
                                        }

                                        if (props.existingSurveyKeys.includes(surveyKeyFromData)) {
                                            setErrorMsg(`Survey key "${surveyKeyFromData}" already used in this study. Open the survey to upload a new version for it.`);
                                            setNewSurvey(undefined);
                                            return;
                                        }
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
                    {errorMsg && <p className='text-red-600'>{errorMsg}</p>}
                    <LoadingButton
                        className='mt-3'
                        isLoading={isPending}
                        disabled={newSurvey === undefined}
                        onClick={() => {
                            submit();
                        }}
                    >
                        <Upload className='size-4 me-2' />
                        Upload
                    </LoadingButton>
                    <span className='text-neutral-600 text-xs'>Use a JSON file from your computer to create a new survey</span>
                </div>

                <div className='flex row items-center my-4'>
                    <div className='border-t border-t-neutral-400 grow h-[1px]'></div>
                    <span className='px-2 text-neutral-400'>OR</span>
                    <div className='border-t border-t-neutral-400 grow h-[1px]'></div>
                </div>

                <div className='flex flex-col gap-1'>
                    <Button
                        variant="outline"
                        disabled={true || isPending}
                        asChild
                    >
                        <Link
                            href={`/tools/editors/survey`}
                        >
                            <PenSquare className='size-4 me-2' />
                            Open Editor
                        </Link>
                    </Button>
                    <span className='text-neutral-600 text-xs'>Start creating the survey in the interactive editor</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default CreateSurveyActionsCard;

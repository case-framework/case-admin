'use client';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import React, { useState, useTransition } from 'react';
import { Link as NextUILink } from '@nextui-org/link'
import { Button } from '@nextui-org/button';
import Filepicker from '@/components/inputs/Filepicker';
import { Survey } from 'survey-engine/data_types';
import { BsCloudArrowUp, BsPencilSquare } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { uploadSurvey } from '../surveyUploadAction';


interface CreateSurveyActionsCardProps {
    studyKey: string;
    existingSurveyKeys: string[];
}

const CreateSurveyActionsCard: React.FC<CreateSurveyActionsCardProps> = (props) => {
    const [isPending, startTransition] = useTransition();
    const [newSurvey, setNewSurvey] = useState<Survey | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = useState<string | undefined>(undefined);
    const router = useRouter();

    const submit = async () => {
        setErrorMsg(undefined);
        setSuccessMsg(undefined);
        if (newSurvey) {
            startTransition(async () => {
                try {
                    const response = await uploadSurvey(props.studyKey, newSurvey)
                    router.refresh();
                    setSuccessMsg('Survey uploaded successfully.');
                }
                catch (e: any) {
                    setErrorMsg(e.message);
                    console.error(e);
                }
            })
        };
    };

    return (
        <Card
            className='bg-white/50'
            isBlurred
        >
            <CardHeader className="bg-content2">
                <h3 className='text-xl font-bold'>Upload new survey</h3>
            </CardHeader>
            <Divider />
            <CardBody className='max-h-[400px] overflow-y-scroll'>
                <div className='flex flex-col gap-1'>
                    <Filepicker
                        id='upload-survey-filepicker'
                        label='Upload survey'
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
                    {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                    {successMsg && <p className='text-success'>{successMsg}</p>}
                    <Button
                        variant="flat"
                        className='mt-unit-sm'
                        color='secondary'
                        size='lg'
                        isLoading={isPending}
                        isDisabled={newSurvey === undefined}
                        startContent={<BsCloudArrowUp className='text-large' />}
                        onClick={() => {
                            submit();
                        }}
                    >
                        Upload
                    </Button>
                    <span className='text-default-400 text-small'>Use a JSON file from your computer to create a new survey</span>
                </div>

                <div className='flex row items-center my-4'>
                    <div className='border-t border-t-default-400 grow h-[1px]'></div>
                    <span className='px-2 text-default-400'>OR</span>
                    <div className='border-t border-t-default-400 grow h-[1px]'></div>
                </div>

                <div className='flex flex-col gap-1'>
                    <Button
                        variant="flat"
                        color="primary"
                        as={NextUILink}
                        size='lg'
                        isDisabled={true || isPending}
                        href={`/tools/study-configurator/${props.studyKey}/survey/new`}
                        startContent={<BsPencilSquare className='text-large' />}
                    >

                        Open Editor
                    </Button>
                    <span className='text-default-400 text-small'>Start creating the survey in the interactive editor</span>
                </div>
            </CardBody>
            <Divider />

        </Card>
    );
};

export default CreateSurveyActionsCard;

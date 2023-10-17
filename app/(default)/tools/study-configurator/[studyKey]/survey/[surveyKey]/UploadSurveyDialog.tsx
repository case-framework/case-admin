'use client';

import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { BsCloudArrowUp } from 'react-icons/bs';
import { Survey } from 'survey-engine/data_types';
import { uploadSurvey } from '../surveyUploadAction';
import Filepicker from '@/components/inputs/Filepicker';

interface UploadSurveyDialogProps {
    surveyKey: string;
    studyKey: string;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const UploadSurveyDialog: React.FC<UploadSurveyDialogProps> = ({
    isOpen,
    onOpenChange,
    surveyKey,
    studyKey,
}) => {
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
                    const response = await uploadSurvey(studyKey, newSurvey)
                    router.refresh();
                    setSuccessMsg('Survey uploaded successfully.');
                }
                catch (e: any) {
                    setErrorMsg(e.message);
                    console.log(e);
                }
            })
        };
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}
            backdrop='blur'
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="bg-content2 flex flex-col gap-1">
                            Upload new version for {surveyKey}
                        </ModalHeader>
                        <Divider />
                        <ModalBody>
                            <div className='py-unit-md flex flex-col'>
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
                                                    setNewSurvey(data as Survey);
                                                } else {
                                                    setNewSurvey(undefined);
                                                    console.log('error');
                                                }
                                            }
                                            reader.readAsText(files[0]);
                                        } else {
                                            setNewSurvey(undefined);
                                        }
                                    }}
                                />

                                <span className='text-default-600 text-small'>Use a JSON file from your computer to publish a new survey version</span>

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
                                {errorMsg && <p className='text-danger mt-unit-sm'>{errorMsg}</p>}
                                {successMsg && <p className='text-success mt-unit-sm'>{successMsg}</p>}
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default UploadSurveyDialog;

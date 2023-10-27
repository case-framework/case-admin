'use client';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import React, { useState, useTransition } from 'react';
import { Link as NextUILink } from '@nextui-org/link'
import { Button } from '@nextui-org/button';
import Filepicker from '@/components/inputs/Filepicker';
import { BsCloudArrowUp, BsPencilSquare, BsShuffle } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { Expression, isExpression } from 'survey-engine/data_types';
import { uploadStudyRules } from './actionUploadStudyRules';


interface StudyRuleEditActionsProps {
    studyKey: string;
}

const checkIfValidStudyRule = (rules: any): boolean => {
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

const StudyRuleEditActions: React.FC<StudyRuleEditActionsProps> = (props) => {
    const [isPending, startTransition] = useTransition();
    const [newStudyRules, setNewStudyRules] = useState<Expression[] | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = useState<string | undefined>(undefined);
    const router = useRouter();

    const submit = async () => {
        setErrorMsg(undefined);
        setSuccessMsg(undefined);
        if (newStudyRules) {
            startTransition(async () => {
                try {
                    const response = await uploadStudyRules(props.studyKey, { rules: newStudyRules })
                    setSuccessMsg('Study rules uploaded successfully');
                    router.refresh();
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
                <h3 className='text-xl font-bold flex items-center'>
                    <BsShuffle className='mr-unit-sm text-default-400' />
                    General study rules
                </h3>
            </CardHeader>
            <Divider />
            <CardBody className='max-h-[400px] overflow-y-scroll'>
                <div className='flex flex-col gap-1'>
                    <Filepicker
                        id='upload-survey-filepicker'
                        label='Upload new study rules'
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
                    {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                    {successMsg && <p className='text-success'>{successMsg}</p>}
                    <Button
                        variant="flat"
                        className='mt-unit-sm'
                        color='secondary'
                        size='lg'
                        isLoading={isPending}
                        isDisabled={newStudyRules === undefined}
                        startContent={<BsCloudArrowUp className='text-large' />}
                        onClick={() => {
                            submit();
                        }}
                    >
                        Upload
                    </Button>
                    <span className='text-default-400 text-small'>Use a JSON file from your computer to publish a new set of study rules</span>
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
                        href={`/tools/study-configurator/${props.studyKey}/rules`}
                        startContent={<BsPencilSquare className='text-large' />}
                    >
                        Open in Editor
                    </Button>
                    <span className='text-default-400 text-small'>Open the current version of the study rules in the interactive editor</span>
                </div>
            </CardBody>
            <Divider />

        </Card>
    );
};

export default StudyRuleEditActions;

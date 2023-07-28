'use client';

import React, { useState, useTransition } from 'react';
import { Expression } from 'survey-engine/data_types';
import Filepicker from '../inputs/Filepicker';
import Button from '../buttons/Button';
import { useRouter } from 'next/navigation';
import { uploadStudyRules } from '@/app/(default)/tools/admin-v1/studies/[studyKey]/rules/actions';


interface StudyRuleUploaderProps {
    studyKey: string;
}

const StudyRuleUploader: React.FC<StudyRuleUploaderProps> = ({ studyKey }) => {
    const [newStudyRules, setNewStudyRules] = useState<Expression[] | undefined>(undefined);
    const router = useRouter()
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [isPending, startTransition] = useTransition();


    const submit = async () => {
        setError(undefined);
        setSuccess(undefined)

        if (newStudyRules) {
            startTransition(async () => {
                try {
                    const response = await uploadStudyRules(studyKey, { rules: newStudyRules })
                    setSuccess('Study rules uploaded successfully');
                    router.refresh();
                } catch (e: any) {
                    setError(e.message);
                }
            });
        }
    }

    return (
        <div>
            <h3 className='text-slate-500 font-bold mb-2'>Select study rule:</h3>

            <Filepicker
                accept={{
                    'application/json': ['.json'],
                }}
                onChange={(files) => {
                    if (files.length > 0) {
                        // read file as a json
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const text = e.target?.result;
                            if (typeof text === 'string') {
                                const data = JSON.parse(text);
                                setNewStudyRules(data as Expression[]);
                            } else {
                                setNewStudyRules(undefined);
                                console.log('error');
                            }
                        }
                        reader.readAsText(files[0]);
                    }
                    console.log(files);
                }}
            />
            {success && <p className='text-green-500'>{success}</p>}
            {error && <p className='text-red-500'>{error}</p>}
            <Button
                disabled={newStudyRules === undefined || isPending}
                onClick={() => {
                    submit();
                }}>
                Upload
            </Button>
        </div>
    );
};

export default StudyRuleUploader;
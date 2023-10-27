'use client';

import { AuthAPIFetcher } from '@/utils/server/fetcher';
import { Button, Card, CardBody, CardHeader, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from '@nextui-org/react';
import { signOut } from 'next-auth/react';
import React from 'react';
import { BsAsterisk, BsCalendar2, BsCloudArrowUp, BsDownload, BsPencilSquare, BsThreeDotsVertical } from 'react-icons/bs';
import { Survey } from 'survey-engine/data_types';
import useSWR from 'swr';
import UploadSurveyDialog from './UploadSurveyDialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SurveyHistoryViewProps {
    studyKey: string;
    surveyKey: string;
}

const SurveyHistoryView: React.FC<SurveyHistoryViewProps> = (props) => {
    const { data: surveyVersions, mutate, error, isLoading } = useSWR<{ surveyVersions?: Survey[] }>(`/api/case-management-api/v1/study/${props.studyKey}/survey/${props.surveyKey}/versions`, AuthAPIFetcher)

    const router = useRouter();
    const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);

    const surveyVersionTimeline = React.useMemo(() => {
        if (!surveyVersions || !surveyVersions.surveyVersions) {
            return <p>No survey versions found.</p>
        }
        const versionCount = surveyVersions.surveyVersions.length;
        return <div className='pl-[15px]'>
            <ol className="relative border-l-2 border-default-300 space-y-[42px]">
                {
                    surveyVersions.surveyVersions.map((survey, index) => {
                        const isLast = index === versionCount - 1;
                        if (typeof survey.published === 'string') {
                            survey.published = parseFloat(survey.published);
                        }
                        const publishedTime = survey.published ? new Date(survey.published * 1000).toLocaleString() : 'Not published yet';
                        return <li className="ml-[36px] relative" key={index.toFixed()}>
                            {isLast &&
                                <span className="absolute flex items-center justify-center w-6 h-full bg-white  -left-[40px] ring-white">
                                </span>
                            }
                            {(index === 0 && !survey.unpublished) ?
                                <span className="absolute flex items-center justify-center w-[30px] h-[30px] bg-primary-100 rounded-full -left-[51px] ring-4 ring-white">
                                    <BsAsterisk className='text-primary-800 text-tiny' />
                                </span>
                                :
                                <span className="absolute flex items-center justify-center w-[20px] h-[20px] bg-default-300 rounded-full -left-[47px] top-[2px] ring-2 ring-white">

                                </span>
                            }
                            <div className='flex gap-20'>
                                <div className=''>
                                    <h3 className="flex items-center mb-1">
                                        Version: <span className="ml-2 font-bold">
                                            {survey.versionId}
                                        </span>
                                    </h3>
                                    <time className="text-sm font-normal leading-none text-default-500 flex items-center gap-2">
                                        <BsCalendar2 />
                                        {publishedTime}
                                    </time>
                                </div>
                                <div>
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button
                                                variant="light"
                                                isIconOnly
                                            >
                                                <BsThreeDotsVertical />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu variant="faded" aria-label="Actions for survey version"
                                            onAction={(key) => {
                                                if (key === 'download') {
                                                    // fetch survey data and save as JSON
                                                    const url = `/api/case-management-api/v1/study/${props.studyKey}/survey/${props.surveyKey}/${survey.versionId}`;
                                                    fetch(url, {
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Accept': 'application/json'
                                                        }
                                                    }).then(response => {
                                                        if (response.ok) {
                                                            return response.json();
                                                        }
                                                        throw new Error('Failed to fetch survey data.');
                                                    }).then(data => {
                                                        // save json file
                                                        const element = document.createElement("a");
                                                        const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                                        element.href = URL.createObjectURL(file);
                                                        element.download = `${props.surveyKey}_${survey.versionId}.json`;
                                                        document.body.appendChild(element);
                                                        element.click();
                                                    }).catch(error => {
                                                        console.error(error);
                                                        alert('Failed to fetch survey data.');
                                                    })

                                                } else if (key === 'open-in-editor') {
                                                    router.push(`/tools/study-configurator/${props.studyKey}/survey/${props.surveyKey}/editor?version=${survey.versionId}`);
                                                }

                                            }}
                                        >
                                            <DropdownItem
                                                key="download"
                                                startContent={<BsDownload />}
                                            >
                                                Download JSON
                                            </DropdownItem>
                                            <DropdownItem
                                                key="open-in-editor"
                                                startContent={<BsPencilSquare />}
                                            >
                                                Open in Editor
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>

                                </div>
                            </div>
                        </li>
                    })
                }

            </ol>
        </div>
    }, [props.studyKey, props.surveyKey, surveyVersions, router])

    if (error) {
        if (error.message === 'Unauthorized') {
            signOut({ callbackUrl: `/auth/login?callbackUrl=/tools/study-configurator/${props.studyKey}/survey/${props.surveyKey}` });
            return null;
        }
    }

    return (
        <>
            <Card
                className='bg-white/50'
                isBlurred
            >
                <CardHeader className="bg-content2">
                    <h3 className='text-xl'>Survey:
                        <span className='font-bold ml-2'>
                            {props.surveyKey}
                        </span>
                    </h3>
                </CardHeader>
                <Divider />
                <CardBody className=''>
                    <div className='space-x-unit-md mb-unit-md'>
                        <Button
                            startContent={<BsCloudArrowUp />}
                            color='secondary'
                            variant='flat'
                            onPress={() => { setUploadDialogOpen(true) }}
                        >
                            Upload New Version
                        </Button>
                        <Button
                            startContent={<BsPencilSquare />}
                            color='primary'
                            variant='flat'
                            as={Link}
                            isDisabled={isLoading || !surveyVersions || !surveyVersions.surveyVersions || surveyVersions?.surveyVersions?.length === 0}
                            href={`/tools/study-configurator/${props.studyKey}/survey/${props.surveyKey}/editor?version=${surveyVersions?.surveyVersions?.[0]?.versionId}`}
                        >
                            Open Current Version in Editor
                        </Button>
                    </div>

                    <Divider />

                    <h4 className='font-bold text-lg mt-unit-md mb-unit-sm'>
                        History
                    </h4>
                    {isLoading && <Spinner />}
                    {!isLoading && surveyVersionTimeline}
                </CardBody>

            </Card>
            <UploadSurveyDialog
                studyKey={props.studyKey}
                surveyKey={props.surveyKey}
                isOpen={uploadDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        mutate();
                    }
                    setUploadDialogOpen(open)
                }}
            />
        </>
    );
};

export default SurveyHistoryView;

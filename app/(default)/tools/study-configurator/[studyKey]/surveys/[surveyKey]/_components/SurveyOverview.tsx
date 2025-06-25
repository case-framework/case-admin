import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getSurveyVersions } from '@/lib/data/studyAPI';
import React from 'react';
import UploadSurveyDialog from './UploadSurveyDialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Timeline from './Timeline';
import { Calendar } from 'lucide-react';
import SurveyVersionMenu from './SurveyVersionMenu';
import SurveyMenu from './SurveyMenu';
import { Badge } from '@/components/ui/badge';

interface SurveyOverviewProps {
    studyKey: string;
    surveyKey: string;
}

const Wrapper: React.FC<SurveyOverviewProps & {
    children: React.ReactNode;
    isLoading: boolean;
}> = (props) => {
    return <Card
        variant={'opaque'}
    >
        <CardHeader>
            <CardTitle className='text-xl font-bold flex items-start'>
                <span className='grow'>{props.surveyKey}</span>
                <SurveyMenu
                    studyKey={props.studyKey}
                    surveyKey={props.surveyKey}
                />
            </CardTitle>
            <CardDescription>
                You can view and edit the survey from here.
            </CardDescription>
        </CardHeader>

        <CardContent>
            {props.children}
        </CardContent>
    </Card>;
}


const SurveyOverview: React.FC<SurveyOverviewProps> = async (props) => {

    const resp = await getSurveyVersions(props.studyKey, props.surveyKey);

    const versions = resp.versions;
    const error = resp.error;
    if (error || !versions || versions.length === 0) {
        return (
            <Wrapper {...props}
                isLoading={true}
            >
                <ErrorAlert
                    title='Could not load survey information'
                    error={error || 'An unknown error occurred.'}
                />
            </Wrapper>
        );
    }

    const latestVersionId = versions[0].versionId;


    return (
        <Wrapper {...props}
            isLoading={false}
        >
            <div className='flex mb-4 gap-4'>
                <UploadSurveyDialog
                    studyKey={props.studyKey}
                    surveyKey={props.surveyKey}
                />
                <Button
                    variant={'outline-solid'}
                    asChild
                >
                    <Link
                        href={`/tools/editors/survey-from-server?studyKey=${props.studyKey}&surveyKey=${props.surveyKey}&versionId=${latestVersionId}`}
                    >
                        Open Current Version in Editor
                    </Link>
                </Button>
            </div>
            <Separator />
            <div>
                <h3 className='text-lg font-bold mt-4 mb-2'>Versions</h3>
                <Timeline
                    items={versions.map((version) => {
                        const publishedTime = version.published ? new Date(version.published * 1000).toLocaleString() : 'Not published yet';

                        return <div className='flex gap-6 group'
                            key={version.versionId}
                        >
                            <div className='grow'>
                                <div className="flex items-center mb-1 border-b group-hover:border-neutral-300 border-transparent">
                                    Version: <span className="ml-2 font-bold">
                                        {version.versionId}
                                    </span>
                                    {version.unpublished && <Badge
                                        className='ml-2'
                                    >
                                        Unpublished
                                    </Badge>}
                                </div>
                                <time className="text-xs font-normal leading-none text-neutral-500 flex items-center gap-2">
                                    <span><Calendar className='size-4' /></span>
                                    <span>{publishedTime}</span>
                                </time>
                            </div>
                            <SurveyVersionMenu
                                studyKey={props.studyKey}
                                surveyKey={props.surveyKey}
                                versionId={version.versionId}
                            />
                        </div>
                    })}
                />

            </div>
        </Wrapper>
    );
};

export default SurveyOverview;

export const SurveyOverviewSkeleton: React.FC<SurveyOverviewProps> = (props) => {
    return (
        <Wrapper {...props}
            isLoading={true}
        >
            <CogLoader
                label='Loading survey information...'
            />
        </Wrapper>
    );
}

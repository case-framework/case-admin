import CogLoader from '@/components/CogLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React from 'react';
import UploadStudyRulesDialog from './UploadStudyRulesDialog';
import { getStudyRulesVersions } from '@/lib/data/studyAPI';
import ErrorAlert from '@/components/ErrorAlert';
import Timeline from '../../surveys/[surveyKey]/_components/Timeline';
import StudyRuleVersionMenu from './StudyRuleVersionMenu';

interface StudyRulesOverviewProps {
    studyKey: string;
}


const Wrapper: React.FC<StudyRulesOverviewProps & {
    children: React.ReactNode;
    isLoading: boolean;
}> = (props) => {
    return <Card
        variant={'opaque'}
    >
        <CardHeader>
            <CardTitle className='text-xl font-bold flex items-start'>
                <span className='grow'>
                    Study Rules
                </span>
            </CardTitle>
            <CardDescription>
                You can view and edit the study rule that govern the flows in the study from here.
            </CardDescription>
        </CardHeader>

        <CardContent>
            {props.children}
        </CardContent>
    </Card>;
}



const StudyRulesOverview: React.FC<StudyRulesOverviewProps> = async (props) => {
    const resp = await getStudyRulesVersions(props.studyKey);
    const versions = resp.versions;
    const error = resp.error;
    if (error) {
        return (
            <Wrapper {...props}
                isLoading={true}
            >
                <ErrorAlert
                    title='Could not load study rules information'
                    error={error || 'An unknown error occurred.'}
                />
            </Wrapper>
        );
    }


    let content: React.ReactNode = null;
    let latestVersionId: string = 'new';
    if (!versions || versions.length === 0) {

        content = <div>
            <p className='font-bold'>
                No study rules found
            </p>
            <p className='text-sm'>
                Upload the initial set of rules for the study.
            </p>
        </div>

    } else {
        latestVersionId = versions[0].id;

        content = <Timeline
            items={versions.map((version) => {
                const publishedTime = version.uploadedAt ? new Date(version.uploadedAt * 1000).toLocaleString() : 'Not published yet';

                return <div className='flex gap-6 group'
                    key={version.id}
                >
                    <div className='grow'>
                        <div className="flex items-center mb-1 border-b group-hover:border-neutral-300 border-transparent">
                            <p>
                                Rules published at:
                            </p>

                        </div>
                        <p className="font-bold">
                            {publishedTime}
                        </p>
                    </div>
                    <StudyRuleVersionMenu
                        studyKey={props.studyKey}
                        versionId={version.id}
                    />
                </div>
            })}
        />
    }


    return (
        <Wrapper
            isLoading={false}
            {...props}
        >
            <div className='flex mb-4 gap-4'>
                <UploadStudyRulesDialog
                    studyKey={props.studyKey}
                />
                <Button
                    variant={'outline-solid'}
                    asChild
                >
                    <Link
                        href={`/tools/study-configurator/${props.studyKey}/rules/${latestVersionId}`}
                    >
                        {latestVersionId === 'new' ? 'Create New Version' : 'Open Current Version in Editor'}
                    </Link>
                </Button>
            </div>
            <Separator />

            <h3 className='text-lg font-bold mt-4 mb-2'>Versions</h3>

            {content}
        </Wrapper>
    );
};

export default StudyRulesOverview;

export const StudyRulesOverviewSkeleton: React.FC<StudyRulesOverviewProps> = (props) => {
    return (
        <Wrapper
            isLoading={true}
            {...props}
        >
            <CogLoader
                label='Loading study rules...'
            />
        </Wrapper>
    );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, Plus, StepForward } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { StoredSurvey } from '../utils/SurveyStorage';
import { formatDistance } from 'date-fns';

interface WelcomeScreenProps {
    onOpenSurvey: () => void;
    onCreateSurvey: () => void;
    recentlyEditedStoredSurvey?: StoredSurvey;
    onOpenRecentlyEditedSurvey?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = (props) => {

    const [hasRecentlyEditedSurvey, setHasRecentlyEditedSurvey] = useState<boolean>(false);
    const [hasFetched, setHasFetched] = useState<boolean>(false);

    useEffect(() => {
        setHasRecentlyEditedSurvey(props.recentlyEditedStoredSurvey !== undefined);
        setHasFetched(true);
    }, [props.recentlyEditedStoredSurvey]);

    const lastEditedDate = hasRecentlyEditedSurvey ? props.recentlyEditedStoredSurvey?.lastUpdated ?? new Date() : new Date();
    const visualSurveyId = hasRecentlyEditedSurvey ? props.recentlyEditedStoredSurvey?.id : (hasFetched ? 'No recent survey' : 'Loading...');

    const buttonInfo = hasRecentlyEditedSurvey ? <p className='text-sm text-gray-500'>{<>{visualSurveyId} {" ("}{formatDistance(lastEditedDate, new Date())}{" ago)"}</>}</p> : <p className='text-sm text-gray-500'>{<>{visualSurveyId}</>}</p>;

    return (
        <div className='flex w-full h-full justify-center items-center'>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Welcome to the survey editor
                    </CardTitle>
                    <CardDescription>
                        Open a survey or create a new one to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-4'>

                        <Button
                            variant={'outline'}
                            className='gap-4 text-lg py-2 h-auto justify-start'
                            onClick={props.onOpenRecentlyEditedSurvey}
                            disabled={!hasRecentlyEditedSurvey}
                        >
                            <StepForward className='size-6' />
                            <div className='flex flex-col items-start'>
                                <p>Continue working</p>
                                {buttonInfo}
                            </div>

                        </Button>
                        <Button
                            variant={'outline'}
                            className='gap-4 text-lg py-2 h-auto justify-start'
                            onClick={props.onOpenSurvey}
                        >
                            <FolderOpen className='size-6' />
                            Open survey
                        </Button>
                        <Button
                            variant={'outline'}
                            className='gap-4 text-lg py-2 h-auto justify-start'
                            onClick={props.onCreateSurvey}
                        >
                            <Plus className='size-6' />
                            Create new survey
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default WelcomeScreen;

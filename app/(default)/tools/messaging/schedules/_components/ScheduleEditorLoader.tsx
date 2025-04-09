'use server'

import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { MessageSchedule } from '@/utils/server/types/messaging';
import React from 'react';
import ScheduleEditor from './ScheduleEditor';
import { getEmailScheduleById } from '@/lib/data/messagingAPI';

interface ScheduleEditorLoaderProps {
    id: string;
}


const ScheduleEditorLoader: React.FC<ScheduleEditorLoaderProps> = async (props) => {
    const resp = await getEmailScheduleById(props.id);

    const schedule: MessageSchedule = resp.schedule;

    const error = resp.error;
    if (error) {
        return (
            <ErrorAlert
                title={`Error while loading schedule '${props.id}':`}
                error={error}
                hint="If this is an unexpected, check you connection and try again. Try to refresh the page or log out and log in again. If the problem persists, contact support."
            />
        );
    }

    if (!schedule) {
        return (
            <ErrorAlert
                title={`Error while loading schedule '${props.id}':`}
                error="No schedule found"
                hint="Check if your URL is correct and try again. If the problem persists, contact support."
            />
        );
    }

    return (
        <ScheduleEditor
            schedule={schedule}
        />
    );
};

export default ScheduleEditorLoader;

export const ScheduleEditorLoaderSkeleton: React.FC = async () => {
    return (
        <div className='flex justify-center grow'>
            <CogLoader label='Loading schedule...'
                className='w-full'
            />
        </div>
    );
}

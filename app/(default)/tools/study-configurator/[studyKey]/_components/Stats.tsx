import ErrorAlert from '@/components/ErrorAlert';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getStudy } from '@/lib/data/studyAPI';
import React from 'react';
import LinkButton from './LinkButton';

interface StatsProps {
    studyKey: string;
}

const StatCard = (props: {
    title: string, value?: number, link?: {
        href: string;
        text: string;
    }
}) => {
    return (
        <Card variant={'opaque'}
            className='p-6'
        >
            <h3 className='font-semibold mb-2'>{props.title}</h3>
            {props.value === undefined && <Skeleton className='h-8 w-20' />}
            <p className='text-2xl font-semibold'>
                {props.value}
            </p>
            {props.link && <LinkButton href={props.link.href} text={props.link.text} />}
        </Card>
    );
}

const Stats: React.FC<StatsProps> = async (props) => {

    const resp = await getStudy(props.studyKey);

    const error = resp.error;
    if (error) {
        return <ErrorAlert
            title="Error loading study stats"
            error={error}
        />
    }

    const study = resp.study;

    return (
        <div className='grid grid-cols-1 sm:grid-cols-3 w-full gap-4'>
            <StatCard title='Participants'
                value={study?.stats.participantCount || 0}
                link={{
                    href: '/tools/participants/' + props.studyKey,
                    text: 'View Participants'
                }} />

            <StatCard title='Temporary Participants'
                value={study?.stats.tempParticipantCount || 0}
            />

            <StatCard title='Total Responses'
                value={study?.stats.responseCount || 0}
                link={{
                    href: '/tools/participants/' + props.studyKey + '/responses',
                    text: 'View Responses'
                }} />
        </div>
    );
};

export default Stats;

export const StatsSkeleton: React.FC = () => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-3 w-full gap-4'>
            <StatCard title='Participants'
                link={{
                    href: '/tools/participants',
                    text: 'View Participants'
                }} />

            <StatCard title='Temporary Participants' />

            <StatCard title='Total Responses'
                link={{
                    href: '/tools/participants',
                    text: 'View Responses'
                }} />
        </div>
    );
}

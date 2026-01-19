import React from 'react';
import WrapperCard from '../../_components/WrapperCard';
import ErrorAlert from '@/components/ErrorAlert';
import { getStudyNotificationSubscriptions } from '@/lib/data/studyAPI';
import NewNotificationSubDialog from './NewNotificationSubDialog';
import { Button } from '@/components/ui/button';
import { BellOff, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import NotificationSubsList from './NotificationSubsList';

interface NotificationsSubsCardProps {
    studyKey: string;
}

const NotificationsSubsCard: React.FC<NotificationsSubsCardProps> = async (props) => {
    const resp = await getStudyNotificationSubscriptions(props.studyKey);

    const error = resp.error;
    const subscriptions = resp.subscriptions;

    let content: React.ReactNode | null = null;
    if (error) {
        content = <ErrorAlert
            title="Failed to fetch notification subscriptions"
            error={error}
        />;
    } else if (!subscriptions || subscriptions.length === 0) {
        content = (
            <div className='pb-6'>
                <p className='text-neutral-600 flex items-center'>
                    <span>
                        <BellOff className='size-4 me-2' />
                    </span>
                    No subscriptions found</p>
            </div>
        );
    } else {
        content = (
            <div>
                <NotificationSubsList
                    studyKey={props.studyKey}
                    subscriptions={subscriptions}
                />
            </div>
        );
    }

    return (
        <WrapperCard
            title="Notification subscriptions"
            description='Controls which email address will receive notifications for which study events. To trigger a message topic, you need to explicitly add this into the study rules.'
        >
            {content}

            <NewNotificationSubDialog
                studyKey={props.studyKey}
                subscriptions={subscriptions || []}
                trigger={
                    <Button>
                        <Plus className='size-4 me-2' />
                        New topic subscription
                    </Button>
                }
            />
        </WrapperCard>
    );
};

export default NotificationsSubsCard;

export const NotificationsSubsCardSkeleton = () => {
    return (
        <WrapperCard
            title="Notification subscriptions"
            description='Which email will receive notifications for which study events? To trigger a message topic, you need to explicitly add this into the study rules.'
        >
            <Skeleton className='h-8 w-40 mb-2' />
            <Skeleton className='h-8 w-1/2 mb-2' />
            <Skeleton className='h-8 w-2/3 mb-2' />
            <Skeleton className='h-8 w-40 mb-2' />
        </WrapperCard>
    );
}

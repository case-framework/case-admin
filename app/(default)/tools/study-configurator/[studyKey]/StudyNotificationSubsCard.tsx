'use client';

import React, { useEffect, useTransition } from 'react';
import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';
import { Button } from '@nextui-org/button';
import { BsPlus, BsXLg } from 'react-icons/bs';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Divider, Input, Spinner } from '@nextui-org/react';
import { saveStudyNotifications } from './actionSaveStudyNotifications';
import { AuthAPIFetcher } from '@/utils/server/fetcher';
import useSWR from 'swr';

interface StudyNotificationSubsCardProps {
    studyKey: string;
}

interface NewStudyNotificationSubDialogProps {
    open: boolean;
    isLoading: boolean;
    onCreate: (newSub: { messageType: string; email: string }) => void;
    onClose: () => void;
}

const NewStudyNotificationSubDialog: React.FC<NewStudyNotificationSubDialogProps> = (props) => {
    const [newSubscription, setNewSubscription] = React.useState<{ messageType: string; email: string }>({ messageType: '', email: '' });

    useEffect(() => {
        if (props.open) {
            setNewSubscription({ messageType: '', email: '' });
        }
    }, [props.open])

    return (
        <Modal isOpen={props.open} onOpenChange={(open) => {
            if (!open) {
                props.onClose();
            }
        }}
            backdrop='blur'
        >
            <ModalContent>
                {(onClose) => (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            props.onCreate(newSubscription);
                        }}
                    >
                        <ModalHeader className="bg-content2 flex flex-col gap-1">New subscription for a topic</ModalHeader>
                        <Divider />
                        <ModalBody>
                            <div className='py-unit-md flex flex-col gap-unit-md'>

                                <Input
                                    label='Message type/topic'
                                    placeholder='Topic name'
                                    id='messageType'
                                    type='text'
                                    value={newSubscription.messageType}
                                    onValueChange={(value) => {
                                        setNewSubscription({ ...newSubscription, messageType: value });
                                    }}
                                    description='Receive a notification for this topic'
                                    isRequired
                                />
                                <Input
                                    label='Email'
                                    placeholder='Enter the email address'
                                    id='sub-email'
                                    type='email'
                                    value={newSubscription.email}
                                    onValueChange={(value) => {
                                        setNewSubscription({ ...newSubscription, email: value });
                                    }}
                                    description='This email will receive notifications for this topic'
                                    isRequired
                                />
                            </div>
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                            <Button color="danger" variant="light"
                                type='button'
                                onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary"
                                type='submit'
                                isLoading={props.isLoading}
                            >
                                Add new subscription
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
}


interface CurrentStudyNotificationsProps {
    isLoading: boolean;
    currentSubscriptions?: Array<{ messageType: string; email: string }>
    onChange: (newSubs: Array<{ messageType: string; email: string }>) => void;
}


const CurrentStudyNotifications: React.FC<CurrentStudyNotificationsProps> = (props) => {
    if (props.isLoading) {
        return <div className='py-unit-lg text-center'>
            <Spinner />
        </div>
    }

    if (!props.currentSubscriptions || props.currentSubscriptions.length === 0) {
        return <div className='mb-unit-md text-default-500'>
            {"There are no researcher notification subscriptions for this study yet."}
            <p className='text-small'>
                {"You can add a new subscription below. Don't forget to add the topic to the study rules."}
            </p>
        </div>;
    }


    // extract unique message types:
    const messageTypes = props.currentSubscriptions.map(s => s.messageType).filter((value, index, self) => self.indexOf(value) === index);

    return (
        <div className='mb-unit-md space-y-unit-md'>
            {messageTypes.map((mt) => {
                return <div key={mt}>
                    <h4>
                        <span className='text-default-600 text-small'>Topic: </span>
                        <span className='font-bold'>{mt}</span>
                    </h4>
                    <div className='flex flex-wrap gap-unit-sm mt-1'>
                        {props.currentSubscriptions?.filter(s => s.messageType === mt).map((s) => {
                            return <div key={mt + s.email} className='bg-content2 rounded-medium px-4 py-1 flex items-center border border-default-400'>
                                <span className='mr-1'>{s.email}</span>
                                <Button
                                    variant='light'
                                    isIconOnly
                                    size='sm'
                                    onPress={() => {
                                        if (confirm('Are you sure you want to remove this subscription?')) {
                                            props.onChange(props.currentSubscriptions?.filter(s2 => s2.messageType !== mt || s2.email !== s.email) || []);
                                        }
                                    }}
                                >
                                    <BsXLg />
                                </Button>
                            </div>
                        })}
                    </div>
                </div>
            })}
        </div>
    );
}

interface NotificationSubscription {
    messageType: string;
    email: string;
}

const StudyNotificationSubsCard: React.FC<StudyNotificationSubsCardProps> = (props) => {
    const [showNewSubDialog, setShowNewSubDialog] = React.useState(false);
    const [isPending, startTransition] = useTransition();

    const { data, error, isLoading, mutate } = useSWR<{ subscriptions: NotificationSubscription[] }>(`/api/case-management-api/v1/study/${props.studyKey}/notification-subscriptions`, AuthAPIFetcher)

    return (
        <TwoColumnsWithCards
            label='Notifications'
            description='Which email will receive notifications for which study events? To trigger a message topic, you need to explicitly add this into the study rules.'
        >
            <CurrentStudyNotifications
                currentSubscriptions={data?.subscriptions}
                isLoading={isLoading || isPending}
                onChange={(newSubs) => {
                    startTransition(async () => {
                        try {
                            await saveStudyNotifications(props.studyKey, newSubs);
                            mutate();
                            setShowNewSubDialog(false);
                        } catch (e: any) {
                            console.error(e);
                        }
                    })
                }}
            />
            {error && <div className='bg-danger-50 gap-unit-md rounded-medium p-unit-md flex items-center'>
                Something went wrong
            </div>}

            <div>
                <Button
                    startContent={<BsPlus />}
                    onPress={() => {
                        setShowNewSubDialog(true);
                    }}
                >
                    New topic subscription
                </Button>
            </div>
            <NewStudyNotificationSubDialog
                open={showNewSubDialog}
                isLoading={isPending}
                onCreate={(newSub) => {
                    startTransition(async () => {
                        try {
                            const notificationSubs = data?.subscriptions || [];

                            if (notificationSubs.findIndex(s => s.messageType === newSub.messageType && s.email === newSub.email) > -1) {
                                alert('This subscription already exists. You cannot add the same subscription twice.')
                                return;
                            }
                            await saveStudyNotifications(props.studyKey, [...notificationSubs, newSub]);
                            mutate();
                            setShowNewSubDialog(false);
                        } catch (e: any) {
                            console.error(e);
                        }
                    })
                }}
                onClose={() => {
                    setShowNewSubDialog(false);
                }}
            />
        </TwoColumnsWithCards>
    );
};

export default StudyNotificationSubsCard;

'use client';

import { MessageSchedule } from '@/utils/server/types/messaging';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { deleteMessageSchedule, saveMessageSchedule } from '../../../../../../actions/messaging/schedules';
import NotImplemented from '@/components/NotImplemented';
import { addHours, addMonths, addWeeks, format } from 'date-fns';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import EmailContentPreviewAndEditor from '../../email-templates/_components/EmailContentPreviewAndEditor';
import MessageConfig from './MessageConfig';
import LoadingButton from '@/components/loading-button';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import getErrorMessage from '@/utils/getErrorMessage';


const dateToInputStr = (date: Date) => {
    return format(date, 'yyyy-MM-dd\'T\'HH:mm')
}


interface ScheduleEditorProps {
    schedule?: MessageSchedule;
}

const initialSchedule: MessageSchedule = {
    id: '',
    label: '',
    type: 'all-users',
    studyKey: '',
    nextTime: Math.floor(new Date().getTime() / 1000),
    period: 86400,
    until: undefined,
    condition: undefined,
    template: {
        defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en',
        messageType: 'weekly',
        headerOverrides: undefined,
        translations: [

        ]
    }
}

const ScheduleEditor: React.FC<ScheduleEditorProps> = (props) => {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const [schedule, setSchedule] = React.useState<MessageSchedule>(props.schedule ?? {
        ...initialSchedule
    });
    const [isDirty, setIsDirty] = useState(false);
    const [nextTimeInput, setNextTimeInput] = useState(
        dateToInputStr(new Date((props.schedule ?? initialSchedule).nextTime * 1000))
    );
    const [untilInput, setUntilInput] = useState(
        (props.schedule?.until && Number.isFinite(props.schedule.until) && props.schedule.until > 0)
            ? dateToInputStr(new Date(props.schedule.until * 1000))
            : ''
    );


    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
    useEffect(() => {
        setCurrentDateTime(new Date());
    }, []);

    useEffect(() => {
        setNextTimeInput(dateToInputStr(new Date(schedule.nextTime * 1000)));
    }, [schedule.nextTime]);

    useEffect(() => {
        if (schedule.until && Number.isFinite(schedule.until) && schedule.until > 0) {
            setUntilInput(dateToInputStr(new Date(schedule.until * 1000)));
            return;
        }
        setUntilInput('');
    }, [schedule.until]);


    const onSaveSchedule = () => {
        startTransition(async () => {
            try {
                const resp = await saveMessageSchedule(schedule);
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Schedule saved');
                router.replace('/tools/messaging/schedules');
            } catch (error: unknown) {
                console.error(error);
                toast.error('Something went wrong', { description: getErrorMessage(error) });
            }

        })
    }

    const onDeleteSchedule = () => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            if (!schedule || !schedule.id) return;

            startTransition(async () => {
                try {
                    await deleteMessageSchedule(schedule.id);
                    router.refresh();
                    router.replace('/tools/messaging/schedules');
                } catch (error: unknown) {
                    console.error(error);
                    toast.error('Something went wrong', { description: getErrorMessage(error) });
                }
            })
        }
    }


    const buttons = <div className="flex justify-end gap-4 ">
        <LoadingButton
            type='submit'
            color='primary'
            size='lg'
            disabled={!schedule || !schedule.label || !schedule.template.translations || schedule.template.translations.length === 0 || !isDirty}
            isLoading={isPending}
            onClick={onSaveSchedule}
        >
            {props.schedule ? 'Save changes' : 'Create schedule'}
        </LoadingButton>
        <Button
            type='button'
            variant='outline'
            disabled={isPending}
            size='lg'
            onClick={() => {
                router.replace('/tools/messaging/schedules');
            }}
        >
            Cancel
        </Button>
    </div>



    return (
        <div className='w-full h-full flex flex-col gap-1'>
            <div>
                <BackButton
                    label='Back to schedules'
                    href={'/tools/messaging/schedules'}
                />
            </div>

            <Card
                variant={'opaque'}
                className='w-full h-full grow overflow-y-scroll'
            >
                <CardHeader>
                    <CardTitle className='flex items-center'>
                        <span className='grow'>
                            {props.schedule ? 'Edit schedule' : 'New schedule'}
                        </span>
                        {props.schedule && (
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                disabled={isPending}
                                className='text-danger-500 hover:text-danger-600'
                                onClick={onDeleteSchedule}

                            >Delete schedule</Button>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent
                    className='w-full space-y-4'
                >
                    <div>
                        <Card className='p-4'>
                            <TooltipProvider>
                                <div>
                                    <h3 className='font-bold text-xl mb-4'>
                                        Schedule config
                                    </h3>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-4'>
                                        <div className='space-y-1'>
                                            <Label className='flex gap-2 items-center'
                                                htmlFor='schedule-label'
                                            >
                                                Label
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className='size-4 text-neutral-600' />
                                                    </TooltipTrigger>
                                                    <TooltipContent className='max-w-64'>
                                                        {'A label for this schedule. This will be used to identify the schedule in the list of schedules.'}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                            <Input
                                                id='schedule-label'
                                                placeholder='add a label...'
                                                value={schedule.label}
                                                onChange={(event) => {
                                                    const value = event.target.value;
                                                    setIsDirty(true);
                                                    setSchedule((s) => {
                                                        const newSchedule = { ...s };
                                                        newSchedule.label = value;
                                                        return newSchedule;
                                                    })
                                                }}
                                            />
                                        </div>

                                        <div className='space-y-1'>
                                            <Label className='flex gap-2 items-center'
                                                htmlFor='message-send-to'
                                            >
                                                Send to
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className='size-4 text-neutral-600' />
                                                    </TooltipTrigger>
                                                    <TooltipContent className='max-w-96 space-y-3'>
                                                        Target group of this message.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                            <Select
                                                name='message-send-to'
                                                value={schedule.type}
                                                onValueChange={(value) => {
                                                    setSchedule((s) => {
                                                        const newSchedule = { ...s };

                                                        newSchedule.type = value as 'all-users' | 'study-participants';
                                                        return newSchedule;
                                                    })
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="select a target group..." />
                                                </SelectTrigger>
                                                <SelectContent className='' align='end'>
                                                    <SelectItem
                                                        key='all-users'
                                                        value='all-users'
                                                    >
                                                        All users
                                                    </SelectItem>
                                                    <SelectItem
                                                        key='study-participants'
                                                        value='study-participants'
                                                    >
                                                        Study participants
                                                    </SelectItem>
                                                </SelectContent>

                                            </Select>
                                        </div>

                                        {schedule.type === 'study-participants' && (
                                            <div className='p-4  flex flex-col gap-4 border border-neutral-200 rounded-md'>
                                                <div className='space-y-1'>
                                                    <Label className='flex gap-2 items-center'
                                                        htmlFor='schedule-study-key'
                                                    >
                                                        Label
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Info className='size-4 text-neutral-600' />
                                                            </TooltipTrigger>
                                                            <TooltipContent className='max-w-64'>
                                                                {'The study key of the study from which to select participants.'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </Label>
                                                    <Input
                                                        id='schedule-study-key'
                                                        placeholder='add a study key...'
                                                        value={schedule.studyKey ?? ''}
                                                        onChange={(event) => {
                                                            const value = event.target.value;
                                                            setIsDirty(true);
                                                            setSchedule((s) => {
                                                                const newSchedule = { ...s };
                                                                newSchedule.studyKey = value;
                                                                return newSchedule;
                                                            })
                                                        }}
                                                    />
                                                </div>

                                                <NotImplemented>
                                                    Add a condition to filter participants
                                                </NotImplemented>
                                            </div>
                                        )}




                                    </div>
                                    <div className='space-y-4'>
                                        <div className='space-y-1'>
                                            <Label className='flex gap-2 items-center'
                                                htmlFor='schedule-next-time'
                                            >
                                                Next time
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className='size-4 text-neutral-600' />
                                                    </TooltipTrigger>
                                                    <TooltipContent className='max-w-64'>
                                                        {'The next time the message will be sent.'}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                            <Input
                                                id='schedule-next-time'
                                                type='datetime-local'
                                                placeholder='enter next time...'
                                                value={nextTimeInput}
                                                min={dateToInputStr(currentDateTime)}
                                                max={dateToInputStr(addMonths(currentDateTime, 12))}
                                                onChange={(event) => {
                                                    setNextTimeInput(event.target.value);
                                                }}
                                                onBlur={() => {
                                                    const parsed = new Date(nextTimeInput).getTime();
                                                    if (Number.isNaN(parsed)) {
                                                        toast.error('Please enter a valid date and time.');
                                                        setNextTimeInput(dateToInputStr(new Date(schedule.nextTime * 1000)));
                                                        return;
                                                    }

                                                    const minAllowed = currentDateTime.getTime();
                                                    const maxAllowed = addMonths(currentDateTime, 12).getTime();
                                                    if (parsed < minAllowed || parsed > maxAllowed) {
                                                        toast.error('Please select a date between now and one year from now.');
                                                        setNextTimeInput(dateToInputStr(new Date(schedule.nextTime * 1000)));
                                                        return;
                                                    }

                                                    const nextTime = Math.floor(parsed / 1000);
                                                    setIsDirty(true);
                                                    setSchedule((s) => ({
                                                        ...s,
                                                        nextTime,
                                                    }));
                                                }}
                                            />
                                        </div>

                                        <div className='space-y-1'>
                                            <Label className='flex gap-2 items-center'
                                                htmlFor='schedule-period'
                                            >
                                                Period
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className='size-4 text-neutral-600' />
                                                    </TooltipTrigger>
                                                    <TooltipContent className='max-w-64'>
                                                        {'The period in seconds after which the message will be sent again.'}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                            <Input
                                                id='schedule-period'
                                                type='number'
                                                placeholder='enter period...'
                                                value={schedule.period.toString()}
                                                min={0}
                                                onChange={(event) => {
                                                    const value = parseInt(event.target.value);
                                                    setIsDirty(true);
                                                    setSchedule({
                                                        ...schedule,
                                                        period: value
                                                    })
                                                }}
                                            />
                                        </div>

                                        <div className='flex items-center gap-4'>
                                            <div className='shrink-0 flex items-center'>
                                                <Switch
                                                    id='auto-delete'
                                                    checked={Boolean(schedule.until && Number.isFinite(schedule.until) && schedule.until > 0)}
                                                    onCheckedChange={(value) => {
                                                        setIsDirty(true);
                                                        setSchedule((s) => {
                                                            const newSchedule = { ...s };
                                                            if (value) {
                                                                newSchedule.until = Math.floor(
                                                                    addHours(
                                                                        addWeeks(new Date(), 1), 12
                                                                    ).getTime() / 1000
                                                                );
                                                            } else {
                                                                newSchedule.until = undefined;
                                                            }
                                                            return newSchedule;
                                                        })
                                                    }}
                                                />
                                                <Label htmlFor='auto-delete' className='ml-2'>
                                                    Auto delete
                                                </Label>
                                            </div>
                                            <div className='grow'>
                                                <div className='space-y-1'>
                                                    <Label className='flex gap-2 items-center'
                                                        htmlFor='schedule-until-time'
                                                    >
                                                        Until
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Info className='size-4 text-neutral-600' />
                                                            </TooltipTrigger>
                                                            <TooltipContent className='max-w-64'>
                                                                {'The date and time after which the message will not be sent anymore and the schedule wil be deleted.'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </Label>
                                                    <Input
                                                        id='schedule-until-time'
                                                        type='datetime-local'
                                                        placeholder='enter a time...'
                                                        disabled={!(schedule.until && Number.isFinite(schedule.until) && schedule.until > 0)}
                                                        value={untilInput}
                                                        min={dateToInputStr(currentDateTime)}
                                                        max={dateToInputStr(addMonths(currentDateTime, 24))}
                                                        onChange={(event) => {
                                                            setUntilInput(event.target.value);
                                                        }}
                                                        onBlur={() => {
                                                            if (!(schedule.until && Number.isFinite(schedule.until) && schedule.until > 0)) {
                                                                return;
                                                            }

                                                            const parsed = new Date(untilInput).getTime();
                                                            if (Number.isNaN(parsed)) {
                                                                toast.error('Please enter a valid date and time.');
                                                                setUntilInput(dateToInputStr(new Date(schedule.until * 1000)));
                                                                return;
                                                            }

                                                            const minAllowed = currentDateTime.getTime();
                                                            const maxAllowed = addMonths(currentDateTime, 24).getTime();
                                                            if (parsed < minAllowed || parsed > maxAllowed) {
                                                                toast.error('Please select a date between now and two years from now.');
                                                                setUntilInput(dateToInputStr(new Date(schedule.until * 1000)));
                                                                return;
                                                            }

                                                            const until = Math.floor(parsed / 1000);
                                                            setIsDirty(true);
                                                            setSchedule((s) => ({
                                                                ...s,
                                                                until,
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </TooltipProvider>

                        </Card>
                    </div>
                    <div className='flex gap-4'>
                        <Card className='grow'>
                            <EmailContentPreviewAndEditor
                                emailTemplateConfig={schedule.template}
                                onChange={(newConfig) => {
                                    setIsDirty(true);
                                    setSchedule((s) => {
                                        const newSchedule = { ...s };
                                        newSchedule.template = newConfig;
                                        return newSchedule;
                                    });
                                }}
                            />
                        </Card>
                        <div className='space-y-4'>
                            <Card>
                                <MessageConfig
                                    emailTemplateConfig={schedule.template}
                                    isNewTemplate={true}
                                    onChange={(newConfig) => {
                                        setIsDirty(true);
                                        setSchedule((s) => {
                                            const newSchedule = { ...s };
                                            newSchedule.template = newConfig;
                                            return newSchedule;
                                        });
                                    }}
                                />
                            </Card>
                            {buttons}
                        </div>
                    </div>
                </CardContent>


            </Card>
        </div>
    )
};

export default ScheduleEditor;

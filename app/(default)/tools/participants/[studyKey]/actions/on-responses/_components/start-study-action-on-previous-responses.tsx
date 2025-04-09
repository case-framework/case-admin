'use client';

import LoadingButton from '@/components/loading-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { Expression } from 'survey-engine/data_types';
import ActionExpressionPicker from '../../_components/action-expression-picker';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { runStudyActionOnPreviousResponses, runStudyActionOnPreviousResponsesForAllParticipants } from '@/actions/study/runStudyActions';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface StartStudyActionOnPreviousResponsesProps {
    studyKey: string;
}

const StartStudyActionOnPreviousResponses: React.FC<StartStudyActionOnPreviousResponsesProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const [currentRules, setCurrentRules] = React.useState<Expression[] | undefined>(undefined);
    const [participantScope, setParticipantScope] = React.useState<'all' | 'single'>('single');
    const [participantID, setParticipantID] = React.useState<string | undefined>(undefined);
    const router = useRouter();
    const [runOnAllSurveys, setRunOnAllSurveys] = React.useState<boolean>(false);
    const [surveyKeys, setSurveyKeys] = React.useState<string[] | undefined>(undefined);
    const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined);
    const [toDate, setToDate] = React.useState<Date | undefined>(undefined);

    const startActionForParticipantOnOldResps = () => {
        startTransition(async () => {
            try {
                const resp = await runStudyActionOnPreviousResponses(
                    props.studyKey,
                    currentRules || [],
                    participantID || '',
                    surveyKeys,
                    fromDate,
                    toDate
                );
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Action performed successfully');
            } catch (error: unknown) {
                toast.error('Failed to start action', { description: (error as Error).message });
            }
        });
    }

    const startActionForAllParticipantsPreviousResponses = () => {
        startTransition(async () => {
            try {
                const resp = await runStudyActionOnPreviousResponsesForAllParticipants(
                    props.studyKey,
                    currentRules || [],
                    surveyKeys,
                    fromDate,
                    toDate
                );
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Action started successfully');
                router.push(`/tools/participants/${props.studyKey}/actions/on-responses/${resp.task.id}`);
            } catch (error: unknown) {
                toast.error('Failed to start action', { description: (error as Error).message });
            }
        });
    }

    const isValidForm = () => {
        if (!currentRules || currentRules.length === 0) {
            return false;
        }
        if (!runOnAllSurveys && (!surveyKeys || surveyKeys.length === 0)) {
            return false;
        }

        if (participantScope === 'single' && !participantID) {
            return false;
        }
        return true;
    }

    return (
        <div className='p-4 space-y-4'>
            <h2 className='text-lg font-semibold mb-4'>Start action</h2>
            <Alert className="">
                <Info className="size-4" />
                <AlertDescription>
                    This action will be applied as a participant would submit the previous responses, so rules can implement custom submission handler events. Unless you select a specific participant, it will be applied to all participants in the study except for temporary and deleted users.
                </AlertDescription>
            </Alert>

            <ActionExpressionPicker
                onChange={(newRules) => {
                    setCurrentRules(newRules);
                }}
            />

            <div className=''>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Participant Scope
                </Label>
                <RadioGroup
                    name="participantScope"
                    value={participantScope}
                    onValueChange={(value: 'all' | 'single') => setParticipantScope(value)}
                    className="flex space-x-4"
                >
                    <Label htmlFor="single-participant" className="flex items-center space-x-2">
                        <RadioGroupItem value="single" id="single-participant" />
                        <span>
                            Single Participant
                        </span>
                    </Label>
                    <Label htmlFor="all-participants" className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all-participants" />
                        <span>
                            All Participants
                        </span>
                    </Label>
                </RadioGroup>
            </div>

            {
                participantScope === 'single' && <div className='space-y-1.5 py-2'>
                    <Label className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor='participant-id'
                    >
                        Participant ID
                    </Label>

                    <Input
                        type="text"
                        id='participant-id'
                        name='participant-id'
                        placeholder="Enter participant ID..."
                        value={participantID || ''}
                        onChange={(e) => {
                            setParticipantID(e.target.value);
                        }}
                    />
                    <p className="text-xs text-muted-foreground">
                        Enter the participant ID to apply the action to.
                    </p>
                </div>
            }

            <div className='space-y-1.5 py-2'>
                <Label>
                    Survey scope
                </Label>
                <Label
                    className='flex items-center space-x-2 cursor-pointer'
                    htmlFor='run-on-all-surveys'
                >
                    <span>
                        Apply on specific surveys
                    </span>
                    <Switch
                        id='run-on-all-surveys'
                        checked={runOnAllSurveys}
                        onCheckedChange={(checked) => {
                            setRunOnAllSurveys(checked);
                            if (!checked) {
                                setSurveyKeys(undefined);
                            }
                        }}
                    />
                    <span>
                        Apply on all surveys
                    </span>
                </Label>
            </div>

            <div className='space-y-1.5 py-2'>
                <Label className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor='survey-keys'
                >
                    Survey keys
                </Label>

                <Textarea
                    id='survey-keys'
                    name='survey-keys'
                    disabled={runOnAllSurveys}
                    placeholder="Enter survey keys..."
                    defaultValue={surveyKeys?.join(',')}
                    onChange={(e) => {
                        const newSurveyKeys = e.target.value.split('\n').map(sk => sk.trim()).filter(sk => sk.length > 0);
                        setSurveyKeys(newSurveyKeys);
                    }}
                />
                <p className="text-xs text-muted-foreground">
                    Enter the survey keys to apply the action to. One per line.
                </p>
            </div>

            <div className='space-y-1.5 py-2'>
                <Label className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor='from-date'
                >
                    From date (optional)
                </Label>

                <Input
                    type="date"
                    id='from-date'
                    name='from-date'
                    placeholder="Enter from date..."
                    value={fromDate ? fromDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const newFromDate = new Date(e.target.value);
                        setFromDate(newFromDate);
                    }}
                />
                <p className="text-xs text-muted-foreground">
                    Enter the from date to apply the action to.
                </p>
            </div>

            <div className='space-y-1.5 py-2'>
                <Label className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor='to-date'
                >
                    Until date (optional)
                </Label>

                <Input
                    type="date"
                    id='to-date'
                    name='to-date'
                    placeholder="Enter to date..."
                    value={toDate ? toDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const newToDate = new Date(e.target.value);
                        setToDate(newToDate);
                    }}
                />
                <p className="text-xs text-muted-foreground">
                    Enter the to date to apply the action to.
                </p>
            </div>

            <LoadingButton
                isLoading={isPending}
                variant={'default'}
                disabled={!isValidForm()}

                onClick={() => {
                    switch (participantScope) {
                        case 'all':
                            startActionForAllParticipantsPreviousResponses();
                            break;
                        case 'single':
                            startActionForParticipantOnOldResps();
                            break;
                    }
                }}
            >
                <span>
                    <Play className='size-4 me-2' />
                </span>

                Start action
            </LoadingButton>
        </div>
    );
};

export default StartStudyActionOnPreviousResponses;

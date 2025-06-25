import React, { useEffect } from 'react';
import { useStudyExpressionEditor } from '../../study-expression-editor-context';
import { Card } from '@/components/ui/card';
import SessionNameEditor from '../session-name-editor';
import NoContextHint from '../no-context-hint';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DownloadIcon, MoreVerticalIcon, UploadIcon } from 'lucide-react';
import LoadRulesFromDisk from './load-rules-from-disk';
import SectionCard from './section-card';
import { StudyRulesSet } from './utils';
import HandlerListItem from './handler-list-item';
import HandlerEditor, { HandlerSelection } from './handler-editor';
import { ExpArg, ExpressionArg } from '@/components/expression-editor/utils';
import { toast } from 'sonner';

const Overview: React.FC = () => {
    const [openLoadRulesDialog, setOpenLoadRulesDialog] = React.useState(false);
    const {
        currentRules,
        updateCurrentRules,
        saveRulesToDisk,
        currentStudyContext,
    } = useStudyExpressionEditor();

    const [rulesSet, setRulesSet] = React.useState<StudyRulesSet | undefined>(undefined);
    const [selectedHandler, setSelectedHandler] = React.useState<HandlerSelection | undefined>(undefined);

    useEffect(() => {
        setRulesSet(new StudyRulesSet(currentRules ?? []));
    }, [currentRules])

    const entryEventHandler = rulesSet?.getEntryEventHandler();
    const leaveEventHandler = rulesSet?.getLeaveEventHandler();
    const mergeEventHandler = rulesSet?.getMergeEventHandler();
    const surveySubmissionHandlers = rulesSet?.getSurveySubmissionHandlerInfos();
    const customEventHandlers = rulesSet?.getCustomEventHandlerInfos();
    const timerEventHandlers = rulesSet?.getTimerEventHandlerInfos();

    if (selectedHandler) {
        return <HandlerEditor
            selection={selectedHandler}
            onClose={() => setSelectedHandler(undefined)}
            onChange={(selection) => {
                console.log('selection', selection)
                let newActions: ExpressionArg[] | undefined = selection.actions as ExpressionArg[] | undefined;
                if (newActions === undefined || newActions.length === 0) {
                    newActions = undefined;
                }
                switch (selection.type) {
                    case 'survey-submission':
                        if (selection.handlerKey === undefined) {
                            toast.error('No handler key selected');
                            return;
                        }
                        rulesSet?.updateSurveySubmissionHandler(selection.handlerKey, newActions);
                        break;
                    case 'custom-event':
                        if (selection.handlerKey === undefined) {
                            toast.error('No handler key selected');
                            return;
                        }
                        rulesSet?.updateCustomEventHandler(selection.handlerKey, newActions);
                        break;
                    case 'timer-event':
                        rulesSet?.updateTimerEventHandler(selection.index, newActions ? newActions.at(0) : undefined);
                        break;
                    case 'merge':
                        rulesSet?.updateMergeEventHandler(newActions);
                        break;
                    case 'entry':
                        rulesSet?.updateEntryEventHandler(newActions);
                        break;
                    case 'leave':
                        rulesSet?.updateLeaveEventHandler(newActions);
                        break;
                }
                updateCurrentRules(rulesSet?.getRules());
                setSelectedHandler({
                    ...selectedHandler,
                    actions: newActions,
                });
            }}
        />
    }

    return (
        <div className='p-6 space-y-6 overflow-y-auto @container'>
            <Card className='p-4 space-y-4'>
                <h3 className='font-bold text-sm flex justify-between gap-4'>
                    <span>General</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'outline-solid'}
                                size={'sm'}
                            >
                                <span>Options</span>
                                <MoreVerticalIcon className='size-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                                disabled={!currentRules}
                                onClick={saveRulesToDisk}
                            >
                                <DownloadIcon className='mr-2 size-4' />
                                Export study rules to file
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setOpenLoadRulesDialog(true)}
                            >
                                <UploadIcon className='mr-2 size-4' />
                                Open study rules from file
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </h3>
                <SessionNameEditor />
                <NoContextHint />
            </Card>

            <div className='grid grid-cols-1 gap-4 @4xl:grid-cols-2 pb-12'>
                <div className='space-y-4'>
                    <SectionCard
                        title='Entry event handler'
                        description='Rules applied when a participant enters the study'
                    >
                        <HandlerListItem
                            actions={entryEventHandler ? [entryEventHandler] : []}
                            onRemove={() => {
                                rulesSet?.updateEntryEventHandler(undefined);
                                updateCurrentRules(rulesSet?.getRules());
                            }}
                            onSelect={() => {
                                if (!entryEventHandler) {
                                    return;
                                }
                                const actions = (entryEventHandler as ExpArg).exp.data?.slice(1);
                                setSelectedHandler({
                                    type: 'entry',
                                    actions: actions ?? []
                                })
                            }}
                        />
                    </SectionCard>

                    <SectionCard
                        title='Merge event handler'
                        description='Rules for when a temporary participant is merged into an active participant'
                    >
                        <HandlerListItem
                            actions={mergeEventHandler ? [mergeEventHandler] : []}
                            onRemove={() => {
                                rulesSet?.updateMergeEventHandler(undefined);
                                updateCurrentRules(rulesSet?.getRules());
                            }}
                            onSelect={() => {
                                if (!mergeEventHandler) {
                                    return;
                                }
                                const actions = (mergeEventHandler as ExpArg).exp.data?.slice(1);
                                setSelectedHandler({
                                    type: 'merge',
                                    actions: actions ?? []
                                })
                            }}
                        />
                    </SectionCard>

                    <SectionCard
                        title='Leave event handler'
                        description='Rules applied when a participant leaves the study (e.g., account is deleted)'
                    >
                        <HandlerListItem
                            actions={leaveEventHandler ? [leaveEventHandler] : []}
                            onRemove={() => {
                                rulesSet?.updateLeaveEventHandler(undefined);
                                updateCurrentRules(rulesSet?.getRules());
                            }}
                            onSelect={() => {
                                if (!leaveEventHandler) {
                                    return;
                                }
                                const actions = (leaveEventHandler as ExpArg).exp.data?.slice(1);
                                setSelectedHandler({
                                    type: 'leave',
                                    actions: actions ?? []
                                })
                            }}
                        />
                    </SectionCard>
                </div>

                <SectionCard
                    title='Survey submission handlers'
                    description='Rules applied when a participant submits a survey'
                    count={surveySubmissionHandlers?.length ?? 0}

                    keySuggestions={currentStudyContext?.surveyKeys ?? []}
                    usedKeys={surveySubmissionHandlers?.map(h => h.key) ?? []}
                    onAddNewEntry={(key?: string) => {
                        if (!key) {
                            return;
                        }
                        rulesSet?.updateSurveySubmissionHandler(key, []);
                        updateCurrentRules(rulesSet?.getRules());
                    }}

                    items={surveySubmissionHandlers}
                    onSelectItem={(index) => {
                        setSelectedHandler({
                            type: 'survey-submission',
                            index,
                            handlerKey: surveySubmissionHandlers?.at(index)?.key,
                            actions: surveySubmissionHandlers?.at(index)?.actions
                        })
                    }}
                    onRemoveItem={(index) => {
                        if (!confirm('Are you sure you want to remove this handler?')) {
                            return;
                        }
                        const key = surveySubmissionHandlers?.at(index)?.key;
                        if (key === undefined) {
                            console.warn('Invalid key');
                            return;
                        }
                        rulesSet?.updateSurveySubmissionHandler(key, undefined);
                        updateCurrentRules(rulesSet?.getRules());
                    }}
                />

                <SectionCard
                    title='Custom event handlers'
                    description='Rules applied when a custom study event is triggered'
                    count={customEventHandlers?.length ?? 0}
                    keySuggestions={currentStudyContext?.customEventKeys ?? []}
                    usedKeys={customEventHandlers?.map(h => h.key) ?? []}
                    items={customEventHandlers}
                    onAddNewEntry={(key?: string) => {
                        if (!key) {
                            return;
                        }
                        rulesSet?.updateCustomEventHandler(key, []);
                        updateCurrentRules(rulesSet?.getRules());
                    }}
                    onSelectItem={(index) => {
                        setSelectedHandler({
                            type: 'custom-event',
                            index,
                            handlerKey: customEventHandlers?.at(index)?.key,
                            actions: customEventHandlers?.at(index)?.actions
                        })
                    }}
                    onRemoveItem={(index) => {
                        if (!confirm('Are you sure you want to remove this handler?')) {
                            return;
                        }
                        const key = customEventHandlers?.at(index)?.key;
                        if (key === undefined) {
                            console.warn('Invalid key');
                            return;
                        }
                        rulesSet?.updateCustomEventHandler(key, undefined);
                        updateCurrentRules(rulesSet?.getRules());
                    }}
                />

                <SectionCard
                    title='Timer event handlers'
                    description='Rules executed on study timer event'
                    count={timerEventHandlers?.length ?? 0}
                    addWithoutKey={true}
                    items={timerEventHandlers}
                    onAddNewEntry={() => {
                        rulesSet?.updateTimerEventHandler(undefined, {
                            dtype: 'exp',
                            exp: { name: 'DO', data: [] }
                        });
                        updateCurrentRules(rulesSet?.getRules());
                    }}
                    onSelectItem={(index) => {
                        setSelectedHandler({
                            type: 'timer-event',
                            index,
                            actions: timerEventHandlers?.at(index)?.actions
                        })
                    }}
                    onRemoveItem={(index) => {
                        rulesSet?.updateTimerEventHandler(index, undefined);
                        updateCurrentRules(rulesSet?.getRules());
                    }}
                />


            </div>

            <LoadRulesFromDisk
                open={openLoadRulesDialog}
                onClose={() => setOpenLoadRulesDialog(false)}
            />
        </div>
    );
};

export default Overview;

import React from 'react';
import SessionNameEditor from './session-name-editor';
import NoContextHint from './no-context-hint';
import { Card } from '@/components/ui/card';
import LoadRulesFromDisk from './study-rule-editor/load-rules-from-disk';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DownloadIcon, MoreVerticalIcon, UploadIcon } from 'lucide-react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';
import ExpArgEditor from '@/components/expression-editor/exp-arg-editor';

const StudyActionEditor: React.FC = () => {
    const [openLoadRulesDialog, setOpenLoadRulesDialog] = React.useState(false);
    const {
        currentRules,
        saveRulesToDisk,
    } = useStudyExpressionEditor();

    return (
        <div className='p-6 space-y-6 overflow-y-auto'>
            <Card className='p-4 space-y-4'>
                <h3 className='font-bold text-sm'>General</h3>
                <SessionNameEditor />
                <NoContextHint />
            </Card>

            <Card className='p-4 space-y-4'>
                <h3 className='font-bold text-sm flex justify-between gap-4'>
                    <span>
                        Edit action rules
                    </span>


                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'outline'}
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
                                Export action to file
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setOpenLoadRulesDialog(true)}
                            >
                                <UploadIcon className='mr-2 size-4' />
                                Open action from file
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </h3>
                <div className='bg-slate-100 rounded-md p-4'>
                    <ExpArgEditor
                        availableExpData={currentRules ?
                            currentRules.map(e => ({ dtype: 'exp', exp: e })) : []}
                        availableMetadata={{
                            slotTypes: []
                            //slotTypes: currentExpArgSlot ? [currentExpArgSlot] : []
                        }}
                        expRegistry={{
                            expressionDefs: [],
                            builtInSlotTypes: [],
                            categories: [],
                            /*expressionDefs: surveyEngineRegistry,
                            builtInSlotTypes: supportedBuiltInSlotTypes,
                            categories: surveyExpressionCategories,*/
                        }}
                        context={{
                            /*singleChoiceOptions: singleChoiceKeys,
                            multipleChoiceOptions: multipleChoiceKeys,
                            allItemKeys: allItemKeys,
                            dateUnitPicker: [
                                { key: 'years', label: 'Years' },
                                { key: 'months', label: 'Months' },
                                { key: 'days', label: 'Days' },
                                { key: 'hours', label: 'Hours' },
                                { key: 'minutes', label: 'Minutes' },
                                { key: 'seconds', label: 'Seconds' },
                            ],*/
                        }}
                        currentIndex={0}
                        slotDef={{
                            label: 'Actions',
                            required: false,
                            isListSlot: true,
                            allowedTypes: [
                                {
                                    id: 'exp-slot',
                                    type: 'expression',
                                    allowedExpressionTypes: ['action']
                                }
                            ],
                        }}
                        onChange={(newArgs,) => {
                            /* console.log('newArgs', newArgs)
                             const updatedSurveyItem = {
                                 ...props.surveyItem,
                             }
                             if (!newArgs || newArgs.length < 1 || newArgs[0] === undefined) {
                                 updatedSurveyItem.condition = undefined;
                             } else {
                                 updatedSurveyItem.condition = (newArgs[0] as ExpArg).exp as CaseExpression;
                             }
                             props.onUpdateSurveyItem(updatedSurveyItem);
                         */
                        }}
                    />

                </div>
            </Card>

            <LoadRulesFromDisk
                open={openLoadRulesDialog}
                onClose={() => setOpenLoadRulesDialog(false)}
            />
        </div>
    );
};

export default StudyActionEditor;

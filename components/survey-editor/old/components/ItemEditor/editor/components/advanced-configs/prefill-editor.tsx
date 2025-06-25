import AddDropdown from '@/components/survey-editor/old/components/general/add-dropdown';
import { FilePenLineIcon, HistoryIcon, SquareDashedIcon, XIcon } from 'lucide-react';
import React from 'react';
import { useItemEditorCtx } from '../../../item-editor-context';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { Expression, ExpressionArg, Survey } from 'survey-engine/data_types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ExpArgEditorForDate from '../content-editor/response-editors/exp-arg-editor-for-date';
import { ExpArg } from '@/components/expression-editor/utils';

interface PrefillRuleItemProps {
    index: number;
    rule: Expression;
    onChange: (newRule: Expression) => void;
    onDelete: () => void;
}

const PrefillRuleItem: React.FC<PrefillRuleItemProps> = (props) => {


    const name = () => {
        switch (props.rule.name) {
            case 'PREFILL_SLOT_WITH_VALUE':
                return 'Constant value';
            case 'PREFILL_ITEM_WITH_LAST_RESPONSE':
                return "Last response"
        }
    }

    const argEditor = () => {
        switch (props.rule.name) {
            case 'PREFILL_SLOT_WITH_VALUE':
                let slotKey = ''
                let slotValue: number | string = '';
                let useNumericValue = false;
                if (props.rule.data && props.rule.data.length > 1) {
                    slotKey = props.rule.data[1].str || '';
                }
                if (props.rule.data && props.rule.data.length > 2) {
                    const valArg = props.rule.data[2];
                    if (valArg.dtype === 'num') {
                        useNumericValue = true;
                        slotValue = valArg.num || 0;
                    } else {
                        slotValue = valArg.str || '';
                    }
                }

                return <div className='flex gap-2 items-center w-full'>
                    <Label className='grow space-y-1.5 font-medium text-xs'>
                        <span>
                            Slot key
                        </span>
                        <Input
                            placeholder='Slot key (e.g. rg.mcg.1)'
                            defaultValue={slotKey}
                            onChange={(e) => {
                                const val = e.target.value;

                                if (!props.rule.data || props.rule.data.length < 1) {
                                    return;
                                }

                                if (props.rule.data.length < 2) {
                                    props.rule.data.push({
                                        dtype: 'str',
                                        str: val,
                                    });
                                } else {
                                    props.rule.data[1].str = val;
                                }
                                props.onChange(props.rule);
                            }}
                        />
                    </Label>

                    <Label className='grow space-y-1.5 font-medium text-xs'>
                        <span>
                            Optional value
                        </span>
                        <Input
                            placeholder='Optional value'
                            defaultValue={slotValue}
                            type={useNumericValue ? 'number' : 'text'}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (!props.rule.data || props.rule.data.length < 1) {
                                    return;
                                }

                                if (props.rule.data.length < 2) {
                                    props.rule.data.push({
                                        dtype: 'str',
                                        str: '',
                                    });
                                }

                                const val: ExpressionArg = useNumericValue ? {
                                    dtype: 'num',
                                    num: parseInt(value),
                                } : {
                                    dtype: 'str',
                                    str: value,
                                }
                                if (props.rule.data.length < 3) {
                                    props.rule.data.push(val);
                                } else {
                                    props.rule.data[2] = val;
                                }
                                props.onChange(props.rule);
                            }}
                        />
                    </Label>


                    <Label className='flex flex-col gap-1'>
                        <span className='text-xs text-nowrap'>
                            Use number
                        </span>
                        <Switch
                            checked={useNumericValue}
                            onCheckedChange={(checked) => {
                                if (!props.rule.data || props.rule.data.length < 1) {
                                    return;
                                }

                                if (props.rule.data.length < 2) {
                                    props.rule.data.push({
                                        dtype: 'str',
                                        str: '',
                                    });
                                }

                                const val: ExpressionArg = checked ? {
                                    dtype: 'num',
                                    num: 0,
                                } : {
                                    dtype: 'str',
                                    str: '',
                                }
                                if (props.rule.data.length < 3) {
                                    props.rule.data.push(val);
                                } else {
                                    props.rule.data[2] = val;
                                }
                                props.onChange(props.rule);
                            }}
                        />
                    </Label>
                </div>
            case 'PREFILL_ITEM_WITH_LAST_RESPONSE':
                let currentDateFilter: ExpressionArg | undefined;
                if (props.rule.data && props.rule.data.length > 1) {
                    currentDateFilter = props.rule.data[1];
                }

                return <ExpArgEditorForDate
                    label='Optional date filter'
                    expArg={currentDateFilter as ExpArg}
                    onChange={(argValue) => {
                        if (!props.rule.data || props.rule.data.length < 1) {
                            console.warn('rule.data is empty')
                            return
                        }
                        if (argValue === undefined) {
                            props.rule.data.splice(1, 1);
                            props.onChange(props.rule);
                            return
                        } else {
                            if (props.rule.data.length > 1) {
                                props.rule.data[1] = argValue as ExpressionArg;
                            } else {
                                props.rule.data.push(argValue as ExpressionArg);
                            }
                            props.onChange(props.rule);
                        }
                    }}
                />

        }
    }


    return (
        <div className='flex items-start gap-2 px-3 py-2 border border-border rounded-md justify-between bg-secondary'>
            <div className=' space-y-2 items-center grow'>
                <p className='text-sm uppercase font-bold text-nowrap'>
                    {name()}
                </p>
                <div className=''>
                    {argEditor()}
                </div>
            </div>

            <Button variant='ghost' size='icon' onClick={() => {
                if (!confirm('Are you sure you want to delete this rule?')) {
                    return;
                }
                props.onDelete();
            }}>
                <XIcon />
            </Button>
        </div>
    )
}


const PrefillEditor: React.FC = () => {
    const { selectedItemKey } = useItemEditorCtx();
    const { survey, setSurvey } = useSurveyEditorCtx();

    const onAddPrefillRule = (key: string) => {
        const exitingRules = survey?.prefillRules || [];
        const newRules = [...exitingRules];

        if (!selectedItemKey) {
            console.warn('No item selected');
            return;
        }

        switch (key) {
            case 'PREFILL_ITEM_WITH_LAST_RESPONSE':
                newRules.push({
                    name: key,
                    data: [
                        { str: selectedItemKey },
                    ]
                });
                break;
            case 'PREFILL_SLOT_WITH_VALUE':
                newRules.push({
                    name: key,
                    data: [
                        { str: selectedItemKey, dtype: 'str' },
                        { str: '', dtype: 'str' }, // slot key
                        { str: '', dtype: 'str' }, // value
                    ]
                });
                break;
        }

        const newSurvey = { ...survey };
        newSurvey.prefillRules = newRules;
        setSurvey(newSurvey as Survey);
    }

    const prefillRulesForItem: {
        index: number,
        rule: Expression
    }[] = [];

    survey?.prefillRules?.forEach((rule, index) => {
        if (!rule.data) {
            return;
        }
        if (rule.data.length < 1) {
            return;
        }

        if (rule.data[0]?.str === selectedItemKey) {
            prefillRulesForItem.push({
                index,
                rule
            });
        }
    })

    return (
        <>
            <div>
                <div>
                    <h3 className='font-semibold text-base'>Prefill</h3>
                    <p className='text-sm text-muted-foreground'>
                        The following prefill rules will be applied in supported environments.
                    </p>
                </div>
            </div>
            {prefillRulesForItem.length < 1 && <div className='flex items-center justify-center gap-2 text-muted-foreground p-4 text-sm'>
                <SquareDashedIcon />
                <p>No prefills found for this item</p>
            </div>}
            <ul className='space-y-2'>
                {prefillRulesForItem.map((ruleItem) => <li
                    key={ruleItem.index}
                > <PrefillRuleItem
                        index={ruleItem.index}
                        rule={ruleItem.rule}
                        onChange={(newRule) => {
                            const exitingRules = survey?.prefillRules || [];
                            const newRules = [...exitingRules];
                            newRules[ruleItem.index] = newRule;
                            const newSurvey = { ...survey };
                            newSurvey.prefillRules = newRules;
                            setSurvey(newSurvey as Survey);
                        }}
                        onDelete={() => {
                            const exitingRules = survey?.prefillRules || [];
                            const newRules = [...exitingRules];
                            newRules.splice(ruleItem.index, 1);
                            const newSurvey = { ...survey };
                            newSurvey.prefillRules = newRules;
                            setSurvey(newSurvey as Survey);
                        }}
                    /></li>)}
            </ul>

            <div className='flex justify-center'>
                <AddDropdown
                    options={[
                        { key: 'PREFILL_ITEM_WITH_LAST_RESPONSE', label: 'With last response', icon: <HistoryIcon className='size-4 me-2' /> },
                        { key: 'PREFILL_SLOT_WITH_VALUE', label: 'With constant', icon: <FilePenLineIcon className='size-4 me-2' /> },
                    ]}
                    onAddItem={onAddPrefillRule}
                />
            </div>
        </>
    );
};

export default PrefillEditor;

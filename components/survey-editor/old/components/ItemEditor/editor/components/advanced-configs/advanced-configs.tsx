import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

import React from 'react';
import { SurveyItem, SurveySingleItem } from 'survey-engine/data_types';
import PrefillEditor from './prefill-editor';

interface AdvancedConfigsProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const AdvancedConfigs: React.FC<AdvancedConfigsProps> = (props) => {
    const currentItem = props.surveyItem as SurveySingleItem;

    const confidentialModeOn = currentItem.confidentialMode !== undefined;

    const onToggleConfidentialMode = (checked: boolean) => {
        if (!checked) {
            currentItem.confidentialMode = undefined;
            currentItem.mapToKey = undefined;
        } else {
            currentItem.confidentialMode = 'replace';
        }
        props.onUpdateSurveyItem(currentItem);
    }

    return (
        <div>


            <div className='px-4 pt-2 pb-4 space-y-4'>
                <div>
                    <h3 className='font-semibold text-base'>Confidential mode</h3>
                    <p className='text-sm text-muted-foreground'>By marking this item as confidential, the response will be saved into the confidential data store.</p>
                </div>
                <div className=''>
                    <Label htmlFor='confidential-mode-switch'
                        className='flex items-center gap-2'
                    >
                        <Switch
                            id='confidential-mode-switch'
                            checked={confidentialModeOn}
                            onCheckedChange={onToggleConfidentialMode}
                        />
                        Confidential mode ({confidentialModeOn ? 'On' : 'Off'})
                    </Label>
                </div>

                {confidentialModeOn && (
                    <>

                        <fieldset className='space-y-2 flex'>
                            <legend className='font-semibold text-sm'>Confidential mode</legend>
                            <div>
                                <Select value={currentItem.confidentialMode || ''}
                                    onValueChange={(value) => {
                                        currentItem.confidentialMode = value as 'replace' | 'add';
                                        props.onUpdateSurveyItem(currentItem);
                                    }}
                                >

                                    <SelectTrigger className='w-64'>
                                        <SelectValue placeholder="Select a confidential mode..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='replace'>Replace</SelectItem>
                                        <SelectItem value='add'>Add</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </fieldset>
                        <div className='space-y-1.5'>
                            <Label
                                htmlFor="mapToKey"
                                className='text-sm font-semibold'
                            >
                                Map to key (optional)
                            </Label>
                            <Input
                                id="mapToKey"
                                type="text"
                                value={currentItem.mapToKey || ''}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    currentItem.mapToKey = value === '' ? undefined : value;
                                    props.onUpdateSurveyItem(currentItem);
                                }}
                                placeholder='Enter a key...'
                            />
                            <p className='text-xs text-muted-foreground'>
                                The response for this item will be saved in the confidential data store with the key provided here.
                            </p>
                        </div>
                    </>
                )}
            </div>

            <Separator />

            <div className='px-4 py-4 space-y-4'>
                <PrefillEditor />
            </div>
        </div>
    );
};

export default AdvancedConfigs;

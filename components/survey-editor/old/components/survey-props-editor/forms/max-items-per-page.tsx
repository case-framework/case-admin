import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';


const MaxItemsPerPage: React.FC = () => {
    const { survey, setSurvey } = useSurveyEditorCtx();

    const useMaxItemsPerPage = survey?.maxItemsPerPage !== undefined;

    return (
        <div className='space-y-6'>
            <div>
                <h3 className="text-lg font-medium mb-1">Max items per page</h3>
                <p className="text-sm text-muted-foreground">
                    Can be used to limit the number of items per page for small and large screens. You can use page breaks items instead to control the number of items per page if the number of items per page is variable.
                </p>
            </div>
            <Separator />

            <Label className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-1.5">
                    <div className="">Limit the number of items per page for small and large screens.</div>
                    <div className='text-xs text-muted-foreground'>
                        If enabled, only the configured number of items per page will be shown on small and large screens respectively.
                    </div>
                </div>

                <Switch
                    checked={useMaxItemsPerPage}
                    onCheckedChange={(checked) => {
                        if (!survey) {
                            return;
                        }

                        const newSurvey = { ...survey };
                        if (checked) {
                            newSurvey.maxItemsPerPage = {
                                small: 10,
                                large: 20
                            }
                        } else {
                            delete newSurvey.maxItemsPerPage;
                        }
                        setSurvey(newSurvey);
                    }}
                />
            </Label>

            {useMaxItemsPerPage && <div className='flex gap-4'>
                <div className='space-y-1.5'>
                    <Label
                        htmlFor='max-items-per-page-small'
                        className='mb-1.5'>
                        On small screens
                    </Label>
                    <Input
                        id='max-items-per-page-small'
                        type="number" min={1} max={100} value={survey?.maxItemsPerPage?.small}
                        onChange={(e) => {
                            if (!survey) {
                                return;
                            }
                            const value = e.target.value;
                            if (value === '') {
                                return;
                            }
                            const num = parseInt(value);
                            if (isNaN(num)) {
                                return;
                            }

                            if (num < 1 || num > 100) {
                                return;
                            }



                            const newSurvey = { ...survey };
                            newSurvey.maxItemsPerPage = {
                                small: num,
                                large: survey.maxItemsPerPage?.large ?? 20
                            }
                            setSurvey(newSurvey);
                        }} />

                </div>

                <div className='space-y-1.5'>
                    <Label
                        htmlFor='max-items-per-page-large'
                    >
                        On large screens
                    </Label>
                    <Input
                        id='max-items-per-page-large'
                        type="number" min={1} max={100}
                        defaultValue={survey?.maxItemsPerPage?.large}
                        onChange={(e) => {
                            if (!survey) {
                                return;
                            }
                            const value = e.target.value;
                            if (value === '') {
                                return;
                            }
                            const num = parseInt(value);
                            if (isNaN(num)) {
                                return;
                            }

                            if (num < 1 || num > 100) {
                                return;
                            }

                            const newSurvey = { ...survey };
                            newSurvey.maxItemsPerPage = {
                                small: survey.maxItemsPerPage?.small ?? 10,
                                large: num,
                            }
                            setSurvey(newSurvey);
                        }} />

                </div>
            </div>}

        </div>

    );
};

export default MaxItemsPerPage;

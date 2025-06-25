'use client';

import LoadingButton from '@/components/loading-button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import React from 'react';
import { toast } from 'sonner';

interface StudyConfigExporterProps {
    studyKey: string;
}

const StudyConfigExporter: React.FC<StudyConfigExporterProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const [includeConfig, setIncludeConfig] = React.useState(true);
    const [includeSurveys, setIncludeSurveys] = React.useState(true);
    const [includeRules, setIncludeRules] = React.useState(true);

    const onPrepAndDownloadExport = () => {
        startTransition(async () => {
            try {
                const queryParams = new URLSearchParams();
                queryParams.append('config', includeConfig ? 'true' : 'false');
                queryParams.append('surveys', includeSurveys ? 'true' : 'false');
                queryParams.append('rules', includeRules ? 'true' : 'false');

                const apiURL = `/api/case-management-api/v1/studies/${props.studyKey}/export-config?${queryParams.toString()}`;
                const resp = await fetch(apiURL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (resp.status !== 200) {
                    const respBodyError = await resp.json();
                    toast.error('Failed to prepare export', {
                        description: respBodyError.error
                    });
                    return;
                }
                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const filename = resp.headers.get('Content-Disposition')?.split('filename=')[1] || 'exported-config.json';
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                toast.success('File downloaded');
            } catch (e) {
                console.error(e);
                toast.error('Failed to download file');
            }
        });
    }

    return (
        <div className='space-y-4'>
            <h4 className='text-lg font-medium mb-2'>
                Export study configuration
            </h4>
            <Label className='flex items-center gap-2'>
                <Checkbox
                    checked={includeConfig}
                    onCheckedChange={(value) => {
                        setIncludeConfig(value === true);
                    }}
                />

                Include study configuration
            </Label>

            <Label className='flex items-center gap-2'>
                <Checkbox
                    checked={includeSurveys}
                    onCheckedChange={(value) => {
                        setIncludeSurveys(value === true);
                    }}
                />

                Include surveys
            </Label>

            <Label className='flex items-center gap-2'>
                <Checkbox
                    checked={includeRules}
                    onCheckedChange={(value) => {
                        setIncludeRules(value === true);
                    }}
                />

                Include rules
            </Label>

            <LoadingButton
                isLoading={isPending}
                variant={'outline-solid'}
                onClick={onPrepAndDownloadExport}
                disabled={!includeConfig && !includeSurveys && !includeRules}
            >
                Prepare and download study configuration
            </LoadingButton>
        </div>
    );
};

export default StudyConfigExporter;

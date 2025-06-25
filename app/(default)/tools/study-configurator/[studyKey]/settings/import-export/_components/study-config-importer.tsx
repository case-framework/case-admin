'use client';
import { saveStudyNotifications } from '@/actions/study/saveStudyNotifications';
import { saveStudyRules } from '@/actions/study/studyRules';
import { uploadSurvey } from '@/actions/study/surveys';
import { updateStudyDisplayProps, updateStudyFileUploadConfig, updateStudyIsDefault, updateStudyStatus } from '@/actions/study/updateStudyProps';
import Filepicker from '@/components/inputs/Filepicker';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Study } from '@/utils/server/types/studyInfos';
import { PlayIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Expression, Survey } from 'survey-engine/data_types';

interface StudyConfigImporterProps {
    studyKey: string;
}

interface ImportedStudyConfig {
    exportedAt: string;
    config?: Study & {
        notificationSubscriptions: Array<{
            messageType: string;
            email: string;
        }>;
    };
    surveys?: Survey[];
    rules?: {
        rules: Expression[];
    };
}

const StudyConfigImporter: React.FC<StudyConfigImporterProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const [open, setOpen] = React.useState(false);

    const [hasSurveys, setHasSurveys] = React.useState(false);
    const [hasRules, setHasRules] = React.useState(false);
    const [hasConfig, setHasConfig] = React.useState(false);


    const [includeConfig, setIncludeConfig] = React.useState(true);
    const [includeSurveys, setIncludeSurveys] = React.useState(true);
    const [includeRules, setIncludeRules] = React.useState(true);

    const [importedConfig, setImportedConfig] = React.useState<ImportedStudyConfig | undefined>(undefined);

    const hasValidConfig = hasConfig || hasSurveys || hasRules;

    const onApplyImport = async () => {
        startTransition(async () => {
            if (includeConfig && importedConfig?.config) {
                // update study is default
                try {
                    const response = await updateStudyIsDefault(props.studyKey, importedConfig?.config.props.systemDefaultStudy)
                    if (response.error) {
                        toast.error('Failed to update study is default.', {
                            description: response.error
                        });
                        return;
                    }
                    toast.success('Study is default updated successfully.');
                }
                catch (e: unknown) {
                    toast.error('Failed to update study is default.');
                    console.error(e);
                }

                // update display props
                try {
                    const response = await updateStudyDisplayProps(props.studyKey, importedConfig?.config.props.name, importedConfig?.config.props.description, importedConfig?.config.props.tags)
                    if (response.error) {
                        toast.error('Failed to update display props.', {
                            description: response.error
                        });
                        return;
                    }
                    toast.success('Display props updated successfully.');
                }
                catch (e: unknown) {
                    toast.error('Failed to update display props.');
                    console.error(e);
                }

                // update study notifications
                try {
                    const response = await saveStudyNotifications(props.studyKey, importedConfig?.config.notificationSubscriptions || [])
                    if (response.error) {
                        toast.error('Failed to update study notifications.', {
                            description: response.error
                        });
                        return;
                    }
                    toast.success('Study notifications updated successfully.');
                } catch (e: unknown) {
                    toast.error('Failed to update study notifications.');
                    console.error(e);
                }

                // update study status
                try {
                    const response = await updateStudyStatus(props.studyKey, importedConfig?.config.status)
                    if (response.error) {
                        toast.error('Failed to update study status.', {
                            description: response.error
                        });
                        return;
                    }
                    toast.success('Study status updated successfully.');
                }
                catch (e: unknown) {
                    toast.error('Failed to update study status.');
                    console.error(e);
                }

                // update file upload config
                if (importedConfig?.config.configs.participantFileUploadRule) {
                    try {
                        const response = await updateStudyFileUploadConfig(props.studyKey, false, importedConfig?.config?.configs.participantFileUploadRule)
                        if (response.error) {
                            toast.error('Failed to update file upload config.', {
                                description: response.error
                            });
                            return;
                        }
                        toast.success('File upload config updated successfully.');
                    }
                    catch (e: unknown) {
                        toast.error('Failed to update file upload config.');
                        console.error(e);
                    }
                }
            }

            if (includeSurveys && importedConfig?.surveys && importedConfig?.surveys.length > 0) {
                for (const survey of importedConfig.surveys) {
                    const surveyKey = survey.surveyDefinition.key;
                    try {
                        const response = await uploadSurvey(props.studyKey, surveyKey, survey)
                        if (response.error) {
                            toast.error('Failed to upload survey: ' + surveyKey, {
                                description: response.error
                            });
                            return;
                        }
                        toast.success('Survey uploaded successfully: ' + surveyKey);
                    }
                    catch (e: unknown) {
                        toast.error('Error while uploading survey: ' + surveyKey);
                        console.error(e);
                    }
                }
            }
            if (includeRules && importedConfig?.rules?.rules) {
                try {
                    const response = await saveStudyRules(props.studyKey, importedConfig?.rules?.rules);
                    if (response.error) {
                        toast.error('Failed to upload study rules.', {
                            description: response.error
                        });
                        return;
                    }
                    toast.success('Study rules uploaded successfully.');

                }
                catch (e: unknown) {
                    toast.error('Failed to upload study rules.');
                    console.error(e);
                }
            }

            toast.success('Imported study configuration', { duration: 12000 });
            setOpen(false);
        });
    }

    return (
        <div>
            <h4 className='text-lg font-medium mb-2'>
                Import study configuration
            </h4>
            <Sheet
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (value === false) {
                        setImportedConfig(undefined);
                        setHasConfig(false);
                        setHasSurveys(false);
                        setHasRules(false);
                    }
                }}
            >
                <SheetTrigger asChild>
                    <Button variant={'outline-solid'}>
                        Open Importer
                    </Button>

                </SheetTrigger>
                <SheetContent
                    side={'bottom'}>
                    <div className='mb-4'>
                        <SheetTitle>
                            Study config importer
                        </SheetTitle>
                        <SheetDescription>
                            Select a study configuration file (JSON) and what parts to import from it.
                        </SheetDescription>
                    </div>
                    <Separator />
                    <div className='py-4 space-y-4'>
                        <div className='space-y-2'>
                            <h5 className='font-medium'>Step 1: Select study configuration file</h5>
                            <Filepicker
                                id='import-study-config-file'
                                label='Import study configuration file'
                                accept={{
                                    'application/json': ['.json'],
                                }}
                                onChange={(files) => {
                                    if (files.length > 0) {
                                        // read file as a json
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            const text = e.target?.result;
                                            if (typeof text === 'string') {
                                                const data = JSON.parse(text);

                                                const hasConfig = data.config !== undefined;
                                                const hasSurveys = data.surveys !== undefined;
                                                const hasRules = data.rules !== undefined;
                                                setHasConfig(hasConfig);
                                                setHasSurveys(hasSurveys);
                                                setHasRules(hasRules);
                                                if (!hasConfig && !hasSurveys && !hasRules) {
                                                    setImportedConfig(undefined);
                                                    toast.error('Selected file does not appear to be a valid study configuration file. Please check if you have selected the correct file.');
                                                    return;
                                                }

                                                setIncludeConfig(hasConfig);
                                                setIncludeSurveys(hasSurveys);
                                                setIncludeRules(hasRules);
                                                setImportedConfig(data);
                                            } else {
                                                toast.error('Failed to read file');
                                            }
                                        }
                                        reader.readAsText(files[0]);
                                    }
                                }}
                            />
                        </div>
                        <Separator />
                        <div className='space-y-2'>
                            <h5 className='font-medium'>Step 2: What to import</h5>
                            {!hasValidConfig && <p className='text-muted-foreground text-sm border border-border p-4 rounded'>select a valid study configuration file first</p>}
                            {hasValidConfig && <div className='border border-border p-4 rounded flex gap-2 justify-between'>
                                {hasConfig && <Label className='flex items-center gap-2'>
                                    <Checkbox
                                        checked={includeConfig}
                                        onCheckedChange={(value) => {
                                            setIncludeConfig(value === true);
                                        }}
                                    />

                                    Override study configuration
                                </Label>}

                                {hasSurveys && <Label className='flex items-center gap-2'>
                                    <Checkbox
                                        checked={includeSurveys}
                                        onCheckedChange={(value) => {
                                            setIncludeSurveys(value === true);
                                        }}
                                    />

                                    Override surveys
                                </Label>}


                                {hasRules && <Label className='flex items-center gap-2'>
                                    <Checkbox
                                        checked={includeRules}
                                        onCheckedChange={(value) => {
                                            setIncludeRules(value === true);
                                        }}
                                    />

                                    Override rules
                                </Label>}
                            </div>}
                        </div>
                        <Separator />
                        <div>
                            <h5 className='font-medium'>Step 3: Confirm import</h5>
                            <p className='mb-2 text-xs'>Override current study configuration with selected parts of the imported file</p>
                            <LoadingButton
                                isLoading={isPending}
                                disabled={(importedConfig === undefined) || ((!includeConfig && !includeSurveys && !includeRules) || !hasValidConfig)}
                                onClick={onApplyImport}
                            >
                                Import
                                <span><PlayIcon className='size-4' /></span>
                            </LoadingButton>
                        </div>
                    </div>

                </SheetContent>
            </Sheet>


        </div>
    );
};

export default StudyConfigImporter;

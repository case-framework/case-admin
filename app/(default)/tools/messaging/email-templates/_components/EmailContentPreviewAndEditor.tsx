
import React, { useEffect, useState } from 'react';
import { decodeTemplate, encodeTemplate } from '../../schedules/_components/utils';
import { EmailTemplate } from '@/utils/server/types/messaging';
import LanguageSelector from '@/components/LanguageSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Download, Eye, Pencil, Upload } from 'lucide-react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import LoadNewTemplateFormDisk from './LoadNewTemplateFormDisk';
import ContentPreview from './ContentPreview';
import ContentEditor from './ContentEditor';
import { toast } from 'sonner';

interface EmailContentPreviewAndEditorProps {
    emailTemplateConfig: EmailTemplate;
    onChange: (template: EmailTemplate) => void;
}

const checkMissingTranslations = (template: EmailTemplate): string[] => {
    const expectedLanguages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ? process.env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',') : ['en'];
    const missingLanguages = expectedLanguages.filter(lang => {
        const t = template.translations.find(t => t.lang === lang)
        return !t || !t.subject || !t.templateDef;
    });
    return missingLanguages;
}

const EmailContentPreviewAndEditor: React.FC<EmailContentPreviewAndEditorProps> = (props) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en');
    const [emailPreviewDocSrc, setEmailPreviewDocSrc] = React.useState<string | null>(null);
    const [mode, setMode] = useState<'preview' | 'editor'>('preview')
    const [loadFileDialogOpen, setLoadFileDialogOpen] = useState(false);

    useEffect(() => {
        if (!props.emailTemplateConfig) {
            setEmailPreviewDocSrc(null);
            return
        };
        const t = props.emailTemplateConfig.translations.find(t => t.lang === selectedLanguage);
        if (!t || !t.templateDef) {
            setEmailPreviewDocSrc(null);
            return;
        }
        const docSrc = decodeTemplate(t.templateDef ?? '') ?? '';
        setEmailPreviewDocSrc(docSrc);
    }, [selectedLanguage, props.emailTemplateConfig]);


    const onUpdateEmailSubject = (newSubject: string) => {
        const updatedTemplate = { ...props.emailTemplateConfig };
        const translation = updatedTemplate.translations.find(t => t.lang === selectedLanguage);
        if (translation) {
            translation.subject = newSubject;
        } else {
            updatedTemplate.translations.push({
                lang: selectedLanguage,
                subject: newSubject,
                templateDef: '',
            })
        }
        props.onChange(updatedTemplate)
    }

    const onUpdateEmailTemplate = (newTemplateContent: string) => {
        const encodedTemplate = encodeTemplate(newTemplateContent);
        if (!encodedTemplate) {
            toast.error('Failed to encode template');
            return;
        }

        const newEmailTemplateConfig = { ...props.emailTemplateConfig };
        const translation = newEmailTemplateConfig.translations.find(t => t.lang === selectedLanguage);
        if (translation) {
            translation.templateDef = encodedTemplate;
        } else {
            newEmailTemplateConfig.translations.push({
                lang: selectedLanguage,
                subject: '',
                templateDef: encodedTemplate,
            })
        }
        props.onChange(newEmailTemplateConfig);
    }

    const onDownloadCurrentHtml = () => {
        const content = emailPreviewDocSrc;
        if (!content) {
            toast.warning('Content is empty, nothing to download.');
            return;
        }

        // download csv
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${props.emailTemplateConfig.messageType}${props.emailTemplateConfig.studyKey && '_' + props.emailTemplateConfig.studyKey}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const currentTranslatedContent = props.emailTemplateConfig.translations.find(t => t.lang === selectedLanguage);

    return (
        <div className='p-4'>
            <div>
                <h3 className='font-bold text-xl'>
                    Content
                </h3>
                <p className='text-sm text-neutra-600'>Set subject and content of the message for each language</p>
            </div>

            <div className='space-y-4'>
                <div className='flex justify-end'>
                    <LanguageSelector
                        onLanguageChange={setSelectedLanguage}
                        showBadgeForLanguages={checkMissingTranslations(props.emailTemplateConfig)}
                    />
                </div>

                <div className='space-y-1'>
                    <Label
                        className='font-semibold'
                        htmlFor='email-subject'>
                        Subject
                    </Label>
                    <Input
                        type='text'
                        id='email-subject'
                        name='email-subject'
                        placeholder='<no entry for the selected language>'
                        value={currentTranslatedContent?.subject ?? ''}
                        onChange={(event) => {
                            const value = event.target.value;
                            onUpdateEmailSubject(value);
                        }}
                    />
                </div>

                <div className='flex justify-end gap-2'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'outline-solid'}
                                    size='icon'
                                    onClick={() => {
                                        setMode(prev => {
                                            if (prev == 'preview') {
                                                return 'editor';
                                            }
                                            return 'preview';
                                        })
                                    }}
                                >
                                    {mode == 'preview' ? <Pencil className='size-5' /> : <Eye className='size-5' />}

                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {mode == 'preview' ? 'Switch to editor' : 'Switch to preview'}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'outline-solid'}
                                    size='icon'
                                    onClick={() => {
                                        setLoadFileDialogOpen(true);
                                    }}
                                >
                                    <Upload className='size-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Upload a new template for the selected language
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'outline-solid'}
                                    size='icon'
                                    onClick={onDownloadCurrentHtml}
                                >
                                    <Download className='size-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Download html template
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {mode == 'preview' ? <ContentPreview
                    decodedTemplate={emailPreviewDocSrc ?? ''}
                /> : <ContentEditor
                    content={emailPreviewDocSrc ?? ''}
                    onChange={(newContent) => {
                        onUpdateEmailTemplate(newContent);
                    }}
                />}

                <LoadNewTemplateFormDisk
                    open={loadFileDialogOpen}
                    onClose={() => {
                        setLoadFileDialogOpen(false);
                    }}
                    onTemplateLoaded={(content) => {
                        onUpdateEmailTemplate(content);
                        setLoadFileDialogOpen(false);
                    }}
                />
            </div>
        </div>
    );
};

export default EmailContentPreviewAndEditor;

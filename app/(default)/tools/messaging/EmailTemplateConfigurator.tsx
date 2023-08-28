'use client'

import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';
import Filepicker from '@/components/inputs/Filepicker';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { Button, Checkbox, Code, Divider, Input, ScrollShadow, Switch, Tab, Tabs } from '@nextui-org/react';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { decodeTemplate, encodeTemplate } from './schedules/editor/utils';
import { BsCheck, BsExclamationCircle, BsExclamationTriangle, BsFileEarmarkCode, BsFiletypeHtml } from 'react-icons/bs';
import LanguageSelector from '@/components/LanguageSelector';
import { useRouter } from 'next/navigation';
import { deleteMessageTemplate, uploadMessageTemplate } from './actionsMessageTemplates';

interface EmailTemplateConfiguratorProps {
    emailTemplateConfig?: EmailTemplate;
    messageType?: string;
    isSystemTemplate: boolean;
}

const initialEmailTemplate: EmailTemplate = {
    messageType: '',
    studyKey: '',
    defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    headerOverrides: undefined,
    translations: [],
};

const checkMissingTranslations = (template: EmailTemplate): string[] => {
    const expectedLanguages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ? process.env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',') : ['en'];
    const missingLanguages = expectedLanguages.filter(lang => {
        const t = template.translations.find(t => t.lang === lang)
        return !t || !t.subject || !t.templateDef;
    });
    return missingLanguages;
}

const EmailTemplateConfigurator: React.FC<EmailTemplateConfiguratorProps> = (props) => {
    const [emailTemplateConfig, setEmailTemplateConfig] = React.useState<EmailTemplate>(props.emailTemplateConfig ? props.emailTemplateConfig : { ...initialEmailTemplate });
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();

    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en');
    const [submitError, setSubmitError] = React.useState('');
    const [submitSuccess, setSubmitSuccess] = React.useState(false);

    useEffect(() => {
        if (!emailTemplateConfig) {
            setEmailPreviewDocSrc(null);
            return
        };
        const t = emailTemplateConfig.translations.find(t => t.lang === selectedLanguage);
        if (!t || !t.templateDef) {
            setEmailPreviewDocSrc(null);
            return;
        }
        const docSrc = decodeTemplate(t.templateDef ?? '') ?? '';
        setEmailPreviewDocSrc(docSrc);
    }, [selectedLanguage, emailTemplateConfig]);

    const [emailPreviewDocSrc, setEmailPreviewDocSrc] = React.useState<string | null>(null);

    let errorComp: React.ReactNode = null;
    if (submitError) {
        errorComp = <div className='bg-danger-50 gap-unit-md rounded-medium p-unit-md flex items-center'>
            <div className='text-danger text-2xl'>
                <BsExclamationTriangle />
            </div>
            <div>
                <p className='text-danger font-bold'>Something went wrong</p>
                <p className='text-danger text-small'>{submitError}</p>
            </div>
        </div>
    }

    const submitSuccessComp = <div className='bg-success-50 border border-success-200 gap-unit-md rounded-medium p-unit-md flex items-center'>
        <div className='text-success text-2xl'>
            <BsCheck />
        </div>
        <div>
            <p className='text-success font-bold'>Success</p>
            <p className='text-success text-small'>Message template saved</p>
        </div>
    </div>

    const currentTranslatedContent = emailTemplateConfig.translations.find(t => t.lang === selectedLanguage);

    return (
        <form
            className='w-full'
            onSubmit={(event) => {
                event.preventDefault();
                setSubmitError('');
                setSubmitSuccess(false);
                startTransition(async () => {
                    try {
                        await uploadMessageTemplate(emailTemplateConfig);
                        router.refresh();
                        setSubmitSuccess(true);
                        if (!props.emailTemplateConfig) {
                            router.replace('/tools/messaging/custom-messages');
                        }
                    } catch (error: any) {
                        console.error(error);
                        setSubmitError(error.message);
                    }

                })
            }}
        >
            <h2 className="font-bold text-2xl mb-unit-sm flex items-start">
                <span className='grow'>
                    {props.emailTemplateConfig ? 'Edit edit template' : 'New template'}
                </span>
                {(props.emailTemplateConfig && !props.isSystemTemplate) && (
                    <Button
                        type='button'
                        variant='light'
                        color='danger'
                        size='sm'
                        isDisabled={isPending}
                        onPress={() => {
                            if (confirm('Are you sure you want to delete this message template?')) {
                                if (!emailTemplateConfig || !emailTemplateConfig.id) return;

                                startTransition(async () => {
                                    try {
                                        await deleteMessageTemplate(
                                            emailTemplateConfig.messageType,
                                            emailTemplateConfig.studyKey ?? '');
                                        router.refresh();
                                        router.replace('/tools/messaging/custom-messages');
                                    } catch (error: any) {
                                        console.error(error);
                                        setSubmitError(`Failed to delete schedule: ${error.message}`);
                                    }
                                })
                            }
                        }}

                    >Delete template</Button>
                )}
            </h2>
            {errorComp}

            <TwoColumnsWithCards
                label="Message settings"
                description="General settings for the message."
            >
                <div className='flex flex-col gap-unit-md'>
                    <Input
                        label='Message type'
                        isReadOnly={props.emailTemplateConfig !== undefined}
                        placeholder='Enter the message type'
                        isRequired
                        value={emailTemplateConfig.messageType ?? ''}
                        onValueChange={(value) => {
                            setEmailTemplateConfig((s) => {
                                const newEmailTemplateConfig = { ...s };
                                newEmailTemplateConfig.messageType = value;
                                return newEmailTemplateConfig;
                            })
                        }}
                        variant='bordered'
                        labelPlacement='outside'
                        description={!props.isSystemTemplate && 'This message type will be used to identify the message in the system, e.g. "T3_reminder". Cannot be changed later.'}
                    />

                    {!props.isSystemTemplate && (
                        <Input
                            label='Study key (Optional)'
                            placeholder='Enter a study key'
                            isReadOnly={props.emailTemplateConfig !== undefined}
                            value={emailTemplateConfig.studyKey ?? ''}
                            onValueChange={(value) => {
                                setEmailTemplateConfig((s) => {
                                    const newEmailTemplateConfig = { ...s };
                                    newEmailTemplateConfig.studyKey = value;
                                    return newEmailTemplateConfig;
                                })
                            }}
                            variant='bordered'
                            labelPlacement='outside'
                            description='Assign this message to a study if you want to use it in a study, to avoid name (message type) collisions. Cannot be changed later.'
                        />)}
                    <Divider />
                    <div className=''>
                        <Switch
                            isSelected={emailTemplateConfig.headerOverrides !== undefined}
                            onValueChange={(value) => {
                                if (!value && emailTemplateConfig.headerOverrides !== undefined && (
                                    emailTemplateConfig.headerOverrides.from ||
                                    (emailTemplateConfig.headerOverrides.replyTo && emailTemplateConfig.headerOverrides.replyTo.length > 0) ||
                                    emailTemplateConfig.headerOverrides.sender
                                )) {
                                    if (!confirm('Are you sure you want to remove the email header overrides?')) {
                                        return;
                                    }
                                }
                                setEmailTemplateConfig((s) => {
                                    const newTemplateConfig = { ...s };
                                    if (value) {
                                        newTemplateConfig.headerOverrides = {
                                            from: '',
                                            replyTo: [],
                                            noReplyTo: false,
                                            sender: '',
                                        }
                                    } else {
                                        newTemplateConfig.headerOverrides = undefined;
                                    }
                                    return newTemplateConfig;
                                })
                            }}
                        >
                            Override email headers
                        </Switch>
                        <p className='text-tiny text-default-400'>
                            Override the email headers for this message. This will override the default headers set in the email server configuration.
                        </p>
                        <div
                            className={clsx('flex flex-col gap-unit-md mt-unit-md p-unit-md border border-default-200 rounded-medium',
                                {
                                    'hidden bg-default-100 opacity-50': !emailTemplateConfig.headerOverrides
                                }
                            )}
                        >
                            <Input
                                type='text'
                                label='From'
                                placeholder='Enter from'
                                description='This will appear as the sender of the email. E.g. "Name <email@comp.tld" or simply "email@comp.tld"'
                                value={emailTemplateConfig.headerOverrides?.from ?? ''}
                                onValueChange={(value) => {
                                    setEmailTemplateConfig((s) => {
                                        const newTemplateConfig = { ...s };
                                        if (newTemplateConfig.headerOverrides) {
                                            newTemplateConfig.headerOverrides.from = value;
                                        }
                                        return newTemplateConfig;
                                    })
                                }}
                                variant='flat'
                                labelPlacement='outside'
                                disabled={!emailTemplateConfig.headerOverrides}
                            />

                            <Input
                                type='text'
                                label='Sender'
                                placeholder='Enter sender'
                                description='This email address will be used for the email server as a sender.'
                                value={emailTemplateConfig.headerOverrides?.sender ?? ''}
                                onValueChange={(value) => {
                                    setEmailTemplateConfig((s) => {
                                        const newTemplateConfig = { ...s };
                                        if (newTemplateConfig.headerOverrides) {
                                            newTemplateConfig.headerOverrides.sender = value;
                                        }
                                        return newTemplateConfig;
                                    })
                                }}
                                variant='flat'
                                labelPlacement='outside'
                                disabled={!emailTemplateConfig.headerOverrides}
                            />

                            <Input
                                type='text'
                                label='Reply to'
                                placeholder='Enter reply to'
                                description='List of email addresses that will be used as reply to addresses. Comma separated.'
                                value={emailTemplateConfig.headerOverrides?.replyTo?.join(',') ?? ''}
                                onValueChange={(value) => {
                                    setEmailTemplateConfig((s) => {
                                        const newTemplateConfig = { ...s };
                                        if (newTemplateConfig.headerOverrides) {
                                            newTemplateConfig.headerOverrides.replyTo = value.split(',').map(v => v.trim());
                                        }
                                        return newTemplateConfig;
                                    })
                                }}
                                variant='flat'
                                labelPlacement='outside'
                                disabled={!emailTemplateConfig.headerOverrides}
                            />

                            <Checkbox
                                isSelected={emailTemplateConfig.headerOverrides?.noReplyTo ?? false}
                                onValueChange={(value) => {
                                    setEmailTemplateConfig((s) => {
                                        const newTemplateConfig = { ...s };
                                        if (newTemplateConfig.headerOverrides) {
                                            newTemplateConfig.headerOverrides.noReplyTo = value;
                                        }
                                        return newTemplateConfig;
                                    })
                                }}
                            >
                                {'Mark this address with "no-reply"'}
                            </Checkbox>
                        </div>
                    </div>
                </div>
            </TwoColumnsWithCards>

            <Divider />

            <TwoColumnsWithCards

                label="Content"
                description="Set subject and content of the message for each language."
            >
                <div className='flex flex-col gap-unit-md'>
                    <div className='flex justify-end'>
                        <LanguageSelector
                            onLanguageChange={setSelectedLanguage}
                            showBadgeForLanguages={checkMissingTranslations(emailTemplateConfig)}
                        />

                    </div>
                    <Input
                        type='text'
                        label='Subject'
                        placeholder='Enter subject'
                        value={currentTranslatedContent?.subject ?? ''}
                        onValueChange={(value) => {
                            setEmailTemplateConfig((s) => {
                                const newEmailTemplateConfig = { ...s };
                                const translation = newEmailTemplateConfig.translations.find(t => t.lang === selectedLanguage);
                                if (translation) {
                                    translation.subject = value;
                                } else {
                                    newEmailTemplateConfig.translations.push({
                                        lang: selectedLanguage,
                                        subject: value,
                                        templateDef: '',
                                    })
                                }
                                return newEmailTemplateConfig;
                            })
                        }}
                        variant='bordered'
                        labelPlacement='outside'

                    />

                    <Filepicker
                        label='Pick a new file to replace/set the current template'
                        id='template-upload'
                        accept={{
                            'application/html': ['.html'],
                        }}
                        onChange={(files) => {
                            if (files.length > 0) {
                                // read file as a json
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const text = e.target?.result;
                                    if (typeof text === 'string') {

                                        const encodedTemplate = encodeTemplate(text);
                                        if (!encodedTemplate) {
                                            setSubmitError('Failed to encode template');
                                            return;
                                        }

                                        setEmailTemplateConfig((s) => {
                                            const newEmailTemplateConfig = { ...s };
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
                                            return newEmailTemplateConfig;
                                        })
                                    }
                                }
                                reader.readAsText(files[0]);
                            }
                        }}
                    />

                    <div>
                        <div className='flex flex-col w-full max-w-full h-[566px]'>
                            <Tabs aria-label="Preview mode" color="default" variant="solid">
                                <Tab
                                    key="source"
                                    title={
                                        <div className="flex items-center space-x-2">
                                            <BsFileEarmarkCode />
                                            <span>Source</span>
                                        </div>
                                    }
                                >
                                    <Code
                                        className='h-[500px] w-full max-w-full overflow-x-scroll'
                                    >
                                        <ScrollShadow
                                            className='h-full'
                                            size={60}
                                        >
                                            {emailPreviewDocSrc ? <>{emailPreviewDocSrc.split('\n').map(
                                                (line, i) => {
                                                    let tabCount = 0;
                                                    let spaceCount = 0;
                                                    const tabMatcher = line.match(/^\t*/);
                                                    if (tabMatcher && tabMatcher.length > 0) {
                                                        tabCount = (tabMatcher[0] || '').length;
                                                    }
                                                    const spaceMatcher = line.match(/^\s*/);
                                                    if (spaceMatcher && spaceMatcher.length > 0) {
                                                        spaceCount = (spaceMatcher[0] || '').length;
                                                    }
                                                    return <div key={i} className='flex items-center'>
                                                        <span className='text-default-400 text-small w-6 mr-unit-sm'>{i + 1}</span>
                                                        <span style={{ width: tabCount * 8 }}></span>
                                                        <span style={{ width: spaceCount * 2 }}></span>
                                                        {line}
                                                    </div>
                                                }
                                            )}</> : <div className='flex flex-col items-center justify-center h-full'>
                                                <p className='font-bold text-large text-warning'>No template</p>
                                                <BsExclamationCircle className='mt-unit-sm text-4xl text-warning-300' />
                                            </div>}
                                        </ScrollShadow>
                                    </Code>

                                </Tab>
                                <Tab
                                    key="preview"
                                    title={
                                        <div className="flex items-center space-x-2">

                                            <span>
                                                <BsFiletypeHtml className='mr-unit-sm text-default-500' />
                                            </span>
                                            Email preview
                                        </div>
                                    }
                                >
                                    <div className='border border-dashed border-deafult-200 rounded-medium'>
                                        {emailPreviewDocSrc ?
                                            <iframe
                                                src={`data:text/html;charset=UTF-8,${encodeURIComponent(emailPreviewDocSrc)}`}
                                                style={{ width: '100%', height: '500px' }}
                                                title="Email template preview"
                                            /> : <div className='flex flex-col items-center justify-center h-[500px]'>
                                                <p className='font-bold text-large text-warning'>No template</p>
                                                <BsExclamationCircle className='mt-unit-sm text-4xl text-warning-300' />
                                            </div>}
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </TwoColumnsWithCards>


            <Divider />

            <div className='mt-unit-lg flex flex-col gap-unit-lg'>
                {errorComp}
                {submitSuccess && submitSuccessComp}
                <div className="flex justify-end gap-unit-md pb-unit-lg ">
                    <Button
                        type='submit'
                        color='primary'
                        size='lg'
                        isDisabled={!emailTemplateConfig || !emailTemplateConfig.translations || emailTemplateConfig.translations.length === 0}
                        isLoading={isPending}
                    >
                        {props.emailTemplateConfig ? 'Save changes' : 'Create message template'}
                    </Button>
                    {!props.isSystemTemplate && (
                        <Button
                            type='button'
                            color='danger'
                            variant='ghost'
                            isDisabled={isPending}
                            size='lg'
                            onPress={() => {
                                router.back();
                            }}
                        >
                            Cancel
                        </Button>)}
                </div>

            </div >
        </form >
    );
};

export default EmailTemplateConfigurator;

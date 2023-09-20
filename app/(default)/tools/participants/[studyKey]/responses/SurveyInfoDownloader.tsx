'use client'

import LanguageSelector from '@/components/LanguageSelector';
import React from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '@nextui-org/card';
import { Button, Checkbox, Divider, Select, SelectItem } from '@nextui-org/react';
import { BsDownload } from 'react-icons/bs';
import ErrorOrSuccessInlineAlert from '../../../../../../components/ErrorOrSuccessInlineAlert';

interface SurveyInfoDownloaderProps {
    studyKey: string;
    availableSurveys: string[];
}

const SurveyInfoDownloader: React.FC<SurveyInfoDownloaderProps> = (props) => {
    const [selectedSurveyKey, setSelectedSurveyKey] = React.useState<string>(props.availableSurveys[0] || '');
    const [exportFormat, setExportFormat] = React.useState<string>('json');
    const [language, setLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');
    const [useShortKeys, setUseShortKeys] = React.useState<boolean>(false);
    const [isPending, startTransition] = React.useTransition();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = React.useState<string | undefined>(undefined);


    let cardContent = null;
    if (props.availableSurveys.length === 0) {
        cardContent = (<>
            <div>No surveys available in this study</div>
        </>
        )
    } else {
        cardContent = (<fieldset>
            <p className='text-tiny text-default-600 p-unit-sm bg-primary-50 rounded-small mb-unit-md'>
                Download the history of the survey structure in a CSV or JSON format. This can be helpful when interpreting the response data.
            </p>


            <Select
                id='survey-key-for-survey-info-downloader'
                label='Survey key'
                labelPlacement='outside'
                variant='bordered'
                placeholder='Select a survey'
                classNames={{
                    trigger: 'bg-white'
                }}
                description='Download survey info for this survey.'
                selectedKeys={new Set([selectedSurveyKey || ''])}
                onSelectionChange={(keys: Set<React.Key> | 'all') => {
                    const selectedKey = (keys as Set<React.Key>).values().next().value;
                    if (!selectedKey) return;
                    setSelectedSurveyKey(selectedKey as string);
                }}
            >
                {
                    props.availableSurveys.map((surveyKey) => {
                        return (
                            <SelectItem
                                key={surveyKey}
                                value={surveyKey}
                            >
                                {surveyKey}
                            </SelectItem>
                        );
                    })
                }
            </Select>

            <Select
                id='export-format-for-survey-info-downloader'
                label='Export format'
                labelPlacement='outside'
                variant='bordered'
                placeholder='Select a format'
                classNames={{
                    trigger: 'bg-white'
                }}
                description='Select the format for the downloaded file.'
                selectedKeys={new Set([exportFormat || ''])}
                onSelectionChange={(keys: Set<React.Key> | 'all') => {
                    const selectedKey = (keys as Set<React.Key>).values().next().value;
                    if (!selectedKey) return;
                    setExportFormat(selectedKey as string);
                }}
            >
                <SelectItem
                    key='json'
                    value='json'
                >
                    JSON
                </SelectItem>
                <SelectItem
                    key='csv'
                    value='csv'
                >
                    CSV
                </SelectItem>
            </Select>

            <div className=''>
                <LanguageSelector onLanguageChange={(l) =>
                    setLanguage(l)
                } />
            </div>
            <div className='mt-unit-md'>
                <Checkbox
                    id='use-short-keys-for-survey-info-downloader'
                    isSelected={useShortKeys}
                    onValueChange={(v) => setUseShortKeys(v)}
                >
                    <span className=''>Use short keys</span>
                </Checkbox>
            </div>
        </fieldset>
        )
    }

    return (
        <div>
            <Card
                fullWidth={false}
                className="bg-white/60"
                isBlurred
                isFooterBlurred
            >
                <CardHeader className="bg-content2">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center">
                            Survey info downloader
                        </h2>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="bg-white">
                    {cardContent}
                    <ErrorOrSuccessInlineAlert
                        errorMsg={errorMsg}
                        successMsg={successMsg}
                    />
                </CardBody>
                <Divider />
                <CardFooter className='flex justify-end'>
                    <Button
                        variant="flat"
                        color="primary"
                        isLoading={isPending}
                        startContent={<BsDownload />}
                        isDisabled={props.availableSurveys.length === 0 || !selectedSurveyKey}
                        onPress={async () => {
                            setErrorMsg(undefined);
                            setSuccessMsg(undefined);
                            if (!selectedSurveyKey) {
                                setErrorMsg('Please select a survey key.');
                                return;
                            }
                            startTransition(async () => {
                                const resp = await fetch(`/api/case-management-api/v1/data/${props.studyKey}/survey/${selectedSurveyKey}/survey-info${exportFormat === 'csv' ? '/csv' : ''}?lang=${language}&shortKeys=${useShortKeys}`)
                                if (resp.status !== 200) {
                                    const err = await resp.json();
                                    setErrorMsg(err.error);
                                    return;
                                }
                                const blob = await resp.blob();
                                const fileName = resp.headers.get('Content-Disposition')?.split('filename=')[1];
                                const link = document.createElement('a');
                                link.href = window.URL.createObjectURL(blob);
                                link.download = (fileName || `${selectedSurveyKey}_info.${exportFormat}`).replaceAll('"', '');
                                link.click();
                                setSuccessMsg('Download successful.');
                            });
                        }}
                    >
                        Get survey info
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SurveyInfoDownloader;

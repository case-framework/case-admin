'use client';

import { addMonths, format } from 'date-fns';
import React from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '@nextui-org/card';
import { Button, Checkbox, Divider, Input, Select, SelectItem } from '@nextui-org/react';
import { BsDownload, BsFiletypeCsv, BsFiletypeJson } from 'react-icons/bs';
import ErrorOrSuccessInlineAlert from '../../../../../../components/ErrorOrSuccessInlineAlert';


interface ResponseDownloaderProps {
    studyKey: string;
    availableSurveys: string[];
}

const dateToInputStr = (date: Date) => {
    return format(date, 'yyyy-MM-dd\'T\'HH:mm')
}

const ResponseDownloader: React.FC<ResponseDownloaderProps> = (props) => {
    const [selectedSurveyKey, setSelectedSurveyKey] = React.useState<string>(props.availableSurveys[0] || '');
    const [exportFormat, setExportFormat] = React.useState<'long' | 'wide' | 'json'>('wide');
    const [keySeparator, setKeySeparator] = React.useState<string>('-');
    const [queryStartDate, setQueryStartDate] = React.useState<Date>(addMonths(new Date(), -1));
    const [queryEndDate, setQueryEndDate] = React.useState<Date>(new Date());
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
        cardContent = (<fieldset className='flex flex-col'>

            <Select
                id='survey-key-for-response-downloader'
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
                id='export-format-for-responses-downloader'
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
                    setExportFormat(selectedKey as 'long' | 'wide' | 'json');
                }}
            >
                <SelectItem
                    key='wide'
                    value='wide'
                    startContent={<BsFiletypeCsv className='text-2xl text-default-500' />}
                >
                    CSV (wide)
                </SelectItem>
                <SelectItem
                    key='long'
                    value='long'
                    startContent={<BsFiletypeCsv className='text-2xl text-default-500' />}
                >
                    CSV (long)
                </SelectItem>
                <SelectItem
                    key='json'
                    value='json'
                    startContent={<BsFiletypeJson className='text-2xl text-default-500' />}
                >
                    JSON
                </SelectItem>
            </Select>

            <Input
                id='key-separator-for-survey-responses-downloader'
                type='text'
                label='Key separator'
                labelPlacement='outside'
                variant='bordered'
                placeholder='Enter a key separator'
                description='This character will be used to separate parts the slot keys in the output.'
                value={keySeparator}
                maxLength={1}
                onValueChange={(v) => {
                    setKeySeparator(v);
                }}
            />

            <div className='flex gap-unit-md py-unit-md'>
                <Input
                    id='query-start-date-for-survey-responses-downloader'
                    type='datetime-local'
                    label='From'
                    labelPlacement='outside'
                    variant='bordered'
                    placeholder='Select a date'
                    description='Download responses from this date.'
                    value={dateToInputStr(queryStartDate)}
                    onValueChange={(v) => {
                        setQueryStartDate(new Date(v));
                    }}
                />
                <Input
                    id='query-end-date-for-survey-responses-downloader'
                    type='datetime-local'
                    label='Until'
                    labelPlacement='outside'
                    variant='bordered'
                    placeholder='Select a date'
                    description='Download responses until this date.'
                    value={dateToInputStr(queryEndDate)}
                    onValueChange={(v) => {
                        setQueryEndDate(new Date(v));
                    }}
                />

            </div>
            <div className=''>
                <Checkbox
                    id='use-short-keys-for-survey-responses-downloader'
                    isSelected={useShortKeys}
                    onValueChange={(v) => setUseShortKeys(v)}
                >
                    <span className=''>Use short keys</span>
                </Checkbox>
            </div>
        </fieldset>)
    }

    return (
        <Card
            fullWidth={false}
            className="bg-white/60"
            isBlurred
            isFooterBlurred
        >
            <CardHeader className="bg-content2">
                <div>
                    <h2 className="text-2xl font-bold flex items-center">
                        Response downloader
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
                        startTransition(async () => {
                            try {
                                const resp = await fetch(`/api/data/responses?studyKey=${props.studyKey}&surveyKey=${selectedSurveyKey}&from=${Math.round(queryStartDate.getTime() / 1000)}&until=${Math.round(queryEndDate.getTime() / 1000)}&format=${exportFormat}&keySeparator=${keySeparator}&useShortKeys=${useShortKeys}`)
                                if (resp.status !== 200) {
                                    const err = await resp.json();
                                    setErrorMsg(err.error);
                                    //setErrorMsg(await resp.text());
                                    return;
                                }
                                const blob = await resp.blob();
                                const fileName = resp.headers.get('Content-Disposition')?.split('filename=')[1];
                                const link = document.createElement('a');
                                link.href = window.URL.createObjectURL(blob);
                                link.download = (fileName || 'responses.csv').replaceAll('"', '');
                                link.click();
                                setSuccessMsg('Downloaded successfully.');
                            } catch (e: any) {
                                console.log(e)
                                setErrorMsg(e.message);
                            }
                        })
                    }}
                >
                    Get responses
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ResponseDownloader;

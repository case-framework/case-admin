'use client';

import ErrorOrSuccessInlineAlert from '@/components/ErrorOrSuccessInlineAlert';
import { Button, Card, CardBody, CardFooter, CardHeader, Code, Divider, Input, ScrollShadow } from '@nextui-org/react';
import { addMonths, format } from 'date-fns';
import React from 'react';
import { BsCardList, BsCloudArrowDown, BsDownload, BsFilter, BsInfoCircle } from 'react-icons/bs';

interface ReportsDownloaderProps {
    studyKey: string;
}

const dateToInputStr = (date: Date) => {
    return format(date, 'yyyy-MM-dd\'T\'HH:mm')
}

const ReportsDownloader: React.FC<ReportsDownloaderProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = React.useState<string | undefined>(undefined);
    const [reports, setReports] = React.useState<any[]>([]);

    const [reportKeyFilter, setReportKeyFilter] = React.useState<string>('');
    const [participantID, setParticipantID] = React.useState<string>('');
    const [queryStartDate, setQueryStartDate] = React.useState<Date>(addMonths(new Date(), -1));
    const [queryEndDate, setQueryEndDate] = React.useState<Date>(new Date());

    const queryCard = <Card>
        <CardHeader className='bg-content2'>
            <h3 className='text-lg font-bold flex items-center'>
                <span className='text-default-400 text-2xl mr-unit-md'>
                    <BsFilter />
                </span>
                Query
            </h3>
        </CardHeader>
        <Divider />
        <CardBody>
            <fieldset className='flex flex-col gap-unit-md'>
                <Input
                    id='report-key-for-report-downloader'
                    label='Report key (optional)'
                    labelPlacement='outside'
                    variant='bordered'
                    placeholder='Enter a report key'
                    description='Enter a report key to query. If left empty all reports will be returned.'
                    value={reportKeyFilter}
                    onValueChange={(v) => {
                        setReportKeyFilter(v);
                    }}
                />
                <div className='flex gap-unit-md'>
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

                <Input
                    id='participant-id-for-report-downloader'
                    label='Participant ID (optional)'
                    labelPlacement='outside'
                    variant='bordered'
                    placeholder='Enter a participant ID'
                    description='Return only reports for a specific participant. If left empty all reports will be returned.'
                    value={participantID}
                    onValueChange={(v) => {
                        setParticipantID(v);
                    }}
                />

                <ErrorOrSuccessInlineAlert
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />
            </fieldset>
        </CardBody>
        <Divider />
        <CardFooter className='flex justify-end'>
            <Button
                variant="flat"
                color="primary"
                isLoading={isPending}
                startContent={<BsCloudArrowDown />}
                onPress={async () => {
                    setErrorMsg(undefined);
                    setSuccessMsg(undefined);
                    startTransition(async () => {
                        try {
                            let searchParams = new URLSearchParams();
                            if (reportKeyFilter) {
                                searchParams.append('reportKey', reportKeyFilter);
                            }
                            if (participantID) {
                                searchParams.append('participantId', participantID);
                            }

                            searchParams.append('from', `${Math.round(queryStartDate.getTime() / 1000)}`);
                            searchParams.append('until', `${Math.round(queryEndDate.getTime() / 1000)}`);


                            const resp = await fetch(
                                `/api/case-management-api/v1/data/${props.studyKey}/reports${searchParams.toString() ? '?' + searchParams.toString() : ''}`,
                                {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    next: {
                                        revalidate: 10
                                    }
                                }
                            )
                            if (resp.status !== 200) {
                                const err = await resp.json();
                                setErrorMsg(err.error);
                                return;
                            }
                            const data = await resp.json();
                            if (!data.reports) {
                                setErrorMsg('No reports found.');
                                return;
                            }


                            setReports(data.reports);
                            setSuccessMsg('Downloaded successfully.');
                            console.log(data);

                        } catch (err: any) {
                            setErrorMsg(err.message);
                        }
                    });
                }}
            >
                Get reports
            </Button>
        </CardFooter>
    </Card>


    const outputCard = <Card>
        <CardHeader className='bg-content2'>
            <h3 className='text-lg font-bold flex items-center'>
                <span className='text-default-400 text-2xl mr-unit-md'>
                    <BsCardList />
                </span>
                Output
            </h3>
        </CardHeader>
        <Divider />
        <CardBody>
            <div className='flex flex-col gap-unit-md'>
                <p className='text-small'>Run the query above to update the output.</p>
                <Code
                    className='h-[400px] w-full max-w-full overflow-x-scroll'
                >
                    <ScrollShadow
                        className='h-full'
                        size={60}
                    >
                        {JSON.stringify(reports, null, 2).split('\n').map(
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
                                    <span style={{ width: spaceCount * 4 }}></span>
                                    {line}
                                </div>
                            }
                        )}
                    </ScrollShadow>
                </Code>



            </div>
        </CardBody>
        <Divider />
        <CardFooter className='flex justify-end'>
            <Button
                variant="flat"
                color="primary"
                isLoading={isPending}
                startContent={<BsDownload />}
                onPress={async () => {
                    const blob = new Blob([JSON.stringify(reports)], { type: 'application/json' });
                    const fileName = `${props.studyKey}_reports.json`
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = (fileName).replaceAll('"', '');
                    link.click();

                }}
            >
                Save to disk
            </Button>
        </CardFooter>
    </Card>

    return (
        <Card
            fullWidth={false}
            className="bg-white/60 min-w-[400px]"
            isBlurred
            isFooterBlurred
        >
            <CardHeader className="bg-content2">
                <div>
                    <h2 className="text-2xl font-bold flex items-center">
                        Participant report downloader
                    </h2>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-unit-md">
                <p className='text-small text-default-600 p-unit-sm bg-primary-50 rounded-small flex items-center'>
                    <span className='inline-block text-2xl mr-unit-sm text-primary'>
                        <BsInfoCircle />
                    </span>
                    Participant reports are generated by certain study rules if present in the study configuration. If they are used, you can query and download participants reports here.
                </p>


                {queryCard}
                {outputCard}
            </CardBody>
        </Card>
    );
};

export default ReportsDownloader;

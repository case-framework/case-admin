'use client';

import ErrorOrSuccessInlineAlert from '@/components/ErrorOrSuccessInlineAlert';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Switch, Textarea } from '@nextui-org/react';
import React from 'react';
import { BsDownload, BsExclamationTriangle } from 'react-icons/bs';
import { ResponseItem, SurveySingleItemResponse } from 'survey-engine/data_types';

interface ConfidentialResponseDownloaderProps {
    studyKey: string;
}

const conditionForActiveParticipants = {
    "name": "hasStudyStatus",
    "data": [
        {
            "dtype": "str",
            "str": "active"
        }
    ]
}

const dummyCondition = {
    "name": "gt",
    "data": [
        {
            "dtype": "num",
            "num": 1
        },
        {
            "dtype": "num",
            "num": 0
        }
    ]
}

const parseSlot = (responseItem: ResponseItem, parentKey: string, hasSiblings?: boolean) => {
    let slotResponses: {
        [key: string]: string;
    } = {};

    const currentKey = `${parentKey}${responseItem.key}`;
    if (!responseItem.items) {
        if (responseItem.value) {
            slotResponses[currentKey] = responseItem.value;
        } else {
            if (hasSiblings) {
                slotResponses[currentKey] = 'TRUE';
            } else {
                slotResponses[parentKey.substring(0, parentKey.length - 1)] = responseItem.key;
            }
        }
        return slotResponses;
    }
    const hasMoreChildren = responseItem.items?.length > 1;
    responseItem.items.forEach((item) => {

        const newSlotes = parseSlot(item, `${currentKey}.`, hasMoreChildren);
        slotResponses = {
            ...slotResponses,
            ...newSlotes,
        }
    })
    return slotResponses;
}



const parseSingleConfidentialResponse = (response: SurveySingleItemResponse) => {
    const itemKey = response.key;
    let slotResponses = {};
    if (!response.response) {
        return slotResponses;
    }
    const slotKey = `${itemKey}-`;
    const newSlots = parseSlot(response.response, slotKey);
    slotResponses = {
        ...slotResponses,
        ...newSlots,
    }
    return slotResponses;
}


const parseConfidentialResponses = (responses: Array<{
    key: string;
    participantId: string;
    responses: SurveySingleItemResponse[];
}>) => {
    return responses.map((response) => {
        let obj = {
            participantId: response.participantId,
        }
        response.responses.forEach((r) => {
            const parsed = parseSingleConfidentialResponse(r);
            obj = {
                ...obj,
                ...parsed,
            }
        })
        return obj;
    })
}


const ConfidentialResponseDownloader: React.FC<ConfidentialResponseDownloaderProps> = (props) => {
    const [participantIds, setParticipantIds] = React.useState<string[]>([]);
    const [onlyForActiveParticipants, setOnlyForActiveParticipants] = React.useState(true);
    const [isPending, startTransition] = React.useTransition();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = React.useState<string | undefined>(undefined);

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
                        Confidential response downloader
                    </h2>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="bg-white">
                <p className='text-small text-default-600 p-unit-sm bg-warning-50 rounded-small flex items-center'>
                    <BsExclamationTriangle className='inline-block mr-unit-sm' />
                    These responses are not stored together with the other responses for improved privacy protection. Please handle these responses with care.
                </p>
                <fieldset className='flex flex-col gap-unit-md mt-unit-md'>

                    <Textarea
                        id='participant-ids-for-confidential-responses-downloader'
                        label='Participant IDs'
                        labelPlacement='outside'
                        variant='bordered'
                        placeholder='Enter participant IDs'
                        description='Enter participant IDs, one per line.'
                        // value={participantIds.join('\n')}
                        isMultiline
                        onValueChange={(v) => {
                            setParticipantIds(v.split('\n').map((s) => s.trim()).filter((s) => s.length > 0));
                        }}
                    />

                    <Switch
                        id='only-for-active-participants-for-confidential-responses-downloader'
                        isSelected={onlyForActiveParticipants}
                        onValueChange={(v) => setOnlyForActiveParticipants(v)}
                    >
                        {onlyForActiveParticipants ? 'Only if participant is currently active' : 'Ignoring participant status'}
                    </Switch>



                </fieldset>
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
                    isDisabled={participantIds.length < 1}
                    onPress={async () => {
                        setErrorMsg(undefined);
                        setSuccessMsg(undefined);
                        if (participantIds.length < 1) {
                            setErrorMsg('Please enter at least one participant id.');
                            return;
                        }
                        startTransition(async () => {
                            try {
                                const resp = await fetch(`/api/case-management-api/v1/data/${props.studyKey}/fetch-confidential-responses`,
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            participantIds: participantIds,
                                            keyFilter: '',
                                            condition: onlyForActiveParticipants ? conditionForActiveParticipants : dummyCondition
                                        }),
                                        next: {
                                            revalidate: 10
                                        }
                                    }
                                )


                                if (resp.status !== 200) {
                                    const err = await resp.json();
                                    setErrorMsg(err.error);
                                    //setErrorMsg(await resp.text());
                                    return;
                                }
                                const data = await resp.json();
                                if (!data.responses) {
                                    setErrorMsg('No responses found.');
                                    return;
                                }
                                const result = parseConfidentialResponses(data.responses);

                                const blob = new Blob([JSON.stringify(result)], { type: 'application/json' });
                                const fileName = `${props.studyKey}_confidential_responses.json`
                                const link = document.createElement('a');
                                link.href = window.URL.createObjectURL(blob);
                                link.download = (fileName).replaceAll('"', '');
                                link.click();
                                setSuccessMsg('Downloaded successfully.');
                            } catch (err: any) {
                                setErrorMsg(err.message);
                            }
                        });
                    }}
                >
                    Get confidential responses
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ConfidentialResponseDownloader;

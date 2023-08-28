'use client'

import AvatarFromId from '@/components/AvatarFromID';
import { ParticipantState } from '@/utils/server/types/participantState';
import { Card, CardBody, Chip, Divider, Snippet, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';

import React from 'react';
import { BsActivity, BsBookmarks, BsBoxArrowInRight, BsEnvelopePaper, BsFileEarmarkMedical, BsPerson, BsPersonVcard } from 'react-icons/bs';

interface ParticipantDetailsProps {
    participant?: ParticipantState;
}



const ParticipantDetails: React.FC<ParticipantDetailsProps> = (props) => {
    console.log(props.participant?.messages)
    const flagsTable = React.useMemo(() => {
        if (!props.participant) return <></>;

        const flags = props.participant.flags ? Object.entries(props.participant.flags) : [];

        return (
            <Table
                isStriped
                isCompact
                aria-label='participant flags'
                classNames={{
                    emptyWrapper: 'h-16 text-small'
                }}
            >
                <TableHeader>
                    <TableColumn

                    >
                        KEY
                    </TableColumn>
                    <TableColumn

                    >
                        VALUE
                    </TableColumn>
                </TableHeader>
                <TableBody items={flags}
                    emptyContent='No flags'
                >
                    {(flag) => (
                        <TableRow key={flag[0]}>
                            <TableCell>
                                {flag[0]}
                            </TableCell>
                            <TableCell>
                                {flag.length > 1 ? flag[1] : ''}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        );
    }, [props.participant]);

    const assignedSurveysTable = React.useMemo(() => {
        if (!props.participant) return <></>;

        const assignedSurveys = props.participant.assignedSurveys ? props.participant.assignedSurveys.map((s, index) => {
            return {
                key: index,
                ...s,
            }
        }) : [];

        return (
            <Table
                isStriped
                isCompact
                aria-label='participant assigned surveys'
                classNames={{
                    emptyWrapper: 'h-16 text-small'
                }}
            >
                <TableHeader>
                    <TableColumn>
                        SURVEY KEY
                    </TableColumn>
                    <TableColumn>
                        CATEGORY
                    </TableColumn>
                    <TableColumn>
                        FROM
                    </TableColumn>
                    <TableColumn>
                        UNTIL
                    </TableColumn>
                </TableHeader>
                <TableBody items={assignedSurveys}
                    emptyContent='No assigned surveys'
                >
                    {(survey) => {
                        let from = '';
                        if (survey.validFrom) {
                            const date = new Date(survey.validFrom * 1000);
                            from = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                        }

                        let until = '';
                        if (survey.validUntil) {
                            const date = new Date(survey.validUntil * 1000);
                            until = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                        }

                        return (
                            <TableRow key={survey.key}>
                                <TableCell>
                                    {survey.surveyKey}
                                </TableCell>
                                <TableCell>
                                    {survey.category}
                                </TableCell>
                                <TableCell>
                                    {from}
                                </TableCell>
                                <TableCell>
                                    {until}
                                </TableCell>
                            </TableRow>
                        )
                    }}
                </TableBody>
            </Table>
        );
    }, [props.participant]);

    const lastSubmissionsTable = React.useMemo(() => {
        if (!props.participant) return <></>;

        const lastSubmissions = props.participant.lastSubmissions ? Object.entries(props.participant.lastSubmissions) : [];

        return (
            <Table
                isStriped
                isCompact
                aria-label='participant last submissions'
                classNames={{
                    emptyWrapper: 'h-16 text-small'
                }}
            >
                <TableHeader>
                    <TableColumn

                    >
                        SURVEY
                    </TableColumn>
                    <TableColumn

                    >
                        DATE
                    </TableColumn>
                </TableHeader>
                <TableBody items={lastSubmissions}
                    emptyContent='No submissions'
                >
                    {(submission) => {
                        let value = '';
                        if (submission.length > 1) {
                            const date = new Date(submission[1] * 1000);
                            value = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                        }
                        return (
                            <TableRow key={submission[0]}>
                                <TableCell>
                                    {submission[0]}
                                </TableCell>
                                <TableCell>
                                    {value}
                                </TableCell>
                            </TableRow>
                        )
                    }}
                </TableBody>
            </Table>
        );
    }, [props.participant]);

    const scheduledMessagesTable = React.useMemo(() => {
        if (!props.participant) return <></>;

        const scheduledMessages = props.participant.messages ? props.participant.messages : [];

        return (
            <Table
                isStriped
                isCompact
                aria-label='participant scheduled messages'
                classNames={{
                    emptyWrapper: 'h-16 text-small'
                }}
            >
                <TableHeader>
                    <TableColumn

                    >
                        MESSAGE TYPE
                    </TableColumn>
                    <TableColumn

                    >
                        DUE
                    </TableColumn>
                </TableHeader>
                <TableBody items={scheduledMessages}
                    emptyContent='No scheduled messages'
                >
                    {(message) => {


                        const date = new Date(message.scheduledFor * 1000);
                        const value = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

                        return (
                            <TableRow key={message.id}>
                                <TableCell>
                                    {message.type}
                                </TableCell>
                                <TableCell>
                                    {value}
                                </TableCell>
                            </TableRow>
                        )
                    }}
                </TableBody>
            </Table>
        );
    }, [props.participant]);


    if (!props.participant) {
        return (
            <div className='ps-unit-lg gap-unit-md flex flex-col'>
                <h2 className='text-2xl font-bold'>Participant details</h2>
                <div className='w-full h-[300px] flex items-center justify-center'>
                    <div className='flex flex-col items-center bg-white/60 rounded-medium p-unit-lg backdrop-blur-sm text-center'>
                        <span>
                            <BsPersonVcard className='text-default-400 text-6xl' />
                        </span>
                        <h3 className='text-xl font-bold mt-unit-md'>No participant selected</h3>
                        <p className='text-small text-foreground'>
                            Select a participant from the list to view the details.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const lastActivity = props.participant.lastSubmissions ? Object.values(props.participant.lastSubmissions).sort((a, b) => b - a)[0] : undefined;


    return (
        <div className='ps-unit-lg gap-unit-md flex flex-col pb-unit-lg'>
            <h2 className='text-2xl font-bold'>Participant details</h2>

            <div className='flex'>
                <Card className='bg-white'>
                    <CardBody>
                        <div className='flex flex-col gap-unit-lg'>

                            <div className='flex items-start gap-unit-md'>
                                <div>
                                    <AvatarFromId
                                        userId={props.participant.id}
                                        pixelSize={7}
                                    />
                                </div>
                                <div className=''>
                                    <div className='text-small text-foreground mb-unit-1'>
                                        Participant ID
                                    </div>
                                    <Snippet
                                        color='default'
                                        symbol=''
                                    >
                                        {props.participant.id}
                                    </Snippet>
                                </div>
                            </div>


                            <div className='flex gap-unit-md items-end'>
                                <div className=''>
                                    <div className='text-small text-foreground mb-unit-1 flex items-center gap-1'>
                                        <span className='text-default-400'><BsBoxArrowInRight /></span>
                                        Joined
                                    </div>
                                    <div>
                                        {(new Date(props.participant.enteredAt * 1000)).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='text-small text-foreground mb-unit-1 flex items-center gap-1'>
                                        <span className='text-default-400'><BsActivity /></span>
                                        Last activity
                                    </div>
                                    <div>
                                        {lastActivity ? (new Date(lastActivity * 1000).toLocaleDateString()) : 'Never'}
                                    </div>
                                </div>
                                <span className='grow'></span>
                                <Chip
                                    size='lg'
                                    variant='flat'
                                    color={props.participant.studyStatus === 'active' ? 'success' : (props.participant.studyStatus === 'accountDeleted' ? 'danger' : 'default')}
                                >
                                    {props.participant.studyStatus}
                                </Chip>
                            </div>

                        </div>
                    </CardBody>
                </Card>
            </div>

            <Divider />
            <div>
                <h3 className='font-bold mb-unit-2 flex items-center gap-unit-sm'>
                    <span className='text-default-400'><BsBookmarks /></span>
                    Flags
                </h3>
                {flagsTable}
            </div>

            <Divider />
            <div>
                <h3 className='font-bold mb-unit-2 flex items-center gap-unit-sm'>
                    <span className='text-default-400'><BsFileEarmarkMedical /></span>
                    Assigned surveys
                </h3>
                {assignedSurveysTable}
            </div>
            <Divider />
            <div>
                <h3 className='font-bold mb-unit-2 flex items-center gap-unit-sm'>
                    <span className='text-default-400'><BsActivity /></span>
                    Last submissions
                </h3>
                {lastSubmissionsTable}
            </div>
            <Divider />
            <div>
                <h3 className='font-bold mb-unit-2 flex items-center gap-unit-sm'>
                    <span className='text-default-400'><BsEnvelopePaper /></span>
                    Scheduled messages
                </h3>
                {scheduledMessagesTable}
            </div>
        </div>
    );
};

export default ParticipantDetails;

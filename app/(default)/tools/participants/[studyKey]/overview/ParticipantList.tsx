'use client '

import AvatarFromId from '@/components/AvatarFromID';
import { AuthAPIFetcher } from '@/utils/server/fetcher';
import { ParticipantState, pStateFromAPI } from '@/utils/server/types/participantState';
import { shortenID } from '@/utils/shortenID';
import { Button, Divider, Input, Pagination, Spinner, Listbox, ListboxItem, divider, Chip, Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { BsActivity, BsChevronRight, BsPersonX } from 'react-icons/bs';
import useSWR from 'swr';

interface ParticipantListProps {
    studyKey: string;
    onParticipantSelected?: (participant: ParticipantState | undefined) => void;
}

const pageSize = 10;

interface ParticipantStateResponse {
    itemCount: number;
    pageCount: number;
    page: number;
    pageSize: number;
    items: ParticipantState[];
}

const getLastSubmission = (lastSubmissions?: { [key: string]: number }) => {
    if (!lastSubmissions) return <>
        None
    </>
    const lastSubmission = Object.values(lastSubmissions).sort((a, b) => b - a)[0]

    // format date form unix timestamp
    const date = new Date(lastSubmission * 1000)

    return <>
        {format(date, 'dd-MMM-yyyy')}
    </>
}

const ParticipantList: React.FC<ParticipantListProps> = ({
    onParticipantSelected,
    ...props
}) => {
    const [queryInput, setQueryInput] = React.useState<string>('');
    const [query, setQuery] = React.useState<string>('');

    const [participants, setParticipants] = React.useState<ParticipantState[]>([]);
    const [page, setPage] = React.useState<number>(1);
    const [selectedParticipantId, setSelectedParticipantId] = React.useState<string | undefined>(undefined);

    const { data, error, isLoading } = useSWR<ParticipantStateResponse>(`/api/case-management-api/v1/data/${props.studyKey}/participants?page=${page}&query=${encodeURIComponent(query)}&pageSize=${pageSize}`, AuthAPIFetcher)


    useEffect(() => {
        if (data && data.items) {
            const pStates = data.items.map(i => pStateFromAPI(i))
            setParticipants(pStates);
        } else {
            setParticipants([]);
        }
    }, [data]);

    const listView = React.useMemo(() => {
        if (isLoading) {
            return (
                <div className='flex justify-center items-center h-40'>
                    <Spinner />
                </div>
            );
        }

        if (participants.length === 0) {
            return (
                <div className='flex items-center py-unit-sm gap-unit-sm'>
                    <span><BsPersonX className='text-4xl text-default-400' /></span>
                    <p className='font-bold'>No participants found</p>
                </div>
            );
        }

        return (
            <div className='flex flex-col gap-unit-md py-unit-md'>
                <Listbox
                    aria-label="Single selection example"
                    variant="flat"
                    disallowEmptySelection
                    color='primary'
                    selectionMode="single"
                    // selectedKeys={selectedKeys}
                    selectedKeys={selectedParticipantId ? new Set([selectedParticipantId]) : new Set([])}
                    onSelectionChange={(keys: Set<React.Key> | 'all') => {
                        const selectedKey = (keys as Set<React.Key>).values().next().value;
                        if (!selectedKey) {
                            setSelectedParticipantId(undefined);
                            onParticipantSelected && onParticipantSelected(undefined);
                            return;
                        };
                        setSelectedParticipantId(selectedKey as string);
                        const selectedParticipant = participants.find((p) => p.id === selectedKey);
                        onParticipantSelected && onParticipantSelected(selectedParticipant);
                    }}
                    itemClasses={{
                        selectedIcon: 'hidden',
                    }}
                    items={participants}
                >
                    {(p) => {
                        //participants.map((p) => {
                        return (
                            <ListboxItem
                                key={p.id}
                                value={p.id}
                                showDivider
                                selectedIcon={<></>}
                                textValue={p.id}
                                className={clsx({ 'bg-primary-200/60 text-primary': selectedParticipantId === p.id })}
                                startContent={<div className='flex items-center'>
                                    <AvatarFromId userId={p.participantId}
                                        pixelSize={3}
                                    />
                                </div>}
                                endContent={<div className='flex items-center'>
                                    <BsChevronRight className='text-default-400' />
                                </div>}
                            >
                                <div>
                                    <div className='font-mono'>
                                        {shortenID(p.participantId, 16)}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <div className='text-default-600 text-tiny grow flex items-center gap-1'>

                                            <BsActivity className='' />
                                            {getLastSubmission(p.lastSubmissions)}

                                        </div>
                                        <Chip
                                            size='sm'
                                            variant='flat'
                                            className='text-tiny'
                                            color={p.studyStatus === 'active' ? 'success' : (p.studyStatus === 'accountDeleted' ? 'danger' : 'default')}
                                        >
                                            {p.studyStatus}
                                        </Chip>
                                    </div>
                                </div>
                            </ListboxItem>
                        );
                    }
                    }
                </Listbox>


            </div>
        );
    }, [isLoading, participants, selectedParticipantId, onParticipantSelected]);

    const pagination = React.useMemo(() => {
        if (!data || !data.pageCount) return null;

        return (
            <div className='flex justify-center'>
                <Pagination
                    total={data.pageCount}
                    showControls
                    page={Math.min(page, data.pageCount)}
                    disableAnimation
                    isCompact
                    onChange={(page) => {
                        setPage(page);
                    }}
                />
            </div>
        )

    }, [data, page]);


    const errorComp = React.useMemo(() => {
        if (!error) return null;

        return (
            <div className='flex items-center py-unit-sm gap-unit-sm'>
                <span><BsPersonX className='text-4xl text-default-400' /></span>
                <p className='font-bold text-danger'>Error loading participants: {error.message}</p>
            </div>
        );
    }, [error]);


    return (<div className='pb-unit-lg'>
        <div className='flex items-center pb-unit-md pr-unit-md'>
            <Input
                id='search-participants'
                label='Participant filter'
                labelPlacement='outside'
                placeholder='Search participants'
                description='You can use mongo query syntax here.'
                value={queryInput}
                onValueChange={(v) => {
                    setQueryInput(v);
                }}
                classNames={{
                    inputWrapper: 'pe-0'
                }}
                endContent={<Button
                    type='button'
                    color='default'
                    className='rounded-s-none'
                    onPress={() => {
                        setQuery(queryInput);
                    }}
                >
                    Search
                </Button>}
            />
        </div>
        <Divider />
        {errorComp}
        {listView}
        {pagination}

    </div>
    );
};

export default ParticipantList;

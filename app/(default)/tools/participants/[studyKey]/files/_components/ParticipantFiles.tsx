import React from 'react';
import ParticipantFilesClient from './ParticipantFilesClient';
import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { List } from 'lucide-react';
import { getFileInfos } from '@/lib/data/fileInfos';

interface ParticipantFilesProps {
    studyKey: string;
    filter?: string;
}

const ParticipantFiles: React.FC<ParticipantFilesProps> = async (props) => {
    const pageSize = 100;
    const rawFilter = props.filter ? decodeURIComponent(props.filter) : undefined;
    const normalizedFilter = rawFilter?.trim();
    let parsedFilter: string | undefined;

    if (normalizedFilter) {
        let participantId = normalizedFilter;
        try {
            const parsed = JSON.parse(normalizedFilter);
            if (parsed && typeof parsed === 'object' && typeof parsed.participantID === 'string') {
                participantId = parsed.participantID.trim();
            }
        } catch {
            // Non-JSON filter input; treat as a participant ID.
        }

        if (participantId) {
            parsedFilter = encodeURIComponent(JSON.stringify({ participantID: participantId }));
        }
    }

    const resp = await getFileInfos(
        props.studyKey,
        1,
        parsedFilter,
        pageSize,
    );

    const fileInfos = resp.fileInfos;
    const error = resp.error;

    if (error) {
        return (
            <div className='flex w-full p-4'>
                <div className='w-full'>
                    <ErrorAlert
                        error={error}
                        title='Error loading reports'
                    />
                </div>
            </div>
        )
    }

    if (!fileInfos || fileInfos.length === 0) {
        return (
            <div className='w-full p-4 h-full flex items-center justify-center'>
                <div className='text-center text-xl text-neutral-600'>
                    <div>
                        <List className='size-8 mb-2 mx-auto' />
                    </div>
                    <p>
                        No files found.
                    </p>
                    <p className='text-sm mt-3'>
                        Check back later or filter by participant ID.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <ParticipantFilesClient
            studyKey={props.studyKey}
            filter={parsedFilter}
            fileInfos={fileInfos}
            pageSize={pageSize}
            totalCount={resp.pagination?.totalCount || 0}
        />
    );
};

export default ParticipantFiles;

export const ParticipantFilesSkeleton = () => {
    return (
        <div className='flex w-full p-4'>
            <div className='w-full'>
                <CogLoader
                    label='Loading file infos...'
                />
            </div>
        </div>
    );
};

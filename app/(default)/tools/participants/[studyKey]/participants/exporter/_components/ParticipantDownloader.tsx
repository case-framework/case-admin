'use client';

import LoadingButton from '@/components/loading-button';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { getParticipantCount, startParticipantExport } from '@/lib/data/participants';
import { toast } from 'sonner';

interface ParticipantDownloaderProps {
    studyKey: string;
}

const ParticipantDownloader: React.FC<ParticipantDownloaderProps> = (props) => {
    const router = useRouter();

    const [isCountPending, startCountTransition] = React.useTransition();
    const [isPending, startTransition] = React.useTransition();
    const [search, setSearch] = React.useState<string>('');
    const [resultCount, setResultCount] = React.useState<number | undefined>(undefined);
    const [hasError, setHasError] = React.useState(false);

    useEffect(() => {
        onGetResultCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onGetResultCount = () => {
        // get count of participants
        setResultCount(undefined);
        setHasError(false);
        startCountTransition(async () => {
            try {
                const resp = await getParticipantCount(props.studyKey, search)
                if (resp.error) {
                    toast.error('Failed to get participant count', {
                        description: resp.error
                    });
                    setHasError(true);
                    return;
                }
                setResultCount(resp.count);
            } catch (e) {
                console.error(e);
                setHasError(true);
                toast.error('Failed to get participant count');
            }
        })
    }

    const onStartExportTask = () => {
        startTransition(async () => {
            try {
                // start export task
                const resp = await startParticipantExport(props.studyKey, search);
                if (resp.error || !resp.task) {
                    toast.error('Failed to start export task', {
                        description: resp.error
                    });
                    return;
                }
                toast.success('Export task started');
                router.push(`/tools/participants/${props.studyKey}/participants/exporter/${resp.task.id}`)
            } catch (e) {
                console.error(e);
                toast.error('Failed to start export task');
            }
        });
    }

    return (
        <div className='space-y-4'>
            <div>
                <Input
                    id='participant-filter'
                    name='participant-filter'
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setResultCount(undefined);
                    }}
                    placeholder="Search..."
                    onBlur={() => {
                        onGetResultCount();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onGetResultCount();
                        }
                    }}
                />
                {hasError && <p className='text-red-500 text-xs mt-1'>Failed to get participant count</p>}
                {isCountPending && <p className='text-xs mt-1'>
                    Loading participant count...
                </p>}
                {(!hasError && !isCountPending) && <p className='text-xs mt-1'>
                    {resultCount === undefined ? 'Press enter or leave the input to submit...' : `The current query will return ${resultCount} participants.`}
                </p>}
            </div>

            <div>
                <LoadingButton
                    isLoading={isPending || isCountPending}
                    disabled={!resultCount}
                    onClick={() => {
                        onStartExportTask();
                    }}
                >
                    Start Export
                </LoadingButton>
            </div>
        </div>
    );
};

export default ParticipantDownloader;

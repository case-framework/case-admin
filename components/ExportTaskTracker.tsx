'use client';

import ErrorAlert from '@/components/ErrorAlert';
import LoadingButton from '@/components/loading-button';
import { Progress } from '@/components/ui/progress';
import { Task, getTaskProgress } from '@/lib/data/tasks';
import { Download, FileCheck2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface TaskTrackerProps {
    taskURLPrefix: string; // to get status and result
    taskID: string;
}

const statusLabels = {
    loadingProgress: 'Loading progress...',
    fileGenerationInProgress: 'File generation in progress...',
    fileGenerationComplete: 'File generation complete',
    fileGenerationFailed: 'File generation failed'
}

const TaskTracker: React.FC<TaskTrackerProps> = (props) => {
    const [taskInfo, setTaskInfo] = React.useState<Task | undefined>(undefined);
    const [isPending, startTransition] = React.useTransition();


    React.useEffect(() => {
        const interval = setInterval(async () => {
            try {
                // get task status
                const resp = await getTaskProgress(props.taskURLPrefix, props.taskID);
                if (resp.error || !resp.task) {
                    console.error('Failed to get task progress', resp.error);
                    toast.error('Failed to get task progress', {
                        description: resp.error
                    });
                    return;
                }
                setTaskInfo(resp.task);
                if (resp.task.status === 'completed') {
                    clearInterval(interval);
                }
            } catch (e) {
                toast.error('Failed to get task progress');
                console.error(e);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [props.taskID, props.taskURLPrefix]);

    useEffect(() => {
        if (taskInfo?.status === 'completed') {
            onDownloadResult();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskInfo]);


    const processedCount = taskInfo?.processedCount || 0;
    const totalCount = taskInfo?.targetCount || 0;
    const progress = totalCount > 0 ? (processedCount / totalCount) * 100 : 0;

    let status = statusLabels.loadingProgress;
    if (taskInfo) {
        if (taskInfo.status === 'completed') {
            status = statusLabels.fileGenerationComplete;
        } else if (taskInfo.status === 'failed') {
            status = statusLabels.fileGenerationFailed;
        } else {
            status = statusLabels.fileGenerationInProgress;
        }
    }

    const onDownloadResult = () => {
        startTransition(async () => {
            try {
                const resp = await fetch(`/api/case-management-api/${props.taskURLPrefix}/task/${props.taskID}/result`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (resp.status !== 200) {
                    toast.error('Failed to download file', {
                        description: resp.statusText
                    });
                    return;
                }
                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const filename = resp.headers.get('Content-Disposition')?.split('filename=')[1] || 'exported-participants.json';
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                toast.success('File downloaded');
            } catch (e) {
                console.error(e);
                toast.error('Failed to download file');
            }
        });
    }

    const result = () => {
        if (taskInfo?.status === 'completed') {
            if (taskInfo.error) {
                return (
                    <div className='mt-4'>
                        <ErrorAlert
                            title='Failed to generate file'
                            error={taskInfo.error}
                        />
                    </div>
                )
            }

            // result should be ready to download
            return (
                <div className='mt-4'>
                    <p className='flex items-center gap-2 mb-4'>
                        <span>
                            <FileCheck2 className='size-6 text-green-600' />
                        </span>
                        The result file was successfully generated and should download automatically shortly. If it does not, click the button below.
                    </p>
                    <LoadingButton
                        onClick={onDownloadResult}
                        variant={'outline-solid'}
                        isLoading={isPending}
                    >
                        <span>
                            <Download className='size-5 me-2' />
                        </span>
                        Download
                    </LoadingButton>
                </div>
            )
        }
        return null;
    }

    return (
        <div>
            <Progress value={progress} />
            <p className='text-xs mt-1 text-neutral-600'>
                {status}
            </p>
            {result()}
        </div>
    );
};

export default TaskTracker;

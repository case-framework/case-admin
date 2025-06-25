'use client';

import { Button } from '@/components/ui/button';
import { ArrowUpRight, Copy, Download, MoreVertical, Save, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import DeleteResponsesDialog from './DeleteResponsesDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination } from '@/utils/server/types/paginationInfo';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getResponses } from '@/lib/data/responses';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from 'usehooks-ts';
import { deleteResponses } from '@/actions/study/responses';

interface ResponseTableClientProps {
    studyKey: string;
    surveyKey: string;
    filter?: string;
    sort?: string;
    pageSize?: number;
    responses?: Array<{
        [key: string]: number | string | boolean | object
    }>;
    pagination?: Pagination;
}

const fixedCols = [
    'ID',
    "participantID",
    "version",
    "opened",
    "submitted",
    "arrived",
    "language",
    "engineVersion",
    "session",
]


const ObjectValue = (props: { value: object }) => {
    const [, copyToClipboard] = useCopyToClipboard();
    return (
        <div className='flex items-center'>
            {'<Object>'}
            <Button
                variant='link'
                size='icon'
                className='size-4 ms-2'
                onClick={() => {
                    copyToClipboard(JSON.stringify(props.value, null, 2));
                    toast.success('Copied to clipboard');
                }}
            >
                <Copy />
            </Button>
        </div>
    )
}

const printValue = (value: number | string | boolean | object): string | React.ReactNode => {
    if (typeof value === 'object') {
        return <ObjectValue value={value} />
    }
    return value;
}

const printAsDate = (value: number) => {
    const date = new Date(value * 1000);
    return date.toLocaleString();
}

const escapeCsvValue = (val: string | undefined) => {
    if (val === null || val === undefined) {
        return '';
    }
    let str = String(val);
    // Escape double quotes
    str = str.replace(/"/g, '""');
    // Enclose in double quotes if the value contains a comma, newline, or double quote
    if (str.search(/("|,|\n)/g) >= 0) {
        str = `"${str}"`;
    }
    return str;
};

const ResponseTableClient: React.FC<ResponseTableClientProps> = (props) => {
    const [isMounted, setIsMounted] = React.useState(false);
    const [drowndownOpen, setDrowndownOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    const [responses, setResponses] = React.useState(props.responses || []);
    const [totalResponses, setTotalResponses] = React.useState(props.pagination?.totalCount || 0);
    const [isPending, startTransition] = React.useTransition();

    const pageSize = props.pageSize || 20;

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        }
    }, []);

    useEffect(() => {
        setTotalResponses(props.pagination?.totalCount || 0);
    }, [props.pageSize, props.pagination?.totalCount]);

    if (!isMounted) {
        return null;
    }

    const onDownloadCurrentView = () => {
        startTransition(() => {
            // convert responses to csv
            const convertResponsesToCSV = () => {
                let csvContent = '';
                csvContent += columns.join(',') + '\n';
                csvContent += responses.map((response) => {
                    const values = columns.map((colName) => {
                        const value = response[colName];
                        if (typeof value === 'object') {
                            return JSON.stringify(value);
                        }
                        if (typeof value !== 'string') {
                            return value.toString();
                        }
                        return value;
                    }).map((value) => escapeCsvValue(value));
                    return values.join(',');
                }).join('\n');

                return csvContent;
            };

            const csvContent = convertResponsesToCSV();

            // download csv
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${props.studyKey}_${props.surveyKey}_responses.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
    }

    const onLoadMore = () => {
        const page = Math.floor(responses.length / pageSize) + 1;
        startTransition(async () => {
            try {
                const resp = await getResponses(
                    props.studyKey,
                    props.surveyKey,
                    page,
                    props.filter,
                    props.sort,
                    pageSize,
                    true
                );
                if (resp.error) {
                    toast.error('Failed to load more responses', {
                        description: resp.error
                    });
                    return;
                }
                if (resp.responses) {
                    setResponses([...responses, ...resp.responses]);
                }
                if (resp.pagination) {
                    setTotalResponses(resp.pagination.totalCount);
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to load more responses');
            }
        });
    }

    const hasMore = totalResponses > responses.length;

    if (responses.length === 0) {
        return (
            <div>no responses</div>
        )
    }

    const allColumns = Object.keys(responses[0]);
    const columns = [...fixedCols, ...allColumns.filter(col => !fixedCols.includes(col))];

    return (
        <div className='h-full w-full'>
            <div className='overflow-y-scroll h-full pb-6'>
                <ScrollArea className='block ps-2 pt-2 pb-3 pe-3 h-full overscroll-x-contain'>
                    <table className='text-xs border border-neutral-300 mx-1 shadow-md drop-shadow-md mb-2'>
                        <thead className='sticky top-0 z-10 shadow-xs border-b-4'>
                            <tr className='bg-slate-200/70 backdrop-blur-md '>
                                {columns.map((column, index) => {
                                    return (
                                        <th key={index} className={cn('h-auto px-2 w-auto whitespace-nowrap py-1 font-bold')}>
                                            {column}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map((resp, index) => {
                                return (
                                    <tr key={index} className='group'>
                                        {columns.map((column, index) => (
                                            <td
                                                key={index}
                                                className={cn(
                                                    'h-auto px-2 text-center py-1.5 bg-white border-b border-neutral-200 whitespace-nowrap',
                                                    'group-hover:bg-slate-50',
                                                    {
                                                        'bg-slate-50 group-hover:bg-slate-100': index % 2 === 0,
                                                        'text-start font-mono': column === 'ID' || column === 'participantID',
                                                    }
                                                )}
                                            >
                                                {column === 'opened' || column === 'submitted'
                                                    ? printAsDate(resp[column] as number)
                                                    : printValue(resp[column])}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <ScrollBar
                        className='w-3'
                    />

                    <ScrollBar
                        className='h-3'
                        orientation='horizontal'
                    />
                </ScrollArea>

            </div>

            <div className='h-6 w-full bg-slate-50 absolute bottom-0 left-0 border-t border-neutral-300'>
                <div className='flex items-center justify-between px-4 h-full'>
                    <p className='text-neutral-500 text-xs '>
                        Showing responses:
                        <span className='ms-2'>
                            {responses.length} of {totalResponses}
                        </span>
                    </p>

                    {hasMore && <Button
                        variant={'link'}
                        className='text-xs px-0 h-4'
                        onClick={onLoadMore}
                        disabled={isPending}
                    >
                        <Download className='size-3 me-2' />
                        {isPending ? 'Loading...' : 'Load more'}
                    </Button>}

                    <div className='flex gap-2 items-center max-h-6'>
                        <Button
                            variant={'link'}
                            className='text-xs px-0 h-4'
                            onClick={onDownloadCurrentView}
                        >
                            <Save className='size-3 me-2' />
                            Download current view
                        </Button>



                        <DropdownMenu
                            modal={false}
                            open={drowndownOpen}
                            onOpenChange={setDrowndownOpen}
                        >
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost"
                                    size='icon'
                                    className='size-4 px-0 flex items-center justify-center'
                                    onClick={() => setDrowndownOpen(true)}
                                >
                                    <MoreVertical className="size-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align='end'
                                className="">
                                <DropdownMenuItem
                                    className='flex items-center gap-1 px-4 py-2 text-sm text-red-600'
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                >
                                    <span>
                                        <Trash2 className='size-4 me-2 opacity-60' />
                                    </span>
                                    <span>
                                        Delete responses by current filter
                                    </span>
                                    <span>
                                        <ArrowUpRight className='size-4 ms-2' />
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <DeleteResponsesDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}

                isLoading={isPending}
                studyKey={props.studyKey}
                totalResponses={totalResponses}

                onPerformDelete={() => {
                    startTransition(async () => {
                        console.log('Perform delete');
                        try {
                            const resp = await deleteResponses(props.studyKey, props.surveyKey, props.filter, props.studyKey);
                            if (resp.error) {
                                toast.error('Failed to delete responses', {
                                    description: resp.error
                                });
                                setIsDeleteDialogOpen(false);
                                return;
                            }
                            toast.success('Responses deleted');
                        } catch (e) {
                            console.error(e);
                            toast.error('Failed to delete responses');
                        }

                        setIsDeleteDialogOpen(false);
                    })
                }}
            />

        </div >
    );
};

export default ResponseTableClient;

'use client';

import { deleteParticipantFile } from '@/actions/study/files';
import AvatarFromId from '@/components/AvatarFromID';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FileInfo, getFileInfos } from '@/lib/data/fileInfos';
import { Calendar, Download, Save, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { BsFileEarmark, BsFiletypeCsv, BsFiletypeJpg, BsFiletypeJson, BsFiletypePdf, BsFiletypePng } from 'react-icons/bs';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ParticipantFilesClientProps {
    studyKey: string;
    filter?: string;
    fileInfos: Array<FileInfo>;
    totalCount: number;
    pageSize: number;
}


const ParticipantFilesClient: React.FC<ParticipantFilesClientProps> = (props) => {
    const [isMounted, setIsMounted] = React.useState(false);

    const [fileInfos, setFileInfos] = React.useState(props.fileInfos || []);
    const [totalCount, setTotalCount] = React.useState(props.totalCount || 0);
    const [isPending, startTransition] = React.useTransition();
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
    const [isBulkDownloading, setIsBulkDownloading] = React.useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
    const [bulkDeleteConfirmText, setBulkDeleteConfirmText] = React.useState('');
    const [bulkDeleteProgress, setBulkDeleteProgress] = React.useState<{ total: number; deleted: number } | null>(null);
    const isBulkDeletingRef = React.useRef(false);

    const pageSize = props.pageSize || 100;

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        }
    }, []);

    useEffect(() => {
        setSelectedIds((prev) => {
            if (prev.size === 0) {
                return prev;
            }
            const validIds = new Set(fileInfos.map((fileInfo) => fileInfo.id));
            const next = new Set<string>();
            prev.forEach((id) => {
                if (validIds.has(id)) {
                    next.add(id);
                }
            });
            return next;
        });
    }, [fileInfos]);

    if (!isMounted) {
        return null;
    }

    const onLoadMore = () => {
        const page = Math.floor(fileInfos.length / pageSize) + 1;
        startTransition(async () => {
            try {
                const resp = await getFileInfos(
                    props.studyKey,
                    page,
                    props.filter,
                    pageSize,
                );
                if (resp.error) {
                    toast.error('Failed to load more file infos', {
                        description: resp.error
                    });
                    return;
                }
                if (resp.fileInfos) {
                    setFileInfos((prev) => [...prev, ...(resp.fileInfos ?? [])]);
                }
                if (resp.pagination) {
                    setTotalCount(resp.pagination.totalCount);
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to load more file infos');
            }
        });
    }

    const hasMore = totalCount > fileInfos.length;

    if (fileInfos.length === 0) {
        return (
            <div>No files found.</div>
        )
    }

    const downloadFile = async (fileInfo: FileInfo, showToast = true) => {
        const url = `/api/case-management-api/v1/studies/${props.studyKey}/data-explorer/files/${fileInfo.id}`;

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (resp.status !== 200) {
            const err = await resp.json();
            if (showToast) {
                toast.error('Failed to download file', {
                    description: err.error,
                });
            }
            throw new Error(err.error || 'Failed to download file');
        }
        const blob = await resp.blob();
        const fileName = resp.headers.get('Content-Disposition')?.split('filename=')[1];
        const link = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(blob);
        link.href = objectUrl;
        link.download = (fileName || 'participant_file').replaceAll('"', '');
        link.click();

        // Delay revocation to allow download to start
        setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);

        if (showToast) {
            toast.success('File downloaded');
        }
    };

    const onDownloadFile = (fileInfo: FileInfo) => {
        startTransition(async () => {
            try {
                await downloadFile(fileInfo);
            } catch (e) {
                console.error(e);
                toast.error('Failed to download file', {
                    description: e instanceof Error ? e.message : undefined,
                });
            }
        });
    }

    const onDownloadSelected = async () => {
        if (selectedIds.size === 0 || isBulkDownloading) {
            return;
        }
        const filesToDownload = fileInfos.filter((fileInfo) => selectedIds.has(fileInfo.id));
        setIsBulkDownloading(true);
        const errors: string[] = [];
        try {
            for (const fileInfo of filesToDownload) {
                try {
                    await downloadFile(fileInfo, false);
                } catch (error) {
                    errors.push(error instanceof Error ? error.message : 'Failed to download file');
                }
            }

            if (errors.length > 0) {
                toast.error('Failed to download some files', {
                    description: errors.join('\n'),
                });
            } else {
                toast.success(`Downloaded ${filesToDownload.length} file${filesToDownload.length === 1 ? '' : 's'}`);
            }
        } finally {
            setIsBulkDownloading(false);
        }
    };

    const onDeleteFile = (fileInfo: FileInfo) => {
        if (!confirm('Are you sure you want to delete this file?')) {
            return;
        }

        startTransition(async () => {
            try {
                const resp = await deleteParticipantFile(
                    props.studyKey,
                    fileInfo.id,
                );
                if (resp.error) {
                    toast.error('Failed to delete file', {
                        description: resp.error
                    });
                    return;
                }
                toast.success('File deleted');

                setFileInfos((prev) => prev.filter(f => f.id !== fileInfo.id));
                setSelectedIds((prev) => {
                    if (!prev.has(fileInfo.id)) {
                        return prev;
                    }
                    const next = new Set(prev);
                    next.delete(fileInfo.id);
                    return next;
                });
                setTotalCount(prev => prev ? prev - 1 : 0);
            } catch (e) {
                console.error(e);
                toast.error('Failed to delete file');
            }
        })
    }

    const onConfirmBulkDelete = async () => {
        if (isBulkDeleting || bulkDeleteConfirmText !== 'delete-files') {
            return;
        }
        const filesToDelete = fileInfos.filter((fileInfo) => selectedIds.has(fileInfo.id));
        if (filesToDelete.length === 0) {
            return;
        }

        // Set ref synchronously to prevent dialog from closing
        isBulkDeletingRef.current = true;
        setIsBulkDeleting(true);
        setBulkDeleteProgress({
            total: filesToDelete.length,
            deleted: 0,
        });

        const errors: string[] = [];
        try {
            for (const fileInfo of filesToDelete) {
                try {
                    const resp = await deleteParticipantFile(props.studyKey, fileInfo.id);
                    if (resp.error) {
                        errors.push(resp.error);
                        continue;
                    }
                    setFileInfos((prev) => prev.filter((item) => item.id !== fileInfo.id));
                    setSelectedIds((prev) => {
                        if (!prev.has(fileInfo.id)) {
                            return prev;
                        }
                        const next = new Set(prev);
                        next.delete(fileInfo.id);
                        return next;
                    });
                    setBulkDeleteProgress((prev) => prev ? { ...prev, deleted: prev.deleted + 1 } : prev);
                    setTotalCount(prev => prev ? prev - 1 : 0);
                } catch (error) {
                    errors.push(error instanceof Error ? error.message : 'Failed to delete file');
                }
            }

            if (errors.length > 0) {
                toast.error('Failed to delete some files', {
                    description: errors.join('\n'),
                });
            } else {
                toast.success(`Deleted ${filesToDelete.length} file${filesToDelete.length === 1 ? '' : 's'}`);
            }
            setBulkDeleteOpen(false);
            setBulkDeleteConfirmText('');
            setBulkDeleteProgress(null);
        } finally {
            isBulkDeletingRef.current = false;
            setIsBulkDeleting(false);
        }
    };

    const getFileIcon = (fileType: string) => {
        let icon = <span><BsFileEarmark /></span>;
        if (fileType.includes('csv')) {
            icon = <span><BsFiletypeCsv /></span>;
        } else if (fileType.includes('json')) {
            icon = <span><BsFiletypeJson /></span>;
        } else if (fileType.includes('pdf')) {
            icon = <span><BsFiletypePdf /></span>;
        } else if (fileType.includes('png')) {
            icon = <span><BsFiletypePng /></span>
        } else if (fileType.includes('jpeg') || fileType.includes('jpg')) {
            icon = <span><BsFiletypeJpg /></span>
        }
        return <span
            className='text-2xl text-neutral-500'
        >{icon}</span>;
    }

    const selectedCount = fileInfos.filter((fileInfo) => selectedIds.has(fileInfo.id)).length;
    const hasSelected = selectedCount > 0;
    const allSelected = fileInfos.length > 0 && selectedCount === fileInfos.length;
    const isIndeterminate = selectedCount > 0 && selectedCount < fileInfos.length;

    const toggleSelectAll = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allSelected) {
                fileInfos.forEach((fileInfo) => next.delete(fileInfo.id));
                return next;
            }
            fileInfos.forEach((fileInfo) => next.add(fileInfo.id));
            return next;
        });
    };

    const toggleSelectRow = (fileId: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(fileId)) {
                next.delete(fileId);
            } else {
                next.add(fileId);
            }
            return next;
        });
    };

    return (
        <div className='h-full w-full relative'>
            <div className='overflow-y-scroll h-full pb-14'>
                <div className='px-4 pt-4 pb-2 flex items-center justify-between gap-4'>
                    <div className='text-xs text-neutral-500'>
                        {hasSelected ? `${selectedCount} selected` : 'Select files to bulk download or delete'}
                    </div>
                </div>

                <div className='px-4 pb-4'>
                    <div className='rounded-md border border-neutral-300 bg-white overflow-hidden'>
                        <div className='overflow-x-auto'>
                            <Table className='w-full text-sm'>
                                <TableHeader className='bg-slate-50 text-xs text-neutral-600'>
                                    <TableRow className='border-b border-neutral-200'>
                                        <TableHead className='px-3 py-2 text-left w-10'>
                                            <Checkbox
                                                checked={isIndeterminate ? 'indeterminate' : allSelected}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label='Select all files'
                                                className='size-5 bg-white'
                                            />
                                        </TableHead>
                                        <TableHead className='px-3 py-2 text-left w-12'>Type</TableHead>
                                        <TableHead className='px-3 py-2 text-left'>Participant</TableHead>
                                        <TableHead className='px-3 py-2 text-left'>Created</TableHead>
                                        <TableHead className='px-3 py-2 text-right'>Size</TableHead>
                                        <TableHead className='px-3 py-2 text-right w-24'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fileInfos.map((fileInfo) => (
                                        <TableRow
                                            key={fileInfo.id}
                                            className='border-b border-neutral-200 last:border-b-0'
                                        >
                                            <TableCell className='px-3 py-2 align-middle'>
                                                <Checkbox
                                                    checked={selectedIds.has(fileInfo.id)}
                                                    onCheckedChange={() => toggleSelectRow(fileInfo.id)}
                                                    aria-label={`Select file ${fileInfo.id}`}
                                                    className='size-5 bg-white'
                                                />
                                            </TableCell>
                                            <TableCell className='px-3 py-2 align-middle'>
                                                {getFileIcon(fileInfo.fileType)}
                                            </TableCell>
                                            <TableCell className='px-3 py-2 align-middle'>
                                                <div className='flex items-center gap-2'>
                                                    <AvatarFromId userId={fileInfo.participantID} pixelSize={2} />
                                                    <span className='font-mono text-xs'>{fileInfo.participantID}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className='px-3 py-2 align-middle'>
                                                <div className='flex items-center gap-2 text-xs text-neutral-600'>
                                                    <Calendar className='size-3' />
                                                    <span>
                                                        {fileInfo.createdAt ? new Date(fileInfo.createdAt).toLocaleString() : 'N/A'}
                                                    </span>
                                                    {fileInfo.status !== 'ready' && <Badge>{fileInfo.status}</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell className='px-3 py-2 align-middle text-right text-xs'>
                                                {(fileInfo.size / 1024 / 1024).toFixed(2)} MB
                                            </TableCell>
                                            <TableCell className='px-3 py-2 align-middle text-right'>
                                                <div className='inline-flex items-center gap-1'>
                                                    <Button
                                                        size='icon'
                                                        variant={'ghost'}
                                                        disabled={isPending}
                                                        onClick={() => onDownloadFile(fileInfo)}
                                                        aria-label={`Download file ${fileInfo.id}`}
                                                    >
                                                        <Save className='size-4' />
                                                    </Button>

                                                    <Button
                                                        size='icon'
                                                        variant={'ghost'}
                                                        disabled={isPending}
                                                        onClick={() => onDeleteFile(fileInfo)}
                                                        aria-label={`Delete file ${fileInfo.id}`}
                                                    >
                                                        <Trash2 className='size-4' />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <div className='h-6 w-full bg-slate-50 absolute bottom-0 left-0 border-t border-neutral-300'>
                    <div className='flex items-center justify-between px-4 h-full'>
                        <p className='text-neutral-500 text-xs '>
                            Showing files:
                            <span className='ms-2'>
                                {fileInfos.length} of {totalCount}
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

                        <div className='w-20'>

                        </div>


                    </div>
                </div>
            </div>

            {hasSelected && (
                <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20'>
                    <div className='flex items-center gap-1.5 rounded-full border border-border bg-primary/10 backdrop-blur-sm p-1.5 shadow-sm drop-shadow-sm'>
                        <Button
                            size='sm'
                            variant={'outline'}
                            onClick={onDownloadSelected}
                            className='rounded-full'
                            disabled={isBulkDownloading || isPending}
                        >
                            <Save className='size-4' />
                            Download {selectedCount} files
                        </Button>

                        <AlertDialog
                            open={bulkDeleteOpen}
                            onOpenChange={(nextOpen) => {
                                // Check ref synchronously to prevent dialog from closing during deletion
                                if (!nextOpen && isBulkDeletingRef.current) {
                                    return;
                                }
                                setBulkDeleteOpen(nextOpen);
                                if (!nextOpen) {
                                    setBulkDeleteConfirmText('');
                                    setBulkDeleteProgress(null);
                                }
                            }}
                        >
                            <Button
                                size='sm'
                                variant={'outline'}
                                className='rounded-full text-destructive'
                                onClick={() => setBulkDeleteOpen(true)}
                                disabled={isBulkDeleting || isPending}
                            >
                                <Trash2 className='size-4' />
                                Delete {selectedCount} files
                            </Button>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete selected files</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action is irreversible. Type <span className='font-semibold'>delete-files</span> to confirm deletion.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className='space-y-3'>
                                    <Input
                                        value={bulkDeleteConfirmText}
                                        onChange={(event) => setBulkDeleteConfirmText(event.target.value)}
                                        placeholder='delete-files'
                                        disabled={isBulkDeleting}
                                    />
                                    {bulkDeleteProgress && (
                                        <p className='text-xs text-neutral-500'>
                                            Deleted {bulkDeleteProgress.deleted} of {bulkDeleteProgress.total}
                                        </p>
                                    )}
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isBulkDeleting}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button
                                            variant={'destructive'}
                                            disabled={isBulkDeleting || bulkDeleteConfirmText !== 'delete-files'}
                                            onClick={onConfirmBulkDelete}
                                        >
                                            {isBulkDeleting ? 'Deleting...' : `Delete ${selectedCount} file${selectedCount === 1 ? '' : 's'}`}
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipantFilesClient;

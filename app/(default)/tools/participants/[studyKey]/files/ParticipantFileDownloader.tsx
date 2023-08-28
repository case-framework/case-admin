'use client';

import AvatarFromId from '@/components/AvatarFromID';
import { AuthAPIFetcher } from '@/utils/server/fetcher';
import { shortenID } from '@/utils/shortenID';
import { Button, Card, CardBody, CardHeader, Chip, Divider, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react';
import { format } from 'date-fns';
import { signOut } from 'next-auth/react';
import React from 'react';
import { BsDownload, BsExclamationTriangle, BsFileEarmark, BsFiletypeCsv, BsFiletypeJpg, BsFiletypeJson, BsFiletypePdf, BsFiletypePng, BsInfoCircle, BsTrash3 } from 'react-icons/bs';
import useSWR from 'swr';

interface ParticipantFileDownloaderProps {
    studyKey: string;
}

interface FileInfo {
    id: string;
    fileType: string;
    status: string;
    participantId: string;
    uploadedAt: string;
    size: number;
}

const columns = [
    { id: 'fileType', label: 'File type' },
    { id: 'participantId', label: 'Participant' },
    { id: 'uploadedAt', label: 'Uploaded at' },
    { id: 'fileSize', label: 'Size' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' },
];


const fileDownload = async (fileInfo: FileInfo, studyKey: string) => {
    let searchParams = new URLSearchParams();

    searchParams.append('id', fileInfo.id);

    const resp = await fetch(
        `/api/case-management-api/v1/data/${studyKey}/file${searchParams.toString() ? '?' + searchParams.toString() : ''}`,
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
        console.log('err', err);
        throw new Error(err.message);
    }
    const blob = await resp.blob();
    const fileName = resp.headers.get('Content-Disposition')?.split('filename=')[1];
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = (fileName || 'participant_file').replaceAll('"', '');
    link.click();
}

const ParticipantFileDownloader: React.FC<ParticipantFileDownloaderProps> = (props) => {

    const { data, error, isLoading } = useSWR<{ fileInfos?: FileInfo[] }>(`/api/case-management-api/v1/data/${props.studyKey}/file-infos`, AuthAPIFetcher)

    const fileInfos = data?.fileInfos || [];

    const loadingContent = React.useMemo(() => <div className='py-unit-lg text-center'>
        <Spinner />
    </div>, [])

    const emptyContent = React.useMemo(() => <div className='gap-unit-md rounded-medium p-unit-md flex justify-center items-center'>
        <div className='text-primary text-2xl'>
            <BsInfoCircle />
        </div>
        <div>
            <p className='font-bold'>No files</p>
            <p className='text-small'>No files can be found with the current filter for this study.</p>
        </div>
    </div>, [])


    const renderCell = React.useCallback((fileInfo: FileInfo, columnKey: React.Key) => {
        switch (columnKey) {
            case "fileType":
                let icon = <span><BsFileEarmark /></span>;
                if (fileInfo.fileType.includes('csv')) {
                    icon = <span><BsFiletypeCsv /></span>;
                } else if (fileInfo.fileType.includes('json')) {
                    icon = <span><BsFiletypeJson /></span>;
                } else if (fileInfo.fileType.includes('pdf')) {
                    icon = <span><BsFiletypePdf /></span>;
                } else if (fileInfo.fileType.includes('png')) {
                    icon = <span><BsFiletypePng /></span>
                } else if (fileInfo.fileType.includes('jpeg') || fileInfo.fileType.includes('jpg')) {
                    icon = <span><BsFiletypeJpg /></span>
                }

                return (
                    <Tooltip content={fileInfo.fileType}>
                        <div className='flex justify-center text-2xl text-default-400 w-full'>
                            {icon}
                        </div>
                    </Tooltip>
                );
            case "participantId":

                return (
                    <div className='flex items-center justify-start w-full overflow-hidden text-ellipsis gap-unit-sm'>
                        <div className='p-1 flex items-center'>
                            <AvatarFromId userId={fileInfo.participantId}
                                pixelSize={2}
                            />
                        </div>
                        <span className='flex items-center font-mono'>{
                            shortenID(fileInfo.participantId)
                        }</span>
                    </div>
                );
            case "uploadedAt":
                if (!fileInfo.uploadedAt) {
                    return '-';
                }
                const date = new Date(parseInt(fileInfo.uploadedAt) * 1000);
                return (
                    <p>
                        {format(date, 'yyyy-MM-dd HH:mm')}
                    </p>
                );
            case "fileSize":
                return (
                    <p>
                        {(fileInfo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                );
            case "status":
                return (
                    <Chip
                        color={fileInfo.status === 'ready' ? 'success' : 'danger'}
                        size='sm'
                        variant='dot'
                    >
                        {fileInfo.status}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Download"
                            placement='left'
                        >
                            <Button
                                type='button'
                                isIconOnly
                                variant='light'
                                size='sm'
                                color='default'
                                className='text-large'
                                onPress={async () => {
                                    try {
                                        await fileDownload(fileInfo, props.studyKey);
                                    } catch (e: any) {
                                        alert(e.message || 'Something went wrong - could not download file.');
                                    }
                                }}
                            >
                                <BsDownload />
                            </Button>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete file"
                            placement='right'
                        >
                            <Button
                                type='button'
                                isIconOnly
                                variant='light'
                                size='sm'
                                color='danger'
                                className='text-large'
                                onPress={async () => {
                                    if (confirm('Are you sure you want to delete this file?')) {
                                        try {
                                            const resp = await fetch(
                                                `/api/case-management-api/v1/data/${props.studyKey}/delete-files`,
                                                {
                                                    method: 'POST',
                                                    body: JSON.stringify({
                                                        fileIds: [fileInfo.id]
                                                    }),
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
                                                console.log('err', err);
                                                throw new Error(err.message);
                                            }
                                            alert('File deleted successfully.');
                                        } catch (e: any) {
                                            alert(e.message || 'Something went wrong - could not delete file.');
                                        }

                                    }
                                }}
                            >
                                <BsTrash3 />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return columnKey;
        }
    }, [props.studyKey]);


    let errorComp: React.ReactNode = null;
    if (error) {
        if (error.message === 'Unauthorized') {
            signOut({ callbackUrl: '/auth/login?callbackUrl=/tools/participants' });
            return null;
        }

        errorComp = <div className='bg-danger-50 gap-unit-md rounded-medium p-unit-md flex items-center'>
            <div className='text-danger text-2xl'>
                <BsExclamationTriangle />
            </div>
            <div>
                <p className='text-danger font-bold'>Something went wrong</p>
                <p className='text-danger text-small'>{error.message}</p>
            </div>
        </div>
    }



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
                        Participant files
                    </h2>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-unit-md">
                <p className='text-small text-default-600 p-unit-sm bg-primary-50 rounded-small flex items-center'>
                    <span className='inline-block text-2xl mr-unit-sm text-primary'>
                        <BsInfoCircle />
                    </span>
                    If your study accepts file uploads, you can access the files through this page.
                </p>

                {errorComp}

                <Table aria-label="File info table"
                    isStriped
                    classNames={{
                        table: "min-h-[400px]",
                    }}
                >
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.id}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody
                        items={fileInfos}
                        isLoading={isLoading}
                        loadingContent={loadingContent}
                        emptyContent={!isLoading && emptyContent}
                    >
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
};

export default ParticipantFileDownloader;

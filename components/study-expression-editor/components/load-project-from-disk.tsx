import Filepicker from '@/components/inputs/Filepicker';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';

import { toast } from 'sonner';
import { Session } from '../types';


const LoadRulesFromDisk: React.FC = () => {
    const {
        sessions,
        loadSessionObject,
        deleteSession,
        loadSession,
    } = useStudyExpressionEditor();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);
    const [newSession, setNewSession] = React.useState<Session | undefined>(undefined);


    const filePickerHint = () => {
        return <p className='text-xs text-muted-foreground'>
            Select a CASE study expression project (*.csep) file to load.
        </p>;
    }

    return (
        <div className='flex flex-col items-center justify-center p-6 h-full'>
            <div className='w-full max-w-2xl border-border border rounded-lg p-6 space-y-6 bg-white'>

                <div className='py-3 space-y-4'>
                    <h2 className='text-xl font-bold mb-2'>
                        Load Project from disk
                    </h2>

                    <div className='space-y-2'>
                        <Filepicker
                            id='rules upload'
                            accept={{
                                'application/csep': ['.csep'],
                            }}
                            onChange={(files) => {
                                setNewSession(undefined);
                                setErrorMsg(undefined);

                                if (files.length > 0) {
                                    // read file as a json
                                    const reader = new FileReader();

                                    reader.onload = (e) => {
                                        const text = e.target?.result;
                                        if (typeof text === 'string') {
                                            const data = JSON.parse(text);

                                            if (data.meta?.fileTypeId !== 'case-study-expression-project') {
                                                setErrorMsg('The selected file is not a valid rule file.');
                                                toast.error('The selected file is not a valid rule file.');
                                                return;
                                            }

                                            setNewSession(data as Session);
                                        } else {
                                            setNewSession(undefined);
                                            setErrorMsg('Error reading file');
                                            toast.error('Error reading file');
                                        }

                                    }
                                    reader.readAsText(files[0]);
                                }
                            }}
                        />
                        {filePickerHint()}
                        {errorMsg && (
                            <p className='text-destructive mt-3'>{errorMsg}</p>
                        )}
                    </div>
                    <Button
                        variant={'default'}
                        className='w-full'
                        disabled={!newSession}
                        onClick={() => {
                            if (!newSession) {
                                toast.error('No session to load');
                                return;
                            }
                            loadSessionObject(newSession);
                        }}
                    >
                        Load
                    </Button>
                </div>

                {sessions.length > 0 && <div className='space-y-6'>
                    <Separator />
                    <h2 className='text-xl font-bold mb-2'>
                        Open a recent session
                    </h2>
                    <ul className='space-y-2  max-h-64 overflow-y-auto'>
                        {sessions.map((session, index) => (
                            <li key={index}>
                                <ContextMenu>
                                    <ContextMenuTrigger>
                                        <Button
                                            variant={'outline'}
                                            className='w-full h-auto'
                                            onClick={() => {
                                                loadSession(session.id);
                                            }}
                                        >
                                            <div className='flex items-center justify-between w-full'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-medium'>
                                                        {session.name ? session.name : '(no name)'}
                                                    </span>
                                                    <span className='text-xs text-muted-foreground text-end'>
                                                        (Edited {new Date(session.lastModified).toLocaleString()})
                                                    </span>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Badge
                                                        className='text-xs'
                                                        variant={session.mode === 'study-rules' ? 'outline' : 'primaryOutline'}
                                                    >
                                                        {session.mode === 'study-rules' ? 'Study rules' : 'Actions'}
                                                    </Badge>
                                                    <span className='text-muted-foreground'>
                                                        <ChevronRight className='size-4' />
                                                    </span>
                                                </div>
                                            </div>
                                        </Button>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem onClick={() => {
                                            if (!confirm('Are you sure you want to delete this session? All unsaved changes will be lost.')) {
                                                return;
                                            }
                                            deleteSession(session.id);
                                        }}>
                                            Delete
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            </li>
                        ))}
                    </ul>
                </div>}
            </div>
        </div>
    );
};

export default LoadRulesFromDisk;

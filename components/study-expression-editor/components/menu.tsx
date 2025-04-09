import React from 'react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar';
import { toast } from 'sonner';
import { StudyExpressionEditorMode } from '../types';
import { DownloadIcon, FolderOpenIcon, SaveIcon } from 'lucide-react';

interface MenuProps {
    onExit: () => void;
}

const Menu: React.FC<MenuProps> = (props) => {
    const {
        mode,
        view,
        sessionId,
        changeView,
        initNewSession,
        updateCurrentStudyContext,
        sessions,
        saveRulesToDisk,
        saveSessionToDisk,
    } = useStudyExpressionEditor();

    const recentContexts = sessions.map(s => {
        return {
            id: s.id,
            name: s.name,
            lastModified: s.lastModified,
            studyContext: s.studyContext,
        }
    });

    const hasActiveSession = sessionId !== undefined && sessionId !== '';

    const hasRecentContexts = recentContexts.length > 0;

    const initNewProject = (type: StudyExpressionEditorMode) => {
        if (sessionId) {
            if (!confirm('Are you sure you want to create a new session? All unsaved changes will be lost.')) {
                return;
            }
        }
        initNewSession(undefined, type);
        changeView('expression-editor');
    }

    return (
        <Menubar
            className='rounded-none border-0 border-b px-6'
        >
            <MenubarMenu>
                <MenubarTrigger
                    className='font-bold min-w-[159px] justify-center'
                >
                    Study {mode === 'study-rules' ? 'Rules' : 'Action'} Editor
                </MenubarTrigger>

            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger
                >
                    Project
                </MenubarTrigger>
                <MenubarContent>

                    <MenubarSub>
                        <MenubarSubTrigger>New</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem
                                onClick={() => { initNewProject('study-rules') }}
                            >
                                Study Rules Project
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem
                                onClick={() => { initNewProject('action') }}
                            >
                                Study Actions Project
                            </MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>

                    <MenubarSeparator />

                    <MenubarItem
                        onClick={() => {
                            if (sessionId) {
                                if (!confirm('Are you sure you want to open a new project? All unsaved changes will be lost.')) {
                                    return;
                                }
                            }
                            changeView('load-project-from-disk');
                        }}
                    >
                        <FolderOpenIcon
                            className='mr-2 size-4 text-muted-foreground'
                        />
                        Open Project...
                    </MenubarItem>


                    <MenubarItem
                        onClick={() => saveSessionToDisk()}
                    >
                        <SaveIcon
                            className='mr-2 size-4 text-muted-foreground'
                        />
                        Save Project <MenubarShortcut>⌘ +  S</MenubarShortcut>
                    </MenubarItem>

                    <MenubarSeparator />



                    <MenubarItem
                        disabled={!hasActiveSession}
                        onClick={() => {
                            saveRulesToDisk();
                        }}
                    >
                        <DownloadIcon
                            className='mr-2 size-4 text-muted-foreground'
                        />
                        Export Rules <MenubarShortcut>⌘ +  E</MenubarShortcut>
                    </MenubarItem>


                    <MenubarSeparator />

                    <MenubarItem
                        onClick={props.onExit}
                    >
                        Exit editor
                    </MenubarItem>

                </MenubarContent>
            </MenubarMenu>

            {hasActiveSession && <MenubarMenu>
                <MenubarTrigger>
                    Context
                </MenubarTrigger>
                <MenubarContent>
                    {view !== 'context-editor' && <MenubarItem onClick={() => changeView('context-editor')} >
                        Open Context Editor
                    </MenubarItem>}
                    {view === 'context-editor' && <MenubarItem onClick={() => changeView('expression-editor')} >
                        Exit Context Editor
                    </MenubarItem>}
                    <MenubarSeparator />

                    <MenubarSub>
                        <MenubarSubTrigger>Use recent context</MenubarSubTrigger>
                        <MenubarSubContent
                            className='max-h-[300px] overflow-y-auto divide-y '
                        >
                            {!hasRecentContexts && <MenubarItem disabled>No recent contexts</MenubarItem>}
                            {hasRecentContexts && recentContexts.map(s => {
                                return <MenubarItem
                                    className='min-w-[159px]'
                                    key={s.id}
                                    onClick={() => {
                                        updateCurrentStudyContext(s.studyContext);
                                        toast(`Context replaced`);
                                    }}
                                >
                                    <div className='flex flex-col gap-1 w-full'>
                                        <span>
                                            {s.name ? s.name : '(no name)'}
                                        </span>
                                        <span className='text-xs text-muted-foreground text-end'>
                                            {s.lastModified && new Date(s.lastModified).toLocaleString()}
                                        </span>
                                    </div>
                                </MenubarItem>
                            })}
                        </MenubarSubContent>
                    </MenubarSub>

                </MenubarContent>
            </MenubarMenu>}
        </Menubar>
    );
};

export default Menu;

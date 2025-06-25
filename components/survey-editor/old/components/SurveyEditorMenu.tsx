import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import React from 'react';
import { EditorMode } from './types';
import { AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SurveyEditorMenuProps {
    currentEditorMode: EditorMode;
    noSurveyOpen: boolean;
    notLatestVersion?: boolean;
    embedded?: boolean;
    onChangeMode: (mode: EditorMode) => void;
    onSave: () => void;
    onOpen: () => void;
    onNew: () => void;
    onExit: () => void;
    onUploadNewVersion: () => void;
}

const SurveyEditorMenu: React.FC<SurveyEditorMenuProps> = (props) => {
    return (
        <TooltipProvider>
            <Menubar
                className='rounded-none px-6 border-0 border-b border-black/20'
            >
                <MenubarMenu>
                    <MenubarTrigger
                        className='font-bold'
                    >
                        Survey Editor
                    </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                        {!props.embedded && <>
                            <MenubarItem onClick={props.onNew}>
                                New...
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={props.onOpen}>
                                Open... <MenubarShortcut>⌘ +  O</MenubarShortcut>
                            </MenubarItem>
                        </>}

                        <MenubarItem
                            onClick={props.onSave}
                            disabled={props.noSurveyOpen}
                        >
                            Save to disk <MenubarShortcut>⌘ +  S</MenubarShortcut>
                        </MenubarItem>

                        {
                            props.embedded && <MenubarItem
                                onClick={props.onUploadNewVersion}
                            >
                                Upload new version
                            </MenubarItem>
                        }
                        <MenubarSeparator />
                        <MenubarItem
                            onClick={props.onExit}
                        >
                            Exit survey editor
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>
                        View
                    </MenubarTrigger>
                    <MenubarContent>
                        <MenubarRadioGroup value={props.currentEditorMode}>
                            <MenubarRadioItem
                                disabled={props.noSurveyOpen}
                                value={EditorMode.Properties}
                                onClick={() => props.onChangeMode(EditorMode.Properties)}
                            >
                                Survey Properties &nbsp; <MenubarShortcut>⌘ + 1</MenubarShortcut>
                            </MenubarRadioItem>
                            <MenubarRadioItem
                                disabled={props.noSurveyOpen}
                                value={EditorMode.ItemEditor}
                                onClick={() => props.onChangeMode(EditorMode.ItemEditor)}
                            >
                                Item Editor <MenubarShortcut>⌘ + 2</MenubarShortcut>
                            </MenubarRadioItem>
                            <MenubarSeparator />
                            <MenubarRadioItem
                                disabled={props.noSurveyOpen}
                                value={EditorMode.Simulator}
                                onClick={() => props.onChangeMode(EditorMode.Simulator)}
                            >
                                Simulator <MenubarShortcut>⌘ + 3</MenubarShortcut>
                            </MenubarRadioItem>
                        </MenubarRadioGroup>
                    </MenubarContent>
                </MenubarMenu>
                <span className='grow'></span>

                {props.notLatestVersion && <div className='flex items-center'>
                    <div className='flex items-center gap-2'>
                        <Tooltip>
                            <TooltipTrigger>
                                <AlertTriangle className='size-5 text-warning-600' />
                            </TooltipTrigger>
                            <TooltipContent>
                                This is not the latest version of the survey.
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>}
            </Menubar>
        </TooltipProvider>
    );
};

export default SurveyEditorMenu;

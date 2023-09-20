import React from 'react';

import { Sidebar, SidebarItem } from '../Sidebar';
import { BsBoxArrowLeft, BsCloudUpload, BsFileEarmarkMedical, BsFilePlay, BsFolder, BsListUl } from 'react-icons/bs';
import { Divider } from '@nextui-org/react';
import { editorModes } from './utils';

interface SidebarProps {
    currentMode: string;
    onModeChange: (mode: string) => void;
    onExit: () => void;
}

const SurveyEditorSidebar: React.FC<SidebarProps> = ({
    currentMode: mode,
    onModeChange: setMode,
    onExit,
}) => {
    return (
        <div className='fixed inset-y-0 z-[50]'>
            <Sidebar
                className='border-default-400'
            >
                <SidebarItem
                    tooltip='File import/export'
                    isActive={mode === editorModes[0]}
                    onPress={() => {
                        setMode(editorModes[0]);
                    }}
                >
                    <BsFolder />
                </SidebarItem>
                <SidebarItem
                    tooltip='Survey properties'
                    isActive={mode === editorModes[1]}
                    onPress={() => {
                        setMode(editorModes[1]);
                    }}
                >
                    <BsFileEarmarkMedical />
                </SidebarItem>

                <SidebarItem
                    tooltip='Survey items'
                    isActive={mode === editorModes[2]}
                    onPress={() => {
                        setMode(editorModes[2]);
                    }}
                >
                    <BsListUl />
                </SidebarItem>

                <SidebarItem
                    tooltip='Preview'
                    isActive={mode === editorModes[3]}
                    onPress={() => {
                        setMode(editorModes[3]);
                    }}
                >
                    <BsFilePlay />
                </SidebarItem>

                <SidebarItem
                    tooltip='Publish'
                    isActive={mode === editorModes[4]}
                    onPress={() => {
                        setMode(editorModes[4]);
                    }}
                >
                    <BsCloudUpload />
                </SidebarItem>

                <span className='grow'></span>
                <Divider />
                <SidebarItem
                    tooltip='Exit Survey Editor'
                    onPress={() => {
                        onExit();
                    }}
                >
                    <BsBoxArrowLeft className='text-secondary' />
                </SidebarItem>

            </Sidebar>
        </div>
    );
};

export default SurveyEditorSidebar;

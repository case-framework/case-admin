import React from 'react';

import { Sidebar, SidebarItem } from '../Sidebar';
import { BsBoxArrowLeft, BsCloudUpload, BsFileEarmarkMedical, BsFilePlay, BsFolder, BsListUl } from 'react-icons/bs';
import { Divider } from '@nextui-org/react';


interface SidebarProps {
    currentMode: string;
    onModeChange: (mode: string) => void;
    onExit: () => void;
    editorModes: Array<{
        mode: string;
        isDisabled?: boolean;
    }>;
}

const SurveyEditorSidebar: React.FC<SidebarProps> = ({
    editorModes,
    currentMode,
    onModeChange: setMode,
    onExit,
}) => {

    const getItem = (mode: string, isDisabled?: boolean) => {
        switch (mode) {
            case 'file':
                return <SidebarItem
                    key={mode}
                    tooltip='File import/export'
                    isActive={currentMode === 'file'}
                    onPress={() => {
                        setMode(mode);
                    }}
                    isDisabled={isDisabled}
                >
                    <BsFolder />
                </SidebarItem>
            case 'props':
                return <SidebarItem
                    key={mode}
                    tooltip='Survey properties'
                    isActive={currentMode === 'props'}
                    onPress={() => {
                        setMode(mode);
                    }}
                    isDisabled={isDisabled}
                >
                    <BsFileEarmarkMedical />
                </SidebarItem>
            case 'items':
                return <SidebarItem
                    key={mode}
                    tooltip='Survey items'
                    isActive={currentMode === 'items'}
                    onPress={() => {
                        setMode(mode);
                    }}
                    isDisabled={isDisabled}
                >
                    <BsListUl />
                </SidebarItem>
            case 'preview':
                return <SidebarItem
                    key={mode}
                    tooltip='Preview'
                    isActive={currentMode === 'preview'}
                    onPress={() => {
                        setMode(mode);
                    }}
                    isDisabled={isDisabled}
                >
                    <BsFilePlay />
                </SidebarItem>
            case 'publish':
                return <SidebarItem
                    key={mode}
                    tooltip='Publish'
                    isActive={currentMode === 'publish'}
                    onPress={() => {
                        setMode(mode);
                    }}
                    isDisabled={isDisabled}
                >
                    <BsCloudUpload />
                </SidebarItem>
            default:
                return null;
        }
    }

    return (
        <div className='fixed inset-y-0 z-[50]'>
            <Sidebar
                className='border-default-400'
            >
                {editorModes.map(mode => getItem(mode.mode, mode.isDisabled))}
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

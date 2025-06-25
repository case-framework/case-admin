import { TooltipProvider } from '@/components/ui/tooltip';
import React from 'react';

interface EditorWrapperProps {
    children: React.ReactNode;
}

const EditorWrapper: React.FC<EditorWrapperProps> = (props) => {
    return (
        <TooltipProvider>
            <div className='p-4 mx-auto flex flex-col bg-neutral-50 rounded-md border border-border'>
                {props.children}
            </div>
        </TooltipProvider>
    );
};

export default EditorWrapper;

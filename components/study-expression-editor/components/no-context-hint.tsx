import React from 'react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';
import { Button } from '@/components/ui/button';
import { PenIcon, TriangleAlertIcon } from 'lucide-react';

const NoContextHint: React.FC = () => {
    const {
        currentStudyContext,
        changeView,
    } = useStudyExpressionEditor();

    if (currentStudyContext) {
        return null;
    }

    return (
        <div className='space-y-2 p-4 bg-muted text-foreground rounded-lg'>
            <p className='text-sm flex items-center gap-2'>
                <span><TriangleAlertIcon className='size-5  text-muted-foreground' /></span>
                Editor context is currently empty. You can load a study context from a previous session, or from a file or create a new one, in order to populate select options and suggestions.
            </p>
            <div className='flex justify-center'>
                <Button onClick={() => {
                    changeView('context-editor');
                }}
                    size={'sm'}
                    variant={'outline'}
                >
                    <span>
                        <PenIcon className='size-4' />
                    </span>
                    Open context editor
                </Button></div>
        </div>
    );
};

export default NoContextHint;

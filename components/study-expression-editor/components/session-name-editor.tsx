import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';

const SessionNameEditor: React.FC = () => {
    const { updateName, currentName } = useStudyExpressionEditor();

    return (
        <Label className='flex flex-col gap-1.5 w-80'>
            <span>
                Session name
            </span>
            <Input
                type='text'
                placeholder='(no name)'
                value={currentName || ''}
                onChange={(e) => {
                    updateName(e.target.value);
                }}
            />
            <p className='text-xs text-muted-foreground'>
                Optional name for this session to help you identify it.
            </p>
        </Label>
    );
};

export default SessionNameEditor;

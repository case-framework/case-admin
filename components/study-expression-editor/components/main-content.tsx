import React from 'react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';
import LoadProjectFromDisk from './load-project-from-disk';
import StudyActionEditor from './study-action-editor';
import StudyRulesEditorOverview from './study-rule-editor/overview';
import StudyExpContextEditorOverview from './context-editor/overview';

const MainContent: React.FC = () => {
    const { view, mode, sessionId } = useStudyExpressionEditor();

    if (!sessionId) {
        return <LoadProjectFromDisk />
    }

    switch (view) {
        case 'expression-editor':
            if (mode === 'study-rules') {
                return <StudyRulesEditorOverview />
            } else if (mode === 'action') {
                return <StudyActionEditor />
            }
            return <p>unknown editor mode</p>
        case 'context-editor':
            return <StudyExpContextEditorOverview />
        case 'load-project-from-disk':
            return <LoadProjectFromDisk />
        default:
            return <p>unknown view</p>
    }

};

export default MainContent;

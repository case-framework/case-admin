'use client';

import StudyExpressionEditor from '@/components/study-expression-editor/study-expression-editor';
import React from 'react';

const Page: React.FC = () => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div>loading...</div>
    }


    return (
        <StudyExpressionEditor />
    );
};

export default Page;

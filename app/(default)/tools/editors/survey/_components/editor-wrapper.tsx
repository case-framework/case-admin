'use client';
import SurveyEditor from "@/components/survey-editor";
import { useRouter } from "next/navigation";
import React from 'react';


const EditorWrapper: React.FC = () => {
    const router = useRouter();
    return (
        <SurveyEditor
            simulatorUrl="/tools/survey-simulator"
            onExit={() => {
                console.log("exit");
                router.push('/tools/editors')
            }}
        />
    );
};

export default EditorWrapper;

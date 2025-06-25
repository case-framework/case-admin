
import { Suspense } from "react";
import SurveyEditorLoader from "./_components/survey-editor-loader";


interface PageProps {
    searchParams: Promise<{
        studyKey: string;
        surveyKey: string;
        versionId: string;
    }>
}

export default async function Page(props: PageProps) {
    return (
        (<Suspense fallback={<div>Loading...</div>}>
            <SurveyEditorLoader
                studyKey={(await props.searchParams).studyKey}
                surveyKey={(await props.searchParams).surveyKey}
                versionId={(await props.searchParams).versionId}
            />
        </Suspense>)
    );

}

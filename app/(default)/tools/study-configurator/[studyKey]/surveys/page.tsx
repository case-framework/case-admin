import { Suspense } from "react";
import SurveyList, { SurveyListSkeleton } from "./_components/SurveyList";
import { StudyKeyPageParams } from "../page";

export default async function Page(props: StudyKeyPageParams) {

    return (
        (<Suspense fallback={<SurveyListSkeleton studyKey={(await props.params).studyKey} />}>
            <SurveyList studyKey={(await props.params).studyKey} />
        </Suspense>)
    );
}

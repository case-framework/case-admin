import SurveyEditor from "@/components/survey-editor/SurveyEditor";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { getSurveyVersion } from "@/utils/server/studyAPI";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        studyKey: string;
        surveyKey: string;
    }
    searchParams: {
        version: string;
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        redirect('/auth/login?callbackUrl=/tools/study-configurator');
    }

    if (!props.searchParams.version) {
        redirect(`/tools/study-configurator/${props.params.studyKey}/survey/${props.params.surveyKey}`);
    }

    // download survey
    const surveyDef = await getSurveyVersion(props.params.studyKey, props.params.surveyKey, props.searchParams.version);

    return <>
        <div className="absolute top-0 z-50 w-full">
            <SurveyEditor
                initialSurvey={surveyDef}

            />
        </div>
    </>
}

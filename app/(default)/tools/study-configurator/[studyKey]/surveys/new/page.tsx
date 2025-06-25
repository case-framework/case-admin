import CreateSurveyActionsCard from "./_components/CreateSurveyActionsCard";
import { getSurveyInfos } from "@/lib/data/studyAPI";
import BackButton from "../../../../../../../components/BackButton";


interface PageProps {
    params: Promise<{
        studyKey: string
    }>
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {
    const surveyKeys = (await getSurveyInfos((await props.params).studyKey)).surveys?.map(s => s.key) || [];

    return (
        (<div className="space-y-4">
            <div>
                <BackButton
                    label="Back to surveys"
                    href={`/tools/study-configurator/${(await props.params).studyKey}/surveys`}
                />
            </div>
            <div className="w-full sm:w-2/3 md:1/2">
                <CreateSurveyActionsCard
                    studyKey={(await props.params).studyKey}
                    existingSurveyKeys={surveyKeys || []}
                />
            </div>
        </div>)
    );
}

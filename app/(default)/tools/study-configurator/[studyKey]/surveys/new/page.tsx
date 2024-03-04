import Breadcrumbs from "@/components/Breadcrumbs";
import CreateSurveyActionsCard from "./CreateSurveyActionsCard";
import { getSurveyInfos } from "@/lib/data/studyAPI";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/spinner";


interface PageProps {
    params: {
        studyKey: string
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {
    const surveyKeys = (await getSurveyInfos(props.params.studyKey)).surveys?.map(s => s.key) || [];

    return (
        <div className="px-unit-lg bg-white/60 h-full">
            <div className="py-unit-sm">
                <Breadcrumbs
                    homeLink="/tools/study-configurator"
                    links={
                        [
                            {
                                title: props.params.studyKey,
                                href: `/tools/study-configurator/${props.params.studyKey}`,
                            },
                            {
                                title: 'Create a new survey'
                            }
                        ]
                    }
                />
                <main className="py-unit-lg">
                    <Suspense fallback={
                        <div className="flex justify-center">
                            <Spinner />
                        </div>
                    }>
                        <CreateSurveyActionsCard
                            studyKey={props.params.studyKey}
                            existingSurveyKeys={surveyKeys || []}
                        />
                    </Suspense>
                </main>
            </div>
        </div>
    )
}

import BackButton from "@/components/BackButton";

import ExporterTabs from "./_components/ExporterTabs";
import { getSurveyInfos } from "@/lib/data/studyAPI";
import { toast } from "sonner";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";
import { ResponsesPageLinkContent } from "../../../_components/breacrumbs-contents";

export default async function Page(
    props: {
        params: Promise<{
            studyKey: string;
        }>;
        searchParams: Promise<{ tab: string }>;
    }
) {
    const searchParams = await props.searchParams;

    const {
        tab
    } = searchParams;

    const params = await props.params;

    const {
        studyKey
    } = params;

    let surveyKeys: string[] = [];
    try {
        const resp = await getSurveyInfos(studyKey)

        if (resp.surveys) {
            surveyKeys = resp.surveys.map(s => s.key);
        }
    } catch (e) {
        toast.error('Failed to fetch survey keys');
        console.error(e);
    }


    return (
        <div
            className="w-full flex flex-col overflow-y-auto" >
            <SidebarToggleWithBreadcrumbs
                breadcrumbs={[
                    {
                        href: "/tools/participants",
                        content: studyKey
                    },
                    {
                        href: `/tools/participants/${studyKey}/responses`,
                        content: <ResponsesPageLinkContent />
                    },
                    {
                        content: 'Exporter'
                    }
                ]}
            />
            <main className="px-4 grow flex flex-col pb-1">
                <div className="">
                    <BackButton
                        label="Back to response explorer"
                        href={`/tools/participants/${studyKey}/responses`}
                    />
                </div>

                <div className="grow">
                    <div className="">
                        <ExporterTabs
                            studyKey={studyKey}
                            availableSurveyKeys={surveyKeys}
                            currentTab={tab}
                        />
                    </div>
                </div>
            </main>

        </div >
    );
}

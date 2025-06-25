import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsDownloader from "./_components/ReportsDownloader";
import { ReportsPageLinkContent } from "../../../_components/breacrumbs-contents";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";

export default async function Page(
    props: {
        params: Promise<{
            studyKey: string;
        }>;
    }
) {
    const params = await props.params;

    const {
        studyKey
    } = params;

    return (
        <div
            className="h-full w-full  flex flex-col" >
            <SidebarToggleWithBreadcrumbs
                breadcrumbs={[
                    {
                        href: "/tools/participants",
                        content: studyKey
                    },
                    {
                        href: `/tools/participants/${studyKey}/reports`,
                        content: <ReportsPageLinkContent />
                    },
                    {
                        content: "Download reports"
                    }
                ]}
            />
            <main className="px-4">
                <div className="">
                    <BackButton
                        label="Back to reports explorer"
                        href={`/tools/participants/${studyKey}/reports`}
                    />
                </div>

                <div className="grow flex overflow-hidden">
                    <div className="w-full h-full flex flex-col">
                        <Card
                            variant={'opaque'}
                        >
                            <CardHeader>
                                <CardTitle>
                                    Export Reports
                                </CardTitle>
                                <CardDescription>
                                    Prepare a JSON file with all the reports for the given query and when ready download the file.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ReportsDownloader
                                    studyKey={studyKey}
                                />
                            </CardContent>
                        </Card >
                    </div>
                </div>
            </main>
        </div >
    );
}

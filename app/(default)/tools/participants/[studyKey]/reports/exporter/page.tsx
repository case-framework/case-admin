import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsDownloader from "./_components/ReportsDownloader";
import { ReportsPageLinkContent } from "../../../_components/breacrumbs-contents";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";

export default function Page({
    params: { studyKey }
}: {
    params: {
        studyKey: string;
    };
}) {

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
                                    The file will be prepared based on your query and when ready it will be downloaded.
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

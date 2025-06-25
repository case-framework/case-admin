import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TaskTracker from "../../../../../../../../components/ExportTaskTracker";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";
import { ReportsPageLinkContent } from "../../../../_components/breacrumbs-contents";

export default async function Page(
    props: {
        params: Promise<{
            studyKey: string;
            taskID: string;
        }>;
    }
) {
    const params = await props.params;

    const {
        studyKey,
        taskID
    } = params;

    return (
        <div
            className="h-full w-full flex flex-col" >
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
                        href: `/tools/participants/${studyKey}/reports/exporter`,
                        content: "Download reports"
                    },
                    {
                        content: 'Export task'
                    }
                ]}
            />
            <main className="px-4">
                <div className="">
                    <BackButton
                        label="Back to exporter"
                        href={`/tools/participants/${studyKey}/reports/exporter`}
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
                                <TaskTracker
                                    taskID={taskID}
                                    taskURLPrefix={`/v1/studies/${studyKey}/data-exporter/reports`}
                                />
                            </CardContent>
                        </Card >
                    </div>
                </div>
            </main>

        </div >
    );
}

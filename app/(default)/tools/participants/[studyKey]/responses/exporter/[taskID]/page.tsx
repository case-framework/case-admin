import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TaskTracker from "../../../../../../../../components/ExportTaskTracker";
import { ResponsesPageLinkContent } from "../../../../_components/breacrumbs-contents";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";

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
        <div>
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
                        href: `/tools/participants/${studyKey}/responses/exporter`,
                        content: 'Exporter'
                    },
                    {
                        content: 'Exporter task'
                    }
                ]}
            />
            <main className="px-4">
                <div className="">
                    <BackButton
                        label="Back to exporter"
                        href={`/tools/participants/${studyKey}/responses/exporter`}
                    />
                </div>

                <div className="grow flex overflow-hidden">
                    <div className="w-full h-full flex flex-col">
                        <Card
                            variant={'opaque'}
                        >
                            <CardHeader>
                                <CardTitle>
                                    Export Responses
                                </CardTitle>
                                <CardDescription>
                                    {"Your file is being prepared. You can download it once it's ready."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TaskTracker
                                    taskID={taskID}
                                    taskURLPrefix={`/v1/studies/${studyKey}/data-exporter/responses`}
                                />
                            </CardContent>
                        </Card >
                    </div>
                </div>
            </main>

        </div >
    );
}

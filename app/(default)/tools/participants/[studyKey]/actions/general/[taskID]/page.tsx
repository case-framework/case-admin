import BackButton from "@/components/BackButton";
import TaskTracker from "@/components/ExportTaskTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


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
            className="h-full w-full p-6 flex flex-col" >
            <div className="">
                <BackButton
                    label="Back to start action"
                    href={`/tools/participants/${studyKey}/actions/general`}
                />
            </div>

            <div className="grow flex overflow-hidden">
                <div className="w-full h-full flex flex-col">
                    <Card
                        variant={'opaque'}
                    >
                        <CardHeader>
                            <CardTitle>
                                Study action execution
                            </CardTitle>
                            <CardDescription>
                                {"Your task is running."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TaskTracker
                                taskID={taskID}
                                taskURLPrefix={`/v1/studies/${studyKey}/data-exporter/participants`}
                            />
                        </CardContent>
                    </Card >
                </div>
            </div>

        </div >
    );
}

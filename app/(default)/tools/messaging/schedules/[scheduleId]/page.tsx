import { Suspense } from "react";
import ScheduleEditorLoader, { ScheduleEditorLoaderSkeleton } from "../_components/ScheduleEditorLoader";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

export const dynamic = 'force-dynamic';

export default function Page(
    props: {
        params: { scheduleId: string; }
    }
) {

    return (
        <SimpleBreadcrumbsPageLayout
            links={[
                {
                    title: 'Messaging Tools',
                    href: '/tools/messaging',
                },
                {
                    title: 'Scheduled emails',
                    href: '/tools/messaging/schedules',
                },
                {
                    title: props.params.scheduleId,
                },
            ]}
        >
            <div className="h-full w-full pb-6 flex flex-col gap-4" >
                <div className="grow flex overflow-hidden">
                    <Suspense fallback={<ScheduleEditorLoaderSkeleton />}>
                        <ScheduleEditorLoader
                            id={props.params.scheduleId}
                        />
                    </Suspense>
                </div>
            </div>
        </SimpleBreadcrumbsPageLayout>
    );
}

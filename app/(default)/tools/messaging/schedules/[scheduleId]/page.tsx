import { Suspense } from "react";
import ScheduleEditorLoader, { ScheduleEditorLoaderSkeleton } from "../_components/ScheduleEditorLoader";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

export const dynamic = 'force-dynamic';

export default async function Page(
    props: {
        params: Promise<{ scheduleId: string; }>
    }
) {

    return (
        (<SimpleBreadcrumbsPageLayout
            links={[
                {
                    title: 'Messaging Tools',
                    href: '/tools/messaging',
                },
                {
                    title: 'Schedules emails',
                    href: '/tools/messaging/schedules',
                },
                {
                    title: (await props.params).scheduleId,
                },
            ]}
        >
            <div className="h-full w-full pb-6 flex flex-col gap-4" >
                <div className="grow flex overflow-hidden">
                    <Suspense fallback={<ScheduleEditorLoaderSkeleton />}>
                        <ScheduleEditorLoader
                            id={(await props.params).scheduleId}
                        />
                    </Suspense>
                </div>
            </div>
        </SimpleBreadcrumbsPageLayout>)
    );
}

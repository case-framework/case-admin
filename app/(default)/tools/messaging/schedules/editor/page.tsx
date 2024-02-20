import Breadcrumbs from "@/components/Breadcrumbs";
import { redirect } from "next/navigation";
import ScheduleEditor from "./ScheduleEditor";
import { MessageSchedule } from "@/utils/server/types/messaging";
import { getMessageSchedules } from "@/utils/server/messagingAPI";


export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: {
        id?: string;
    }

}

export default async function Page(props: PageProps) {

    const scheduleId = props.searchParams.id;

    let schedules: MessageSchedule[];
    try {
        schedules = await getMessageSchedules();
    } catch (e) {
        redirect('/auth/login?callbackUrl=/tools/messaging/schedules')
    }

    const currentSchedule = schedules.find(s => s.id === scheduleId);
    if (scheduleId && !currentSchedule) {
        redirect('/tools/messaging/schedules')
    }

    return (
        <div className="px-unit-lg h-full">
            <div className="py-unit-sm">
                <Breadcrumbs
                    homeLink="/tools/messaging"
                    links={
                        [
                            {
                                title: 'Message schedules',
                                href: '/tools/messaging/schedules'
                            },
                            {
                                title: scheduleId ? 'Edit schedule' : 'Create new schedule',
                            }
                        ]
                    }
                />
                <main className="py-unit-lg">
                    <div className="flex flex-col justify-start">
                        <ScheduleEditor
                            schedule={currentSchedule}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}


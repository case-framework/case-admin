'use server';

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCASEManagementAPIURL, getTokenHeader } from "@/utils/server/api";
import { MessageSchedule } from "@/utils/server/types/messaging";
import { getServerSession } from "next-auth/next";




export const getMessageSchedules = async (): Promise<MessageSchedule[]> => {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        throw new Error('Unauthorized');
    }

    const url = getCASEManagementAPIURL('/v1/messaging/auto-messages');
    const response = await fetch(url,
        {
            headers: {
                ...getTokenHeader(session.accessToken)
            },
            next: {
                revalidate: 10
            }
        });

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    let schedules: Array<MessageSchedule> = data.autoMessages || [];
    schedules = schedules.map((schedule) => {
        let nt = schedule.nextTime;
        if (typeof nt === 'string') nt = parseInt(nt);

        let until = schedule.until;
        if (typeof until === 'string') until = parseInt(until);

        let period = schedule.period;
        if (typeof period === 'string') period = parseInt(period);

        return {
            ...schedule,
            nextTime: nt,
            until,
            period,
        }
    })
    return schedules;
}

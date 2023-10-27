'use server';

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { MessageSchedule } from "@/utils/server/types/messaging";
import { getServerSession } from "next-auth/next";


export const saveMessageSchedule = async (
    messageSchedule: MessageSchedule
) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) throw new Error('unauthenticated');
    const url = getCASEManagementAPIURL('/v1/messaging/auto-messages');
    const r = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({ 'autoMessage': messageSchedule }),
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json'
        },
        next: { revalidate: 0 }
    });
    if (r.status !== 200) {
        console.error(await r.json());
        throw new Error('Failed to save message schedule');
    }
    return r.json();
}

export const deleteMessageSchedule = async (
    id: string
) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/messaging/auto-message/${id}`);
    const r = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
        next: { revalidate: 0 }
    });
    if (r.status !== 200) {
        console.error(await r.json());
        throw new Error('Failed to delete message schedule');
    }
    return r.json();
}

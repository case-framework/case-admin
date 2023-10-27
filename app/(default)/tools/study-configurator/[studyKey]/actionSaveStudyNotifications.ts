'use server';

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { getServerSession } from "next-auth/next";


export const saveStudyNotifications = async (studyKey: string, subscriptions: { messageType: string; email: string }[]) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}/notification-subscriptions`);
    const r = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscriptions }),
        next: { revalidate: 0 }
    });
    if (r.status !== 200) {
        console.error(await r.json());
        throw new Error('upload failed');
    }
    return r.json();
}

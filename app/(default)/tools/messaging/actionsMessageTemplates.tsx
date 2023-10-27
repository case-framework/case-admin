'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { Study } from "@/utils/server/types/studyInfos";
import { getServerSession } from "next-auth/next";


export const uploadMessageTemplate = async (template: any): Promise<Study> => {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/messaging/email-templates`);
    const r = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({ template: template }),
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json'
        },
        next: { revalidate: 0 }
    });
    if (r.status !== 200) {
        console.error(await r.json());
        throw new Error('upload failed');
    }
    return r.json();
}

export const deleteMessageTemplate = async (
    messageType: string,
    studyKey: string,
) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/messaging/email-templates/delete`);
    const r = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({ messageType, studyKey }),
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

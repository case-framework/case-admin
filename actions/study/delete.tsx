'use server';

import { auth } from "@/auth";
import { getCASEManagementAPIURL } from "@/utils/server/api";


export const deleteStudyAction = async (studyKey: string) => {
    const session = await auth();
    if (!session || !session.accessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}`);
    const r = await fetch(url.toString(), {
        method: 'DELETE',
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

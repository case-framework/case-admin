'use server';

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { getServerSession } from "next-auth/next";


export const deleteStudyAction = async (studyKey: string) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}`);
    const r = await fetch(url.toString(), {
        method: 'DELETE',
        body: JSON.stringify({ studyKey: studyKey }),
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json'
        },
        next: { revalidate: 0 }
    });
    if (r.status !== 200) {
        console.log(await r.json());
        throw new Error('upload failed');
    }
    return r.json();
}

'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { getServerSession } from "next-auth/next";
import { Survey } from "survey-engine/data_types";


export const uploadSurvey = async (studyKey: string, survey: Survey) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}/surveys`);
    const r = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({ survey: survey }),
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

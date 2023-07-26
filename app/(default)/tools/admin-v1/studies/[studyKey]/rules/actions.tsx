'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { getServerSession } from "next-auth/next";
import { Expression } from "survey-engine/data_types";


export const uploadStudyRules = async (studyKey: string, rulesObj: {
    rules: Expression[]
}) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}/rules`);
    const r = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify(rulesObj),
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

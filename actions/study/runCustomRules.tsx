'use server'

import { auth } from "@/auth";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { Expression } from "survey-engine/data_types";


export const runCustomRules = async (studyKey: string, rulesObj: {
    rules: Expression[]
}) => {
    const session = await auth();
    if (!session || !session.accessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}/run-rules`);
    const r = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({
            studyKey,
            rules: rulesObj.rules,
        }),
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

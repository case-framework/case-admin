'use server'

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";

export const createPermissionForManagementUser = async (
    userID: string,
    resourceType: string,
    resourceKey: string,
    action: string,
    limiter: string
) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, body: { error: 'Unauthorized' } };
    }

    const resp = await fetchCASEManagementAPI(`/v1/user-management/management-users/${userID}/permissions`,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                resourceType,
                resourceKey,
                action,
                limiter
            }),
            revalidate: 0,
        });
    if (resp.status !== 200) {
        return { error: `Failed to create permissions: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/user-management');
    return resp.body;
}

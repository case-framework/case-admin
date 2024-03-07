'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { Pagination } from "@/utils/server/types/paginationInfo";
import { ParticipantState } from "@/utils/server/types/participantState";


export const getParticipants = async (
    studyKey: string,
    page: number,
    filter?: string,
    sort?: string,
    pageSize?: number,
): Promise<{
    error?: string,
    participants?: ParticipantState[],
    pagination?: Pagination
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const queryParams = new URLSearchParams();
    if (filter) {
        queryParams.append('filter', filter);
    }
    if (sort) {
        queryParams.append('sort', sort);
    }
    queryParams.append('page', page.toString());
    if (pageSize) queryParams.append('limit', pageSize.toString());


    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-explorer/participants?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch participants: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

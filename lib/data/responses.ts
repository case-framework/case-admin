'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { Pagination } from "@/utils/server/types/paginationInfo";
import { Task } from "./tasks";

export const getResponses = async (
    studyKey: string,
    surveyKey: string,
    page: number,
    filter?: string,
    sort?: string,
    pageSize?: number,
    useShortKeys?: boolean,
): Promise<{
    error?: string,
    responses?: Array<{
        [key: string]: number | string | boolean | Object
    }>
    pagination?: Pagination
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const queryParams = new URLSearchParams();
    queryParams.append('surveyKey', surveyKey);
    if (filter) {
        queryParams.append('filter', filter);
    }
    if (sort) {
        queryParams.append('sort', sort);
    }
    queryParams.append('page', page.toString());
    if (pageSize) queryParams.append('limit', pageSize.toString());
    queryParams.append('shortKeys', useShortKeys ? 'true' : 'false');


    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-explorer/responses?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch responses: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}


export const startResponseExport = async (
    studyKey: string,
    surveyKey: string,
    exportFormat: string,
    keySeparator: string,
    queryStartDate: number,
    queryEndDate: number,
    useShortKeys: boolean,
    sort?: string,
): Promise<{
    error?: string,
    task?: Task
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const queryParams = new URLSearchParams();

    const filter = {
        '$and': [
            { arrivedAt: { '$gt': queryStartDate } },
            { arrivedAt: { '$lt': queryEndDate } }
        ]
    };
    queryParams.append('filter', encodeURIComponent(JSON.stringify(filter)));
    if (sort) {
        queryParams.append('sort', sort);
    }
    queryParams.append('format', exportFormat);
    queryParams.append('questionOptionSep', keySeparator);
    queryParams.append('surveyKey', surveyKey);
    queryParams.append('shortKeys', useShortKeys ? 'true' : 'false');

    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-exporter/responses?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'GET',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to start export task: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

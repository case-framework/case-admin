'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { Pagination } from "@/utils/server/types/paginationInfo";
import { Task } from "./tasks";

export interface Report {
    id: string;
    key: string;
    participantID: string;
    responseID: string;
    timestamp: number;
    data?: Array<{
        key: string;
        value: string;
        dtype?: string;
    }>
}

export const getReportKeys = async (
    studyKey: string,
    participantID?: string,
    fromDate?: Date,
    toDate?: Date,
): Promise<{
    error?: string,
    reportKeys?: Array<string>
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const queryParams = new URLSearchParams();
    if (participantID) {
        queryParams.append('pid', participantID);
    }
    if (fromDate && !isNaN(fromDate.getTime())) {
        queryParams.append('from', Math.floor(fromDate.getTime() / 1000).toFixed(0));
    }
    if (toDate && !isNaN(toDate.getTime())) {
        queryParams.append('until', Math.floor(toDate.getTime() / 1000).toFixed(0));
    }

    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-explorer/reports/keys?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch report keys: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getReports = async (
    studyKey: string,
    page: number,
    reportKey?: string,
    participantID?: string,
    from?: Date,
    until?: Date,
    pageSize?: number,
): Promise<{
    error?: string,
    reports?: Array<Report>
    pagination?: Pagination
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const queryParams = new URLSearchParams();
    if (reportKey) {
        queryParams.append('reportKey', reportKey);
    }
    if (participantID) {
        queryParams.append('pid', participantID);
    }
    if (from !== undefined && !isNaN(from.getTime())) {
        queryParams.append('from', Math.floor(from.getTime() / 1000).toString());
    }
    if (until !== undefined && !isNaN(until.getTime())) {
        queryParams.append('until', Math.floor(until.getTime() / 1000).toString());
    }
    queryParams.append('page', page.toString());
    if (pageSize) queryParams.append('limit', pageSize.toString());


    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-explorer/reports?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch reports: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getReportCount = async (
    studyKey: string,
    reportKey?: string,
    participantID?: string,
    from?: Date,
    until?: Date,
): Promise<{
    error?: string,
    count?: number
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const queryParams = new URLSearchParams();
    if (reportKey) {
        queryParams.append('reportKey', reportKey);
    }
    if (participantID) {
        queryParams.append('pid', participantID);
    }
    if (from !== undefined && !isNaN(from.getTime())) {
        queryParams.append('from', Math.floor(from.getTime() / 1000).toString());
    }
    if (until !== undefined && !isNaN(until.getTime())) {
        queryParams.append('until', Math.floor(until.getTime() / 1000).toString());
    }
    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-exporter/reports/count?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch report count: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const startReportExport = async (
    studyKey: string,
    reportKey?: string,
    participantID?: string,
    from?: Date,
    until?: Date,
    type?: 'csv' | 'raw',
): Promise<{
    error?: string,
    task?: Task
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/data-exporter/reports`;

    const queryParams = new URLSearchParams();
    if (reportKey) {
        queryParams.append('reportKey', reportKey);
    }
    if (participantID) {
        queryParams.append('pid', participantID);
    }
    if (from !== undefined && !isNaN(from.getTime())) {
        queryParams.append('from', Math.floor(from.getTime() / 1000).toString());
    }
    if (until !== undefined && !isNaN(until.getTime())) {
        queryParams.append('until', Math.floor(until.getTime() / 1000).toString());
    }
    if (type) {
        queryParams.append('type', type);
    }
    const queryString = queryParams.toString();
    const urlWithQuery = `${url}?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        urlWithQuery,
        session.CASEaccessToken,
        {
            method: 'POST',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to start export task: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

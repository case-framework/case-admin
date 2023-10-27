import 'server-only';
import { getCASEManagementAPIURL, getTokenHeader } from "./api";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { Study } from './types/studyInfos';
import { Survey } from 'survey-engine/data_types';


export const getSurveysForStudy = async (studyKey: string) => {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        throw new Error('Unauthorized');
    }

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}/surveys`);

    const response = await fetch(url,
        {
            headers: {
                ...getTokenHeader(session.accessToken)
            },
            next: {
                revalidate: 10
            }
        });
    if (response.status !== 200) {
        try {
            const err = await response.json();
            throw new Error(err.error);
        } catch (error) {
            throw new Error(`Error ${response.status} when fetching surveys`);
        }
    }
    const data = await response.json();
    return data;
}

export const getStudies = async (): Promise<{ studies?: Study[] }> => {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        throw new Error('Unauthorized');
    }

    const url = getCASEManagementAPIURL(`/v1/studies`);

    const response = await fetch(url,
        {
            headers: {
                ...getTokenHeader(session.accessToken)
            },
            next: {
                revalidate: 10
            }
        });
    if (response.status !== 200) {
        try {
            const err = await response.json();
            throw new Error(err.error);
        } catch (error) {
            throw new Error(`Error ${response.status} when fetching studies`);
        }
    }
    const data = await response.json();
    return data;
}


export const getStudy = async (studyKey: string): Promise<Study> => {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        throw new Error('Unauthorized');
    }

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}`);

    const response = await fetch(url,
        {
            headers: {
                ...getTokenHeader(session.accessToken)
            },
            next: {
                revalidate: 0
            }
        });
    if (response.status !== 200) {
        try {
            const err = await response.json();
            throw new Error(err.error);
        } catch (error) {
            throw new Error(`Error ${response.status} when fetching study`);
        }
    }
    const data = await response.json();
    return data;
}

export const getSurveyKeys = async (studyKey: string): Promise<{
    keys: string[]
}> => {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        throw new Error('Unauthorized');
    }

    const url = getCASEManagementAPIURL(`v1/study/${studyKey}/survey-keys`);

    const response = await fetch(url,
        {
            headers: {
                ...getTokenHeader(session.accessToken)
            },
            next: {
                revalidate: 10
            }
        });
    if (response.status !== 200) {
        try {
            const err = await response.json();
            throw new Error(err.error);
        } catch (error) {
            throw new Error(`Error ${response.status} when fetching survey keys`);
        }
    }
    const data = await response.json();
    return data;
}

export const getSurveyVersion = async (studyKey: string, surveyKey: string, versionID: string): Promise<Survey> => {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        throw new Error('Unauthorized');
    }

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}/survey/${surveyKey}/${versionID}`);
    const response = await fetch(url,
        {
            headers: {
                ...getTokenHeader(session.accessToken)
            },
            next: {
                revalidate: 10
            }
        });
    if (response.status !== 200) {
        try {
            const err = await response.json();
            throw new Error(err.error);
        } catch (error) {
            throw new Error(`Error ${response.status} when fetching survey version`);
        }
    }
    const data = await response.json();
    return data;
}

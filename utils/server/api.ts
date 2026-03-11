import { LoginMsg, LoginResponse, TokenResponse } from './types/authAPI';

export const getCASEManagementAPIURL = (path: string): URL => {
    return new URL(path, process.env.MANAGEMENT_API_URL ? process.env.MANAGEMENT_API_URL : '');
}


export const getTokenHeader = (accessToken?: string): object | { Authorization: string } => {
    if (!accessToken) {
        return {};
    }
    return {
        Authorization: `Bearer ${accessToken}`
    }
}

export const getServiceAccountHeaders = (
    apiKey?: string,
    instanceId?: string
): Record<string, string> => {
    const headers: Record<string, string> = {};

    if (apiKey) {
        headers['X-API-Key'] = apiKey;
    }

    if (instanceId) {
        headers['X-Instance-ID'] = instanceId;
    }

    return headers;
}

const postToCASEManagementAPI = async (path: string, data: object, accessToken?: string) => {
    const url = getCASEManagementAPIURL(path);
    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getTokenHeader(accessToken)
        },
        body: JSON.stringify(data)
    });
    if (!response.ok || response.status > 299) {
        throw await response.json();
    }
    return await response.json();
}

interface IdPLoginMsg {
    instanceId: string;
    sub: string;
    name?: string;
    provider?: string;
    email?: string;
    imageURL?: string;
    roles?: string[];
    renewToken?: string;
}


export const signInWithIdPRequest = async (creds: IdPLoginMsg): Promise<{
    sessionID: string;
    accessToken: string;
    expiresAt: number;
    isAdmin: boolean;
}> => {
    return postToCASEManagementAPI('/v1/auth/signin-with-idp', creds);
}

export const getRenewTokenRequest = async (accessToken: string, sessionId: string): Promise<{
    renewToken: string;
}> => {
    const url = getCASEManagementAPIURL(`/v1/auth/renew-token/${sessionId}`);
    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            ...getTokenHeader(accessToken),
        }
    });
    if (!response.ok || response.status > 299) {
        throw await response.json();
    }
    return await response.json();
}

export const extendSessionRequest = async (accessToken: string, newRenewToken: string): Promise<{
    sessionID: string;
    accessToken: string;
    expiresAt: number;
    isAdmin: boolean;
}> => {
    const url = getCASEManagementAPIURL('/v1/auth/extend-session');
    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getTokenHeader(accessToken)
        },
        body: JSON.stringify({ renewToken: newRenewToken })
    });
    if (!response.ok || response.status > 299) {
        throw await response.json();
    }
    return await response.json();
}


/*const caseAdminAPIInstance = axios.create({
    baseURL: process.env.MANAGEMENT_API_URL ? process.env.MANAGEMENT_API_URL : '',
    httpsAgent: process.env.USE_MUTUAL_TLS === 'true' ? new https.Agent({
        key: fs.readFileSync(process.env.MUTUAL_TLS_CLIENT_KEY_PATH ? process.env.MUTUAL_TLS_CLIENT_KEY_PATH : ''),
        cert: fs.readFileSync(process.env.MUTUAL_TLS_CLIENT_CERTIFICATE_PATH ? process.env.MUTUAL_TLS_CLIENT_CERTIFICATE_PATH : ''),
        ca: fs.readFileSync(process.env.MUTUAL_TLS_CA_CERTIFICATE_PATH ? process.env.MUTUAL_TLS_CA_CERTIFICATE_PATH : '')
    }) : undefined,
});*/


// Auth API
export const loginWithEmailRequest = async (creds: LoginMsg): Promise<LoginResponse> => {
    return postToCASEManagementAPI('/v1/auth/login-with-email', creds);
}

export const renewTokenRequest = async (refreshToken: string, accessToken: string): Promise<TokenResponse> => {
    const url = getCASEManagementAPIURL('/v1/auth/renew-token');

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        headers: {
            ...getTokenHeader(accessToken),
        },
        next: { revalidate: 0 }
    });
    if (response.status !== 200) {
        const err = await response.json();
        console.error(`issue renew token request: ${response.status} ${err} | ${url}`);
        throw new Error(err.error);
    }
    const data = await response.json();
    return data as TokenResponse;
}

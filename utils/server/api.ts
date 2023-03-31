import axios from 'axios';
import * as fs from 'fs';
import * as https from 'https';
import { LoginMsg, LoginResponse, TokenResponse } from './types/authAPI';

const caseAdminAPIInstance = axios.create({
    baseURL: process.env.MANAGEMENT_API_URL ? process.env.MANAGEMENT_API_URL : '',
    httpsAgent: process.env.USE_MUTUAL_TLS === 'true' ? new https.Agent({
        key: fs.readFileSync(process.env.MUTUAL_TLS_CLIENT_KEY_PATH ? process.env.MUTUAL_TLS_CLIENT_KEY_PATH : ''),
        cert: fs.readFileSync(process.env.MUTUAL_TLS_CLIENT_CERTIFICATE_PATH ? process.env.MUTUAL_TLS_CLIENT_CERTIFICATE_PATH : ''),
        ca: fs.readFileSync(process.env.MUTUAL_TLS_CA_CERTIFICATE_PATH ? process.env.MUTUAL_TLS_CA_CERTIFICATE_PATH : '')
    }) : undefined,
});

const getTokenHeader = (accessToken: string) => {
    return {
        'Authorization': `Bearer ${accessToken}`
    }
}

// Auth API
export const loginWithEmailRequest = (creds: LoginMsg) => caseAdminAPIInstance.post<LoginResponse>('/v1/auth/login-with-email', creds);
export const renewTokenRequest = (refreshToken: string, accessToken: string) => caseAdminAPIInstance.post<TokenResponse>('/v1/auth/renew-token', { refreshToken }, { headers: { ...getTokenHeader(accessToken) } });

export default caseAdminAPIInstance;

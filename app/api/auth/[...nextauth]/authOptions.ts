import { renewTokenRequest } from "@/utils/server/api";
import { AuthOptions } from "next-auth/";
import { loginWithEmailRequest } from "@/utils/server/api";

import CredentialsProvider from "next-auth/providers/credentials"
import { Provider } from "next-auth/providers"
import { ERROR_SECOND_FACTOR_NEEDED } from '@/utils/server/types/authAPI';

interface CredentialsUser {
    id: string;
    email: string;
    account: {
        accessToken: string;
        expiresAt: Date;
        refreshToken: string;
    };
}


const CASECredentialProvider = CredentialsProvider({
    id: "case-credentials",
    credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        verificationCode: { label: "Verification Code", type: "text" },
    },
    async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
            return null;
        }

        try {
            const response = await loginWithEmailRequest({
                email: credentials.email,
                password: credentials.password,
                verificationCode: credentials.verificationCode,
                instanceId: process.env.INSTANCE_ID ? process.env.INSTANCE_ID : 'default',
            });
            if (response.secondFactorNeeded) {
                throw new Error(ERROR_SECOND_FACTOR_NEEDED);
            }

            const now = new Date();
            return {
                id: response.user.id,
                email: response.user.account.accountId,
                account: {
                    accessToken: response.token.accessToken,
                    expiresAt: new Date(now.getTime() + response.token.expiresIn * 60000),
                    refreshToken: response.token.refreshToken,
                }
            };
        } catch (error: any) {
            console.error('Unexpected error when logging in with credentials');
            throw error;
        }
    },
})


const CASEOAuthProvider = (process.env.OPENID_CONFIG && process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET) ? {
    id: "management-user-oauth",
    name: "Management User OAuth",
    type: "oauth",
    wellKnown: process.env.OPENID_CONFIG,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    authorization: { params: { scope: "openid email profile" } },
    idToken: true,

    profile(profile) {
        return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
        }
    },

} as Provider : null;

const providers: Provider[] = [
    CASECredentialProvider,
];

if (CASEOAuthProvider) {
    providers.push(CASEOAuthProvider);
}

declare module "next-auth/" {
    interface Session {
        accessToken?: string
        error?: "RefreshAccessTokenError" | "LoginFailed"
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        access_token?: string
        expires_at?: number
        refresh_token?: string
        error?: "RefreshAccessTokenError" | "LoginFailed"
    }
}

export const authOptions = {
    providers: providers,
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                // Save the access token and refresh token in the JWT on the initial login
                if (account.provider === 'case-credentials') {
                    if (!user) {
                        return {
                            ...token,
                            error: 'LoginFailed' as const,
                        };
                    }
                    const currentUser = user as CredentialsUser;
                    console.log(currentUser.account.expiresAt.getTime(),)
                    return {
                        email: currentUser.email,
                        access_token: currentUser.account.accessToken,
                        expires_at: currentUser.account.expiresAt.getTime(),
                        refresh_token: currentUser.account.refreshToken,

                    };
                }

                console.log(account);
                console.log(user);
                return {
                    // email: account.email,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    refresh_token: account.refresh_token,
                }

            } else if (token.expires_at !== undefined && token.expires_at > 0 && Date.now() < token.expires_at) {
                // If the access token has not expired yet, return it
                return token
            } else {
                console.log('refreshing token');
                // If the access token has expired, try to refresh it
                if (!token.refresh_token || !token.access_token) {
                    return {
                        // ...token,
                        error: 'RefreshAccessTokenError' as const,
                    }
                }
                try {
                    const response = await renewTokenRequest(token.refresh_token, token.access_token);
                    return {
                        ...token,
                        access_token: response.accessToken,
                        expires_at: new Date().getTime() + response.expiresIn * 60000,
                        refresh_token: response.refreshToken,
                    }
                } catch (error) {
                    console.error(error);
                    return {
                        // ...token,
                        error: 'RefreshAccessTokenError' as const,
                    }
                }

                return token;
            }
        },
        session({ session, token }) {
            session.accessToken = token.access_token;
            session.error = token.error
            return session
        },

    },
    logger: {
        debug: (...args) => console.log(...args),
        error: (...args) => console.error(...args),
        warn: (...args) => console.warn(...args),
    }
} as AuthOptions;

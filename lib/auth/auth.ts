import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { DbKey, getDb } from "../db/db-registry";
import { mustGetEnv } from "../utils/env-utils";
import { admin } from "better-auth/plugins"


const db = await getDb(DbKey.USER);

export const UserRole = {
    ADMIN: "admin",
    USER: "user",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];


export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client: db.client,
    }),
    user: {
        modelName: 'case_admin_users',
    },
    account: {
        modelName: 'case_admin_accounts'
    },
    session: {
        modelName: 'case_admin_sessions'
    },
    verification: {
        modelName: 'case_admin_verifications'
    },
    socialProviders: {
        microsoft: {
            clientId: mustGetEnv("MICROSOFT_CLIENT_ID"),
            clientSecret: mustGetEnv("MICROSOFT_CLIENT_SECRET"),
            tenantId: mustGetEnv("MICROSOFT_TENANT_ID"),
        }
    },
    advanced: {
        cookiePrefix: "case-admin-auth",
    },
    plugins: [
        admin()
    ],
});

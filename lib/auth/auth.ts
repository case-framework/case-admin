import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDb } from "../db/db-registry";
import { DbKey } from "../db/utils";
import { mustGetEnv } from "../utils/env-utils";
import { admin } from "better-auth/plugins"
import { UserRole } from "../types/user";


const db = await getDb(DbKey.USERS);

const recoveryModeEmail = process.env.RECOVERY_MODE_EMAIL?.trim().toLowerCase();

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client: db.client,
        transaction: false,
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
    databaseHooks: {
        session: {
            create: {
                async before(session, ctx) {
                    if (!ctx || !recoveryModeEmail) {
                        return;
                    }

                    const user = await ctx.context.internalAdapter.findUserById(session.userId);

                    if (!user) {
                        return;
                    }

                    const normalizedUserEmail = user.email.trim().toLowerCase();
                    const currentRole = (user as typeof user & { role?: string }).role;

                    if (
                        normalizedUserEmail === recoveryModeEmail &&
                        currentRole !== UserRole.ADMIN
                    ) {
                        await ctx.context.internalAdapter.updateUser(session.userId, {
                            role: UserRole.ADMIN,
                        });
                    }
                },
            },
        },
    },
    plugins: [
        admin()
    ],
});

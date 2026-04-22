import "server-only";
import { getDb } from "../db-registry";
import { DbKey } from "../utils";
import { AppDb, CollectionIndexDef } from "./base";
import { UserDoc, PermissionDoc } from "../service/types";

export class UsersDb extends AppDb {
    readonly key = DbKey.USERS;

    // Better Auth collections — managed by Better Auth, no custom index recommendations
    readonly caseAdminUsers = this.db.collection<UserDoc>("case_admin_users");
    readonly caseAdminAccounts = this.db.collection("case_admin_accounts");
    readonly caseAdminSessions = this.db.collection("case_admin_sessions");
    readonly caseAdminVerifications = this.db.collection("case_admin_verifications");

    // Management API collections — used by CASE
    readonly managementUsers = this.db.collection("management_users");
    readonly managementUserSessions = this.db.collection("management_user_sessions");
    readonly serviceUserApiKeys = this.db.collection("service_user_api_keys");
    readonly appRoles = this.db.collection("app_roles");
    readonly appRoleTemplates = this.db.collection("app_role_templates");
    readonly permissions = this.db.collection<PermissionDoc>("permissions");

    readonly indexDefs: CollectionIndexDef[] = [
        {
            collection: this.managementUsers,
            indexes: [
                { name: "uniq_sub_1", keys: { sub: 1 }, unique: true },
            ],
        },
        {
            collection: this.managementUserSessions,
            indexes: [
                { name: "createdAt_1", keys: { createdAt: 1 }, expireAfterSeconds: 172800 },
            ],
        },
        {
            collection: this.serviceUserApiKeys,
            indexes: [
                { name: "key_1", keys: { key: 1 }, unique: true },
                { name: "expiresAt_1", keys: { expiresAt: 1 }, expireAfterSeconds: 0 },
            ],
        },
        {
            collection: this.appRoles,
            indexes: [
                { name: "subjectId_1", keys: { subjectId: 1 } },
                { name: "appName_1", keys: { appName: 1 } },
                { name: "uniq_subjectType_1_subjectId_1_appName_1_role_1", keys: { subjectType: 1, subjectId: 1, appName: 1, role: 1 }, unique: true },
            ],
        },
        {
            collection: this.appRoleTemplates,
            indexes: [
                { name: "uniq_appName_1_role_1", keys: { appName: 1, role: 1 }, unique: true },
                { name: "appName_1", keys: { appName: 1 } },
            ],
        },
        {
            collection: this.permissions,
            indexes: [
                { name: "subjectId_1_subjectType_1_resourceType_1_resourceKey_1_action_1", keys: { subjectId: 1, subjectType: 1, resourceType: 1, resourceKey: 1, action: 1 } },
            ],
        },
    ];

    async getIndexDefs(): Promise<CollectionIndexDef[]> {
        return this.indexDefs;
    }
}

let _db: Promise<UsersDb> | undefined;
export const getUsersDb = (): Promise<UsersDb> =>
    (_db ??= getDb(DbKey.USERS).then((db) => new UsersDb(db)));

export const DbKey = {
    STUDY: "study",
    MESSAGE: "message",
    GLOBAL: "global",
    USERS: "users",
} as const;

export type DbKey = (typeof DbKey)[keyof typeof DbKey];

export function buildDatabaseName({
    dbNamePrefix,
    instanceId,
    target,
}: {
    dbNamePrefix: string;
    instanceId?: string;
    target: DbKey;
}): string {
    switch (target) {
        case "users":
            return `${dbNamePrefix}${instanceId}_users`;
        case "study":
            return `${dbNamePrefix}${instanceId}_studyDB`;
        case "message":
            return `${dbNamePrefix}${instanceId}_messageDB`;
        case "global":
            return `${dbNamePrefix}global_infos`;
    }
}
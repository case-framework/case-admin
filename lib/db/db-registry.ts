import "server-only";

import { Db, MongoClient, MongoClientOptions } from "mongodb";
import {
    applyMongoConnectionStringCredentials,
    mustGetEnv,
} from "@/lib/utils/env-utils";
import { DbKey, buildDatabaseName } from "./utils";


const options: MongoClientOptions = {
    // tune as needed
    maxPoolSize: 5,
};

function getMongoUriWithCredentials({
    uriEnvName,
    usernameEnvName,
    passwordEnvName,
    required = false,
}: {
    uriEnvName: string;
    usernameEnvName: string;
    passwordEnvName: string;
    required?: boolean;
}): string {
    const uri = required ? mustGetEnv(uriEnvName) : (process.env[uriEnvName] ?? "");

    return applyMongoConnectionStringCredentials({
        uri,
        username: process.env[usernameEnvName],
        password: process.env[passwordEnvName],
        uriLabel: uriEnvName,
        usernameLabel: usernameEnvName,
        passwordLabel: passwordEnvName,
    });
}

const instanceId = mustGetEnv("INSTANCE_ID");

const config: Record<DbKey, { uri: string; dbNamePrefix: string }> = {
    study: {
        uri: getMongoUriWithCredentials({
            uriEnvName: "MONGO_STUDYDB_URI",
            required: true,
            usernameEnvName: "STUDY_DB_USERNAME",
            passwordEnvName: "STUDY_DB_PASSWORD",
        }),
        dbNamePrefix: process.env.MONGO_STUDYDB_DBNAME_PREFIX ?? "",
    },
    message: {
        uri: getMongoUriWithCredentials({
            uriEnvName: "MONGO_MESSAGE_URI",
            usernameEnvName: "MESSAGE_DB_USERNAME",
            passwordEnvName: "MESSAGE_DB_PASSWORD",
        }),
        dbNamePrefix: process.env.MONGO_MESSAGE_DBNAME_PREFIX ?? "",
    },
    global: {
        uri: getMongoUriWithCredentials({
            uriEnvName: "MONGO_GLOBAL_URI",
            usernameEnvName: "GLOBAL_DB_USERNAME",
            passwordEnvName: "GLOBAL_DB_PASSWORD",
        }),
        dbNamePrefix: process.env.MONGO_GLOBAL_DBNAME_PREFIX ?? "",
    },
    users: {
        uri: getMongoUriWithCredentials({
            uriEnvName: "MONGO_USERS_URI",
            usernameEnvName: "USERS_DB_USERNAME",
            passwordEnvName: "USERS_DB_PASSWORD",
        }),
        dbNamePrefix: process.env.MONGO_USERS_DBNAME_PREFIX ?? "",
    },
};


// Global caches (important for Next.js dev/HMR)
declare global {
    var __mongoClients: Map<string, MongoClient> | undefined;
}

function getClient(uri: string): MongoClient {
    const cache = (globalThis.__mongoClients ??= new Map<string, MongoClient>());

    const existing = cache.get(uri);
    if (existing) return existing;

    const client = new MongoClient(uri, options);
    cache.set(uri, client);
    return client;
}

export async function getDb(key: DbKey): Promise<Db> {
    const cfg = config[key];
    if (!cfg.uri) {
        throw new Error(`Database URI for ${key} is not set`);
    }
    const client = getClient(cfg.uri);

    await client.connect();

    const dbName = buildDatabaseName({
        dbNamePrefix: cfg.dbNamePrefix,
        instanceId,
        target: key,
    });

    return client.db(dbName);
}

export async function getAllDbs(): Promise<Record<DbKey, Db>> {
    const [study, message, global, users] = await Promise.all([
        getDb(DbKey.STUDY),
        getDb(DbKey.MESSAGE),
        getDb(DbKey.GLOBAL),
        getDb(DbKey.USERS),
    ]);

    return { study, message, global, users };
}

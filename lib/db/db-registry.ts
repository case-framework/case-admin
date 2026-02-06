import "server-only";

import { Db, MongoClient, MongoClientOptions } from "mongodb";
import { mustGetEnv } from "../utils/env-utils";

export enum DbKey {
    USER = "user",
    STUDY = "study",
    MESSAGE = "message",
}

const options: MongoClientOptions = {
    // tune as needed
    maxPoolSize: 5,
};


const config = {
    user: {
        uri: mustGetEnv("MONGO_USERDB_URI"),
        dbName: mustGetEnv("MONGO_USERDB_DBNAME"),
    },
    study: {
        uri: mustGetEnv("MONGO_STUDYDB_URI"),
        dbName: mustGetEnv("MONGO_STUDYDB_DBNAME"),
    },
    message: {
        uri: mustGetEnv("MONGO_MESSAGEDB_URI"),
        dbName: mustGetEnv("MONGO_MESSAGEDB_DBNAME"),
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
    const client = getClient(cfg.uri);

    await client.connect();

    return client.db(cfg.dbName);
}

export async function getAllDbs(): Promise<Record<DbKey, Db>> {
    const [user, study, message] = await Promise.all([
        getDb(DbKey.USER),
        getDb(DbKey.STUDY),
        getDb(DbKey.MESSAGE),
    ]);

    return { user, study, message };
}


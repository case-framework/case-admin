import "server-only";
import { Collection, IndexDescription } from "mongodb";
import { DbKey } from "../utils";
import { getGlobalDb } from "../databases/global-db";
import { getMessageDb } from "../databases/message-db";
import { getUsersDb } from "../databases/users-db";
import { getStudyDb } from "../databases/study-db";
import type { AppDb, RecommendedIndex } from "../databases/base";

// Re-export so consumers don't need to know about the databases/ layer
export type { RecommendedIndex } from "../databases/base";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface CollectionIndexStatus {
    collectionName: string;
    existingIndexNames: string[];
    recommendedIndexes: RecommendedIndex[];
    missingIndexNames: string[];
}

export interface DbIndexStatus {
    dbKey: DbKey;
    collections: CollectionIndexStatus[];
    totalRecommended: number;
    totalExisting: number;
    totalMissing: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getAppDb(dbKey: DbKey): Promise<AppDb> {
    switch (dbKey) {
        case DbKey.GLOBAL: return getGlobalDb();
        case DbKey.MESSAGE: return getMessageDb();
        case DbKey.USERS: return getUsersDb();
        case DbKey.STUDY: return getStudyDb();
    }
}

async function safeGetIndexNames(collection: Collection): Promise<string[]> {
    try {
        const indexes = await collection.indexes();
        return indexes
            .map((idx: { name?: string }) => idx.name)
            .filter((n: string | undefined): n is string => !!n && n !== "_id_");
    } catch {
        // Collection does not exist yet — treat as having no indexes
        return [];
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getDbIndexStatus(dbKey: DbKey): Promise<DbIndexStatus> {
    const appDb = await getAppDb(dbKey);
    const defs = await appDb.getIndexDefs();

    const collections = await Promise.all(
        defs.map(async ({ collection, indexes }) => {
            const existingIndexNames = await safeGetIndexNames(collection);

            const existingSet = new Set(existingIndexNames);
            const missingIndexNames = indexes
                .filter((r) => !existingSet.has(r.name))
                .map((r) => r.name);

            return {
                collectionName: collection.collectionName,
                existingIndexNames,
                recommendedIndexes: indexes,
                missingIndexNames,
            } satisfies CollectionIndexStatus;
        }),
    );

    return {
        dbKey,
        collections,
        totalRecommended: collections.reduce((s, c) => s + c.recommendedIndexes.length, 0),
        totalExisting: collections.reduce((s, c) => s + c.existingIndexNames.length, 0),
        totalMissing: collections.reduce((s, c) => s + c.missingIndexNames.length, 0),
    };
}

export async function createMissingIndexes(dbKey: DbKey): Promise<{ created: number }> {
    const appDb = await getAppDb(dbKey);
    const defs = await appDb.getIndexDefs();
    let created = 0;

    for (const { collection, indexes } of defs) {
        const existingNames = new Set(await safeGetIndexNames(collection));

        const missing = indexes.filter((r) => !existingNames.has(r.name));
        if (missing.length === 0) continue;

        const descriptions: IndexDescription[] = missing.map((def) => {
            const desc: IndexDescription = {
                key: def.keys as Record<string, number>,
                name: def.name,
            };
            if (def.unique) desc.unique = true;
            if (def.expireAfterSeconds !== undefined) desc.expireAfterSeconds = def.expireAfterSeconds;
            return desc;
        });

        await collection.createIndexes(descriptions);
        created += missing.length;
    }

    return { created };
}


import "server-only";
import { Collection, Db } from "mongodb";
import { DbKey } from "../utils";

export interface RecommendedIndex {
    name: string;
    keys: Record<string, 1 | -1>;
    unique?: boolean;
    expireAfterSeconds?: number;
}

export interface CollectionIndexDef {
    // Collection<any> is intentional: index operations (.indexes(), .createIndexes())
    // do not depend on the document schema type.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collection: Collection<any>;
    indexes: RecommendedIndex[];
}

export abstract class AppDb {
    abstract readonly key: DbKey;

    constructor(protected readonly db: Db) { }

    /**
     * Returns index definitions for all known collections in this database.
     * Async to support databases with dynamic collections (e.g. StudyDb).
     */
    abstract getIndexDefs(): Promise<CollectionIndexDef[]>;
}

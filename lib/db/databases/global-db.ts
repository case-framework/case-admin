import "server-only";
import { getDb } from "../db-registry";
import { DbKey } from "../utils";
import { AppDb, CollectionIndexDef } from "./base";

export class GlobalDb extends AppDb {
    readonly key = DbKey.GLOBAL;

    readonly blockedJwts = this.db.collection("blockedJwts");
    readonly tempTokens = this.db.collection("temp-tokens");

    readonly indexDefs: CollectionIndexDef[] = [
        {
            collection: this.blockedJwts,
            indexes: [
                { name: "token_1", keys: { token: 1 } },
                { name: "expiresAt_1", keys: { expiresAt: 1 }, expireAfterSeconds: 0 },
            ],
        },
        {
            collection: this.tempTokens,
            indexes: [
                { name: "userID_1_instanceID_1_purpose_1", keys: { userID: 1, instanceID: 1, purpose: 1 } },
                { name: "expiration_1", keys: { expiration: 1 }, expireAfterSeconds: 0 },
                { name: "token_1", keys: { token: 1 }, unique: true },
            ],
        },
    ];

    async getIndexDefs(): Promise<CollectionIndexDef[]> {
        return this.indexDefs;
    }
}

let _db: Promise<GlobalDb> | undefined;
export const getGlobalDb = (): Promise<GlobalDb> =>
    (_db ??= getDb(DbKey.GLOBAL).then((db) => new GlobalDb(db)));

"use client";

import { DbKey } from "@/lib/db/utils";
import { DbIndexCard } from "./db-index-card";

const DB_KEYS: DbKey[] = [DbKey.STUDY, DbKey.USERS, DbKey.MESSAGE, DbKey.GLOBAL];

export function DatabaseIndexesView() {
    return (
        <>
            {DB_KEYS.map((dbKey) => (
                <DbIndexCard key={dbKey} dbKey={dbKey} />
            ))}
        </>
    );
}

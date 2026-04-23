"use client";

import { DB_KEYS } from "@/lib/db/utils";
import { DbIndexCard } from "./db-index-card";

export function DatabaseIndexesView() {
    return (
        <>
            {DB_KEYS.map((dbKey) => (
                <DbIndexCard key={dbKey} dbKey={dbKey} />
            ))}
        </>
    );
}

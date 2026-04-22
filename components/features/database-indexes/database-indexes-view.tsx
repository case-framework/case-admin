"use client";

import { useTranslations } from "next-intl";
import { DbKey } from "@/lib/db/utils";
import { PageLayout } from "@/components/common/page-layout";
import { DbIndexCard } from "./db-index-card";

const DB_KEYS: DbKey[] = [DbKey.STUDY, DbKey.USERS, DbKey.MESSAGE, DbKey.GLOBAL];

export function DatabaseIndexesView() {
    const t = useTranslations("DatabaseIndexes");

    return (
        <PageLayout title={t("title")} description={t("description")}>
            {DB_KEYS.map((dbKey) => (
                <DbIndexCard key={dbKey} dbKey={dbKey} />
            ))}
        </PageLayout>
    );
}

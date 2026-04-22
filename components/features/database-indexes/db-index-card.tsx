"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon, ChevronRightIcon, CheckCircle2Icon, XCircleIcon, DatabaseIcon } from "lucide-react";
import { toast } from "sonner";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LoadingButton } from "@/components/c-ui/loading-button";
import { Button } from "@/components/ui/button";
import { useGetDbIndexStatus, useCreateMissingIndexes } from "@/hooks/use-database-indexes-router";
import { DbKey } from "@/lib/db/utils";
import type { CollectionIndexStatus } from "@/lib/db/service/database-indexes";

// ---------------------------------------------------------------------------
// Label key mapping for DB keys
// ---------------------------------------------------------------------------

const DB_LABEL_KEYS = {
    [DbKey.STUDY]: "labelStudy",
    [DbKey.USERS]: "labelUsers",
    [DbKey.MESSAGE]: "labelMessage",
    [DbKey.GLOBAL]: "labelGlobal",
} as const satisfies Record<DbKey, string>;

// ---------------------------------------------------------------------------
// Collection index list
// ---------------------------------------------------------------------------

function CollectionRow({ collection }: { collection: CollectionIndexStatus }) {
    const t = useTranslations("DatabaseIndexes");
    const [open, setOpen] = useState(false);
    const hasRecommended = collection.recommendedIndexes.length > 0;
    const missingCount = collection.missingIndexNames.length;
    const existingSet = new Set(collection.existingIndexNames);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
                <button className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted/50 transition-colors text-left">
                    {open ? (
                        <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                        <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="font-mono text-xs flex-1">{collection.collectionName}</span>
                    {!hasRecommended ? (
                        <span className="text-xs text-muted-foreground">{t("noRecommended")}</span>
                    ) : missingCount > 0 ? (
                        <span className="text-xs font-medium text-amber-600">
                            {t("missingCount", { count: missingCount })}
                        </span>
                    ) : (
                        <span className="text-xs font-medium text-emerald-600">{t("allPresent")}</span>
                    )}
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <ul className="ml-6 mb-1 space-y-0.5">
                    {collection.recommendedIndexes.map((idx) => {
                        const present = existingSet.has(idx.name);
                        return (
                            <li key={idx.name} className="flex items-center gap-2 px-3 py-1 min-w-0">
                                {present ? (
                                    <CheckCircle2Icon className="size-3.5 shrink-0 text-emerald-500" />
                                ) : (
                                    <XCircleIcon className="size-3.5 shrink-0 text-amber-500" />
                                )}
                                <span className="font-mono text-xs text-muted-foreground truncate min-w-0 flex-1">{idx.name}</span>
                                <span className="shrink-0 flex gap-1">
                                    {idx.unique && (
                                        <span className="rounded-sm bg-blue-50 px-1 py-0.5 text-[10px] font-medium text-blue-600">
                                            {t("unique")}
                                        </span>
                                    )}
                                    {idx.expireAfterSeconds !== undefined && (
                                        <span className="rounded-sm bg-purple-50 px-1 py-0.5 text-[10px] font-medium text-purple-600">
                                            TTL
                                        </span>
                                    )}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    );
}

// ---------------------------------------------------------------------------
// DB card
// ---------------------------------------------------------------------------

interface DbIndexCardProps {
    dbKey: DbKey;
}

export function DbIndexCard({ dbKey }: DbIndexCardProps) {
    const t = useTranslations("DatabaseIndexes");
    const [open, setOpen] = useState(true);

    const { data, isLoading, error } = useGetDbIndexStatus(dbKey);
    const createMutation = useCreateMissingIndexes(dbKey);

    const handleCreateMissing = async () => {
        try {
            const result = await createMutation.mutateAsync({ dbKey });
            toast.success(t("createSuccess", { count: result.created }));
        } catch {
            toast.error(t("createError"));
        }
    };

    const label = t(DB_LABEL_KEYS[dbKey]);
    const hasMissing = (data?.totalMissing ?? 0) > 0;

    return (
        <div className="rounded-xl border bg-card shadow-sm">
            {/* Header */}
            <div className={`flex items-center gap-3 px-5 py-4${open ? " border-b" : ""}`}>
                <DatabaseIcon className="size-4 text-muted-foreground shrink-0" />
                <button
                    className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-left"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className="font-semibold text-sm">{label}</span>
                    {!isLoading && data && (
                        <span className="text-xs text-muted-foreground">
                            {t("stats", {
                                existing: data.totalExisting,
                                recommended: data.totalRecommended,
                            })}
                        </span>
                    )}
                    {!isLoading && hasMissing && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            {t("missingBadge", { count: data!.totalMissing })}
                        </span>
                    )}
                    {!isLoading && !hasMissing && data && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            {t("allPresent")}
                        </span>
                    )}
                </button>
                <div className="flex shrink-0 items-center gap-2 ml-auto">
                    {hasMissing && (
                        <LoadingButton
                            size="sm"
                            variant="outline"
                            isLoading={createMutation.isPending}
                            onClick={handleCreateMissing}
                        >
                            <span className="hidden sm:inline">{t("createMissing")}</span>
                            <span className="sm:hidden">{t("createMissingShort")}</span>
                        </LoadingButton>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setOpen((v) => !v)}
                        className="text-muted-foreground"
                    >
                        {open ? (
                            <ChevronDownIcon className="size-4" />
                        ) : (
                            <ChevronRightIcon className="size-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Body */}
            {open && (
                <div className="py-2">
                    {isLoading && (
                        <div className="px-5 py-4 text-sm text-muted-foreground">{t("loading")}</div>
                    )}
                    {error && (
                        <div className="px-5 py-4 text-sm text-destructive">{t("loadError")}</div>
                    )}
                    {data && data.collections.length === 0 && (
                        <div className="px-5 py-4 text-sm text-muted-foreground">{t("noCollections")}</div>
                    )}
                    {data?.collections.map((col) => (
                        <CollectionRow key={col.collectionName} collection={col} />
                    ))}
                </div>
            )}
        </div>
    );
}

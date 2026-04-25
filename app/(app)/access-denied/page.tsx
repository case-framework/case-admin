import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/utils";
import { type AccessRequirement, type PermissionRequirement } from "@/lib/types/access";

interface AccessDeniedPageProps {
    searchParams: Promise<{ requirement?: string }>;
}

function groupPermissions(permissions: PermissionRequirement[]): Record<string, string[]> {
    const groups: Record<string, string[]> = {};
    for (const p of permissions) {
        if (!groups[p.resourceType]) {
            groups[p.resourceType] = [];
        }
        if (!groups[p.resourceType].includes(p.action)) {
            groups[p.resourceType].push(p.action);
        }
    }
    return groups;
}

function PermissionGroup({ resourceType, actions, limit = 6 }: { resourceType: string; actions: string[]; limit?: number }) {
    const visible = actions.slice(0, limit);
    const remaining = actions.length - visible.length;
    return (
        <li className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
            <span className="font-medium capitalize">{resourceType}</span>
            <span className="text-muted-foreground text-xs">
                {visible.join(", ")}
                {remaining > 0 && `, +${remaining} more`}
            </span>
        </li>
    );
}

export default async function AccessDeniedPage({ searchParams }: AccessDeniedPageProps) {
    await requireAuth();
    const t = await getTranslations("AccessDenied");

    const { requirement: rawRequirement } = await searchParams;

    let requirement: AccessRequirement | null = null;
    try {
        if (rawRequirement) {
            requirement = JSON.parse(rawRequirement) as AccessRequirement;
        }
    } catch {
        // ignore malformed param
    }

    const anyGroups = requirement?.anyPermissions?.length
        ? groupPermissions(requirement.anyPermissions)
        : null;
    const allGroups = requirement?.allPermissions?.length
        ? groupPermissions(requirement.allPermissions)
        : null;
    const hasPermissionInfo = requirement?.adminOnly || anyGroups || allGroups;

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
            <div className="flex flex-col items-center max-w-md w-full text-center gap-6">
                <div className="rounded-full bg-muted p-5">
                    <ShieldOff className="size-8 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t("description")}</p>
                </div>

                {hasPermissionInfo && (
                    <div className="w-full rounded-lg border bg-muted/30 p-4 text-left space-y-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {t("requiredPermissionsLabel")}
                        </p>

                        {requirement!.adminOnly && (
                            <p className="text-sm">{t("adminOnlyMessage")}</p>
                        )}

                        {anyGroups && (
                            <div className="space-y-1.5">
                                <p className="text-xs text-muted-foreground">{t("anyPermissionsLabel")}</p>
                                <ul className="space-y-1">
                                    {Object.entries(anyGroups).map(([type, actions]) => (
                                        <PermissionGroup key={type} resourceType={type} actions={actions} />
                                    ))}
                                </ul>
                            </div>
                        )}

                        {allGroups && (
                            <div className="space-y-1.5">
                                <p className="text-xs text-muted-foreground">{t("allPermissionsLabel")}</p>
                                <ul className="space-y-1">
                                    {Object.entries(allGroups).map(([type, actions]) => (
                                        <PermissionGroup key={type} resourceType={type} actions={actions} />
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <Button asChild>
                    <Link href="/">{t("goToDashboard")}</Link>
                </Button>
            </div>
        </div>
    );
}

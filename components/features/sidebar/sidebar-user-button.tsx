"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";
import { useTranslations } from "next-intl";

function formatCountdown(ms: number): string {
    if (ms <= 0) return "Expired";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
}

export function SidebarUserButton() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const t = useTranslations("Sidebar.User");
    const [remaining, setRemaining] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        const expiresAt = session?.session?.expiresAt;
        if (!expiresAt) return;

        const expiry = new Date(expiresAt).getTime();

        const tick = () => {
            const diff = expiry - Date.now();
            setRemaining(formatCountdown(diff));
            if (diff <= 0) {
                authClient.signOut().then(() => router.push("/login"));
            }
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [session?.session?.expiresAt, router]);

    if (sessionPending) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" disabled className="gap-3">
                        <Skeleton className="size-8 rounded-full shrink-0" />
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <Skeleton className="h-3.5 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    if (!session?.user) return null;

    const { user } = session;
    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
        : undefined;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Popover>
                    <PopoverTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="gap-3 cursor-pointer hover:bg-black/4 active:bg-black/10 transition-all data-[state=open]:bg-black/8 data-[state=open]:hover:bg-black/6"
                            tooltip={user.name ?? user.email ?? "User"}
                        >
                            <Avatar className="size-8 shrink-0">
                                <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                                <AvatarFallback className="bg-black/10 text-foreground text-xs font-medium">
                                    {initials ?? <UserRound className="size-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <span className="truncate text-sm font-medium leading-tight">
                                    {user.name ?? user.email}
                                </span>
                                {remaining ? (
                                    <span className="truncate text-xs text-muted-foreground leading-tight mt-0.5">
                                        {remaining}
                                    </span>
                                ) : (
                                    <Skeleton className="h-3 w-16 mt-0.5" />
                                )}
                            </div>
                        </SidebarMenuButton>
                    </PopoverTrigger>
                    <PopoverContent
                        side="right"
                        align="end"
                        sideOffset={8}
                        className="w-60 p-0"
                    >
                        <div className="px-4 pt-4 pb-3 space-y-0.5">
                            <p className="text-sm font-medium leading-tight">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            <div className="pt-2">
                                <p className="text-xs text-muted-foreground">{t("sessionExpiresIn")}</p>
                                {remaining ? (
                                    <p className="text-xs font-medium tabular-nums">{remaining}</p>
                                ) : (
                                    <Skeleton className="h-3.5 w-20 mt-1" />
                                )}
                            </div>
                        </div>
                        <Separator />
                        <div className="p-1.5">
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={isPending}
                                className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 gap-2 h-8 px-2.5"
                                onClick={() => {
                                    startTransition(async () => {
                                        await authClient.signOut();
                                        router.push("/login");
                                    });
                                }}
                            >
                                <LogOut className="size-3.5" />
                                {t("signOut")}
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

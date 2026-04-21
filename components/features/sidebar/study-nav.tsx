"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    LayoutDashboard,
    Users,
    FileText,
    FolderOpen,
    BarChart2,
    Settings,
    ClipboardList,
    GitBranch,
    Zap,
    Variable,
    List,
    Bell,
    Lock,
    Sliders,
} from "lucide-react";
import { NavGroup, NavItem } from "./nav-group";

interface StudyNavProps {
    studyKey: string;
}

export function StudyNav({ studyKey }: StudyNavProps) {
    const t = useTranslations("Sidebar.Study");
    const pathname = usePathname() || "/";

    const base = `/studies/${studyKey}`;

    const isActive = (href: string) =>
        href === base ? pathname === base : pathname.startsWith(href);

    const overviewItems: NavItem[] = [
        { href: base, label: t("overview"), icon: LayoutDashboard },
    ];

    const dataItems: NavItem[] = [
        { href: `${base}/participants`, label: t("participants"), icon: Users },
        { href: `${base}/responses`, label: t("responses"), icon: FileText },
        { href: `${base}/files`, label: t("files"), icon: FolderOpen },
        { href: `${base}/reports`, label: t("reports"), icon: BarChart2 },
    ];

    const configItems: NavItem[] = [
        { href: `${base}/general`, label: t("general"), icon: Settings },
        { href: `${base}/surveys`, label: t("surveys"), icon: ClipboardList },
        { href: `${base}/rules`, label: t("rules"), icon: GitBranch },
        { href: `${base}/actions`, label: t("actions"), icon: Zap },
        { href: `${base}/variables`, label: t("variables"), icon: Variable },
        { href: `${base}/code-lists`, label: t("codeLists"), icon: List },
        { href: `${base}/notifications`, label: t("notifications"), icon: Bell },
        { href: `${base}/access-control`, label: t("accessControl"), icon: Lock },
        { href: `${base}/advanced`, label: t("advanced"), icon: Sliders },
    ];

    return (
        <>
            <NavGroup items={overviewItems} isActive={isActive} />
            <NavGroup label={t("dataParticipantsSection")} items={dataItems} isActive={isActive} />
            <NavGroup label={t("configurationSection")} items={configItems} isActive={isActive} />
        </>
    );
}

"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NavGroup } from "./nav-group";
import { studyPagePath, studyNavSection } from "@/lib/config/pages";

interface StudyNavProps {
    studyKey: string;
}

export function StudyNav({ studyKey }: StudyNavProps) {
    const t = useTranslations("Sidebar");
    const pathname = usePathname() || "/";
    const base = studyPagePath(studyKey);

    const isActive = (href: string) =>
        href === base ? pathname === base : pathname.startsWith(href);

    return (
        <>
            <NavGroup items={studyNavSection(studyKey, "overview")} isActive={isActive} />
            <NavGroup label={t("dataParticipantsSection")} items={studyNavSection(studyKey, "data")} isActive={isActive} />
            <NavGroup label={t("configurationSection")} items={studyNavSection(studyKey, "config")} isActive={isActive} />
        </>
    );
}



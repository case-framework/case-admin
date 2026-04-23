import {
    Home,
    UserRound,
    MessageSquare,
    UserCog,
    Link2,
    LayoutTemplate,
    BookText,
    Database,
    Settings,
    BookOpen,
    LayoutDashboard,
    Users,
    FileText,
    FolderOpen,
    BarChart2,
    ClipboardList,
    GitBranch,
    Zap,
    Variable,
    List,
    Bell,
    Lock,
    Sliders,
    type LucideIcon,
} from "lucide-react";
import { UserRole } from "@/lib/types/user";

/** Base shape for any page in the application. */
export interface PageDef {
    /** Translation key in the "Pages" namespace. */
    labelKey: string;
    /** Optional description key in the "Pages" namespace. */
    descriptionKey?: string;
    /** Lucide icon for sidebar/UI display. */
    icon?: LucideIcon;
    /** If set, only users with one of these roles can see/access this page. */
    roles?: UserRole[];
    /** If true, the page requires NO authentication. */
    skipAuth?: boolean;
}

/** A page renderable in navigation — has a resolved path and required icon. */
export interface NavPageDef extends PageDef {
    path: string;
    icon: LucideIcon;
}

/** A top-level page with a static path. */
export interface GlobalPageDef extends NavPageDef {
    navSection: GlobalNavSection;
}

/** A study-scoped sub-page (path: /studies/[studyKey]/[segment]). */
export interface StudyPageDef extends PageDef {
    /** URL segment. Empty string for the study overview (/studies/[studyKey]). */
    segment: string;
    icon: LucideIcon;
    navSection: StudyNavSection;
}

// ─── Navigation groups ────────────────────────────────────────────────────────

export type GlobalNavSection = "studies" | "global" | "userManagement" | "system";
export type StudyNavSection = "overview" | "data" | "config";

// ─── Global (top-level) pages ─────────────────────────────────────────────────

export const globalPages: GlobalPageDef[] = [
    { path: "/", labelKey: "dashboard", icon: Home, navSection: "studies" },
    { path: "/studies", labelKey: "studies", icon: BookOpen, navSection: "studies" },
    { path: "/participants", labelKey: "participants", icon: UserRound, navSection: "global" },
    { path: "/messages", labelKey: "messages", icon: MessageSquare, navSection: "global" },
    { path: "/management-users", labelKey: "managementUsers", icon: UserCog, navSection: "userManagement" },
    { path: "/external-services", labelKey: "externalServices", icon: Link2, navSection: "userManagement" },
    { path: "/app-role-templates", labelKey: "appRoleTemplates", icon: LayoutTemplate, navSection: "userManagement" },
    { path: "/documentation", labelKey: "documentation", icon: BookText, navSection: "system" },
    { path: "/database-indexes", labelKey: "databaseIndexes", descriptionKey: "databaseIndexesDescription", icon: Database, navSection: "system", roles: [UserRole.ADMIN] },
    { path: "/settings", labelKey: "settings", icon: Settings, navSection: "system" },
];

// Named references for entries used directly in navigation components
export const pageDashboard = globalPages.find((p) => p.path === "/")!;
export const pageStudies = globalPages.find((p) => p.path === "/studies")!;

/** Helper to get pages for a specific global navigation section */
export function globalNavSection(section: GlobalNavSection): GlobalPageDef[] {
    return globalPages.filter((p) => p.navSection === section);
}

/**
 * Global pages indexed by their first URL segment for breadcrumb and page lookups.
 * e.g. "participants" → the participants page def
 */
export const globalPagesBySegment: Record<string, GlobalPageDef> = Object.fromEntries(
    globalPages
        .filter((p) => p.path !== "/")
        .map((p) => [p.path.slice(1), p])
);

// ─── Study sub-pages ──────────────────────────────────────────────────────────

export const studySubPages: StudyPageDef[] = [
    { segment: "", labelKey: "studyOverview", icon: LayoutDashboard, navSection: "overview" },
    { segment: "participants", labelKey: "participants", icon: Users, navSection: "data" },
    { segment: "responses", labelKey: "responses", icon: FileText, navSection: "data" },
    { segment: "files", labelKey: "files", icon: FolderOpen, navSection: "data" },
    { segment: "reports", labelKey: "reports", icon: BarChart2, navSection: "data" },
    { segment: "general", labelKey: "general", icon: Settings, navSection: "config" },
    { segment: "surveys", labelKey: "surveys", icon: ClipboardList, navSection: "config" },
    { segment: "rules", labelKey: "rules", icon: GitBranch, navSection: "config" },
    { segment: "actions", labelKey: "actions", icon: Zap, navSection: "config" },
    { segment: "variables", labelKey: "variables", icon: Variable, navSection: "config" },
    { segment: "code-lists", labelKey: "codeLists", icon: List, navSection: "config" },
    { segment: "notifications", labelKey: "notifications", icon: Bell, navSection: "config" },
    { segment: "access-control", labelKey: "accessControl", icon: Lock, navSection: "config" },
    { segment: "advanced", labelKey: "advanced", icon: Sliders, navSection: "config" },
];

function toNavPageDef(studyKey: string, p: StudyPageDef): NavPageDef {
    return { path: studyPagePath(studyKey, p.segment), labelKey: p.labelKey, icon: p.icon, roles: p.roles };
}

/** Helper to get study sub-pages for a specific navigation section (e.g. "data" or "config") */
export function studyNavSection(studyKey: string, section: StudyNavSection): NavPageDef[] {
    return studySubPages
        .filter((p) => p.navSection === section)
        .map((p) => toNavPageDef(studyKey, p));
}

/** Builds the full path for a study sub-page. */
export function studyPagePath(studyKey: string, segment: string = ""): string {
    return segment ? `/studies/${studyKey}/${segment}` : `/studies/${studyKey}`;
}

/**
 * Study sub-pages indexed by URL segment for breadcrumb lookups.
 * e.g. "access-control" → { ..., labelKey: "accessControl" }
 */
export const studyPagesBySegment: Record<string, StudyPageDef> = Object.fromEntries(
    studySubPages
        .filter((p) => p.segment !== "")
        .map((p) => [p.segment, p])
);

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
import {
    MessagingAction,
    MessagingPermissionResourceKey,
    ResourceType,
    StudyAction,
    StudyVisibilityActions,
} from "@/lib/types/permission";
import {
    CURRENT_STUDY_RESOURCE_KEY,
    resolveAccessRequirement,
    type AccessRequirement,
} from "@/lib/types/access";

/** Base shape for any page in the application. */
export interface PageDef {
    /** Translation key in the "Pages" namespace. */
    labelKey: string;
    /** Optional description key in the "Pages" namespace. */
    descriptionKey?: string;
    /** Lucide icon for sidebar/UI display. */
    icon?: LucideIcon;
    /** If set, the page requires specific permissions or admin access. */
    access?: AccessRequirement;
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

function currentStudyAnyAccess(): AccessRequirement {
    return currentStudyActionsAccess(StudyVisibilityActions);
}

function anyStudyActionsAccess(actions: string[]): AccessRequirement {
    return {
        anyPermissions: actions.map((action) => ({
            resourceType: ResourceType.study,
            resourceKey: "*",
            action,
            acceptSpecificResourceKeys: true,
        })),
    };
}

function currentStudyActionsAccess(actions: string[]): AccessRequirement {
    return {
        anyPermissions: actions.map((action) => ({
            resourceType: ResourceType.study,
            resourceKey: CURRENT_STUDY_RESOURCE_KEY,
            action,
        })),
    };
}

function messagingAccess(): AccessRequirement {
    return {
        anyPermissions: [
            MessagingPermissionResourceKey.globalEmailTemplates,
            MessagingPermissionResourceKey.studyEmailTemplates,
            MessagingPermissionResourceKey.scheduledEmails,
            MessagingPermissionResourceKey.smsTemplates,
        ].map((resourceKey) => ({
            resourceType: ResourceType.messaging,
            resourceKey,
            action: MessagingAction.all,
        })),
    };
}

// ─── Global (top-level) pages ─────────────────────────────────────────────────

export const globalPages: GlobalPageDef[] = [
    { path: "/", labelKey: "dashboard", icon: Home, navSection: "studies" },
    { path: "/studies", labelKey: "studies", icon: BookOpen, navSection: "studies" },
    {
        path: "/participants",
        labelKey: "participants",
        icon: UserRound,
        navSection: "global",
        access: anyStudyActionsAccess([
            StudyAction.getParticipantStates,
            StudyAction.editParticipantData,
            StudyAction.createVirtualParticipant,
            StudyAction.mergeParticipants,
            StudyAction.getResponses,
            StudyAction.deleteResponses,
            StudyAction.getConfidentialResponses,
            StudyAction.getFiles,
            StudyAction.deleteFiles,
            StudyAction.getReports,
            StudyAction.deleteReports,
        ]),
    },
    { path: "/messages", labelKey: "messages", icon: MessageSquare, navSection: "global", access: messagingAccess() },
    { path: "/management-users", labelKey: "managementUsers", icon: UserCog, navSection: "userManagement", access: { adminOnly: true } },
    { path: "/external-services", labelKey: "externalServices", icon: Link2, navSection: "userManagement", access: { adminOnly: true } },
    { path: "/app-role-templates", labelKey: "appRoleTemplates", icon: LayoutTemplate, navSection: "userManagement", access: { adminOnly: true } },
    { path: "/documentation", labelKey: "documentation", icon: BookText, navSection: "system" },
    {
        path: "/database-indexes",
        labelKey: "databaseIndexes",
        descriptionKey: "databaseIndexesDescription",
        icon: Database,
        navSection: "system",
        access: { adminOnly: true },
    },
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
    { segment: "", labelKey: "studyOverview", icon: LayoutDashboard, navSection: "overview", access: currentStudyAnyAccess() },
    {
        segment: "participants",
        labelKey: "participants",
        icon: Users,
        navSection: "data",
        access: currentStudyActionsAccess([
            StudyAction.getParticipantStates,
            StudyAction.editParticipantData,
            StudyAction.createVirtualParticipant,
            StudyAction.mergeParticipants,
        ]),
    },
    {
        segment: "responses",
        labelKey: "responses",
        icon: FileText,
        navSection: "data",
        access: currentStudyActionsAccess([
            StudyAction.getResponses,
            StudyAction.deleteResponses,
            StudyAction.getConfidentialResponses,
        ]),
    },
    {
        segment: "files",
        labelKey: "files",
        icon: FolderOpen,
        navSection: "data",
        access: currentStudyActionsAccess([
            StudyAction.getFiles,
            StudyAction.deleteFiles,
        ]),
    },
    {
        segment: "reports",
        labelKey: "reports",
        icon: BarChart2,
        navSection: "data",
        access: currentStudyActionsAccess([
            StudyAction.getReports,
            StudyAction.deleteReports,
        ]),
    },
    {
        segment: "general",
        labelKey: "general",
        icon: Settings,
        navSection: "config",
        access: currentStudyActionsAccess([
            StudyAction.readStudyConfig,
            StudyAction.updateStudyProps,
            StudyAction.updateStudyStatus,
            StudyAction.deleteStudy,
        ]),
    },
    {
        segment: "surveys",
        labelKey: "surveys",
        icon: ClipboardList,
        navSection: "config",
        access: currentStudyActionsAccess([
            StudyAction.createSurvey,
            StudyAction.updateSurvey,
            StudyAction.unpublishSurvey,
            StudyAction.deleteSurveyVersion,
        ]),
    },
    { segment: "rules", labelKey: "rules", icon: GitBranch, navSection: "config", access: currentStudyActionsAccess([StudyAction.updateStudyRules]) },
    { segment: "actions", labelKey: "actions", icon: Zap, navSection: "config", access: currentStudyActionsAccess([StudyAction.runStudyAction]) },
    { segment: "variables", labelKey: "variables", icon: Variable, navSection: "config", access: currentStudyActionsAccess([StudyAction.manageStudyVariables]) },
    { segment: "code-lists", labelKey: "codeLists", icon: List, navSection: "config", access: currentStudyActionsAccess([StudyAction.manageStudyCodeLists]) },
    {
        segment: "notifications",
        labelKey: "notifications",
        icon: Bell,
        navSection: "config",
        access: currentStudyActionsAccess([StudyAction.updateNotificationSubscriptions]),
    },
    {
        segment: "access-control",
        labelKey: "accessControl",
        icon: Lock,
        navSection: "config",
        access: currentStudyActionsAccess([StudyAction.manageStudyPermissions]),
    },
    {
        segment: "advanced",
        labelKey: "advanced",
        icon: Sliders,
        navSection: "config",
        access: currentStudyActionsAccess([
            StudyAction.manageStudyCounters,
            StudyAction.deleteStudy,
        ]),
    },
];

export const pageStudyOverview = studySubPages.find((p) => p.segment === "")!;

function toNavPageDef(studyKey: string, p: StudyPageDef): NavPageDef {
    return {
        path: studyPagePath(studyKey, p.segment),
        labelKey: p.labelKey,
        icon: p.icon,
        access: resolveAccessRequirement(p.access, { studyKey }),
    };
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

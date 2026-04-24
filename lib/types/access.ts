import { ResourceType, StudyVisibilityActions } from "@/lib/types/permission";
import { type Study } from "@/lib/types/study";

export const CURRENT_STUDY_RESOURCE_KEY = "$currentStudy";

export interface PermissionAssignment {
    id?: string;
    subjectId?: string;
    subjectType?: string;
    resourceType: ResourceType;
    resourceKey: string;
    action: string;
    limiter?: Record<string, string>[];
}

export interface PermissionRequirement {
    resourceType: ResourceType;
    resourceKey: string;
    action: string;
    limiter?: Record<string, string>;
    acceptSpecificResourceKeys?: boolean;
    acceptSpecificActions?: boolean;
}

export interface AccessRequirement {
    adminOnly?: boolean;
    anyPermissions?: PermissionRequirement[];
    allPermissions?: PermissionRequirement[];
}

export interface AccessSnapshot {
    userId: string;
    isAdmin: boolean;
    permissions: PermissionAssignment[];
}

interface AccessContext {
    studyKey?: string;
    pathname?: string;
}

const STUDY_PATH_REGEX = /^\/studies\/([^/]+)/;

function resolveStudyKey({ studyKey, pathname }: AccessContext = {}): string | undefined {
    if (studyKey) {
        return studyKey;
    }

    if (!pathname) {
        return undefined;
    }

    const match = STUDY_PATH_REGEX.exec(pathname);
    return match?.[1];
}

function resolveRequirementPermission(
    requirement: PermissionRequirement,
    context?: AccessContext,
): PermissionRequirement {
    if (requirement.resourceKey !== CURRENT_STUDY_RESOURCE_KEY) {
        return requirement;
    }

    const studyKey = resolveStudyKey(context);
    if (!studyKey) {
        return requirement;
    }

    return {
        ...requirement,
        resourceKey: studyKey,
    };
}

export function resolveAccessRequirement(
    requirement?: AccessRequirement,
    context?: AccessContext,
): AccessRequirement | undefined {
    if (!requirement) {
        return undefined;
    }

    return {
        ...requirement,
        anyPermissions: requirement.anyPermissions?.map((permission) =>
            resolveRequirementPermission(permission, context)
        ),
        allPermissions: requirement.allPermissions?.map((permission) =>
            resolveRequirementPermission(permission, context)
        ),
    };
}

function limiterMatches(
    granted: Record<string, string>[] | undefined,
    required: Record<string, string> | undefined,
): boolean {
    if (!required) {
        return true;
    }

    if (!granted || granted.length === 0) {
        return false;
    }

    return granted.some((entry) =>
        Object.entries(required).every(([key, value]) => entry[key] === value)
    );
}

export function matchesPermission(
    granted: PermissionAssignment,
    requirement: PermissionRequirement,
): boolean {
    if (granted.resourceType !== requirement.resourceType) {
        return false;
    }

    const actionMatches =
        granted.action === requirement.action ||
        granted.action === "*" ||
        (requirement.acceptSpecificActions === true && requirement.action === "*");

    if (!actionMatches) {
        return false;
    }

    const resourceKeyMatches =
        granted.resourceKey === requirement.resourceKey ||
        granted.resourceKey === "*" ||
        (requirement.acceptSpecificResourceKeys === true && requirement.resourceKey === "*");

    if (!resourceKeyMatches) {
        return false;
    }

    return limiterMatches(granted.limiter, requirement.limiter);
}

export function hasAccess(
    snapshot: AccessSnapshot | undefined,
    requirement?: AccessRequirement,
): boolean {
    if (!requirement) {
        return true;
    }

    if (!snapshot) {
        return false;
    }

    if (snapshot.isAdmin) {
        return true;
    }

    if (requirement.adminOnly) {
        return false;
    }

    const anyPermissions = requirement.anyPermissions;
    if (anyPermissions && anyPermissions.length > 0) {
        const hasAny = anyPermissions.some((permission) =>
            snapshot.permissions.some((granted) => matchesPermission(granted, permission))
        );

        if (!hasAny) {
            return false;
        }
    }

    const allPermissions = requirement.allPermissions;
    if (allPermissions && allPermissions.length > 0) {
        const hasAll = allPermissions.every((permission) =>
            snapshot.permissions.some((granted) => matchesPermission(granted, permission))
        );

        if (!hasAll) {
            return false;
        }
    }

    return true;
}

export function getAccessibleStudyKeys(
    snapshot: AccessSnapshot | undefined,
    actions?: string[],
): { all: boolean; keys: Set<string> } {
    if (!snapshot) {
        return { all: false, keys: new Set<string>() };
    }

    if (snapshot.isAdmin) {
        return { all: true, keys: new Set<string>() };
    }

    const keys = new Set<string>();

    const effectiveActions = actions && actions.length > 0 ? actions : StudyVisibilityActions;

    for (const permission of snapshot.permissions) {
        if (permission.resourceType !== ResourceType.study) {
            continue;
        }

        const actionMatches =
            permission.action === "*" ||
            effectiveActions.includes(permission.action);

        if (!actionMatches) {
            continue;
        }

        if (permission.resourceKey === "*") {
            return { all: true, keys: new Set<string>() };
        }

        keys.add(permission.resourceKey);
    }

    return { all: false, keys };
}

export function filterStudiesByAccess(
    snapshot: AccessSnapshot | undefined,
    studies: Study[],
    actions?: string[],
): Study[] {
    const accessible = getAccessibleStudyKeys(snapshot, actions);
    if (accessible.all) {
        return studies;
    }

    if (accessible.keys.size === 0) {
        return [];
    }

    return studies.filter((study) => accessible.keys.has(study.key));
}
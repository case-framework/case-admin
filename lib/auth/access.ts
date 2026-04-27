import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { type PageDef } from "@/lib/config/pages";
import { requireAuth } from "@/lib/auth/utils";
import {
    hasAccess,
    resolveAccessRequirement,
    type AccessRequirement,
    type AccessSnapshot,
    type PermissionAssignment,
} from "@/lib/types/access";
import { SubjectType } from "@/lib/types/permission";
import { UserRole } from "@/lib/types/user";
import { userService } from "@/lib/db/service/user";

type Session = Awaited<ReturnType<typeof requireAuth>>;
type AccessUser = {
    id: string;
    role?: string | null;
};

function toPermissionAssignment(permission: Awaited<ReturnType<typeof userService.getPermissions>>[number]): PermissionAssignment {
    return {
        id: permission.id,
        subjectId: permission.subjectId,
        subjectType: permission.subjectType,
        resourceType: permission.resourceType,
        resourceKey: permission.resourceKey,
        action: permission.action,
        limiter: permission.limiter,
    };
}

const getCachedRequireAuth = cache(async (): Promise<Session> => requireAuth());

const getCachedAccessSnapshotForUser = cache(
    async (userId: string, role: string | null): Promise<AccessSnapshot> => {
        const isAdmin = role === UserRole.ADMIN;
        const permissions = isAdmin
            ? []
            : (await userService.getPermissions(userId, SubjectType.managementUser)).map(toPermissionAssignment);

        return {
            userId,
            isAdmin,
            permissions,
        };
    },
);

export async function getAccessSnapshotForUser(
    user: AccessUser,
): Promise<AccessSnapshot> {
    return getCachedAccessSnapshotForUser(user.id, user.role ?? null);
}

export async function getCurrentAccess(session?: Session): Promise<AccessSnapshot> {
    const currentSession = session ?? await getCachedRequireAuth();
    return getAccessSnapshotForUser(currentSession.user);
}

export async function requireAccess(
    requirement?: AccessRequirement,
    options?: {
        redirectTo?: string;
        pathname?: string;
        session?: Session;
        studyKey?: string;
    },
) {
    const session = options?.session ?? await getCachedRequireAuth();

    if (!requirement) {
        return { session, access: undefined };
    }

    const access = await getAccessSnapshotForUser(session.user);
    const pathname = options?.pathname ?? (await headers()).get("x-pathname") ?? "/";
    const resolvedRequirement = resolveAccessRequirement(requirement, {
        pathname,
        studyKey: options?.studyKey,
    });

    if (!hasAccess(access, resolvedRequirement)) {
        if (options?.redirectTo) {
            redirect(options.redirectTo);
        }
        const params = new URLSearchParams({
            requirement: JSON.stringify(resolvedRequirement),
        });
        redirect(`/access-denied?${params}`);
    }

    return { session, access };
}

export async function requirePageAccess(
    page: PageDef,
    options?: {
        redirectTo?: string;
        studyKey?: string;
    },
) {
    if (page.skipAuth) {
        return { session: null, access: undefined };
    }

    return requireAccess(page.access, options);
}
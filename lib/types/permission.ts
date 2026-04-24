import { z } from "zod";
import { PermissionDoc } from "../db/service/types";


export const ResourceType = {
    messaging: "messaging",
    study: "study",
    users: "users",
} as const;
export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

export const SubjectType = {
    managementUser: "management-user",
    serviceAccount: "service-account",
} as const;
export type SubjectType = (typeof SubjectType)[keyof typeof SubjectType];

export interface PermissionActionInfo {
    hideLimiter?: boolean;
    limiterHint?: string;
}

export interface ResourcePermissionInfo {
    actions: Record<string, PermissionActionInfo>;
}

export type PermissionDefinitions = Record<
    ResourceType,
    {
        resources: Record<string, ResourcePermissionInfo>;
    }
>;


export const permissionSchema = z.object({
    resourceType: z.enum(ResourceType),
    resourceKey: z.string(),
    action: z.string(),
    subjectId: z.string(),
    subjectType: z.enum(SubjectType),
    limiter: z.array(z.record(z.string(), z.string())).optional(),
});

export abstract class PermissionBase {
    constructor(
        public readonly resourceType: ResourceType,
        public resourceKey: string,
        public action: string,
        public id?: string,
        public subjectId?: string,
        public subjectType?: SubjectType,
        public limiter?: Record<string, string>[],
    ) { }

    static fromDoc(doc: PermissionDoc): PermissionBase {
        switch (doc.resourceType) {
            case ResourceType.messaging:
                return MessagingPermission.fromDoc(doc);
            case ResourceType.study:
                return StudyPermission.fromDoc(doc);
            case ResourceType.users:
                return UserPermission.fromDoc(doc);
            default:
                throw new Error(`Unknown resource type: ${doc.resourceType}`);
        }
    }

    toDoc(): PermissionDoc {
        return {
            resourceType: this.resourceType,
            resourceKey: this.resourceKey,
            action: this.action,
            subjectId: this.subjectId,
            subjectType: this.subjectType,
            limiter: this.limiter,
        };
    }
}


export const MessagingPermissionResourceKey = {
    globalEmailTemplates: "global-email-templates",
    studyEmailTemplates: "study-email-templates",
    scheduledEmails: "scheduled-emails",
    smsTemplates: "sms-templates",
} as const;
export type MessagingPermissionResourceKey = (typeof MessagingPermissionResourceKey)[keyof typeof MessagingPermissionResourceKey];

export const MessagingAction = {
    all: "*",
} as const;
export type MessagingAction = (typeof MessagingAction)[keyof typeof MessagingAction];

export const StudyAction = {
    all: "*",
    createStudy: "create-study",
    readStudyConfig: "read-study-config",
    updateStudyProps: "update-study-props",
    updateStudyStatus: "update-study-status",
    updateNotificationSubscriptions: "update-notification-subscriptions",
    updateStudyRules: "update-study-rules",
    runStudyAction: "run-study-action",
    deleteStudy: "delete-study",
    manageStudyCodeLists: "manage-study-code-lists",
    manageStudyCounters: "manage-study-counters",
    manageStudyVariables: "manage-study-variables",
    manageStudyPermissions: "manage-study-permissions",
    createSurvey: "create-survey",
    updateSurvey: "update-survey",
    unpublishSurvey: "unpublish-survey",
    deleteSurveyVersion: "delete-survey-version",
    getResponses: "get-responses",
    deleteResponses: "delete-responses",
    getConfidentialResponses: "get-confidential-responses",
    getFiles: "get-files",
    deleteFiles: "delete-files",
    createVirtualParticipant: "create-virtual-participant",
    editParticipantData: "edit-participant-data",
    getParticipantStates: "get-participant-states",
    mergeParticipants: "merge-participants",
    getReports: "get-reports",
    deleteReports: "delete-reports",
} as const;
export type StudyAction = (typeof StudyAction)[keyof typeof StudyAction];

export const StudyVisibilityActions: StudyAction[] = [
    StudyAction.readStudyConfig,
    StudyAction.updateStudyProps,
    StudyAction.updateStudyStatus,
    StudyAction.updateNotificationSubscriptions,
    StudyAction.updateStudyRules,
    StudyAction.runStudyAction,
    StudyAction.deleteStudy,
    StudyAction.manageStudyCodeLists,
    StudyAction.manageStudyCounters,
    StudyAction.manageStudyVariables,
    StudyAction.manageStudyPermissions,
    StudyAction.createSurvey,
    StudyAction.updateSurvey,
    StudyAction.unpublishSurvey,
    StudyAction.deleteSurveyVersion,
    StudyAction.getResponses,
    StudyAction.deleteResponses,
    StudyAction.getConfidentialResponses,
    StudyAction.getFiles,
    StudyAction.deleteFiles,
    StudyAction.createVirtualParticipant,
    StudyAction.editParticipantData,
    StudyAction.getParticipantStates,
    StudyAction.mergeParticipants,
    StudyAction.getReports,
    StudyAction.deleteReports,
];

export const permissionDefinitions: PermissionDefinitions = {
    [ResourceType.messaging]: {
        resources: {
            [MessagingPermissionResourceKey.globalEmailTemplates]: {
                actions: {
                    [MessagingAction.all]: { hideLimiter: true },
                },
            },
            [MessagingPermissionResourceKey.studyEmailTemplates]: {
                actions: {
                    [MessagingAction.all]: { hideLimiter: true },
                },
            },
            [MessagingPermissionResourceKey.scheduledEmails]: {
                actions: {
                    [MessagingAction.all]: { hideLimiter: true },
                },
            },
            [MessagingPermissionResourceKey.smsTemplates]: {
                actions: {
                    [MessagingAction.all]: { hideLimiter: true },
                },
            },
        },
    },
    [ResourceType.study]: {
        resources: {
            "*": {
                actions: {
                    [StudyAction.all]: { hideLimiter: true },
                    [StudyAction.createStudy]: { hideLimiter: true },
                    [StudyAction.manageStudyPermissions]: { hideLimiter: true },
                    [StudyAction.readStudyConfig]: { hideLimiter: true },
                    [StudyAction.updateStudyProps]: { hideLimiter: true },
                    [StudyAction.updateStudyStatus]: { hideLimiter: true },
                    [StudyAction.manageStudyCodeLists]: { hideLimiter: true },
                    [StudyAction.manageStudyCounters]: { hideLimiter: true },
                    [StudyAction.manageStudyVariables]: { hideLimiter: true },
                    [StudyAction.deleteStudy]: { hideLimiter: true },
                    [StudyAction.createSurvey]: { hideLimiter: true },
                    [StudyAction.updateSurvey]: {
                        limiterHint: 'To scope this permission to specific surveys, use [{"surveyKey":"<sk1>"}]',
                    },
                    [StudyAction.unpublishSurvey]: {
                        limiterHint: 'To scope this permission to specific surveys, use [{"surveyKey":"<sk1>"}]',
                    },
                    [StudyAction.deleteSurveyVersion]: {
                        limiterHint: 'To scope this permission to specific surveys, use [{"surveyKey":"<sk1>"}]',
                    },
                    [StudyAction.updateStudyRules]: { hideLimiter: true },
                    [StudyAction.runStudyAction]: { hideLimiter: true },
                    [StudyAction.updateNotificationSubscriptions]: { hideLimiter: true },
                    [StudyAction.getResponses]: {
                        limiterHint: 'To scope this permission to responses, use [{"surveyKey":"<sk1>"}] or [{"reportKey":"<rk1>"}]',
                    },
                    [StudyAction.deleteResponses]: { hideLimiter: true },
                    [StudyAction.getConfidentialResponses]: { hideLimiter: true },
                    [StudyAction.getFiles]: { hideLimiter: true },
                    [StudyAction.deleteFiles]: { hideLimiter: true },
                    [StudyAction.getParticipantStates]: { hideLimiter: true },
                    [StudyAction.editParticipantData]: { hideLimiter: true },
                    [StudyAction.createVirtualParticipant]: { hideLimiter: true },
                    [StudyAction.mergeParticipants]: { hideLimiter: true },
                    [StudyAction.getReports]: {
                        limiterHint: 'To scope this permission to reports, use [{"reportKey":"<rk1>"}]',
                    },
                    [StudyAction.deleteReports]: { hideLimiter: true },
                },
            },
        },
    },
    [ResourceType.users]: {
        resources: {
            "*": {
                actions: {
                    "delete-users": { hideLimiter: true },
                },
            },
        },
    },
};

export function getPermissionActionInfo(
    resourceType: ResourceType,
    resourceKey: string,
    action: string,
): PermissionActionInfo | undefined {
    const resources = permissionDefinitions[resourceType]?.resources;
    if (!resources) {
        return undefined;
    }

    const resourceInfo =
        resources[resourceKey] ??
        (resourceType === ResourceType.study ? resources[StudyPermissionResourceKey.allStudies] : undefined);

    return resourceInfo?.actions[action];
}

class MessagingPermission extends PermissionBase {
    resourceKey: MessagingPermissionResourceKey;
    action: MessagingAction;

    constructor(
        resourceKey: MessagingPermissionResourceKey,
        action: MessagingAction,
        id?: string,
        subjectId?: string,
        subjectType?: SubjectType,
        limiter?: Record<string, string>[],
    ) {
        super(
            ResourceType.messaging,
            resourceKey,
            action,
            id,
            subjectId,
            subjectType,
            limiter,
        );
        this.resourceKey = resourceKey;
        this.action = action;
    }

    static fromDoc(doc: PermissionDoc): MessagingPermission {
        // TODO: validate the doc
        const resourceKey = doc.resourceKey as MessagingPermissionResourceKey;
        const action = doc.action as MessagingAction;
        const subjectType = doc.subjectType as SubjectType;

        const id = doc._id ? doc._id.toString() : undefined;

        return new MessagingPermission(
            resourceKey,
            action,
            id,
            doc.subjectId,
            subjectType,
            doc.limiter,
        );
    }
}


export const StudyPermissionResourceKey = {
    allStudies: "*",
} as const;
// it might be a dynamic string for studyKey -->
export type StudyPermissionResourceKey = (typeof StudyPermissionResourceKey)[keyof typeof StudyPermissionResourceKey] | string;

export class StudyPermission extends PermissionBase {
    resourceKey: StudyPermissionResourceKey;

    constructor(
        resourceKey: StudyPermissionResourceKey,
        action: StudyAction,
        id?: string,
        subjectId?: string,
        subjectType?: SubjectType,
        limiter?: Record<string, string>[],
    ) {
        super(ResourceType.study, resourceKey, action, id, subjectId, subjectType, limiter);
        this.resourceKey = resourceKey;
    }

    static fromDoc(doc: PermissionDoc): StudyPermission {
        // TODO: validate the doc
        const resourceKey = doc.resourceKey as StudyPermissionResourceKey;
        const action = doc.action as StudyAction;
        const subjectType = doc.subjectType as SubjectType;
        const id = doc._id ? doc._id.toString() : undefined;
        return new StudyPermission(
            resourceKey,
            action,
            id,
            doc.subjectId,
            subjectType,
            doc.limiter,
        );
    }
}


/**
 * Users Permission
 */
export const UserPermissionActions = {
    deleteUsers: "delete-users",
} as const;
export type UserPermissionActions = (typeof UserPermissionActions)[keyof typeof UserPermissionActions];


export const UserPermissionResourceKey = {
    allUsers: "*",
} as const;
export type UserPermissionResourceKey = (typeof UserPermissionResourceKey)[keyof typeof UserPermissionResourceKey];

export class UserPermission extends PermissionBase {
    resourceKey: UserPermissionResourceKey;

    constructor(
        action: UserPermissionActions,
        id?: string,
        subjectId?: string,
        subjectType?: SubjectType,
        limiter?: Record<string, string>[],
    ) {
        const resourceKey = UserPermissionResourceKey.allUsers;
        super(ResourceType.users, resourceKey, action, id, subjectId, subjectType, limiter);
        this.resourceKey = resourceKey;
    }

    static fromDoc(doc: PermissionDoc): UserPermission {
        // TODO: validate the doc
        const action = doc.action as UserPermissionActions;
        const subjectType = doc.subjectType as SubjectType;
        const id = doc._id ? doc._id.toString() : undefined;
        return new UserPermission(
            action,
            id,
            doc.subjectId,
            subjectType,
            doc.limiter,
        );
    }
}
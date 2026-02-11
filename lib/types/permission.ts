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
    serviceUser: "service-user",
} as const;
export type SubjectType = (typeof SubjectType)[keyof typeof SubjectType];


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
            doc.subjectId,
            id,
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


// TODOs:
/* Use study actions
 actions: {
                    "*": { hideLimiter: true },
                    "create-study": { hideLimiter: true },
                    "manage-study-permissions": { hideLimiter: true },
                    "read-study-config": { hideLimiter: true },
                    "update-study-props": { hideLimiter: true },
                    "update-study-status": { hideLimiter: true },
                    "manage-study-code-lists": { hideLimiter: true },
                    "manage-study-counters": { hideLimiter: true },
                    "manage-study-variables": { hideLimiter: true },
                    "delete-study": { hideLimiter: true },
                    "create-survey": { hideLimiter: true },
                    "update-survey": {
                        limiterHint: 'To specify which surveys the user can upload, use the format [{"surveyKey": "<sk1>"}]'
                    },
                    "unpublish-survey": {
                        limiterHint: 'To specify which surveys the user can unpublish, use the format [{"surveyKey": "<sk1>"}]'
                    },
                    "delete-survey-version": {
                        limiterHint: 'To specify which surveys the user can delete, use the format [{"surveyKey": "<sk1>"}]'
                    },
                    "update-study-rules": { hideLimiter: true },
                    "run-study-action": { hideLimiter: true },
                    "update-notification-subscriptions": { hideLimiter: true },
                    "get-responses": {
                        limiterHint: 'To specify which responses the user can access, use the format [{"surveyKey": "<sk1>"}]'
                    },
                    "delete-responses": { hideLimiter: true },
                    "get-confidential-responses": { hideLimiter: true },
                    "get-files": { hideLimiter: true },
                    "get-participant-states": { hideLimiter: true },
                    "edit-participant-data": { hideLimiter: true },
                    "create-virtual-participant": { hideLimiter: true },
                    "merge-participants": { hideLimiter: true },
                    "get-reports": {
                        limiterHint: 'To specify which reports the user can access, use the format [{"reportKey": "<rk1>"}]'
                    },
                    "delete-reports": { hideLimiter: true },
                }
*/

export class StudyPermission extends PermissionBase {
    resourceKey: StudyPermissionResourceKey;

    constructor(
        resourceKey: StudyPermissionResourceKey,
        action: string,
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
        const action = doc.action as string;
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
import { ResourceType } from "@/lib/types/permission";
import { User } from "@/lib/types/user";
import { Study } from "@/lib/types/study";
import { LocalisedObject } from "@/lib/types/localization";
import { ObjectId } from "mongodb";

export type UserDoc = Omit<User, "id"> & {
    _id: ObjectId;
}

export function toUser(doc: UserDoc): User {
    return {
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        role: doc.role,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
    }
}


export type PermissionDoc = {
    _id?: ObjectId;
    subjectId?: string;
    subjectType?: string;
    resourceType: ResourceType;
    resourceKey: string;
    action: string;
    limiter?: Record<string, string>[];
}

export interface StudyProps {
    name: LocalisedObject[];
    description: LocalisedObject[];
}

export interface StudyDoc {
    _id: ObjectId;
    key: string;
    status: string;
    props: StudyProps;
}

export function toStudy(doc: StudyDoc): Study {
    return {
        id: doc._id.toHexString(),
        key: doc.key,
        status: doc.status,
        name: doc.props?.name ?? [],
        description: doc.props?.description ?? [],
    };
}
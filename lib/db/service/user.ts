import "server-only";
import { DeleteResult, InsertOneResult, ObjectId } from "mongodb";
import { UsersDb, getUsersDb } from "../databases/users-db";
import { User } from "@/lib/types/user";
import { PermissionBase, SubjectType } from "@/lib/types/permission";
import { PermissionDoc, toUser } from "./types";

export class UserService {
    constructor(private readonly db: UsersDb) { }

    async getUsersCount(): Promise<number> {
        return this.db.caseAdminUsers.countDocuments();
    }

    async getUsers(page: number, limit: number): Promise<User[]> {
        const users = await this.db.caseAdminUsers.find({}).skip((page - 1) * limit).limit(limit).toArray();
        return users.map(toUser);
    }

    async getUserById(id: string): Promise<User | null> {
        const _id = new ObjectId(id);
        const doc = await this.db.caseAdminUsers.findOne({ _id });
        return doc ? toUser(doc) : null;
    }

    async getPermissions(subjectId: string, subjectType: SubjectType): Promise<PermissionBase[]> {
        const permissions = await this.db.permissions.find({ subjectId, subjectType }).toArray();
        return permissions.map(PermissionBase.fromDoc);
    }

    async createPermission(permission: PermissionDoc): Promise<InsertOneResult<PermissionDoc>> {
        return this.db.permissions.insertOne(permission);
    }

    async updatePermission(permission: PermissionBase): Promise<void> {
        await this.db.permissions.updateOne({ _id: new ObjectId(permission.id!) }, { $set: permission.toDoc() });
    }

    async deletePermission(id: string): Promise<DeleteResult> {
        return this.db.permissions.deleteOne({ _id: new ObjectId(id) });
    }
}

export const userService = new UserService(await getUsersDb());

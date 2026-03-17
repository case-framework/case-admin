import "server-only";
import { Collection, Db, DeleteResult, InsertOneResult, ObjectId } from "mongodb";
import { getDb } from "../db-registry";
import { DbKey } from "../utils";
import { User } from "@/lib/types/user";
import { PermissionBase, SubjectType } from "@/lib/types/permission";
import { PermissionDoc, UserDoc, toUser } from "./types";

export class UserService {
    private readonly collectionManagementUsers: Collection<UserDoc>;
    private readonly collectionPermissions: Collection<PermissionDoc>;


    constructor(private readonly db: Db) {
        this.collectionManagementUsers = db.collection<UserDoc>("case_admin_users");
        this.collectionPermissions = db.collection<PermissionDoc>("permissions");
    }

    async getUsersCount(): Promise<number> {
        const count = await this.collectionManagementUsers.countDocuments();
        return count;
    }

    async getUsers(page: number, limit: number): Promise<User[]> {
        const users = await this.collectionManagementUsers.find({}).skip((page - 1) * limit).limit(limit).toArray();
        return users.map(toUser);
    }


    async getUserById(id: string): Promise<User | null> {
        const _id = new ObjectId(id);
        const doc = await this.collectionManagementUsers.findOne({ _id });
        return doc ? toUser(doc) : null;
    }

    async getPermissions(subjectId: string, subjectType: SubjectType): Promise<PermissionBase[]> {
        const permissions = await this.collectionPermissions.find({ subjectId, subjectType }).toArray();
        return permissions.map(PermissionBase.fromDoc);
    }

    async createPermission(permission: PermissionDoc): Promise<InsertOneResult<PermissionDoc>> {
        return await this.collectionPermissions.insertOne(permission);
    }

    async updatePermission(permission: PermissionBase): Promise<void> {
        await this.collectionPermissions.updateOne({ _id: new ObjectId(permission.id!) }, { $set: permission.toDoc() });
    }

    async deletePermission(id: string): Promise<DeleteResult> {
        return await this.collectionPermissions.deleteOne({ _id: new ObjectId(id) });
    }
}

const initUserService = async () => {
    const userDB = await getDb(DbKey.USERS);
    return new UserService(userDB);
}

export const userService = await initUserService();
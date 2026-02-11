import { adminProcedure, router } from '../init';
import { z } from 'zod';

import { userService } from '@/lib/db/service/user';
import { TRPCError } from '@trpc/server';
import { TRPCErrorCodes } from '../utils';
import { getTotalPages, hasNextPage, hasPreviousPage, limitCurrentPage, paginationSchema } from './utils';
import { logger } from '@/lib/utils/logger';
import { permissionSchema, SubjectType } from '@/lib/types/permission';


const userManagementLogger = logger("User Management Router");

export const userManagementRouter = router({
    getUsers: adminProcedure.input(paginationSchema).query(async ({ ctx, input }) => {
        const { page, limit } = input;
        userManagementLogger.info(`Getting users with page ${page} and limit ${limit} by admin ${ctx.user?.id}`);

        try {
            const count = await userService.getUsersCount();
            const totalPages = getTotalPages(count, limit);
            const currentPage = limitCurrentPage(page, totalPages);

            const users = await userService.getUsers(currentPage, limit);

            return {
                totalCount: count,
                totalPages: totalPages,
                currentPage: currentPage,
                items: users,
                hasNextPage: hasNextPage(count, page, limit),
                hasPreviousPage: hasPreviousPage(currentPage),
            };
        } catch (error) {
            userManagementLogger.error(error);
            throw new TRPCError({ code: TRPCErrorCodes.INTERNAL_SERVER_ERROR, message: "Failed to get users" });
        }
    }),

    getUserById: adminProcedure.input(z.object({
        id: z.string(),
    })).query(async ({ ctx, input }) => {
        const { id } = input;
        userManagementLogger.info(`Getting user by id ${id} by admin ${ctx.user?.id}`);
        try {
            const user = await userService.getUserById(id);
            return user;
        } catch (error) {
            userManagementLogger.error(error);
            throw new TRPCError({ code: TRPCErrorCodes.INTERNAL_SERVER_ERROR, message: "Failed to get user by id" });
        }
    }),

    getPermissions: adminProcedure.input(z.object({
        subjectId: z.string(),
        subjectType: z.enum(SubjectType),
    })).query(async ({ ctx, input }) => {
        const { subjectId, subjectType } = input;
        userManagementLogger.info(`Getting permissions by subject id ${subjectId} and subject type ${subjectType} by admin ${ctx.user?.id}`);

        try {
            const permissions = await userService.getPermissions(subjectId, subjectType);
            return permissions;
        } catch (error) {
            userManagementLogger.error(error);
            throw new TRPCError({ code: TRPCErrorCodes.INTERNAL_SERVER_ERROR, message: "Failed to get permissions" });
        }
    }),

    createPermission: adminProcedure.input(z.object({
        permission: permissionSchema,
    })).mutation(async ({ ctx, input }) => {
        const { permission } = input;
        userManagementLogger.info(`Creating permission {subjectId: ${permission.subjectId}, subjectType: ${permission.subjectType}} by admin ${ctx.user?.id}`);
        try {
            const result = await userService.createPermission(permission);
            return result;
        } catch (error) {
            userManagementLogger.error(error);
            throw new TRPCError({ code: TRPCErrorCodes.INTERNAL_SERVER_ERROR, message: "Failed to create permission" });
        }
    }),

    deletePermission: adminProcedure.input(z.object({
        id: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const { id } = input;
        userManagementLogger.info(`Deleting permission by id ${id} by admin ${ctx.user?.id}`);
        try {
            const result = await userService.deletePermission(id);
            return result;
        }
        catch (error) {
            userManagementLogger.error(error);
            throw new TRPCError({ code: TRPCErrorCodes.INTERNAL_SERVER_ERROR, message: "Failed to delete permission" });
        }
    }),

});

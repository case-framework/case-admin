import { adminProcedure, router } from "../init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { TRPCErrorCodes } from "../utils";
import { logger } from "@/lib/utils/logger";
import { createMissingIndexes, getDbIndexStatus } from "@/lib/db/service/database-indexes";
import { DB_KEYS } from "@/lib/db/utils";

const dbIndexesLogger = logger("Database Indexes Router");

const dbKeySchema = z.enum(DB_KEYS);

export const databaseIndexesRouter = router({
    getIndexStatus: adminProcedure
        .input(z.object({ dbKey: dbKeySchema }))
        .query(async ({ ctx, input }) => {
            dbIndexesLogger.info(`Getting index status for ${input.dbKey} by admin ${ctx.user?.id}`);
            try {
                return await getDbIndexStatus(input.dbKey);
            } catch (error) {
                dbIndexesLogger.error(error);
                throw new TRPCError({
                    code: TRPCErrorCodes.INTERNAL_SERVER_ERROR,
                    message: `Failed to get index status for ${input.dbKey}`,
                });
            }
        }),

    createMissingIndexes: adminProcedure
        .input(z.object({ dbKey: dbKeySchema }))
        .mutation(async ({ ctx, input }) => {
            dbIndexesLogger.info(`Creating missing indexes for ${input.dbKey} by admin ${ctx.user?.id}`);
            try {
                return await createMissingIndexes(input.dbKey);
            } catch (error) {
                dbIndexesLogger.error(error);
                throw new TRPCError({
                    code: TRPCErrorCodes.INTERNAL_SERVER_ERROR,
                    message: `Failed to create missing indexes for ${input.dbKey}`,
                });
            }
        }),
});

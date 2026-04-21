import { adminProcedure, router } from '../init';
import { z } from 'zod';
import { studyService } from '@/lib/db/service/study';
import { TRPCError } from '@trpc/server';
import { TRPCErrorCodes } from '../utils';
import { logger } from '@/lib/utils/logger';

const studiesLogger = logger("Studies Router");

export const studiesRouter = router({
    getRecentStudies: adminProcedure.query(async ({ ctx }) => {
        studiesLogger.info(`Getting studies for admin ${ctx.user?.id}`);
        try {
            return await studyService.getStudies();
        } catch (error) {
            studiesLogger.error(error);
            throw new TRPCError({ code: TRPCErrorCodes.INTERNAL_SERVER_ERROR, message: "Failed to get recent studies" });
        }
    }),

    getStudyByKey: adminProcedure
        .input(z.object({ key: z.string() }))
        .query(async ({ ctx, input }) => {
            studiesLogger.info(`Getting study by key ${input.key} for admin ${ctx.user?.id}`);
            try {
                return await studyService.getStudyByKey(input.key);
            } catch (error) {
                studiesLogger.error(error);
                throw new TRPCError({ code: TRPCErrorCodes.INTERNAL_SERVER_ERROR, message: "Failed to get study" });
            }
        }),
});

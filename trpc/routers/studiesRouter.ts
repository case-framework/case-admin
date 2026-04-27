import { accessProcedure, requireAccess, router } from '../init';
import { z } from 'zod';
import { studyService } from '@/lib/db/service/study';
import { currentStudyAnyAccess, filterStudiesByAccess } from '@/lib/types/access';
import { TRPCError } from '@trpc/server';
import { TRPCErrorCodes } from '../utils';
import { logger } from '@/lib/utils/logger';

const studiesLogger = logger("Studies Router");

export const studiesRouter = router({
    getRecentStudies: accessProcedure.query(async ({ ctx }) => {
        studiesLogger.info(`Getting studies for user ${ctx.user?.id}`);
        try {
            const studies = await studyService.getStudies();
            return filterStudiesByAccess(ctx.access, studies);
        } catch (error) {
            studiesLogger.error(error);
            throw new TRPCError({ code: TRPCErrorCodes.INTERNAL_SERVER_ERROR, message: "Failed to get recent studies" });
        }
    }),

    getStudyByKey: accessProcedure
        .input(z.object({ key: z.string() }))
        .query(async ({ ctx, input }) => {
            studiesLogger.info(`Getting study by key ${input.key} for user ${ctx.user?.id}`);

            requireAccess(
                ctx.access,
                currentStudyAnyAccess(),
                { context: { studyKey: input.key } }
            );

            try {
                return await studyService.getStudyByKey(input.key);
            } catch (error) {
                studiesLogger.error(error);
                throw new TRPCError({ code: TRPCErrorCodes.INTERNAL_SERVER_ERROR, message: "Failed to get study" });
            }
        }),
});

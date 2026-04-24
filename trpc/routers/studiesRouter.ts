import { accessProcedure, router } from '../init';
import { z } from 'zod';
import { pageStudyOverview } from '@/lib/config/pages';
import { studyService } from '@/lib/db/service/study';
import { filterStudiesByAccess, hasAccess, resolveAccessRequirement } from '@/lib/types/access';
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

            const canAccessStudy = hasAccess(
                ctx.access,
                resolveAccessRequirement(pageStudyOverview.access, { studyKey: input.key })
            );

            if (!canAccessStudy) {
                throw new TRPCError({ code: TRPCErrorCodes.FORBIDDEN, message: "Forbidden" });
            }

            try {
                return await studyService.getStudyByKey(input.key);
            } catch (error) {
                studiesLogger.error(error);
                throw new TRPCError({ code: TRPCErrorCodes.INTERNAL_SERVER_ERROR, message: "Failed to get study" });
            }
        }),
});

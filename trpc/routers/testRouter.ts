import { router, withPermissionsProcedure } from '../init';

import { logger } from '@/lib/utils/logger';


const testRouterLogger = logger("Test Router");

export const testRouter = router({
    testWithPermissionProcedure: withPermissionsProcedure.query(async ({ ctx }) => {
        // TODO: check if the user has the permission to get the whatever

        testRouterLogger.info(`Getting permissions by user ${ctx.user?.id}`);

        return ctx.permissions;

    }),
});
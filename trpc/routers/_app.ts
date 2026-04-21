import { router, procedure } from '../init';
import { testRouter } from './testRouter';

import { userManagementRouter } from './userManagementRouter';
import { studiesRouter } from './studiesRouter';


export const appRouter = router({
    userManagement: userManagementRouter,
    studies: studiesRouter,
    test: testRouter,

    // Example health check
    health: procedure.query(async () => {
        return { status: 'ok', timestamp: new Date() };
    }),
});

export type AppRouter = typeof appRouter;

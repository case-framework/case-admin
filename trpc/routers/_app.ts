import { router, procedure } from '../init';
import { testRouter } from './testRouter';

import { userManagementRouter } from './userManagementRouter';
import { studiesRouter } from './studiesRouter';
import { databaseIndexesRouter } from './databaseIndexesRouter';


export const appRouter = router({
    userManagement: userManagementRouter,
    studies: studiesRouter,
    databaseIndexes: databaseIndexesRouter,
    test: testRouter,

    // Example health check
    health: procedure.query(async () => {
        return { status: 'ok', timestamp: new Date() };
    }),
});

export type AppRouter = typeof appRouter;

import { router, procedure } from '../init';

import { accessRouter } from './accessRouter';
import { userManagementRouter } from './userManagementRouter';
import { studiesRouter } from './studiesRouter';
import { databaseIndexesRouter } from './databaseIndexesRouter';


export const appRouter = router({
    access: accessRouter,
    userManagement: userManagementRouter,
    studies: studiesRouter,
    databaseIndexes: databaseIndexesRouter,

    // Example health check
    health: procedure.query(async () => {
        return { status: 'ok', timestamp: new Date() };
    }),
});

export type AppRouter = typeof appRouter;

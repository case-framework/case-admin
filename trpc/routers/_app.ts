import { router, procedure } from '../init';
import { testRouter } from './testRouter';

import { userManagementRouter } from './userManagementRouter';


export const appRouter = router({
  userManagement: userManagementRouter,
  test: testRouter,

  // Example health check
  health: procedure.query(async () => {
    return { status: 'ok', timestamp: new Date() };
  }),
});

export type AppRouter = typeof appRouter;

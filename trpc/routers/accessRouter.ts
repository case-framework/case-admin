import { accessProcedure, router } from "../init";

export const accessRouter = router({
    getCurrentAccess: accessProcedure.query(async ({ ctx }) => {
        return ctx.access;
    }),
});
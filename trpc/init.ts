import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type Context } from './context'
import { TRPCErrorCodes } from './utils'
import { userService } from '@/lib/db/service/user';
import { SubjectType } from '@/lib/types/permission';
import { UserRole } from '@/lib/types/user';


const t = initTRPC.context<Context>().create({
    transformer: superjson,
});


export const router = t.router;
export const procedure = t.procedure;

const requireLogIn = (ctx: Context) => {
    if (!ctx.session || !ctx.user) {
        throw new TRPCError({ code: TRPCErrorCodes.UNAUTHORIZED })
    }
}

const isAuthUser = t.middleware(async ({ ctx, next }) => {
    requireLogIn(ctx);

    return next({
        ctx: {
            ...ctx,
            user: ctx.user,
        },
    })
})

const isAdminUser = t.middleware(async ({ ctx, next }) => {
    requireLogIn(ctx);

    if (ctx.user!.role !== UserRole.ADMIN) {
        throw new TRPCError({ code: TRPCErrorCodes.FORBIDDEN })
    }

    return next({
        ctx: {
            ...ctx,
            user: ctx.user!,
        },
    })
})

const withPermissions = t.middleware(async ({ ctx, next }) => {
    requireLogIn(ctx);

    const id = ctx.user!.id;
    const permissions = await userService.getPermissions(id, SubjectType.managementUser);

    return next({
        ctx: { ...ctx, permissions },
    })
})


/* const isParticipantNotificationsUser = t.middleware(async ({ ctx, next }) => {
  if (!ctx.token) {
    throw new TRPCError({ code: TRPCErrorCodes.UNAUTHORIZED })
  }

  const hasParticipantNotificationsRole = hasAppRole(ctx.appRoles, Roles.PARTICIPANT_NOTIFICATIONS);
  if (!hasParticipantNotificationsRole) {
    throw new TRPCError({ code: TRPCErrorCodes.FORBIDDEN })
  }

  return next({
    ctx: {
      ...ctx,
      token: ctx.token,
    },
  })
}) */

export const authenticatedProcedure = procedure.use(isAuthUser)
export const adminProcedure = procedure.use(isAdminUser)

export const withPermissionsProcedure = procedure.use(withPermissions)
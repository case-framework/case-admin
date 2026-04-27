import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type Context } from './context'
import { TRPCErrorCodes, type TRPCErrorCode } from './utils'
import { getAccessSnapshotForUser } from '@/lib/auth/access';
import {
    AccessContext,
    hasAccess,
    resolveAccessRequirement,
    type AccessRequirement,
    type AccessSnapshot,
} from '@/lib/types/access';
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

export const requireAccess = (
    access: AccessSnapshot | undefined,
    requirement?: AccessRequirement,
    options?: {
        code?: TRPCErrorCode;
        message?: string;
        context?: AccessContext;
    },
) => {
    const resolvedRequirement = resolveAccessRequirement(requirement, options?.context);

    if (!hasAccess(access, resolvedRequirement)) {
        throw new TRPCError({
            code: options?.code ?? TRPCErrorCodes.FORBIDDEN,
            message: options?.message,
        })
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

const withAccess = t.middleware(async ({ ctx, next }) => {
    requireLogIn(ctx);

    const access = await getAccessSnapshotForUser(ctx.user!);

    return next({
        ctx: { ...ctx, user: ctx.user!, access, permissions: access.permissions },
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

export const accessProcedure = procedure.use(withAccess)

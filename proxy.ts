import { auth } from "./auth"
import { ADMIN_ROUTES, AuthPages, PUBLIC_ROUTES } from "./routes";


export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth?.user;
    const isAdmin = req.auth?.isAdmin;

    const isPublicRoute = PUBLIC_ROUTES.some((route) => {
        if (route.exact) {
            return route.path === nextUrl.pathname;
        }
        return nextUrl.pathname.startsWith(route.path);
    });

    const isAuthRoute = AuthPages.includes(nextUrl.pathname);

    if (process.env.NODE_ENV === 'development') {
        console.log("proxy", { path: nextUrl.pathname, login: isLoggedIn, isPublicRoute, isAuthRoute });
    }

    if (isPublicRoute) {
        return;
    }

    const isAdminRoute = ADMIN_ROUTES.some((route) => {
        if (route.exact) {
            return route.path === nextUrl.pathname;
        }
        return nextUrl.pathname.startsWith(route.path);
    });

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL('/', nextUrl));
        }
        return;
    }

    if (!isLoggedIn) {
        const redirectUrl = new URL(`/auth/login?callback=${nextUrl.pathname}`, nextUrl);
        return Response.redirect(redirectUrl);
    }

    if (isAdminRoute && !isAdmin) {
        return Response.redirect(new URL('/auth/admin-account-required', nextUrl));
    }
})


export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}

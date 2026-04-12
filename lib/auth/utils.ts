import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";


export const requiredAdminAuth = async () => {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') ?? '/';
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
        redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
    return session;
}

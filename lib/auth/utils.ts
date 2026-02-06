import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";


export const requiredAdminAuth = async (redirectTo: string = "/login") => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect(redirectTo)
    }
    return session;
}

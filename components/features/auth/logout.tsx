"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

const LogoutComponent = () => {
    const logout = async () => {
        await authClient.signOut();
    }
    return (
        <div>
            <Button onClick={logout}>Logout</Button>
        </div>
    )
}

export default LogoutComponent;
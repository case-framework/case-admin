"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

interface LoginComponentProps {
    redirectTo: string;
}

const LoginComponent = ({ redirectTo }: LoginComponentProps) => {
    const signIn = async () => {
        const data = await authClient.signIn.social({
            provider: "microsoft",
            callbackURL: redirectTo,
        }, {
            onRequest: (ctx) => {
                //show loading
            },
            onSuccess: (ctx) => {
                //redirect to the dashboard or sign in page
            },
            onError: (ctx) => {
                alert(ctx.error.message);
            },
        });
        console.log(data);
    };

    return (
        <div>
            <h1>Login</h1>
            <Button onClick={signIn}>Login</Button>
        </div>
    );
};

export default LoginComponent;
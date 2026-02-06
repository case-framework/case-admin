"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";


const LoginComponent = () => {
    // read url query params to get the redirect url


    const signIn = async () => {
        const data = await authClient.signIn.social({
            provider: "microsoft",
            callbackURL: "/studies/123",
        },
            {
                onRequest: (ctx) => {
                    //show loading
                },
                onSuccess: (ctx) => {
                    //redirect to the dashboard or sign in page

                },

                onError: (ctx) => {
                    // display the error message
                    alert(ctx.error.message);
                },
            }
        );
        console.log(data);
    };

    return (
        <div>
            <h1>Login</h1>
            <Button onClick={signIn}>Login</Button>
        </div>
    )
}

export default LoginComponent;
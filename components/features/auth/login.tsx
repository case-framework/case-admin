"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LoadingButton } from "@/components/c-ui/loading-button";
import { authClient } from "@/lib/auth/auth-client";
import { LoginBubbleBackground } from "@/components/features/auth/login-bubble-background";
import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { cn } from "@/lib/utils";
import styles from "./login.module.css";

function MicrosoftIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 21" aria-hidden="true">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
        </svg>
    );
}

interface LoginComponentProps {
    redirectTo: string;
}

const LoginComponent = ({ redirectTo }: LoginComponentProps) => {
    const t = useTranslations("Login");
    const tCommon = useTranslations("Common");
    const [isLoading, setIsLoading] = useState(false);

    const signIn = async () => {
        setIsLoading(true);
        await authClient.signIn.social(
            { provider: "microsoft", callbackURL: redirectTo },
            {
                onError: (ctx) => {
                    setIsLoading(false);
                    toast.error(ctx.error.message);
                },
            },
        );
    };

    return (
        <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
            <LoginBubbleBackground />

            <div className="absolute top-4 right-4 z-10">
                <LocaleSwitcher />
            </div>

            <div
                className={cn(
                    "relative z-10 w-full max-w-sm rounded-3xl px-8 py-10",
                    "bg-white/55 shadow-2xl ring-1 ring-white/45 backdrop-blur-xl",
                    styles.card,
                )}
            >
                <div className="mb-7 flex justify-center">
                    <div
                        className={cn(
                            "flex size-16 items-center justify-center rounded-2xl",
                            "bg-white/80 shadow-lg ring-1 ring-white/60",
                            styles.iconWrap,
                        )}
                    >
                        <Image
                            src="/images/case_icon.svg"
                            alt="CASE"
                            width={44}
                            height={44}
                            className="size-11"
                            priority
                        />
                    </div>
                </div>

                <div className="mb-7 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        {tCommon("appName")}
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        {t("description")}
                    </p>
                </div>

                <div className="mb-5 h-px bg-black/7" />

                <LoadingButton
                    onClick={signIn}
                    isLoading={isLoading}
                    variant="outline"
                    className={cn(
                        "h-11 w-full gap-3 border-slate-200 bg-white/80 text-slate-700",
                        "transition-all duration-200",
                        "hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-md hover:scale-[1.015]",
                    )}
                >
                    {!isLoading && <MicrosoftIcon />}
                    {isLoading ? t("signingIn") : t("signInWithMicrosoft")}
                </LoadingButton>
            </div>
        </div>
    );
};

export default LoginComponent;
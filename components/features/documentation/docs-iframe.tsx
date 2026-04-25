"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

const emptySubscribe = () => () => undefined;

interface DocsIframeProps {
    src: string;
}

export function DocsIframe({ src }: DocsIframeProps) {
    const t = useTranslations("Documentation");
    const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
    const isLoaded = loadedSrc === src;

    return (
        <div className="relative w-full h-full">
            {(!isClient || !isLoaded) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/20 rounded-xl">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t("loading")}</p>
                </div>
            )}
            {isClient && (
                <iframe
                    key={src}
                    src={src}
                    title={t("iframeTitle")}
                    className="w-full h-full rounded-xl border-0"
                    // Restrict embedded-page capabilities: no top-frame navigation
                    // (prevents the docs page from redirecting the admin UI),
                    // no cross-origin cookie access beyond what same-origin allows.
                    sandbox="allow-scripts allow-same-origin"
                    referrerPolicy="no-referrer"
                    onLoad={() => setLoadedSrc(src)}
                />
            )}
        </div>
    );
}

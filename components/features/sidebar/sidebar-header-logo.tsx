import { useSidebar, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

// ---------------------------------------------------------------------------
// Animated header logo — shows back arrow when inside a study (expanded only)
// ---------------------------------------------------------------------------
export function SidebarHeaderLogo({
    isStudyView,
    studyDisplayName,
}: {
    isStudyView: boolean;
    studyDisplayName: string;
}) {
    const t = useTranslations("Common");
    const { state } = useSidebar();
    const isExpanded = state === "expanded";

    const showBackArrow = isStudyView && isExpanded;

    return (
        <SidebarMenuButton
            size="lg"
            asChild
            className="hover:bg-black/4 active:bg-black/10 transition-all"
        >
            <Link href={isStudyView ? "/studies" : "/"}>
                {/* Back arrow — only rendered when expanded, animates in/out */}
                {isExpanded && (
                    <div
                        className={cn(
                            "shrink-0 overflow-hidden transition-[max-width,opacity,transform] duration-200 ease-out",
                            showBackArrow
                                ? "max-w-5 opacity-100 translate-x-0"
                                : "max-w-0 opacity-0 -translate-x-1"
                        )}
                    >
                        <ArrowLeft className="size-4" />
                    </div>
                )}

                {/* App icon */}
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-xl bg-white/40 shadow-sm ring-1 ring-white/35">
                    <Image
                        src="/images/case_icon.svg"
                        alt="CASE"
                        className="size-8"
                        width={32}
                        height={32}
                    />
                </div>

                {/* Title area */}
                {isStudyView ? (
                    <div className="text-left leading-tight">
                        <div className="truncate text-sm font-medium">{studyDisplayName}</div>
                        <div className="truncate text-xs opacity-60">{t("appName")}</div>
                    </div>
                ) : (
                    <div className="text-left text-xl">
                        <span className="truncate font-medium">{t("appName")}</span>
                    </div>
                )}
            </Link>
        </SidebarMenuButton>
    );
}
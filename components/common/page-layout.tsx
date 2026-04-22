import { ReactNode } from "react";

interface PageLayoutProps {
    title: string;
    description?: string;
    children?: ReactNode;
}

export function PageLayout({ title, description, children }: PageLayoutProps) {
    return (
        <div className="p-4 sm:p-6 space-y-4">
            <div>
                <h1 className="text-xl font-semibold">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
}

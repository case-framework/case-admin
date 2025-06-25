import { Suspense } from "react";
import EmailTemplateConfig, { EmailTemplateConfigSkeleton } from "../../_components/EmailTemplateConfig";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        messageType: string;
    }>
}

export default async function Page(props: PageProps) {

    return (
        (<main className="p-6 h-full">
            <div
                className="h-full w-full flex flex-col gap-4" >
                <div className="grow flex overflow-hidden">
                    <Suspense fallback={<EmailTemplateConfigSkeleton />}>
                        <EmailTemplateConfig
                            messageType={(await props.params).messageType}
                            isSystemTemplate={true}
                        />
                    </Suspense>
                </div>
            </div>
        </main>)
    );
}

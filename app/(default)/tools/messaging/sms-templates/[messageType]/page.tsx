import { Suspense } from "react";
import SmsTemplateConfig, { SmsTemplateConfigSkeleton } from "./_components/sms-template-config";


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
                    <Suspense fallback={<SmsTemplateConfigSkeleton />}>
                        <SmsTemplateConfig
                            messageType={(await props.params).messageType}
                        />
                    </Suspense>
                </div>
            </div>
        </main>)
    );
}

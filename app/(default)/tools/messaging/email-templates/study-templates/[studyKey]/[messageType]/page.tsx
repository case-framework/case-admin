import { Suspense } from "react";
import EmailTemplateConfig, { EmailTemplateConfigSkeleton } from "../../../_components/EmailTemplateConfig";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

interface PageProps {
    params: Promise<{
        studyKey: string;
        messageType: string;
    }>
}

export const dynamic = 'force-dynamic';

export default async function Page(props: PageProps) {

    return (
        (<SimpleBreadcrumbsPageLayout
            links={
                [
                    {
                        title: 'Messaging Tools',
                        href: '/tools/messaging',
                    },
                    {
                        title: 'Study Email Templates',
                        href: '/tools/messaging/email-templates/study-templates',
                    },
                    {
                        title: (await props.params).studyKey,
                    },
                    {
                        title: (await props.params).messageType,
                    },
                ]
            }
        >
            <div
                className="h-full w-full pb-6 flex flex-col gap-4" >
                <div className="grow flex overflow-hidden">
                    <Suspense fallback={<EmailTemplateConfigSkeleton />}>
                        <EmailTemplateConfig
                            messageType={(await props.params).messageType}
                            studyKey={(await props.params).studyKey}
                            isSystemTemplate={false}
                            isGlobalTemplate={false}
                        />
                    </Suspense>
                </div>
            </div>
        </SimpleBreadcrumbsPageLayout>)
    );
}

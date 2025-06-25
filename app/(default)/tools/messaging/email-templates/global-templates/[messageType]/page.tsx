import { Suspense } from "react";
import EmailTemplateConfig, { EmailTemplateConfigSkeleton } from "../../_components/EmailTemplateConfig";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

export const dynamic = 'force-dynamic';

export default async function Page(
    props: {
        params: Promise<{
            messageType: string;
        }>;
    }
) {
    const params = await props.params;

    const {
        messageType
    } = params;

    return (
        <SimpleBreadcrumbsPageLayout
            links={
                [
                    {
                        title: 'Messaging Tools',
                        href: '/tools/messaging',
                    },
                    {
                        title: 'Global Email Templates',
                        href: '/tools/messaging/email-templates/global-templates',
                    },
                    {
                        title: messageType,
                    },
                ]
            }
        >
            <div
                className="h-full w-full pb-6 flex flex-col gap-4" >
                <div className="grow flex overflow-hidden">
                    <Suspense fallback={<EmailTemplateConfigSkeleton />}>
                        <EmailTemplateConfig
                            messageType={messageType}
                            isSystemTemplate={false}
                            isGlobalTemplate={true}
                        />
                    </Suspense>
                </div>
            </div>
        </SimpleBreadcrumbsPageLayout>
    );
}

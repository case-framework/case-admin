
import Breadcrumbs from "@/components/Breadcrumbs";
import { getMessageTemplates } from "@/utils/server/messagingAPI";
import { EmailTemplate } from "@/utils/server/types/messaging";
import EmailTemplateConfigurator from "../../EmailTemplateConfigurator";
import { redirect } from "next/navigation";


export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: {
        messageType?: string;
        studyKey?: string;
    }
}


export default async function Page(props: PageProps) {
    let templates: EmailTemplate[] = [];
    try {
        templates = await getMessageTemplates();
    } catch (error: any) {
        console.error(error);
        if (error.message === 'Unauthorized') {
            redirect('/auth/login?callbackUrl=/tools/messaging/custom-messages');
        }
    }

    const currentTemplate = templates.find(t => {
        if (props.searchParams.studyKey) {
            return t.studyKey === props.searchParams.studyKey && t.messageType === props.searchParams.messageType;
        }
        return t.messageType === props.searchParams.messageType;
    });

    if (!currentTemplate && props.searchParams.messageType) {
        console.error('template not found');
        redirect('/tools/messaging/custom-messages');
    }

    return (
        <div className="px-unit-lg h-full">
            <div className="py-unit-sm">
                <Breadcrumbs
                    homeLink="/tools/messaging"
                    links={
                        [
                            {
                                title: 'Custom messages',
                                href: '/tools/messaging/custom-messages'
                            },
                            {
                                title: `${(props.searchParams.studyKey && props.searchParams.messageType) ?
                                    `Edit message: ${props.searchParams.studyKey} ${props.searchParams.studyKey && '-'} ${props.searchParams.messageType}` :
                                    'Create new message'
                                    }`
                            }
                        ]
                    }
                />
                <main className="py-unit-lg">
                    <EmailTemplateConfigurator
                        emailTemplateConfig={currentTemplate}
                        isSystemTemplate={false}
                    />
                </main>
            </div>
        </div>
    )
}

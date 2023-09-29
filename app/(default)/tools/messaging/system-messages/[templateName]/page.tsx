import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getMessageTemplates } from "@/utils/server/messagingAPI";
import { EmailTemplate } from "@/utils/server/types/messaging";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import EmailTemplateConfigurator from "../../EmailTemplateConfigurator";

interface PageProps {
    params: {
        templateName: string;
    }
}

export const dynamic = 'force-dynamic';

export default async function Page(props: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/auth/login?callbackUrl=/tools/messaging/system-messages/registration');
    }

    let templates: EmailTemplate[] = [];
    try {
        templates = await getMessageTemplates();
    } catch (error: any) {
        console.log(error);
        if (error.message === 'Unauthorized') {
            redirect('/auth/login?callbackUrl=/tools/messaging/system-messages');
        }
    }

    let currentTemplate = templates.find(t => t.messageType === props.params.templateName);

    if (!currentTemplate) {
        currentTemplate = {
            messageType: props.params.templateName,
            defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
            translations: [],
        }
    }

    return (
        <div className="flex h-full w-full p-unit-lg">
            <EmailTemplateConfigurator
                emailTemplateConfig={currentTemplate}
                isSystemTemplate={true}
            />
        </div>
    )
}

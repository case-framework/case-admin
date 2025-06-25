import { getStudyMessageTemplates } from "@/lib/data/messagingAPI";
import AddReportsForm from "./_components/add-reports-form";
import { EmailTemplate } from "@/utils/server/types/messaging";

export default async function Page(
    props: {
        params: Promise<{
            studyKey: string;
        }>
    }
) {
    const params = await props.params;
    const studyEmailTemplatesResp = await getStudyMessageTemplates();

    const studyEmailTemplates = studyEmailTemplatesResp.templates?.filter((t: EmailTemplate) => t.studyKey === params.studyKey) || [];
    return (
        <div>
            <AddReportsForm
                studyKey={params.studyKey}
                availableStudyEmailTemplates={studyEmailTemplates}
            />
        </div>
    );
}

import { PageHeader } from "@/components/common/page-header";

interface PageProps { params: Promise<{ studyKey: string }> }
export default async function StudyResponsesPage({ params }: PageProps) {
    const { studyKey } = await params;
    return <PageHeader title={`Responses — ${studyKey}`} />;
}

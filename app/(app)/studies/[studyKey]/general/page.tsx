import { PageHeader } from "@/components/common/page-header";

interface PageProps { params: Promise<{ studyKey: string }> }
export default async function StudyGeneralPage({ params }: PageProps) {
    const { studyKey } = await params;
    return <PageHeader title={`General — ${studyKey}`} />;
}

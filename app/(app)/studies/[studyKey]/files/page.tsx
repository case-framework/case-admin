import { PageHeader } from "@/components/common/page-header";

interface PageProps { params: Promise<{ studyKey: string }> }
export default async function StudyFilesPage({ params }: PageProps) {
    const { studyKey } = await params;
    return <PageHeader title={`Files — ${studyKey}`} />;
}

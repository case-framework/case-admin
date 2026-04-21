import { PageHeader } from "@/components/common/page-header";

interface PageProps { params: Promise<{ studyKey: string }> }
export default async function StudyAccessControlPage({ params }: PageProps) {
	const { studyKey } = await params;
	return <PageHeader title={`Access Control — ${studyKey}`} />;
}

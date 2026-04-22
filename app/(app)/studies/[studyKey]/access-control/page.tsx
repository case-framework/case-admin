import { PageLayout } from "@/components/common/page-layout";

interface PageProps { params: Promise<{ studyKey: string }> }
export default async function StudyAccessControlPage({ params }: PageProps) {
	const { studyKey } = await params;
	return <PageLayout title={`Access Control — ${studyKey}`} />;
}

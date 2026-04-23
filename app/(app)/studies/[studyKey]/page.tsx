import LogoutComponent from "@/components/features/auth/logout";
import Module1Component from "@/components/features/module1";
import { requireAuth } from "@/lib/auth/utils";
import { getDb } from "@/lib/db/db-registry";
import { DbKey } from "@/lib/db/utils";

interface StudyPageProps {
	params: Promise<{
		studyKey: string;
	}>
}



const StudyPage = async ({ params }: StudyPageProps) => {
	const { studyKey } = await params;

	await requireAuth();

	const db = await getDb(DbKey.STUDY);
	const users = await db.collection("studies").find({}).toArray();


	/*  interface Study {
			 _id: string;
			 name: string;
			 description: string;
			 createdAt: Date;
			 updatedAt: Date;
	 }

	 getDb(DbKey.STUDY)

	 const getStudies = async (page: number, limit: number) => {
			 const studies = await dbs.study.collection("studies").find<Study>({}).toArray();
			 return studies;
	 }


	 const studies = await getStudies(1, 10); */

	return (
		<div>
			<h1>Study Page {studyKey}</h1>

			<LogoutComponent />

			<Module1Component
				studyKey={studyKey}
			/>

			<pre>{JSON.stringify(users, null, 2)}</pre>
		</div>
	)
}

export default StudyPage;
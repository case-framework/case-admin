import LogoutComponent from "@/components/features/auth/logout";
import Module1Component from "@/components/features/module1";
import { requiredAdminAuth } from "@/lib/auth/utils";
import { getAllDbs } from "@/lib/db/db-registry";

interface StudyPageProps {
    params: Promise<{
        studyKey: string;
    }>
}



const StudyPage = async ({ params }: StudyPageProps) => {
    const { studyKey } = await params;

    await requiredAdminAuth("/login?redirect=/studies/" + studyKey);

    const dbs = await getAllDbs();
    const users = await dbs.user.collection("case_admin_users").find({}).toArray();


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
import { redirect } from "next/navigation";


export default async function Page(
    props: {
        params: Promise<{
            studyKey: string;
        }>;
    }
) {
    const params = await props.params;
    redirect(`/tools/participants/${params.studyKey}/participants`);
}

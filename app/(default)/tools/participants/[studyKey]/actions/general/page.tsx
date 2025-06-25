import StartActionForm from "./_components/start-action-form";

export default async function Page(
    props: {
        params: Promise<{
            studyKey: string;
        }>
    }
) {


    return (
        (<div>
            <StartActionForm
                studyKey={(await props.params).studyKey}
            />
        </div>)
    );
}

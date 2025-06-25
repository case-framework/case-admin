import StartStudyActionOnPreviousResponses from "./_components/start-study-action-on-previous-responses";

export default async function Page(
    props: {
        params: Promise<{
            studyKey: string;
        }>
    }
) {

    return (
        (<StartStudyActionOnPreviousResponses
            studyKey={(await props.params).studyKey}
        />)
    );
}

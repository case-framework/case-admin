export default function Page(props: {
    params: Promise<{
        studyKey: string
        ruleId: string
    }>
}) {
    console.log(/* @next-codemod-error 'props' is passed as an argument. Any asynchronous properties of 'props' must be awaited when accessed. */
    props)

    return (
        <div>
            <h1>TODO page for: app/(default)/tools/study-configurator/[studyKey]/rules/[ruleId]/page.tsx</h1>
        </div>
    );
}

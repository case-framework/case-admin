const EditorMain: React.FC = () => {
    const dotPattern = `
    radial-gradient(circle, var(--main-bg-dot-color) 1px, transparent 1px)
  `


    return <main className="grow bg-(--main-bg-color)"
        //className="w-full h-full relative"
        style={{
            backgroundImage: dotPattern,
            backgroundSize: `var(--main-bg-dot-grid-size) var(--main-bg-dot-grid-size)`,
            backgroundPosition: "0 0, 0 0",
        }}
    >
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">

                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                    </div>
                    <div className="bg-muted/50 flex-1 rounded-xl h-96" />
                    <div className="bg-muted/50 flex-1 rounded-xl h-96" />
                    <div className="bg-muted/50 flex-1 rounded-xl h-96" />
                    <div className="bg-muted/50 flex-1 rounded-xl h-96" />
                    <div className="bg-muted/50 flex-1 rounded-xl h-96" />
                    <div className=" flex-1 rounded-xl h-96 bg-red-50/50 border border-red-400" />
                </div>
            </div>
        </div>
    </main>
}

export default EditorMain;
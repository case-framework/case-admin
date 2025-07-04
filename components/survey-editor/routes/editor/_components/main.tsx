import { Outlet } from "react-router";

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
                <Outlet />
            </div>
        </div>
    </main>
}

export default EditorMain;

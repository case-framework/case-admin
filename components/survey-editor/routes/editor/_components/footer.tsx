import HistoryStack from "./history-stack";


const EditorFooter: React.FC = () => {
    return <footer className="h-(--footer-height) bg-(--footer-bg-color) text-(--footer-text-color)">
        <div className="flex items-center justify-between h-full text-sm ps-4 pe-4 overflows-y-hidden">
            <div className="flex items-center gap-4 h-full">
                <HistoryStack />
                <div className="px-2 hover:bg-(--footer-text-color)/20">
                    issues
                </div>
            </div>
            <div className="">
                <div className="px-2">
                    help
                </div>
            </div>
        </div>
    </footer>
}

export default EditorFooter;

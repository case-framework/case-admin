import HistoryStack from "./history-stack";
import Issues from "./issues";


const EditorFooter: React.FC = () => {
    return <footer className="h-(--footer-height) bg-(--footer-bg-color) text-(--footer-text-color)">
        <div className="flex items-center justify-between h-full text-sm ps-4 pe-4">
            <div className="flex items-center h-full">
                <HistoryStack />
                <Issues />
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

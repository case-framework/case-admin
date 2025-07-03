

const EditorFooter: React.FC = () => {
    return <footer className="h-(--footer-height) bg-(--footer-bg-color) text-(--footer-text-color)">
        <div className="flex items-center justify-between h-full text-sm px-4">
            <div className="flex items-center gap-4 h-full">
                <div className="px-2 hover:bg-(--footer-text-color)/10 h-full flex items-center">
                    history stack
                </div>
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
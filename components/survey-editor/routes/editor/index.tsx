import EditorHeader from "./_components/header"
import EditorFooter from "./_components/footer"
import EditorSidebar from "./_components/sidebar"
import EditorMain from "./_components/main"
import { Navigate } from "react-router";

const Editor = () => {
    const hasSession = true;

    if (!hasSession) {
        return <Navigate to="/" replace />
    }

    return <div className="flex flex-col h-screen w-screen overflow-hidden">
        <EditorHeader />
        <div className="flex flex-1 overflow-hidden">
            <EditorSidebar />
            <EditorMain />
        </div>
        <EditorFooter />
    </div>
}

export default Editor;

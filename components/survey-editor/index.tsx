import { TooltipProvider } from "../ui/tooltip";
import EditorFooter from "./_components/footer";
import EditorHeader from "./_components/header";
import EditorMain from "./_components/main";
import EditorSidebar from "./_components/sidebar";
import "./survey-editor.css";

interface SurveyEditorProps {
}


const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {

    return <div className="survey-editor">
        <TooltipProvider>
            <div className="flex flex-col h-screen w-screen overflow-hidden">
                <EditorHeader />
                <div className="flex flex-1 overflow-hidden">
                    <EditorSidebar />
                    <EditorMain />
                </div>
                <EditorFooter />
            </div>
        </TooltipProvider>
    </div>
}

export default SurveyEditor;

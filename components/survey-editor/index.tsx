import { TooltipProvider } from "../ui/tooltip";
import EditorFooter from "./_components/footer";
import EditorHeader from "./_components/header";
import EditorMain from "./_components/main";
import EditorSidebar from "./_components/sidebar";
import WelcomeScreen from "./_components/no-active-session/welcome-screen";
import "./survey-editor.css";

interface SurveyEditorProps {
    onExit: () => void;
}


const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {

    const noActiveSession = false;

    if (noActiveSession) {
        return <div className="survey-editor">
            <WelcomeScreen onExit={props.onExit} />
        </div>
    }

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

import { useEffect, useState } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { Toaster } from "sonner";
import EditorLayout from "./routes/editor";
import ItemEditor from "./routes/editor/item-editor";
import Simulator from "./routes/editor/simulator";
import TranslationMode from "./routes/editor/translation-mode";

import WelcomeScreen from "./routes/welcome/welcome-screen";
import "./survey-editor.css";
import { HashRouter, Link, Route, Routes } from "react-router";


interface SurveyEditorProps {
    onExit: () => void;
}


const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <div className="survey-editor">
        <TooltipProvider>
            <HashRouter>
                <nav className="absolute top-10 right-0">
                    <Link to="/">Welcome</Link>
                    <Link to="/editor/item-editor">Editor</Link>
                </nav>
                <Routes>
                    <Route path="/editor" element={<EditorLayout />}>
                        <Route path="item-editor" element={<ItemEditor />} />
                        <Route path="translation-mode" element={<TranslationMode />} />
                        <Route path="simulator" element={<Simulator />} />
                    </Route>
                    <Route path="/" element={<WelcomeScreen onExit={props.onExit} />} />
                </Routes>
                <Toaster />
            </HashRouter>
        </TooltipProvider>
    </div>
}

export default SurveyEditor;

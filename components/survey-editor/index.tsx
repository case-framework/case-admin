import { SidebarInset } from "../ui/sidebar"
import { TooltipProvider } from "../ui/tooltip";
import EditorFooter from "./_components/footer";
import EditorHeader from "./_components/header";
import EditorSidebar from "./_components/sidebar";

interface SurveyEditorProps {
}


const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {

    return <div className="[--header-height:calc(--spacing(10))] [--footer-height:calc(--spacing(8))]">
        <TooltipProvider>
            <div className="flex flex-col h-screen w-screen overflow-hidden">
                <EditorHeader />
                <div className="flex flex-1 overflow-hidden">
                    <EditorSidebar />
                    <main className="grow">
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
                </div>
                <EditorFooter />
            </div>
        </TooltipProvider>
    </div>
}

export default SurveyEditor;

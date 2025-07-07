import { Button } from "@/components/ui/button";
import { ArrowUpRight, CircleQuestionMark, FilePlus, FolderOpen, Upload, X } from "lucide-react";
import { useState } from "react";
import NewSurvey from "./new-survey";
import OpenSurvey from "./open-survey";
import LocalSessions, { formatLastChange } from "./local-sessions";
import { useSessionsList, useSessionActions } from "../../store/session-store";
import { useNavigate } from "react-router";

interface WelcomeScreenProps {
    onExit: () => void;
}


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExit }) => {
    const [dialogOpen, setDialogOpen] = useState<"new-survey" | "open-survey" | "local-sessions" | null>(null);
    const sessions = useSessionsList().sort((a, b) => b.timestamps.lastUpdate - a.timestamps.lastUpdate);
    const { selectSession } = useSessionActions();
    const navigate = useNavigate();


    return <div className="flex flex-col gap-4 min-h-screen w-full items-center justify-center p-8 bg-(--main-bg-color)">
        <>
            <NewSurvey
                open={dialogOpen === "new-survey"}
                onClose={() => setDialogOpen(null)}
            />
            <OpenSurvey
                open={dialogOpen === "open-survey"}
                onClose={() => setDialogOpen(null)}
            />
            <LocalSessions
                open={dialogOpen === "local-sessions"}
                onClose={() => setDialogOpen(null)}
            />
        </>
        <div className="flex flex-col gap-4 bg-background border border-border p-4 rounded-lg w-96">

            <div className="flex items-center justify-between gap-4">
                <h1 className="text-primary text-2xl font-bold">
                    CASE Survey Editor
                </h1>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onExit}
                >
                    <X className="size-4" />
                </Button>
            </div>

            <div className="flex gap-4">
                <Button variant="outline" className="grow flex-col h-auto items-start py-3" onClick={() => setDialogOpen("new-survey")}>
                    <FilePlus className="size-4 text-muted-foreground" />
                    New survey
                </Button>
                <Button variant="outline" className="grow flex-col h-auto items-start py-3" onClick={() => setDialogOpen("open-survey")}>
                    <Upload className="size-4 text-muted-foreground" />
                    Open survey
                </Button>
            </div>


            <div>
                <div className="flex items-center justify-between">
                    <h2 className="font-medium text-sm text-muted-foreground">
                        Available local sessions
                    </h2>
                    <Button variant="ghost" className="text-xs font-normal" onClick={() => setDialogOpen("local-sessions")}>
                        <FolderOpen className="size-4 text-muted-foreground" />
                        Show all...
                    </Button>
                </div>

                <div className="border border-border rounded-md overflow-hidden flex items-center justify-center">

                    {sessions.length < 1 && <div className="flex items-center justify-center h-24 p-2">
                        <p className="text-muted-foreground text-center text-sm">
                            No local sessions found
                        </p>
                    </div>}

                    {sessions.length > 0 && <ul className="divide-y divide-border overflow-y-auto w-full h-24">
                        {sessions.map((session) => (
                            <li key={session.id} className="w-full">
                                <Button variant="ghost" className="w-full justify-start rounded-none"
                                    onClick={() => {
                                        selectSession(session.id);
                                        navigate(`/editor/item-editor`, { replace: true });
                                    }}>
                                    <p>{session.name}</p>
                                    <span className="text-muted-foreground text-xs ml-auto">
                                        {formatLastChange(new Date(session.timestamps.lastUpdate))}
                                    </span>
                                </Button>

                            </li>
                        ))}
                    </ul>}
                </div>
            </div>

            <a
                href="https://case-framework.github.io/case-docs"
                target="_blank"
                className="flex items-center gap-1 hover:underline hover:text-primary">
                <span>
                    <CircleQuestionMark className="size-3 text-muted-foreground" />
                </span>
                <span className="text-muted-foreground text-xs">
                    Open documentation
                </span>
                <span>
                    <ArrowUpRight className="size-3 text-muted-foreground" />
                </span>
            </a>
        </div>
    </div>
}

export default WelcomeScreen;

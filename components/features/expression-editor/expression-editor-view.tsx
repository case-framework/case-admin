"use client";

import { useCallback, useEffect, useState } from "react";
import { EditorProvider, useEditor } from "./editor-context";
import { StudyContextProvider } from "./study-context";
import { ExpressionPalette } from "./components/expression-palette";
import { ExpressionBlock } from "./components/expression-block";
import { ScratchPad } from "./components/scratch-pad";
import { FunctionsPanel } from "./components/functions-panel";
import { DEMO_STATE } from "./mock-data";
import { cn } from "@/lib/utils";
import {
	Clipboard,
	ClipboardPaste,
	Download,
	FileJson,
	Redo2,
	RotateCcw,
	Upload,
	Undo2,
} from "lucide-react";

export function ExpressionEditorView() {
	return (
		<StudyContextProvider>
			<EditorProvider initial={DEMO_STATE}>
				<EditorLayout />
			</EditorProvider>
		</StudyContextProvider>
	);
}

function EditorLayout() {
	const { state, dispatch, selectNode, pasteNode } = useEditor();
	const [showJson, setShowJson] = useState(false);

	// Keyboard shortcuts
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

			if (e.key === "Delete" || e.key === "Backspace") {
				if (state.selectedNodeId) {
					dispatch({ type: "REMOVE_NODE", nodeId: state.selectedNodeId });
				}
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "x" && state.selectedNodeId) {
				dispatch({ type: "CUT_NODE", nodeId: state.selectedNodeId });
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "c" && state.selectedNodeId) {
				dispatch({ type: "COPY_NODE", nodeId: state.selectedNodeId });
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "v" && state.clipboard) {
				pasteNode("root");
			}
			if (e.key === "Escape") {
				selectNode(null);
			}
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [state.selectedNodeId, state.clipboard, dispatch, selectNode, pasteNode]);

	return (
		<div className="flex h-[calc(100vh-10rem)] rounded-xl border border-border bg-background overflow-hidden">
			{/* Left sidebar — palette + functions */}
			<div className="w-56 border-r border-border flex flex-col bg-muted/20 shrink-0">
				<div className="px-3 py-2 border-b border-border">
					<h3 className="text-xs font-semibold text-foreground">Blocks</h3>
				</div>
				<div className="flex-1 overflow-hidden flex flex-col">
					<div className="flex-1 overflow-y-auto">
						<ExpressionPalette />
					</div>
					<FunctionsPanel />
				</div>
			</div>

			{/* Main canvas */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Toolbar */}
				<Toolbar showJson={showJson} onToggleJson={() => setShowJson(!showJson)} />

				{/* Canvas area */}
				<div className="flex-1 overflow-hidden flex">
					<div className="flex-1 flex flex-col overflow-hidden">
						<MainCanvas />
						<ScratchPad />
					</div>

					{/* JSON panel */}
					{showJson && <JsonPanel />}
				</div>
			</div>
		</div>
	);
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function Toolbar({ showJson, onToggleJson }: { showJson: boolean; onToggleJson: () => void }) {
	const { state, pasteNode, dispatch } = useEditor();

	return (
		<div className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-muted/10">
			<ToolbarButton icon={<Undo2 className="h-3.5 w-3.5" />} label="Undo" disabled />
			<ToolbarButton icon={<Redo2 className="h-3.5 w-3.5" />} label="Redo" disabled />
			<div className="h-4 w-px bg-border mx-1" />
			<ToolbarButton
				icon={<Clipboard className="h-3.5 w-3.5" />}
				label="Copy"
				disabled={!state.selectedNodeId}
				onClick={() => state.selectedNodeId && dispatch({ type: "COPY_NODE", nodeId: state.selectedNodeId })}
			/>
			<ToolbarButton
				icon={<ClipboardPaste className="h-3.5 w-3.5" />}
				label="Paste"
				disabled={!state.clipboard}
				onClick={() => pasteNode("root")}
			/>
			<div className="h-4 w-px bg-border mx-1" />
			<ToolbarButton icon={<Upload className="h-3.5 w-3.5" />} label="Import JSON" onClick={() => handleImport(dispatch)} />
			<ToolbarButton icon={<Download className="h-3.5 w-3.5" />} label="Export JSON" onClick={() => handleExport(state)} />
			<div className="flex-1" />
			<ToolbarButton
				icon={<FileJson className="h-3.5 w-3.5" />}
				label="JSON"
				active={showJson}
				onClick={onToggleJson}
			/>
			<ToolbarButton
				icon={<RotateCcw className="h-3.5 w-3.5" />}
				label="Reset Demo"
				onClick={() => dispatch({ type: "LOAD_STATE", state: DEMO_STATE })}
			/>
		</div>
	);
}

function ToolbarButton({ icon, label, onClick, disabled, active }: {
	icon: React.ReactNode;
	label: string;
	onClick?: () => void;
	disabled?: boolean;
	active?: boolean;
}) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			title={label}
			className={cn(
				"flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors",
				"text-muted-foreground hover:text-foreground hover:bg-muted",
				disabled && "opacity-30 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground",
				active && "bg-muted text-foreground"
			)}
		>
			{icon}
			<span className="hidden sm:inline">{label}</span>
		</button>
	);
}

// ─── Main Canvas ──────────────────────────────────────────────────────────────

function MainCanvas() {
	const { state, dispatch, addNode } = useEditor();
	const [isDragOver, setIsDragOver] = useState(false);

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);

		const defId = e.dataTransfer.getData("application/expression-def");
		if (defId) {
			addNode(defId, "root");
			return;
		}

		const nodeId = e.dataTransfer.getData("application/expression-node");
		if (nodeId) {
			dispatch({ type: "MOVE_TO_ROOT", nodeId });
		}
	}, [addNode, dispatch]);

	return (
		<div
			className={cn(
				"flex-1 overflow-y-auto px-6 py-4",
				isDragOver && "bg-muted/20"
			)}
			onDrop={handleDrop}
			onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
			onDragLeave={() => setIsDragOver(false)}
			onClick={() => dispatch({ type: "SET_SELECTED", nodeId: null })}
		>
			{state.rootIds.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-full text-muted-foreground/30">
					<div className="text-sm font-medium mb-1">Empty canvas</div>
					<div className="text-xs">Drag blocks from the palette or click + to add</div>
				</div>
			) : (
				<div className="space-y-3 max-w-3xl">
					{state.rootIds.map((nodeId) => (
						<ExpressionBlock key={nodeId} nodeId={nodeId} />
					))}
				</div>
			)}
		</div>
	);
}

// ─── JSON Panel ───────────────────────────────────────────────────────────────

function JsonPanel() {
	const { state } = useEditor();
	const json = JSON.stringify(state, null, 2);

	return (
		<div className="w-80 border-l border-border bg-muted/10 flex flex-col shrink-0">
			<div className="px-3 py-2 border-b border-border flex items-center justify-between">
				<span className="text-xs font-semibold">JSON Output</span>
				<button
					onClick={() => navigator.clipboard.writeText(json)}
					className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted"
				>
					Copy
				</button>
			</div>
			<pre className="flex-1 overflow-auto p-3 text-[10px] font-mono text-muted-foreground leading-relaxed">
				{json}
			</pre>
		</div>
	);
}

// ─── Import / Export ──────────────────────────────────────────────────────────

function handleExport(state: ReturnType<typeof useEditor>["state"]) {
	const json = JSON.stringify(state, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "expression.json";
	a.click();
	URL.revokeObjectURL(url);
}

function handleImport(dispatch: ReturnType<typeof useEditor>["dispatch"]) {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".json";
	input.onchange = async (e) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		try {
			const text = await file.text();
			const parsed = JSON.parse(text);
			dispatch({ type: "LOAD_STATE", state: parsed });
		} catch {
			alert("Invalid JSON file");
		}
	};
	input.click();
}

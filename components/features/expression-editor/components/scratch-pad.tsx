"use client";

import { useEditor } from "../editor-context";
import { ExpressionBlock } from "./expression-block";
import { cn } from "@/lib/utils";
import { Archive, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export function ScratchPad() {
	const { state } = useEditor();
	const [isExpanded, setIsExpanded] = useState(true);
	const count = state.scratchIds.length;

	return (
		<div className="border-t border-border">
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
			>
				{isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
				<Archive className="h-3.5 w-3.5" />
				Scratch Pad
				{count > 0 && (
					<span className="ml-1 px-1.5 py-0.5 text-[10px] bg-muted rounded-full">{count}</span>
				)}
			</button>
			{isExpanded && (
				<ScratchPadContent />
			)}
		</div>
	);
}

function ScratchPadContent() {
	const { state, dispatch } = useEditor();
	const [isDragOver, setIsDragOver] = useState(false);

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setIsDragOver(false);

		const defId = e.dataTransfer.getData("application/expression-def");
		if (defId) {
			const id = `node_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
			dispatch({ type: "ADD_NODE", node: { id, defId, slots: {}, collapsed: false }, target: "scratch" });
			return;
		}

		const nodeId = e.dataTransfer.getData("application/expression-node");
		if (nodeId) {
			dispatch({ type: "MOVE_TO_SCRATCH", nodeId });
		}
	}

	return (
		<div
			onDrop={handleDrop}
			onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
			onDragLeave={() => setIsDragOver(false)}
			className={cn(
				"px-4 pb-3 space-y-2 min-h-16 transition-all",
				isDragOver && "bg-muted/30"
			)}
		>
			{state.scratchIds.length === 0 ? (
				<div className="flex items-center justify-center py-4 text-[10px] text-muted-foreground/40 border border-dashed border-muted-foreground/20 rounded-lg">
					Drag blocks here to store them temporarily
				</div>
			) : (
				state.scratchIds.map((nodeId) => (
					<ExpressionBlock key={nodeId} nodeId={nodeId} compact />
				))
			)}
		</div>
	);
}

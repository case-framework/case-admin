"use client";

import { useEditor, generateId } from "../editor-context";
import { cn } from "@/lib/utils";
import { BookMarked, Plus, Trash2, Eye } from "lucide-react";
import { useState } from "react";

export function FunctionsPanel() {
	const { state, dispatch, selectNode } = useEditor();
	const [isNaming, setIsNaming] = useState(false);
	const [newName, setNewName] = useState("");

	function handleCreateFunction() {
		if (!state.selectedNodeId || !newName.trim()) return;
		dispatch({
			type: "ADD_FUNCTION",
			id: generateId(),
			name: newName.trim(),
			rootNodeId: state.selectedNodeId,
		});
		setNewName("");
		setIsNaming(false);
	}

	return (
		<div className="border-t border-border">
			<div className="flex items-center justify-between px-4 py-2">
				<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
					<BookMarked className="h-3.5 w-3.5" />
					Named Expressions
				</div>
				<button
					onClick={() => setIsNaming(!isNaming)}
					disabled={!state.selectedNodeId}
					className={cn(
						"p-1 rounded hover:bg-muted text-muted-foreground transition-colors",
						!state.selectedNodeId && "opacity-30 cursor-not-allowed"
					)}
					title={state.selectedNodeId ? "Name selected block" : "Select a block first"}
				>
					<Plus className="h-3.5 w-3.5" />
				</button>
			</div>

			{isNaming && (
				<div className="px-4 pb-2 flex gap-1.5">
					<input
						autoFocus
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleCreateFunction();
							if (e.key === "Escape") setIsNaming(false);
						}}
						placeholder="Function name..."
						className="flex-1 px-2 py-1 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring font-mono"
					/>
					<button
						onClick={handleCreateFunction}
						disabled={!newName.trim()}
						className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
					>
						Save
					</button>
				</div>
			)}

			<div className="px-4 pb-3 space-y-1">
				{state.functions.length === 0 && !isNaming && (
					<div className="text-[10px] text-muted-foreground/40 py-1">
						Select a block and click + to name it
					</div>
				)}
				{state.functions.map((fn) => (
					<div key={fn.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
						<span className="text-xs font-mono text-purple-700 dark:text-purple-300 truncate flex-1">
							ƒ {fn.name}
						</span>
						<button
							onClick={() => selectNode(fn.rootNodeId)}
							className="p-0.5 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-500"
							title="Jump to definition"
						>
							<Eye className="h-3 w-3" />
						</button>
						<button
							onClick={() => dispatch({ type: "REMOVE_FUNCTION", id: fn.id })}
							className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600"
						>
							<Trash2 className="h-3 w-3" />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

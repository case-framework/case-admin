"use client";

import { useEditor } from "../editor-context";
import { getExpressionDef } from "../registry";
import { useStudyContext, resolveSelectOptions } from "../study-context";
import type { ColorVariant, EditorNode, SlotDef, SlotValue } from "../types";
import { cn } from "@/lib/utils";
import {
	ChevronDown,
	ChevronRight,
	Copy,
	GripVertical,
	MoreHorizontal,
	MoveRight,
	Scissors,
	Tag,
	Trash2,
	X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

// ─── Color system ─────────────────────────────────────────────────────────────

export const colorClasses: Record<ColorVariant, { bg: string; bgLight: string; border: string; text: string; accent: string }> = {
	blue: { bg: "bg-blue-500", bgLight: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300", accent: "bg-blue-500" },
	purple: { bg: "bg-purple-500", bgLight: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", text: "text-purple-700 dark:text-purple-300", accent: "bg-purple-500" },
	green: { bg: "bg-green-500", bgLight: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800", text: "text-green-700 dark:text-green-300", accent: "bg-green-500" },
	orange: { bg: "bg-orange-500", bgLight: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", text: "text-orange-700 dark:text-orange-300", accent: "bg-orange-500" },
	red: { bg: "bg-red-500", bgLight: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-300", accent: "bg-red-500" },
	yellow: { bg: "bg-yellow-500", bgLight: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800", text: "text-yellow-700 dark:text-yellow-300", accent: "bg-yellow-500" },
	cyan: { bg: "bg-cyan-500", bgLight: "bg-cyan-50 dark:bg-cyan-950/30", border: "border-cyan-200 dark:border-cyan-800", text: "text-cyan-700 dark:text-cyan-300", accent: "bg-cyan-500" },
	pink: { bg: "bg-pink-500", bgLight: "bg-pink-50 dark:bg-pink-950/30", border: "border-pink-200 dark:border-pink-800", text: "text-pink-700 dark:text-pink-300", accent: "bg-pink-500" },
	slate: { bg: "bg-slate-500", bgLight: "bg-slate-50 dark:bg-slate-950/30", border: "border-slate-200 dark:border-slate-800", text: "text-slate-700 dark:text-slate-300", accent: "bg-slate-500" },
};

// ─── Expression Block (recursive) ─────────────────────────────────────────────

interface ExpressionBlockProps {
	nodeId: string;
	depth?: number;
	onRemove?: () => void;
	compact?: boolean;
}

export function ExpressionBlock({ nodeId, depth = 0, onRemove, compact = false }: ExpressionBlockProps) {
	const { state, selectNode, toggleCollapse, removeNode, cutNode, copyNode, moveToScratch, setLabel } = useEditor();
	const node = state.nodes[nodeId];
	const [showMenu, setShowMenu] = useState(false);
	const [editingLabel, setEditingLabel] = useState(false);
	const [labelInput, setLabelInput] = useState("");
	const menuRef = useRef<HTMLDivElement>(null);

	if (!node) return <MissingBlock nodeId={nodeId} />;

	const def = getExpressionDef(node.defId);
	if (!def) return <UnknownBlock node={node} />;

	const colors = colorClasses[def.color] ?? colorClasses.slate;
	const isSelected = state.selectedNodeId === nodeId;
	const isCollapsed = node.collapsed;

	// Find if this node is a named function
	const fn = state.functions.find((f) => f.rootNodeId === nodeId);

	function handleLabelSubmit() {
		const trimmed = labelInput.trim();
		setLabel(nodeId, trimmed || undefined);
		setEditingLabel(false);
	}

	return (
		<div
			className={cn(
				"group/block rounded-lg border transition-all",
				colors.border,
				colors.bgLight,
				isSelected && "ring-2 ring-ring ring-offset-1",
				depth > 0 && "ml-0"
			)}
			onClick={(e) => { e.stopPropagation(); selectNode(nodeId); }}
			draggable
			onDragStart={(e) => {
				e.dataTransfer.setData("application/expression-node", nodeId);
				e.dataTransfer.effectAllowed = "move";
				e.stopPropagation();
			}}
		>
			{/* Block header */}
			<div className={cn("flex items-center gap-1 px-2 py-1 rounded-t-lg", depth === 0 && "cursor-grab active:cursor-grabbing")}>
				<GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 opacity-0 group-hover/block:opacity-100 transition-opacity" />
				<div className={cn("h-2 w-2 rounded-sm shrink-0", colors.accent)} />
				<span className={cn("text-xs font-semibold", colors.text)}>{def.label}</span>

				{/* User label */}
				{node.label && !editingLabel && (
					<span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md truncate max-w-32">
						{node.label}
					</span>
				)}

				{/* Function badge */}
				{fn && (
					<span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded-md">
						ƒ {fn.name}
					</span>
				)}

				{editingLabel && (
					<input
						autoFocus
						value={labelInput}
						onChange={(e) => setLabelInput(e.target.value)}
						onBlur={handleLabelSubmit}
						onKeyDown={(e) => { if (e.key === "Enter") handleLabelSubmit(); if (e.key === "Escape") setEditingLabel(false); }}
						className="text-[10px] px-1.5 py-0.5 bg-background border border-border rounded-md w-24 focus:outline-none focus:ring-1 focus:ring-ring"
						placeholder="Label..."
						onClick={(e) => e.stopPropagation()}
					/>
				)}

				<div className="ml-auto flex items-center gap-0.5">
					{def.slots.length > 0 && (
						<button
							onClick={(e) => { e.stopPropagation(); toggleCollapse(nodeId); }}
							className="p-0.5 rounded hover:bg-muted/80 text-muted-foreground"
						>
							{isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
						</button>
					)}
					<div className="relative" ref={menuRef}>
						<button
							onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
							className="p-0.5 rounded hover:bg-muted/80 text-muted-foreground opacity-0 group-hover/block:opacity-100 transition-opacity"
						>
							<MoreHorizontal className="h-3.5 w-3.5" />
						</button>
						{showMenu && (
							<BlockContextMenu
								onClose={() => setShowMenu(false)}
								onCut={() => { cutNode(nodeId); setShowMenu(false); }}
								onCopy={() => { copyNode(nodeId); setShowMenu(false); }}
								onDelete={() => { removeNode(nodeId); setShowMenu(false); }}
								onLabel={() => { setLabelInput(node.label ?? ""); setEditingLabel(true); setShowMenu(false); }}
								onMoveToScratch={() => { moveToScratch(nodeId); setShowMenu(false); }}
							/>
						)}
					</div>
					{onRemove && (
						<button
							onClick={(e) => { e.stopPropagation(); onRemove(); }}
							className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 opacity-0 group-hover/block:opacity-100 transition-opacity"
						>
							<X className="h-3 w-3" />
						</button>
					)}
				</div>
			</div>

			{/* Collapsed preview */}
			{isCollapsed && (
				<div className="px-3 pb-1.5">
					<span className="text-[10px] text-muted-foreground italic">
						{def.slots.length} slot{def.slots.length !== 1 ? "s" : ""} · click to expand
					</span>
				</div>
			)}

			{/* Slots */}
			{!isCollapsed && def.slots.length > 0 && (
				<div className={cn("px-2 pb-2 space-y-1.5", compact && "space-y-1")}>
					{def.slots.map((slotDef) => (
						<SlotEditor
							key={slotDef.key}
							nodeId={nodeId}
							defId={node.defId}
							slotDef={slotDef}
							value={node.slots[slotDef.key] ?? { kind: "empty" }}
							depth={depth}
							compact={compact}
						/>
					))}
				</div>
			)}
		</div>
	);
}

// ─── Slot Editor ──────────────────────────────────────────────────────────────

function SlotEditor({
	nodeId,
	defId: parentDefId,
	slotDef,
	value,
	depth,
	compact,
}: {
	nodeId: string;
	defId: string;
	slotDef: SlotDef;
	value: SlotValue;
	depth: number;
	compact: boolean;
}) {
	const { updateSlot, addToListSlot, removeFromListSlot, state, dispatch } = useEditor();
	const studyCtx = useStudyContext();
	const [isDragOver, setIsDragOver] = useState(false);

	// Resolve dynamic options from study context
	const dynamicOptions = resolveSelectOptions(slotDef.key, parentDefId, studyCtx);
	// Use dynamic options if available, then fall back to slot definition options
	const selectOptions = dynamicOptions ?? (slotDef.type.kind === "select" ? slotDef.type.options : []);
	// Determine if this is effectively a select (either defined as select or has dynamic options)
	const isContextSelect = dynamicOptions !== null && slotDef.type.kind === "str";

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);

		// Handle dropping an expression def from palette
		const defId = e.dataTransfer.getData("application/expression-def");
		if (defId) {
			if (slotDef.type.kind === "expressionList") {
				addToListSlot(nodeId, slotDef.key, defId);
			} else if (slotDef.type.kind === "expression") {
				const newId = `node_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
				dispatch({ type: "ADD_NODE", node: { id: newId, defId, slots: {}, collapsed: false }, target: "root" });
				updateSlot(nodeId, slotDef.key, { kind: "node", nodeId: newId });
			}
			return;
		}

		// Handle dropping an existing node
		const dragNodeId = e.dataTransfer.getData("application/expression-node");
		if (dragNodeId && dragNodeId !== nodeId) {
			if (slotDef.type.kind === "expressionList") {
				// Detach from previous location, add here
				dispatch({ type: "ADD_TO_LIST_SLOT", nodeId, slotKey: slotDef.key, childNodeId: dragNodeId });
			} else if (slotDef.type.kind === "expression") {
				updateSlot(nodeId, slotDef.key, { kind: "node", nodeId: dragNodeId });
			}
		}
	}, [nodeId, slotDef, addToListSlot, updateSlot, dispatch]);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(true);
	}, []);

	const isExprSlot = slotDef.type.kind === "expression";
	const isListSlot = slotDef.type.kind === "expressionList";

	return (
		<div className="space-y-1">
			<div className="flex items-center gap-1">
				<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{slotDef.label}</span>
				{!slotDef.required && <span className="text-[9px] text-muted-foreground/50 italic">optional</span>}
			</div>

			{/* Primitive value editors (only if no dynamic context options) */}
			{(slotDef.type.kind === "num" || ((slotDef.type.kind === "str" || slotDef.type.kind === "date") && !isContextSelect)) && (
				<PrimitiveEditor
					slotDef={slotDef}
					value={value}
					onChange={(v) => updateSlot(nodeId, slotDef.key, v)}
					suggestions={isContextSelect ? undefined : dynamicOptions ?? undefined}
				/>
			)}

			{/* Select editor — static options from registry OR dynamic from context */}
			{(slotDef.type.kind === "select" || isContextSelect) && (
				<ComboEditor
					options={selectOptions}
					value={value.kind === "str" ? value.value : ""}
					onChange={(v) => updateSlot(nodeId, slotDef.key, { kind: "str", value: v })}
				/>
			)}

			{/* Single expression slot */}
			{isExprSlot && (
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={() => setIsDragOver(false)}
					className={cn(
						"rounded-md transition-all min-h-8",
						isDragOver && "ring-2 ring-ring ring-dashed bg-muted/50"
					)}
				>
					{value.kind === "node" ? (
						<ExpressionBlock
							nodeId={value.nodeId}
							depth={depth + 1}
							compact={compact}
							onRemove={() => updateSlot(nodeId, slotDef.key, { kind: "empty" })}
						/>
					) : (
						<EmptySlot label={slotDef.label} />
					)}
				</div>
			)}

			{/* Expression list slot */}
			{isListSlot && (
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={() => setIsDragOver(false)}
					className={cn(
						"space-y-1 rounded-md transition-all min-h-8",
						isDragOver && "ring-2 ring-ring ring-dashed bg-muted/50"
					)}
				>
					{value.kind === "nodeList" && value.nodeIds.map((childId) => (
						<ExpressionBlock
							key={childId}
							nodeId={childId}
							depth={depth + 1}
							compact={compact}
							onRemove={() => removeFromListSlot(nodeId, slotDef.key, childId)}
						/>
					))}
					<EmptySlot label={`Add ${slotDef.label.toLowerCase()}`} isList />
				</div>
			)}
		</div>
	);
}

// ─── Primitive Editors ────────────────────────────────────────────────────────

function PrimitiveEditor({
	slotDef,
	value,
	onChange,
	suggestions,
}: {
	slotDef: SlotDef;
	value: SlotValue;
	onChange: (v: SlotValue) => void;
	suggestions?: { value: string; label: string }[];
}) {
	if (slotDef.type.kind === "num") {
		const numVal = value.kind === "num" ? value.value : 0;
		return (
			<input
				type="number"
				value={numVal}
				onChange={(e) => onChange({ kind: "num", value: parseFloat(e.target.value) || 0 })}
				className="w-full px-2 py-1 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring font-mono"
				onClick={(e) => e.stopPropagation()}
			/>
		);
	}

	const strVal = value.kind === "str" ? value.value : "";
	return (
		<input
			type="text"
			value={strVal}
			onChange={(e) => onChange({ kind: "str", value: e.target.value })}
			placeholder={slotDef.label}
			className="w-full px-2 py-1 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
			onClick={(e) => e.stopPropagation()}
			list={suggestions ? `suggestions-${slotDef.key}` : undefined}
		/>
	);
}

function ComboEditor({
	options,
	value,
	onChange,
}: {
	options: { value: string; label: string }[];
	value: string;
	onChange: (v: string) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [filter, setFilter] = useState("");

	const filtered = options.filter(
		(o) => !filter || o.label.toLowerCase().includes(filter.toLowerCase()) || o.value.toLowerCase().includes(filter.toLowerCase())
	);

	const selectedLabel = options.find((o) => o.value === value)?.label;

	return (
		<div className="relative" onClick={(e) => e.stopPropagation()}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"w-full flex items-center justify-between px-2 py-1 text-xs bg-background border border-border rounded-md",
					"hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-ring transition-colors",
					!value && "text-muted-foreground"
				)}
			>
				<span className="truncate">{selectedLabel ?? (value || "Select...")}</span>
				<ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
			</button>
			{isOpen && (
				<>
					<div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setFilter(""); }} />
					<div className="absolute left-0 top-full mt-1 z-50 w-full min-w-48 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
						{options.length > 5 && (
							<div className="p-1.5 border-b border-border">
								<input
									autoFocus
									value={filter}
									onChange={(e) => setFilter(e.target.value)}
									placeholder="Filter..."
									className="w-full px-2 py-1 text-xs bg-muted/50 border border-border rounded focus:outline-none"
								/>
							</div>
						)}
						<div className="max-h-40 overflow-y-auto py-1">
							{filtered.length === 0 ? (
								<div className="px-3 py-2 text-xs text-muted-foreground">No matches</div>
							) : (
								filtered.map((o) => (
									<button
										key={o.value}
										onClick={() => { onChange(o.value); setIsOpen(false); setFilter(""); }}
										className={cn(
											"w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors",
											o.value === value && "bg-muted font-medium"
										)}
									>
										{o.label}
									</button>
								))
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}

// ─── Empty Slot ───────────────────────────────────────────────────────────────

function EmptySlot({ label, isList }: { label: string; isList?: boolean }) {
	return (
		<div className={cn(
			"flex items-center justify-center px-3 py-2 rounded-md border border-dashed border-muted-foreground/25",
			"text-[10px] text-muted-foreground/50 select-none",
			"hover:border-muted-foreground/40 hover:bg-muted/30 transition-colors"
		)}>
			{isList ? `Drop or click to add` : `Drop ${label.toLowerCase()} here`}
		</div>
	);
}

// ─── Context Menu ─────────────────────────────────────────────────────────────

function BlockContextMenu({
	onClose,
	onCut,
	onCopy,
	onDelete,
	onLabel,
	onMoveToScratch,
}: {
	onClose: () => void;
	onCut: () => void;
	onCopy: () => void;
	onDelete: () => void;
	onLabel: () => void;
	onMoveToScratch: () => void;
}) {
	return (
		<>
			<div className="fixed inset-0 z-40" onClick={onClose} />
			<div className="absolute right-0 top-full mt-1 z-50 w-40 py-1 bg-popover border border-border rounded-lg shadow-lg">
				<MenuItem icon={<Tag className="h-3 w-3" />} label="Label..." onClick={onLabel} />
				<MenuItem icon={<Scissors className="h-3 w-3" />} label="Cut" shortcut="⌘X" onClick={onCut} />
				<MenuItem icon={<Copy className="h-3 w-3" />} label="Copy" shortcut="⌘C" onClick={onCopy} />
				<MenuItem icon={<MoveRight className="h-3 w-3" />} label="To Scratch Pad" onClick={onMoveToScratch} />
				<div className="h-px bg-border my-1" />
				<MenuItem icon={<Trash2 className="h-3 w-3" />} label="Delete" shortcut="⌫" onClick={onDelete} destructive />
			</div>
		</>
	);
}

function MenuItem({ icon, label, shortcut, onClick, destructive }: {
	icon: React.ReactNode;
	label: string;
	shortcut?: string;
	onClick: () => void;
	destructive?: boolean;
}) {
	return (
		<button
			onClick={(e) => { e.stopPropagation(); onClick(); }}
			className={cn(
				"w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors",
				destructive ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" : "hover:bg-muted"
			)}
		>
			{icon}
			{label}
			{shortcut && <span className="ml-auto text-[10px] text-muted-foreground">{shortcut}</span>}
		</button>
	);
}

// ─── Fallback blocks ──────────────────────────────────────────────────────────

function MissingBlock({ nodeId }: { nodeId: string }) {
	return (
		<div className="px-3 py-2 rounded-lg border border-dashed border-red-300 bg-red-50 dark:bg-red-950/20 text-xs text-red-500">
			Missing node: {nodeId}
		</div>
	);
}

function UnknownBlock({ node }: { node: EditorNode }) {
	return (
		<div className="px-3 py-2 rounded-lg border border-dashed border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 text-xs text-yellow-600">
			Unknown expression: {node.defId}
		</div>
	);
}

"use client";

import { useEditor } from "../editor-context";
import { CATEGORIES, getExpressionsByCategory } from "../registry";
import type { ExpressionDef } from "../types";
import { cn } from "@/lib/utils";
import { ChevronRight, GripVertical, Plus, Search } from "lucide-react";
import { useState } from "react";
import { colorClasses } from "./expression-block";

export function ExpressionPalette() {
	const { addNode } = useEditor();
	const [search, setSearch] = useState("");
	const [expandedCat, setExpandedCat] = useState<string | null>("logic");

	const filteredCategories = CATEGORIES.map((cat) => ({
		...cat,
		expressions: getExpressionsByCategory(cat.id).filter(
			(e) => !search || e.label.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase())
		),
	})).filter((c) => c.expressions.length > 0);

	function handleAdd(def: ExpressionDef) {
		addNode(def.id, "root");
	}

	return (
		<div className="flex flex-col h-full">
			<div className="px-3 pb-2 pt-1">
				<div className="relative">
					<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search blocks..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-7 pr-2 py-1.5 text-xs bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
					/>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto px-1">
				{filteredCategories.map((cat) => (
					<div key={cat.id} className="mb-1">
						<button
							onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
							className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
						>
							<ChevronRight className={cn("h-3 w-3 transition-transform", expandedCat === cat.id && "rotate-90")} />
							<div className={cn("h-2 w-2 rounded-sm", colorClasses[cat.color]?.bg)} />
							{cat.label}
							<span className="ml-auto text-[10px] text-muted-foreground/60">{cat.expressions.length}</span>
						</button>
						{(expandedCat === cat.id || search) && (
							<div className="ml-2 space-y-0.5 pb-1">
								{cat.expressions.map((expr) => (
									<PaletteItem key={expr.id} def={expr} onAdd={handleAdd} />
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

function PaletteItem({ def, onAdd }: { def: ExpressionDef; onAdd: (def: ExpressionDef) => void }) {
	const colors = colorClasses[def.color] ?? colorClasses.slate;

	return (
		<button
			onClick={() => onAdd(def)}
			draggable
			onDragStart={(e) => {
				e.dataTransfer.setData("application/expression-def", def.id);
				e.dataTransfer.effectAllowed = "copy";
			}}
			className={cn(
				"w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all",
				"hover:shadow-sm active:scale-[0.98] cursor-grab active:cursor-grabbing",
				"border",
				colors.border,
				colors.bgLight,
				"hover:opacity-90"
			)}
		>
			<GripVertical className="h-3 w-3 text-muted-foreground/40 shrink-0" />
			<span className="font-medium truncate">{def.label}</span>
			<Plus className="h-3 w-3 ml-auto text-muted-foreground/50 shrink-0" />
		</button>
	);
}

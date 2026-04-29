"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, ChevronRight, Pencil, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "./expression-editor-context";
import { lookupExpressionDef } from "@/lib/expression-types";
import { expressionRegistry } from "@/lib/expression-registry";
import { useState, useCallback, useMemo } from "react";
import { ValueEditor } from "./value-editor";
import { AddExpressionPopover } from "./add-expression-popover";

interface ExpressionBlockProps {
  expression: any;
  depth: number;
  instanceId: string;
  slotIndex?: number;
  isListSlot?: boolean;
  parentInstanceId?: string;
}

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  blue: { border: "border-blue-400/60", bg: "bg-blue-500/10", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-300" },
  green: { border: "border-emerald-400/60", bg: "bg-emerald-500/10", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300" },
  yellow: { border: "border-amber-400/60", bg: "bg-amber-500/10", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-300" },
  purple: { border: "border-purple-400/60", bg: "bg-purple-500/10", text: "text-purple-400", badge: "bg-purple-500/20 text-purple-300" },
  teal: { border: "border-teal-400/60", bg: "bg-teal-500/10", text: "text-teal-400", badge: "bg-teal-500/20 text-teal-300" },
  cyan: { border: "border-cyan-400/60", bg: "bg-cyan-500/10", text: "text-cyan-400", badge: "bg-cyan-500/20 text-cyan-300" },
  dark: { border: "border-slate-400/60", bg: "bg-slate-500/10", text: "text-slate-400", badge: "bg-slate-500/20 text-slate-300" },
  lime: { border: "border-lime-400/60", bg: "bg-lime-500/10", text: "text-lime-400", badge: "bg-lime-500/20 text-lime-300" },
  orange: { border: "border-orange-400/60", bg: "bg-orange-500/10", text: "text-orange-400", badge: "bg-orange-500/20 text-orange-300" },
  rose: { border: "border-rose-400/60", bg: "bg-rose-500/10", text: "text-rose-400", badge: "bg-rose-500/20 text-rose-300" },
  indigo: { border: "border-indigo-400/60", bg: "bg-indigo-500/10", text: "text-indigo-400", badge: "bg-indigo-500/20 text-indigo-300" },
  violet: { border: "border-violet-400/60", bg: "bg-violet-500/10", text: "text-violet-400", badge: "bg-violet-500/20 text-violet-300" },
  amber: { border: "border-amber-400/60", bg: "bg-amber-500/10", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-300" },
  emerald: { border: "border-emerald-400/60", bg: "bg-emerald-500/10", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300" },
  sky: { border: "border-sky-400/60", bg: "bg-sky-500/10", text: "text-sky-400", badge: "bg-sky-500/20 text-sky-300" },
  pink: { border: "border-pink-400/60", bg: "bg-pink-500/10", text: "text-pink-400", badge: "bg-pink-500/20 text-pink-300" },
  slate: { border: "border-slate-400/60", bg: "bg-slate-500/10", text: "text-slate-400", badge: "bg-slate-500/20 text-slate-300" },
  fuchsia: { border: "border-fuchsia-400/60", bg: "bg-fuchsia-500/10", text: "text-fuchsia-400", badge: "bg-fuchsia-500/20 text-fuchsia-300" },
  red: { border: "border-red-400/60", bg: "bg-red-500/10", text: "text-red-400", badge: "bg-red-500/20 text-red-300" },
};

const defaultColors = { border: "border-slate-400/60", bg: "bg-slate-500/10", text: "text-slate-400", badge: "bg-slate-500/20 text-slate-300" };

function getIconComponent(iconName: string | undefined) {
  if (!iconName) return null;
  // Simple icon mapping - in production, use a proper icon library
  const iconMap: Record<string, string> = {
    "ampersands": "&",
    "tally": "#",
    "circle-slash": "!",
    "equal": "=",
    "less-than": "<",
    "less-than-or-equal": "<=",
    "greater-than": ">",
    "greater-than-or-equal": ">=",
    "sigma": "+",
    "minus": "-",
    "signpost": "IF",
    "layout-list": "IF-THEN",
    "play": "DO",
    "terminal": "EV",
    "tag": "KY",
    "clipboard-check": "RS",
    "variable": "V",
    "form-input": "T",
    "calendar-days": "DT",
    "calendar-range": "DT",
    "calendar": "DT",
    "text-cursor": "T",
    "key-round": "KY",
    "link": "LN",
    "link-2": "LN",
    "link-2-off": "LN",
    "external-link": "LN",
    "file-plus": "+",
    "file-x": "X",
    "file-pen": "ED",
    "file-key": "KY",
    "dice": "RN",
    "clock": "TM",
    "circle-question-mark": "?",
    "mail-question-mark": "?",
    "app-window": "AP",
    "package": "PK",
    "package-search": "PK",
    "package-open": "PK",
    "send-horizontal": "SN",
    "book-check": "OK",
    "list-x": "X",
    "list-checks": "OK",
    "list-todo": "TO",
    "list-plus": "+",
    "mail": "MN",
    "plus": "+",
    "trash": "TR",
    "calendar-clock": "TM",
    "calendar-x-2": "X",
    "database": "DB",
    "split": "SP",
    "blocks": "BL",
    "pyramid": "PY",
    "triangle": "TR",
    "square": "SQ",
    "diamond": "DM",
    "braces": "{}",
    "function": "fn",
    "code": "C",
    "box": "[]",
    "brackets": "[]",
    "regex": ".*",
    "square-code": "[]",
    "parentheses": "()",
    "copy-check": "OK",
    "copy-x": "X",
    "copy-plus": "+",
    "user-check": "OK",
    "badge-check": "OK",
    "refresh-ccw": "RF",
    "tally-5": "5",
  };
  return iconMap[iconName] || iconName.slice(0, 2).toUpperCase();
}

export function ExpressionBlock({ expression, depth, instanceId, slotIndex, isListSlot, parentInstanceId }: ExpressionBlockProps) {
  const editor = useEditor();
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [tempLabel, setTempLabel] = useState(expression.userLabel || "");

  const def = useMemo(() => lookupExpressionDef(expression.name, expressionRegistry.expressionDefs), [expression.name]);
  const colors = colorMap[def?.color || ""] || defaultColors;
  const iconChar = getIconComponent(def?.icon);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: instanceId,
    data: { type: "expression", expression, depth, instanceId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCollapse = useCallback(() => {
    editor.toggleCollapse(instanceId);
  }, [editor, instanceId]);

  const handleSaveLabel = useCallback(() => {
    if (tempLabel.trim()) {
      editor.setUserLabel(instanceId, tempLabel.trim());
    }
    setIsEditingLabel(false);
  }, [editor, instanceId, tempLabel]);

  const handleDelete = useCallback(() => {
    if (slotIndex !== undefined && parentInstanceId) {
      editor.removeSlot(parentInstanceId, slotIndex);
    }
  }, [editor, slotIndex, parentInstanceId]);

  const handleCopy = useCallback(() => {
    editor.copyExpression(instanceId);
  }, [editor, instanceId]);

  const slotCount = expression.data?.length || 0;
  const hasListSlots = def?.slots.some((s: any) => s.isListSlot);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border transition-all duration-200",
        colors.border,
        isDragging && "shadow-lg ring-2 ring-blue-500/30",
        depth === 0 && "bg-slate-900/50",
        depth > 0 && "bg-slate-900/30"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 cursor-pointer select-none",
          colors.bg,
          "hover:bg-opacity-80"
        )}
        onClick={handleCollapse}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className={cn("cursor-grab active:cursor-grabbing flex-shrink-0", isListSlot ? "opacity-100" : "opacity-0 hover:opacity-100")}
        >
          <GripVertical className="w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* Collapse toggle */}
        <div className="flex-shrink-0 text-slate-500">
          {editor.root.collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>

        {/* Icon */}
        <div className={cn("w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold", colors.badge)}>
          {iconChar}
        </div>

        {/* Label */}
        <span className={cn("text-sm font-semibold truncate", colors.text)}>
          {def?.label || expression.name}
        </span>

        {/* User label */}
        {expression.userLabel && (
          <span className="text-xs text-slate-500 italic truncate max-w-[120px]">
            "{expression.userLabel}"
          </span>
        )}

        {/* Editable user label */}
        {isEditingLabel ? (
          <input
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onBlur={handleSaveLabel}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveLabel();
              if (e.key === "Escape") {
                setTempLabel(expression.userLabel || "");
                setIsEditingLabel(false);
              }
            }}
            className="w-24 text-xs bg-slate-800 border border-slate-600 rounded px-1.5 py-0.5 text-slate-300 outline-none"
            autoFocus
          />
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTempLabel(expression.userLabel || "");
              setIsEditingLabel(true);
            }}
            className="ml-auto flex items-center gap-1 text-slate-600 hover:text-slate-400 flex-shrink-0"
          >
            <Pencil className="w-3 h-3" />
          </button>
        )}

        {/* Return type badge */}
        {def?.returnType && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 font-mono">
            {def.returnType}
          </span>
        )}

        {/* Slot count */}
        {slotCount > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-600">
            {slotCount} slot{slotCount !== 1 ? "s" : ""}
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-600 hover:text-slate-400"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-600 hover:text-red-400"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!editor.root.collapsed && (
        <div className="px-3 pb-3 space-y-2">
          {def?.slots.map((slotDef: any, idx: number) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-xs text-slate-500 w-24 flex-shrink-0 pt-1">
                {slotDef.label}
                {slotDef.required && <span className="text-red-400 ml-0.5">*</span>}
              </span>
              <div className="flex-1">
                <ValueEditor
                  slotDef={slotDef}
                  slotIndex={idx}
                  expression={expression}
                  instanceId={instanceId}
                  depth={depth + 1}
                />
              </div>
            </div>
          ))}

          {/* Add expression button for list slots */}
          {hasListSlots && (
            <div className="pt-1">
              <AddExpressionPopover
                parentInstanceId={instanceId}
                depth={depth + 1}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

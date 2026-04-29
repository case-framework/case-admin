"use client";

import { useEditor } from "./expression-editor-context";
import { expressionRegistry } from "@/lib/expression-registry";
import { lookupExpressionDef } from "@/lib/expression-types";
import { ExpressionBlock } from "./expression-block";
import { AddExpressionPopover } from "./add-expression-popover";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface ExpressionListProps {
  expression: any;
  depth: number;
  parentInstanceId?: string;
  slotIndex?: number;
  isListSlot?: boolean;
}

export function ExpressionList({ expression, depth, parentInstanceId, slotIndex, isListSlot }: ExpressionListProps) {
  const editor = useEditor();
  const def = lookupExpressionDef(expression.name, expressionRegistry.expressionDefs);

  // If this is a list slot, render children
  if (isListSlot && expression.data) {
    return (
      <div className="space-y-1 ml-2">
        {expression.data.map((child: any, idx: number) => {
          if (child.dtype !== "exp") return null;
          const childDef = lookupExpressionDef(child.exp.name, expressionRegistry.expressionDefs);
          return (
            <div key={idx} className="flex items-start gap-2 group">
              {/* Drag handle for list items */}
              <div className="cursor-grab active:cursor-grabbing pt-2 flex-shrink-0 opacity-0 group-hover:opacity-100">
                <GripVertical className="w-3 h-3 text-slate-600" />
              </div>
              <ExpressionBlock
                expression={child.exp}
                depth={depth}
                instanceId={`expr_${expression.name}_${idx}`}
                parentInstanceId={parentInstanceId || expression.name}
              />
            </div>
          );
        })}
        {/* Add button for list slots */}
        <div className="ml-5">
          <AddExpressionPopover parentInstanceId={parentInstanceId || expression.name} depth={depth + 1} />
        </div>
      </div>
    );
  }

  // Regular expression with slots
  return (
    <div className="space-y-2">
      {def?.slots.map((slotDef: any, idx: number) => {
        const child = expression.data?.[idx];

        if (slotDef.isListSlot) {
          return (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-xs text-slate-500 w-24 flex-shrink-0 pt-1">
                {slotDef.label}
                {slotDef.required && <span className="text-red-400 ml-0.5">*</span>}
              </span>
              <div className="flex-1 space-y-1">
                {child?.dtype === "exp" && child.exp?.data ? (
                  <ExpressionList
                    expression={child.exp}
                    depth={depth + 1}
                    parentInstanceId={expression.name}
                    slotIndex={idx}
                    isListSlot={true}
                  />
                ) : (
                  <AddExpressionPopover
                    parentInstanceId={expression.name}
                    depth={depth + 1}
                  />
                )}
              </div>
            </div>
          );
        }

        // Single value slot
        return (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-xs text-slate-500 w-24 flex-shrink-0 pt-1">
              {slotDef.label}
              {slotDef.required && <span className="text-red-400 ml-0.5">*</span>}
            </span>
            <div className="flex-1">
              <ValueEditorInline
                slotDef={slotDef}
                slotIndex={idx}
                expression={expression}
                instanceId={expression.name}
                depth={depth + 1}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ValueEditorInline({ slotDef, slotIndex, expression, instanceId, depth }: {
  slotDef: any;
  slotIndex: number;
  expression: any;
  instanceId: string;
  depth: number;
}) {
  const editor = useEditor();
  const currentArg = expression.data?.[slotIndex];

  // Expression slot
  if (currentArg?.dtype === "exp") {
    const childDef = lookupExpressionDef(currentArg.exp.name, expressionRegistry.expressionDefs);
    if (childDef) {
      return (
        <ExpressionBlock
          expression={currentArg.exp}
          depth={depth}
          instanceId={`${instanceId}_slot_${slotIndex}`}
        />
      );
    }
  }

  // String input
  if (currentArg?.dtype === "str" || (!currentArg && slotDef.allowedTypes?.some((t: any) => t.type === "str"))) {
    return (
      <input
        value={currentArg?.str || ""}
        onChange={(e) => editor.updateSlot(instanceId, slotIndex, { dtype: "str", str: e.target.value })}
        className="w-full h-7 bg-slate-800/50 border border-slate-700 rounded px-2 text-xs text-slate-300 outline-none focus:border-slate-500"
        placeholder="Enter text..."
      />
    );
  }

  // Number input
  if (currentArg?.dtype === "num" || (!currentArg && slotDef.allowedTypes?.some((t: any) => t.type === "num"))) {
    return (
      <input
        type="number"
        value={currentArg?.num ?? 0}
        onChange={(e) => editor.updateSlot(instanceId, slotIndex, { dtype: "num", num: parseFloat(e.target.value) || 0 })}
        className="w-24 h-7 bg-slate-800/50 border border-slate-700 rounded px-2 text-xs text-slate-300 outline-none focus:border-slate-500"
      />
    );
  }

  // No value, show add button
  return (
    <AddExpressionPopover parentInstanceId={instanceId} depth={depth} />
  );
}

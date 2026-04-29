"use client";

import { useEditor } from "./expression-editor-context";
import { expressionRegistry } from "@/lib/expression-registry";
import { ExpressionArg, isExpArg, isNumArg, isStrArg } from "@/lib/expression-types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { X, Plus } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface ValueEditorProps {
  slotDef: any;
  slotIndex: number;
  expression: any;
  instanceId: string;
  depth: number;
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/20 text-blue-300",
  green: "bg-emerald-500/20 text-emerald-300",
  yellow: "bg-amber-500/20 text-amber-300",
  purple: "bg-purple-500/20 text-purple-300",
  teal: "bg-teal-500/20 text-teal-300",
  cyan: "bg-cyan-500/20 text-cyan-300",
  dark: "bg-slate-500/20 text-slate-300",
  lime: "bg-lime-500/20 text-lime-300",
  orange: "bg-orange-500/20 text-orange-300",
  rose: "bg-rose-500/20 text-rose-300",
  indigo: "bg-indigo-500/20 text-indigo-300",
  violet: "bg-violet-500/20 text-violet-300",
  amber: "bg-amber-500/20 text-amber-300",
  emerald: "bg-emerald-500/20 text-emerald-300",
  sky: "bg-sky-500/20 text-sky-300",
  pink: "bg-pink-500/20 text-pink-300",
  slate: "bg-slate-500/20 text-slate-300",
  fuchsia: "bg-fuchsia-500/20 text-fuchsia-300",
  red: "bg-red-500/20 text-red-300",
};

function getIconComponent(iconName: string | undefined) {
  if (!iconName) return null;
  const iconMap: Record<string, string> = {
    "ampersands": "&", "tally": "#", "circle-slash": "!", "equal": "=",
    "less-than": "<", "less-than-or-equal": "<=", "greater-than": ">",
    "greater-than-or-equal": ">=", "sigma": "+", "minus": "-",
    "signpost": "IF", "layout-list": "IF-THEN", "play": "DO",
    "terminal": "EV", "tag": "KY", "clipboard-check": "RS",
    "variable": "V", "form-input": "T", "calendar-days": "DT",
    "calendar-range": "DT", "calendar": "DT", "text-cursor": "T",
    "key-round": "KY", "link": "LN", "link-2": "LN", "link-2-off": "LN",
    "external-link": "LN", "file-plus": "+", "file-x": "X",
    "file-pen": "ED", "file-key": "KY", "dice": "RN", "clock": "TM",
    "database": "DB", "split": "SP", "blocks": "BL",
    "package": "PK", "package-search": "PK", "package-open": "PK",
    "send-horizontal": "SN", "book-check": "OK", "list-x": "X",
    "list-checks": "OK", "list-todo": "TO", "list-plus": "+",
    "mail": "MN", "trash": "TR", "calendar-clock": "TM",
    "calendar-x-2": "X", "user-check": "OK", "badge-check": "OK",
    "refresh-ccw": "RF", "tally-5": "5",
  };
  return iconMap[iconName] || iconName.slice(0, 2).toUpperCase();
}

export function ValueEditor({ slotDef, slotIndex, expression, instanceId, depth }: ValueEditorProps) {
  const editor = useEditor();
  const currentArg = expression.data?.[slotIndex];
  const isListSlot = slotDef.isListSlot;

  // For list slots, show a list of children
  if (isListSlot && currentArg?.dtype === "exp" && currentArg.exp?.data) {
    return <ListSlotEditor
      slotDef={slotDef}
      slotIndex={slotIndex}
      expression={expression}
      instanceId={instanceId}
      children={currentArg.exp.data}
    />;
  }

  // For list slots without a value yet, show an add button
  if (isListSlot && !currentArg) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs border-dashed border-slate-700 text-slate-600 hover:text-slate-400"
          onClick={() => {
            editor.updateSlot(instanceId, slotIndex, {
              dtype: "exp",
              exp: { name: "eq", data: [] },
            });
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          Add item
        </Button>
      </div>
    );
  }

  // Handle expression slot
  if (currentArg?.dtype === "exp") {
    return <ExpressionSlotEditor
      slotDef={slotDef}
      slotIndex={slotIndex}
      expression={expression}
      instanceId={instanceId}
      currentExp={currentArg.exp}
    />;
  }

  // Handle string slot
  if (currentArg?.dtype === "str" || slotDef.allowedTypes?.some((t: any) => t.type === "str" && t.type !== "expression")) {
    return <StringSlotEditor
      slotDef={slotDef}
      slotIndex={slotIndex}
      expression={expression}
      instanceId={instanceId}
      currentValue={currentArg?.str || ""}
    />;
  }

  // Handle number slot
  if (currentArg?.dtype === "num" || slotDef.allowedTypes?.some((t: any) => t.type === "num" && t.type !== "expression")) {
    return <NumberSlotEditor
      slotDef={slotDef}
      slotIndex={slotIndex}
      expression={expression}
      instanceId={instanceId}
      currentValue={currentArg?.num ?? 0}
    />;
  }

  // Default: show expression selector
  return <ExpressionSlotEditor
    slotDef={slotDef}
    slotIndex={slotIndex}
    expression={expression}
    instanceId={instanceId}
    currentExp={currentArg?.dtype === "exp" ? currentArg.exp : undefined}
  />;
}

function StringSlotEditor({ slotDef, slotIndex, expression, instanceId, currentValue }: {
  slotDef: any;
  slotIndex: number;
  expression: any;
  instanceId: string;
  currentValue: string;
}) {
  const editor = useEditor();
  const [open, setOpen] = useState(false);

  // Check if this is a select type
  const selectType = slotDef.allowedTypes?.find((t: any) => t.type === "select");
  if (selectType) {
    return (
      <Select value={currentValue} onValueChange={(v) => editor.updateSlot(instanceId, slotIndex, { dtype: "str", str: v })}>
        <SelectTrigger className="h-7 bg-slate-800/50 border-slate-700 text-sm">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {selectType.options.map((opt: any) => (
            <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Check if this is a list-selector
  const listSelectorType = slotDef.allowedTypes?.find((t: any) => t.type === "list-selector");
  if (listSelectorType) {
    const contextKey = listSelectorType.contextArrayKey;
    const mockData: Record<string, { key: string; label: string }[]> = {
      studyStatusValues: [
        { key: "active", label: "Active" },
        { key: "inactive", label: "Inactive" },
        { key: "pending", label: "Pending" },
        { key: "completed", label: "Completed" },
      ],
      surveyKeys: [
        { key: "consent", label: "Consent Form" },
        { key: "weekly", label: "Weekly Survey" },
        { key: "baseline", label: "Baseline Survey" },
        { key: "followup", label: "Follow-up Survey" },
      ],
      customEventKeys: [
        { key: "custom_event_1", label: "Custom Event 1" },
        { key: "custom_event_2", label: "Custom Event 2" },
      ],
      participantFlagKeys: [
        { key: "verified", label: "Verified" },
        { key: "premium", label: "Premium User" },
      ],
      messageTypes: [
        { key: "reminder", label: "Reminder" },
        { key: "notification", label: "Notification" },
        { key: "alert", label: "Alert" },
      ],
      monthValues: [
        { key: "1", label: "January" }, { key: "2", label: "February" },
        { key: "3", label: "March" }, { key: "4", label: "April" },
        { key: "5", label: "May" }, { key: "6", label: "June" },
        { key: "7", label: "July" }, { key: "8", label: "August" },
        { key: "9", label: "September" }, { key: "10", label: "October" },
        { key: "11", label: "November" }, { key: "12", label: "December" },
      ],
      codeLists: [
        { key: "diagnosis", label: "Diagnosis Codes" },
        { key: "medication", label: "Medication Codes" },
      ],
    };
    const data = mockData[contextKey] || [];

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-7 bg-slate-800/50 border-slate-700 text-sm justify-between",
              !currentValue && "text-slate-500"
            )}
          >
            {currentValue || "Select..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[240px]" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup>
                {data.map((item: any) => (
                  <CommandItem
                    key={item.key}
                    onSelect={() => {
                      editor.updateSlot(instanceId, slotIndex, { dtype: "str", str: item.key });
                      setOpen(false);
                    }}
                    className="px-3 py-2 text-sm cursor-pointer"
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  // Regular text input
  return (
    <Input
      value={currentValue}
      onChange={(e) => editor.updateSlot(instanceId, slotIndex, { dtype: "str", str: e.target.value })}
      className="h-7 bg-slate-800/50 border-slate-700 text-sm"
      placeholder="Enter text..."
    />
  );
}

function NumberSlotEditor({ slotDef, slotIndex, expression, instanceId, currentValue }: {
  slotDef: any;
  slotIndex: number;
  expression: any;
  instanceId: string;
  currentValue: number;
}) {
  const editor = useEditor();

  return (
    <Input
      type="number"
      value={currentValue}
      onChange={(e) => editor.updateSlot(instanceId, slotIndex, { dtype: "num", num: parseFloat(e.target.value) || 0 })}
      className="h-7 bg-slate-800/50 border-slate-700 text-sm w-24"
    />
  );
}

function ExpressionSlotEditor({ slotDef, slotIndex, expression, instanceId, currentExp }: {
  slotDef: any;
  slotIndex: number;
  expression: any;
  instanceId: string;
  currentExp?: any;
}) {
  const editor = useEditor();
  const [open, setOpen] = useState(false);

  const def = currentExp ? expressionRegistry.expressionDefs.find((d) => d.id === currentExp.name) : null;

  // If we have an expression, show it as a compact block with ability to change
  if (currentExp && def) {
    return (
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded border text-xs",
          colorMap[def.color || ""] || "bg-slate-500/20 text-slate-300",
          "border-slate-700"
        )}>
          <span className="font-bold">{getIconComponent(def.icon)}</span>
          <span>{def.label}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-slate-500 hover:text-slate-300"
          onClick={() => setOpen(true)}
        >
          Change
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-slate-600 hover:text-red-400"
          onClick={() => editor.updateSlot(instanceId, slotIndex, { dtype: "str", str: "" })}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  // No expression yet, show selector
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 text-xs border-dashed border-slate-700 text-slate-500 hover:text-slate-300",
            "justify-start gap-1.5"
          )}
        >
          <Plus className="w-3 h-3" />
          Select expression...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" side="bottom" align="start">
        <Command>
          <CommandInput placeholder="Search expressions..." />
          <CommandList>
            <CommandEmpty>No expressions found.</CommandEmpty>
            {expressionRegistry.categories.map((cat) => {
              const items = expressionRegistry.expressionDefs.filter((d) =>
                d.categories.includes(cat.id)
              );
              if (items.length === 0) return null;
              return (
                <CommandGroup key={cat.id} heading={cat.label}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        editor.updateSlot(instanceId, slotIndex, {
                          dtype: "exp",
                          exp: {
                            name: item.id,
                            data: item.defaultValue ? [JSON.parse(JSON.stringify(item.defaultValue))] : [],
                          },
                        });
                        setOpen(false);
                      }}
                      className="px-3 py-2 text-sm cursor-pointer"
                    >
                      <span className={cn("w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold mr-2 flex-shrink-0", colorMap[item.color || ""] || "bg-slate-500/20 text-slate-300")}>
                        {getIconComponent(item.icon)}
                      </span>
                      <span className="text-slate-300">{item.label}</span>
                      <span className="ml-auto text-[10px] text-slate-600 font-mono">
                        {item.returnType}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ListSlotEditor({ slotDef, slotIndex, expression, instanceId, children }: {
  slotDef: any;
  slotIndex: number;
  expression: any;
  instanceId: string;
  children: any[];
}) {
  const editor = useEditor();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleMove = (from: number, to: number) => {
    if (from === to) return;
    const newChildren = [...children];
    const [removed] = newChildren.splice(from, 1);
    newChildren.splice(to, 0, removed);
    editor.updateSlot(instanceId, slotIndex, {
      dtype: "exp",
      exp: { ...expression, data: newChildren },
    });
  };

  return (
    <div className="space-y-1">
      {children.map((child, idx) => {
        const childDef = child.dtype === "exp" ? expressionRegistry.expressionDefs.find((d) => d.id === child.exp.name) : null;
        return (
          <div
            key={idx}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded bg-slate-800/30 border border-slate-800",
              "group hover:border-slate-700",
              dragIndex === idx && "opacity-50"
            )}
            draggable
            onDragStart={() => setDragIndex(idx)}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={() => {
              if (dragIndex !== null && dragIndex !== idx) {
                handleMove(dragIndex, idx);
              }
              setDragIndex(null);
            }}
          >
            {/* Drag handle */}
            <div className="cursor-grab text-slate-600 hover:text-slate-400">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="6" r="1" fill="currentColor" />
                <circle cx="15" cy="6" r="1" fill="currentColor" />
                <circle cx="9" cy="12" r="1" fill="currentColor" />
                <circle cx="15" cy="12" r="1" fill="currentColor" />
                <circle cx="9" cy="18" r="1" fill="currentColor" />
                <circle cx="15" cy="18" r="1" fill="currentColor" />
              </svg>
            </div>

            {/* Expression badge */}
            {childDef ? (
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded text-xs",
                colorMap[childDef.color || ""] || "bg-slate-500/20 text-slate-300"
              )}>
                <span className="font-bold">{getIconComponent(childDef.icon)}</span>
                <span>{childDef.label}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-500">Unknown expression</span>
            )}

            {/* Actions */}
            <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => handleMove(idx, idx - 1)}
                disabled={idx === 0}
                className="p-0.5 text-slate-600 hover:text-slate-400 disabled:opacity-30"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>
              <button
                onClick={() => handleMove(idx, idx + 1)}
                disabled={idx === children.length - 1}
                className="p-0.5 text-slate-600 hover:text-slate-400 disabled:opacity-30"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => {
                  const newChildren = children.filter((_, i) => i !== idx);
                  editor.updateSlot(instanceId, slotIndex, {
                    dtype: "exp",
                    exp: { ...expression, data: newChildren },
                  });
                }}
                className="p-0.5 text-slate-600 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })}

      {/* Add button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 text-xs border-dashed border-slate-800 text-slate-600 hover:text-slate-400 w-full"
        onClick={() => {
          const newChildren = [...children, { dtype: "exp", exp: { name: "eq", data: [] } }];
          editor.updateSlot(instanceId, slotIndex, {
            dtype: "exp",
            exp: { ...expression, data: newChildren },
          });
        }}
      >
        <Plus className="w-3 h-3 mr-1" />
        Add item
      </Button>
    </div>
  );
}

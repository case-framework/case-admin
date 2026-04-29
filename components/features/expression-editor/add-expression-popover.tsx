"use client";

import { useEditor } from "./expression-editor-context";
import { expressionRegistry } from "@/lib/expression-registry";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus, Clipboard } from "lucide-react";
import { useState, useCallback } from "react";
import { useClipboardValue } from "@/hooks/useClipboardValue";
import { cn } from "@/lib/utils";

interface AddExpressionPopoverProps {
  parentInstanceId: string;
  depth: number;
}

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

export function AddExpressionPopover({ parentInstanceId }: AddExpressionPopoverProps) {
  const editor = useEditor();
  const [open, setOpen] = useState(false);
  const [clipboardValue] = useClipboardValue();
  const [hasClipboardData, setHasClipboardData] = useState(false);

  // Check if clipboard has valid data
  useState(() => {
    if (clipboardValue) {
      try {
        const content = JSON.parse(clipboardValue);
        if (content && content.slotType && content.value) {
          setHasClipboardData(true);
        }
      } catch {
        setHasClipboardData(false);
      }
    }
  });

  const handleAddExpression = useCallback((expressionId: string) => {
    const def = expressionRegistry.expressionDefs.find((d) => d.id === expressionId);
    if (!def) return;

    const newExpr = {
      name: def.id,
      data: def.defaultValue ? [JSON.parse(JSON.stringify(def.defaultValue))] : [],
    };

    // Find the first list slot or append to data
    const listSlotIndex = def.slots.findIndex((s: any) => s.isListSlot);
    if (listSlotIndex !== -1) {
      editor.addChild(parentInstanceId, listSlotIndex, {
        expression: newExpr,
        collapsed: false,
        instanceId: `expr_${Date.now()}`,
      });
    } else {
      editor.updateSlot(parentInstanceId, 0, { dtype: "exp", exp: newExpr });
    }
    setOpen(false);
  }, [editor, parentInstanceId]);

  const handlePaste = useCallback(() => {
    if (!clipboardValue) return;
    try {
      const content = JSON.parse(clipboardValue);
      if (content && content.value) {
        editor.pasteExpression(parentInstanceId, 0);
      }
    } catch {
      // ignore
    }
    setOpen(false);
  }, [editor, parentInstanceId, clipboardValue]);

  // Group expressions by category
  const grouped = expressionRegistry.categories.map((cat) => {
    const items = expressionRegistry.expressionDefs.filter((d) =>
      d.categories.includes(cat.id)
    );
    return { category: cat, items };
  }).filter((g) => g.items.length > 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full h-8 text-xs border-dashed border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500",
            "justify-start gap-1.5"
          )}
        >
          <Plus className="w-3.5 h-3.5" />
          Add expression
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[320px]" side="bottom" align="start">
        <Command>
          <CommandInput placeholder="Search expressions..." />
          <CommandList>
            <CommandEmpty>No expressions found.</CommandEmpty>

            {hasClipboardData && (
              <CommandItem
                onSelect={handlePaste}
                className="px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
              >
                <Clipboard className="w-4 h-4 mr-2" />
                Paste from clipboard
              </CommandItem>
            )}

            {grouped.map(({ category, items }) => (
              <CommandGroup key={category.id} heading={category.label}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleAddExpression(item.id)}
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
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

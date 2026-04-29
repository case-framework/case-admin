"use client";

import { expressionRegistry } from "@/lib/expression-registry";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { BookOpen, Plus, Trash2, Pencil } from "lucide-react";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEditor } from "./expression-editor-context";
import { NamedExpression, createExpression, cloneExpression } from "@/lib/expression-types";

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

export function ExpressionPalette() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Expression Library
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[360px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-sm">Expression Library</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
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
                        className="px-3 py-2 text-sm cursor-pointer"
                      >
                        <span className={cn("w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0", colorMap[item.color || ""] || "bg-slate-500/20 text-slate-300")}>
                          {getIconComponent(item.icon)}
                        </span>
                        <div>
                          <div className="text-slate-300 text-xs font-medium">{item.label}</div>
                          <div className="text-[10px] text-slate-600">
                            {item.slots.length} slot{item.slots.length !== 1 ? "s" : ""} · {item.returnType}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}
            </CommandList>
          </Command>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function NamedExpressionsPanel() {
  const editor = useEditor();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  const handleSaveName = (id: string) => {
    if (tempName.trim()) {
      editor.addNamedExpression({
        id,
        name: tempName.trim(),
        expression: { name: "eq", data: [] },
      });
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-slate-400">Named Expressions</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-slate-500 hover:text-slate-300"
          onClick={() => {
            const id = `named_${Date.now()}`;
            setEditingId(id);
            setTempName("");
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          New
        </Button>
      </div>

      {editingId && (
        <div className="flex items-center gap-2">
          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Expression name..."
            className="h-7 bg-slate-800/50 border-slate-700 text-xs"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName(editingId);
              if (e.key === "Escape") setEditingId(null);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-emerald-400"
            onClick={() => handleSaveName(editingId)}
          >
            Save
          </Button>
        </div>
      )}

      {editor.namedExpressions.length === 0 && !editingId && (
        <div className="text-xs text-slate-600 italic py-2">
          No named expressions yet. Save expressions to reuse them.
        </div>
      )}

      {editor.namedExpressions.map((named) => (
        <div
          key={named.id}
          className="flex items-center gap-2 px-2 py-1.5 rounded bg-slate-800/30 border border-slate-800 group"
        >
          <span className="text-xs text-slate-400 truncate flex-1">
            {named.name}
          </span>
          <button
            onClick={() => {
              setEditingId(named.id);
              setTempName(named.name);
            }}
            className="p-0.5 text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={() => editor.removeNamedExpression(named.id)}
            className="p-0.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

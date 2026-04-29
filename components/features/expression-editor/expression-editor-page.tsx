"use client";

import { EditorProvider, useEditor } from "./expression-editor-context";
import { ExpressionBlock } from "./expression-block";
import { ExpressionPalette, NamedExpressionsPanel } from "./expression-palette";
import { AddExpressionPopover } from "./add-expression-popover";
import { expressionRegistry } from "@/lib/expression-registry";
import { lookupExpressionDef } from "@/lib/expression-types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code2,
  Save,
  Download,
  Upload,
  Copy,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  GitBranch,
  Settings2,
} from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Default expression (IF-THEN template) ───────────────────────────────────

function createDefaultExpression(): any {
  return {
    name: "IFTHEN",
    data: [
      {
        dtype: "exp",
        exp: {
          name: "eq",
          data: [
            { dtype: "str", str: "weekly.Q1" },
            { dtype: "str", str: "option_1" },
          ],
        },
      },
      {
        dtype: "exp",
        exp: {
          name: "UPDATE_STUDY_STATUS",
          data: [{ dtype: "str", str: "active" }],
        },
      },
    ],
  };
}

// ─── Main Editor Content ─────────────────────────────────────────────────────

function ExpressionEditorContent() {
  const editor = useEditor();
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "named">("editor");
  const [showAllCollapsed, setShowAllCollapsed] = useState(false);

  const handleSave = useCallback(() => {
    toast.success("Expression saved");
  }, []);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(editor.root.expression, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expression.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Expression exported");
  }, [editor.root.expression]);

  const handleReset = useCallback(() => {
    editor.setRoot({
      expression: createDefaultExpression(),
      collapsed: false,
      instanceId: `root_${Date.now()}`,
    });
    toast.info("Expression reset to default");
  }, [editor]);

  const handleCopyRoot = useCallback(() => {
    const json = JSON.stringify(editor.root.expression, null, 2);
    navigator.clipboard.writeText(json);
    toast.success("Expression copied to clipboard");
  }, [editor.root.expression]);

  // Recursively collapse/expand all
  const toggleAll = useCallback(() => {
    setShowAllCollapsed(!showAllCollapsed);
    // In a real implementation, we'd traverse the tree
  }, [showAllCollapsed]);

  const rootDef = lookupExpressionDef(editor.root.expression.name, expressionRegistry.expressionDefs);

  return (
    <div className="flex h-full">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">
                {rootDef?.label || editor.root.expression.name}
              </span>
              {rootDef?.returnType && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 font-mono">
                  {rootDef.returnType}
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-slate-500 hover:text-slate-300"
              onClick={toggleAll}
            >
              {showAllCollapsed ? (
                <Eye className="w-3.5 h-3.5 mr-1" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 mr-1" />
              )}
              {showAllCollapsed ? "Expand all" : "Collapse all"}
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-slate-500 hover:text-slate-300 gap-1.5"
              onClick={handleCopyRoot}
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-slate-500 hover:text-slate-300 gap-1.5"
              onClick={handleReset}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-slate-500 hover:text-slate-300 gap-1.5"
              onClick={handleExport}
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-7 text-xs gap-1.5 bg-blue-600 hover:bg-blue-500"
              onClick={handleSave}
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
          <div className="px-4 border-b border-slate-800">
            <TabsList className="h-9 bg-transparent gap-0 p-0 border-b border-slate-800">
              <TabsTrigger
                value="editor"
                className="h-8 px-3 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent bg-transparent"
              >
                <GitBranch className="w-3.5 h-3.5 mr-1.5" />
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="h-8 px-3 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent bg-transparent"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="named"
                className="h-8 px-3 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent bg-transparent"
              >
                <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                Named
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="flex-1 overflow-auto p-4 m-0">
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Root expression */}
              <ExpressionBlock
                expression={editor.root.expression}
                depth={0}
                instanceId={editor.root.instanceId}
              />

              {/* Quick add at bottom */}
              <div className="pt-4 border-t border-slate-800">
                <AddExpressionPopover parentInstanceId={editor.root.instanceId} depth={1} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-auto m-0">
            <div className="p-4">
              <pre className="text-xs text-slate-400 bg-slate-900/50 rounded-lg p-4 overflow-auto max-h-[calc(100vh-200px)]">
                {JSON.stringify(editor.root.expression, null, 2)}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="named" className="flex-1 overflow-auto m-0">
            <div className="p-4 max-w-md">
              <NamedExpressionsPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Sidebar - Expression Library */}
      <div className="w-64 border-l border-slate-800 bg-slate-900/30 flex flex-col">
        <div className="p-3 border-b border-slate-800">
          <h3 className="text-xs font-medium text-slate-400">Expression Library</h3>
        </div>
        <div className="flex-1 overflow-auto p-3">
          <div className="space-y-3">
            {expressionRegistry.categories.map((cat) => {
              const items = expressionRegistry.expressionDefs.filter((d) =>
                d.categories.includes(cat.id)
              );
              if (items.length === 0) return null;
              return (
                <div key={cat.id}>
                  <h4 className="text-[10px] font-medium text-slate-600 uppercase tracking-wider mb-1.5">
                    {cat.label}
                  </h4>
                  <div className="space-y-0.5">
                    {items.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors",
                          "hover:bg-slate-800/50"
                        )}
                        onClick={() => {
                          const newExpr = {
                            name: item.id,
                            data: item.defaultValue ? [JSON.parse(JSON.stringify(item.defaultValue))] : [],
                          };
                          editor.setRoot({
                            expression: newExpr,
                            collapsed: false,
                            instanceId: `root_${Date.now()}`,
                          });
                        }}
                      >
                        <span className={cn(
                          "w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0",
                          item.color === "blue" && "bg-blue-500/20 text-blue-300",
                          item.color === "green" && "bg-emerald-500/20 text-emerald-300",
                          item.color === "yellow" && "bg-amber-500/20 text-amber-300",
                          item.color === "purple" && "bg-purple-500/20 text-purple-300",
                          item.color === "teal" && "bg-teal-500/20 text-teal-300",
                          item.color === "cyan" && "bg-cyan-500/20 text-cyan-300",
                          item.color === "dark" && "bg-slate-500/20 text-slate-300",
                          item.color === "lime" && "bg-lime-500/20 text-lime-300",
                          item.color === "orange" && "bg-orange-500/20 text-orange-300",
                          item.color === "rose" && "bg-rose-500/20 text-rose-300",
                          item.color === "indigo" && "bg-indigo-500/20 text-indigo-300",
                          item.color === "violet" && "bg-violet-500/20 text-violet-300",
                          item.color === "amber" && "bg-amber-500/20 text-amber-300",
                          item.color === "emerald" && "bg-emerald-500/20 text-emerald-300",
                          item.color === "sky" && "bg-sky-500/20 text-sky-300",
                          item.color === "pink" && "bg-pink-500/20 text-pink-300",
                          item.color === "slate" && "bg-slate-500/20 text-slate-300",
                          item.color === "fuchsia" && "bg-fuchsia-500/20 text-fuchsia-300",
                          item.color === "red" && "bg-red-500/20 text-red-300",
                        )}>
                          {item.icon?.slice(0, 2).toUpperCase() || "??"}
                        </span>
                        <span className="text-xs text-slate-400 truncate">{item.label}</span>
                      </button>
                    ))}
                    {items.length > 8 && (
                      <button className="w-full text-[10px] text-slate-600 hover:text-slate-400 py-1">
                        +{items.length - 8} more...
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ExpressionEditorPage() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-950">
      <EditorProvider>
        <ExpressionEditorContent />
      </EditorProvider>
    </div>
  );
}

"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { Expression, ExpressionArg, NamedExpression, createExpression, cloneExpression } from "@/lib/expression-types";

export interface ExpressionState {
  expression: Expression;
  userLabel?: string;
  collapsed: boolean;
  /** Unique ID for this expression instance (for drag-and-drop) */
  instanceId: string;
}

export interface EditorContextValue {
  /** The root expression tree */
  root: ExpressionState;
  setRoot: (root: ExpressionState) => void;

  /** Update an expression at a given path */
  updateExpression: (instanceId: string, update: Partial<Expression>) => void;

  /** Update a specific slot value */
  updateSlot: (instanceId: string, slotIndex: number, arg: ExpressionArg) => void;

  /** Insert a slot at a given index */
  insertSlot: (instanceId: string, slotIndex: number, arg: ExpressionArg) => void;

  /** Remove a slot */
  removeSlot: (instanceId: string, slotIndex: number) => void;

  /** Toggle collapse state */
  toggleCollapse: (instanceId: string) => void;

  /** Set user label */
  setUserLabel: (instanceId: string, label: string) => void;

  /** Add a child expression to a list slot */
  addChild: (parentInstanceId: string, slotIndex: number, child: ExpressionState) => void;

  /** Remove a child expression */
  removeChild: (parentInstanceId: string, childInstanceId: string) => void;

  /** Move a child within a list slot */
  moveChild: (parentInstanceId: string, fromIndex: number, toIndex: number) => void;

  /** Named expressions library */
  namedExpressions: NamedExpression[];
  addNamedExpression: (expr: NamedExpression) => void;
  removeNamedExpression: (id: string) => void;

  /** Clipboard for expressions */
  clipboard: { slotType: string; value: ExpressionArg } | null;
  copyExpression: (instanceId: string) => void;
  pasteExpression: (parentInstanceId: string, slotIndex: number) => void;

  /** Current expression being edited (for study rules context) */
  mode: "condition" | "action" | "value";
  setMode: (mode: "condition" | "action" | "value") => void;
}

export const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}

/** Generate a unique ID */
let idCounter = 0;
function uid(): string {
  return `expr_${Date.now()}_${++idCounter}`;
}

/** Find and update an expression in the tree by instanceId */
function findAndUpdate(
  node: ExpressionState,
  targetId: string,
  updater: (n: ExpressionState) => ExpressionState
): ExpressionState | null {
  if (node.instanceId === targetId) {
    return updater(node);
  }
  // Search children (we don't have direct access to children, so this is handled by the parent)
  return null;
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [root, setRoot] = useState<ExpressionState>(() => ({
    expression: { name: "IF", data: [] },
    collapsed: false,
    instanceId: uid(),
  }));

  const [namedExpressions, setNamedExpressions] = useState<NamedExpression[]>([]);
  const [clipboard, setClipboard] = useState<{ slotType: string; value: ExpressionArg } | null>(null);
  const [mode, setMode] = useState<"condition" | "action" | "value">("condition");

  // We store the full tree in a ref for complex operations
  const treeRef = useRef<Map<string, ExpressionState>>(new Map());

  const updateExpression = useCallback((instanceId: string, update: Partial<Expression>) => {
    setRoot((prev) => {
      const newRoot = { ...prev, expression: { ...prev.expression, ...update } };
      return newRoot;
    });
  }, []);

  const updateSlot = useCallback((instanceId: string, slotIndex: number, arg: ExpressionArg) => {
    setRoot((prev) => {
      const data = [...(prev.expression.data || [])];
      data[slotIndex] = arg;
      return { ...prev, expression: { ...prev.expression, data } };
    });
  }, []);

  const insertSlot = useCallback((instanceId: string, slotIndex: number, arg: ExpressionArg) => {
    setRoot((prev) => {
      const data = [...(prev.expression.data || [])];
      data.splice(slotIndex, 0, arg);
      return { ...prev, expression: { ...prev.expression, data } };
    });
  }, []);

  const removeSlot = useCallback((instanceId: string, slotIndex: number) => {
    setRoot((prev) => {
      const data = [...(prev.expression.data || [])];
      data.splice(slotIndex, 1);
      return { ...prev, expression: { ...prev.expression, data } };
    });
  }, []);

  const toggleCollapse = useCallback((instanceId: string) => {
    setRoot((prev) => ({ ...prev, collapsed: !prev.collapsed }));
  }, []);

  const setUserLabel = useCallback((instanceId: string, label: string) => {
    setRoot((prev) => ({ ...prev, userLabel: label }));
  }, []);

  const addChild = useCallback((parentInstanceId: string, slotIndex: number, child: ExpressionState) => {
    setRoot((prev) => {
      const data = [...(prev.expression.data || [])];
      // For list slots, append to the array at slotIndex
      if (!data[slotIndex]) {
        data[slotIndex] = { dtype: "exp" as const, exp: { name: "" } };
      }
      if (data[slotIndex]?.dtype === "exp" && data[slotIndex].exp?.data) {
        const childData = [...data[slotIndex].exp.data, { dtype: "exp" as const, exp: child.expression }];
        data[slotIndex] = { ...data[slotIndex], exp: { ...data[slotIndex].exp, data: childData } };
      }
      return { ...prev, expression: { ...prev.expression, data } };
    });
  }, []);

  const removeChild = useCallback((parentInstanceId: string, childInstanceId: string) => {
    // Simplified - in a real implementation, we'd traverse the tree
  }, []);

  const moveChild = useCallback((parentInstanceId: string, fromIndex: number, toIndex: number) => {
    setRoot((prev) => {
      const data = [...(prev.expression.data || [])];
      // Find the first list slot and reorder
      for (let i = 0; i < data.length; i++) {
        const arg = data[i];
        if (arg && arg.dtype === "exp" && arg.exp?.data) {
          const childData = [...arg.exp.data];
          const [item] = childData.splice(fromIndex, 1);
          childData.splice(toIndex, 0, item);
          data[i] = { ...arg, exp: { ...arg.exp, data: childData } };
          break;
        }
      }
      return { ...prev, expression: { ...prev.expression, data } };
    });
  }, []);

  const addNamedExpression = useCallback((expr: NamedExpression) => {
    setNamedExpressions((prev) => [...prev, expr]);
  }, []);

  const removeNamedExpression = useCallback((id: string) => {
    setNamedExpressions((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const copyExpression = useCallback((instanceId: string) => {
    // Simplified - in a real implementation, we'd find the expression by instanceId
    setClipboard({ slotType: "placeholder", value: { dtype: "str", str: "" } });
  }, []);

  const pasteExpression = useCallback((parentInstanceId: string, slotIndex: number) => {
    if (!clipboard) return;
    updateSlot(parentInstanceId, slotIndex, clipboard.value);
  }, [clipboard, updateSlot]);

  const value: EditorContextValue = {
    root,
    setRoot,
    updateExpression,
    updateSlot,
    insertSlot,
    removeSlot,
    toggleCollapse,
    setUserLabel,
    addChild,
    removeChild,
    moveChild,
    namedExpressions,
    addNamedExpression,
    removeNamedExpression,
    clipboard,
    copyExpression,
    pasteExpression,
    mode,
    setMode,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

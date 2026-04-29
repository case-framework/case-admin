// ─── Core Expression Types ───────────────────────────────────────────────────

export interface Expression {
  name: string;
  returnType?: string;
  data?: ExpressionArg[];
  metadata?: { slotTypes?: string[] };
  /** Optional user-assigned name for this expression instance */
  userLabel?: string;
}

export type ExpressionArg =
  | { dtype: "exp"; exp: Expression }
  | { dtype: "num"; num: number }
  | { dtype: "str"; str: string };

export function isExpArg(arg: ExpressionArg): arg is { dtype: "exp"; exp: Expression } {
  return arg.dtype === "exp";
}

export function isNumArg(arg: ExpressionArg): arg is { dtype: "num"; num: number } {
  return arg.dtype === "num";
}

export function isStrArg(arg: ExpressionArg): arg is { dtype: "str"; str: string } {
  return arg.dtype === "str";
}

// ─── Registry Types ──────────────────────────────────────────────────────────

export type ReturnKind = "action" | "num" | "str" | "boolean" | "object";
export type ColorVariant =
  | "blue" | "green" | "yellow" | "purple" | "teal" | "cyan"
  | "dark" | "lime" | "orange" | "rose" | "indigo" | "violet"
  | "amber" | "emerald" | "sky" | "pink" | "slate" | "fuchsia" | "red";

export interface SlotDef {
  label: string;
  required: boolean;
  isListSlot?: boolean;
  allowedTypes?: AllowedSlotType[];
}

export type AllowedSlotType =
  | { type: "expression"; allowedExpressionTypes?: ReturnKind[]; excludedExpressions?: string[] }
  | { type: "str" }
  | { type: "num" }
  | { type: "date" }
  | { type: "time-delta" }
  | { type: "select"; options: { key: string; label: string }[] }
  | { type: "list-selector"; contextArrayKey: string }
  | { type: "key-value"; contextObjectKey: string; allowExpressionsForValue?: boolean }
  | { type: "key-value-list"; contextArrayKey?: string; withFixedKey?: string; withFixedValue?: string };

export interface ExpressionDef {
  id: string;
  categories: string[];
  label: string;
  slots: SlotDef[];
  returnType: ReturnKind;
  color?: ColorVariant;
  icon?: string;
  defaultValue?: ExpressionArg;
}

export interface ExpressionCategory {
  id: string;
  label: string;
}

// ─── Named Expressions (user-defined snippets) ───────────────────────────────

export interface NamedExpression {
  id: string;
  name: string;
  expression: Expression;
  color?: ColorVariant;
}

// ─── Expression Editor Context (mock data for selectors) ─────────────────────

export interface ExpEditorContext {
  singleChoiceOptions?: ContextArrayItem[];
  multipleChoiceOptions?: ContextArrayItem[];
  allItemKeys?: ContextArrayItem[];
  surveyKeys?: ContextArrayItem[];
  customEventKeys?: ContextArrayItem[];
  studyStatusValues?: ContextArrayItem[];
  monthValues?: ContextArrayItem[];
  messageTypes?: ContextArrayItem[];
  participantFlagKeys?: ContextArrayItem[];
  participantFlags?: ContextObjectItem;
  studyVariables?: ContextObjectItem;
  codeLists?: ContextArrayItem[];
}

export interface ContextArrayItem {
  key: string;
  label: string;
  type?: string;
}

export interface ContextObjectItem {
  [key: string]: {
    values: string[];
    type?: string;
  };
}

// ─── Utility: lookup expression def ──────────────────────────────────────────

export function lookupExpressionDef(
  name: string,
  registry: ExpressionDef[]
): ExpressionDef | undefined {
  return registry.find((def) => def.id === name);
}

// ─── Utility: create empty expression ────────────────────────────────────────

export function createExpression(name: string): Expression {
  return { name, data: [] };
}

// ─── Utility: deep clone expression ──────────────────────────────────────────

export function cloneExpression(expr: Expression): Expression {
  return JSON.parse(JSON.stringify(expr));
}

// ─── Utility: ensure array has minimum length ────────────────────────────────

export function ensureMinLength<T>(arr: T[], minLength: number): T[] {
  if (arr.length >= minLength) return [...arr];
  const result = [...arr];
  result.length = minLength;
  return result;
}

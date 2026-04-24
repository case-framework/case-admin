// Expression data model — mirrors the backend Go types
export interface Expression {
	name: string;
	returnType?: "action" | "num" | "str" | "boolean" | "object";
	data?: Array<ExpressionArg | undefined>;
	metadata?: {
		slotTypes: Array<string | undefined>;
	};
}

export type ExpressionArg = ExpArg | NumArg | StrArg;

export interface ExpArg {
	dtype: "exp";
	exp: Expression;
}

export interface NumArg {
	dtype: "num";
	num: number;
}

export interface StrArg {
	dtype: "str";
	str: string;
}

// UI types for the expression editor
export type ColorVariant =
	| "blue"
	| "purple"
	| "green"
	| "orange"
	| "red"
	| "yellow"
	| "cyan"
	| "pink"
	| "slate";

export type SlotType =
	| { kind: "num"; label?: string }
	| { kind: "str"; label?: string }
	| { kind: "date"; label?: string }
	| { kind: "select"; label?: string; options: { value: string; label: string }[] }
	| { kind: "expression"; label?: string; returnTypes?: string[] }
	| { kind: "expressionList"; label?: string; returnTypes?: string[] }
	| { kind: "keyValue"; label?: string; keyOptions?: string[] };

export interface ExpressionDef {
	id: string;
	label: string;
	category: string;
	color: ColorVariant;
	returnType: "action" | "num" | "str" | "boolean" | "object";
	slots: SlotDef[];
	description?: string;
}

export interface SlotDef {
	key: string;
	label: string;
	required: boolean;
	type: SlotType;
}

// Editor state types
export interface EditorNode {
	/** Unique ID for this node instance in the editor tree */
	id: string;
	/** The expression definition ID */
	defId: string;
	/** Filled slot values */
	slots: Record<string, SlotValue>;
	/** Whether this node is collapsed in the UI */
	collapsed: boolean;
	/** Optional user-given label for this sub-expression */
	label?: string;
}

export type SlotValue =
	| { kind: "empty" }
	| { kind: "num"; value: number }
	| { kind: "str"; value: string }
	| { kind: "node"; nodeId: string }
	| { kind: "nodeList"; nodeIds: string[] };

/** Flat map of all nodes in the editor (normalized state) */
export type NodeMap = Record<string, EditorNode>;

export interface EditorState {
	/** All nodes keyed by ID */
	nodes: NodeMap;
	/** Root node IDs of the main expression tree */
	rootIds: string[];
	/** Node IDs in the scratch pad (temporary storage) */
	scratchIds: string[];
	/** Named sub-expressions / "functions" */
	functions: { id: string; name: string; rootNodeId: string }[];
	/** Currently selected node ID */
	selectedNodeId: string | null;
	/** Clipboard for cut/copy operations */
	clipboard: { nodeIds: string[]; operation: "cut" | "copy" } | null;
}

export interface StudyContext {
	surveyKeys: string[];
	messageKeys: string[];
	participantFlags: { key: string; values: string[] }[];
	studyStatuses: string[];
	eventKeys: string[];
}

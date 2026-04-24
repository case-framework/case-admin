import type { ExpressionDef } from "./types";

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = [
	{ id: "logic", label: "Logic", color: "blue" as const },
	{ id: "comparison", label: "Comparison", color: "purple" as const },
	{ id: "control", label: "Control Flow", color: "orange" as const },
	{ id: "participant", label: "Participant", color: "green" as const },
	{ id: "survey", label: "Survey", color: "cyan" as const },
	{ id: "study", label: "Study", color: "yellow" as const },
	{ id: "value", label: "Values", color: "slate" as const },
	{ id: "messaging", label: "Messaging", color: "pink" as const },
] as const;

// ─── Expression definitions ───────────────────────────────────────────────────

export const EXPRESSION_DEFS: ExpressionDef[] = [
	// Logic
	{
		id: "and",
		label: "AND",
		category: "logic",
		color: "blue",
		returnType: "boolean",
		description: "All conditions must be true",
		slots: [
			{ key: "conditions", label: "Conditions", required: true, type: { kind: "expressionList", label: "Condition", returnTypes: ["boolean"] } },
		],
	},
	{
		id: "or",
		label: "OR",
		category: "logic",
		color: "blue",
		returnType: "boolean",
		description: "At least one condition must be true",
		slots: [
			{ key: "conditions", label: "Conditions", required: true, type: { kind: "expressionList", label: "Condition", returnTypes: ["boolean"] } },
		],
	},
	{
		id: "not",
		label: "NOT",
		category: "logic",
		color: "blue",
		returnType: "boolean",
		description: "Negate a condition",
		slots: [
			{ key: "condition", label: "Condition", required: true, type: { kind: "expression", returnTypes: ["boolean"] } },
		],
	},

	// Comparison
	{
		id: "eq",
		label: "Equals",
		category: "comparison",
		color: "purple",
		returnType: "boolean",
		description: "Check if two values are equal",
		slots: [
			{ key: "left", label: "Left", required: true, type: { kind: "expression" } },
			{ key: "right", label: "Right", required: true, type: { kind: "expression" } },
		],
	},
	{
		id: "gt",
		label: "Greater than",
		category: "comparison",
		color: "purple",
		returnType: "boolean",
		slots: [
			{ key: "left", label: "Left", required: true, type: { kind: "expression" } },
			{ key: "right", label: "Right", required: true, type: { kind: "expression" } },
		],
	},
	{
		id: "gte",
		label: "≥",
		category: "comparison",
		color: "purple",
		returnType: "boolean",
		slots: [
			{ key: "left", label: "Left", required: true, type: { kind: "expression" } },
			{ key: "right", label: "Right", required: true, type: { kind: "expression" } },
		],
	},
	{
		id: "lt",
		label: "Less than",
		category: "comparison",
		color: "purple",
		returnType: "boolean",
		slots: [
			{ key: "left", label: "Left", required: true, type: { kind: "expression" } },
			{ key: "right", label: "Right", required: true, type: { kind: "expression" } },
		],
	},
	{
		id: "lte",
		label: "≤",
		category: "comparison",
		color: "purple",
		returnType: "boolean",
		slots: [
			{ key: "left", label: "Left", required: true, type: { kind: "expression" } },
			{ key: "right", label: "Right", required: true, type: { kind: "expression" } },
		],
	},

	// Control Flow
	{
		id: "IF",
		label: "IF / THEN / ELSE",
		category: "control",
		color: "orange",
		returnType: "action",
		description: "Conditional execution",
		slots: [
			{ key: "condition", label: "If", required: true, type: { kind: "expression", returnTypes: ["boolean"] } },
			{ key: "then", label: "Then", required: true, type: { kind: "expression", returnTypes: ["action"] } },
			{ key: "else", label: "Else", required: false, type: { kind: "expression", returnTypes: ["action"] } },
		],
	},
	{
		id: "IFTHEN",
		label: "IF / THEN",
		category: "control",
		color: "orange",
		returnType: "action",
		description: "Execute actions when condition is true",
		slots: [
			{ key: "condition", label: "If", required: true, type: { kind: "expression", returnTypes: ["boolean"] } },
			{ key: "actions", label: "Actions", required: true, type: { kind: "expressionList", returnTypes: ["action"] } },
		],
	},
	{
		id: "DO",
		label: "DO (group)",
		category: "control",
		color: "orange",
		returnType: "action",
		description: "Group multiple actions",
		slots: [
			{ key: "actions", label: "Actions", required: true, type: { kind: "expressionList", returnTypes: ["action"] } },
		],
	},

	// Participant actions
	{
		id: "UPDATE_FLAG",
		label: "Set Flag",
		category: "participant",
		color: "green",
		returnType: "action",
		description: "Set a participant flag",
		slots: [
			{ key: "key", label: "Flag Name", required: true, type: { kind: "str" } },
			{ key: "value", label: "Value", required: true, type: { kind: "str" } },
		],
	},
	{
		id: "REMOVE_FLAG",
		label: "Remove Flag",
		category: "participant",
		color: "green",
		returnType: "action",
		slots: [
			{ key: "key", label: "Flag Name", required: true, type: { kind: "str" } },
		],
	},
	{
		id: "ADD_NEW_SURVEY",
		label: "Assign Survey",
		category: "participant",
		color: "green",
		returnType: "action",
		description: "Assign a survey to the participant",
		slots: [
			{ key: "surveyKey", label: "Survey", required: true, type: { kind: "select", options: [] } },
			{ key: "priority", label: "Priority", required: false, type: { kind: "num" } },
			{ key: "from", label: "Available From", required: false, type: { kind: "expression", returnTypes: ["num"] } },
			{ key: "until", label: "Available Until", required: false, type: { kind: "expression", returnTypes: ["num"] } },
			{ key: "category", label: "Category", required: false, type: { kind: "str" } },
		],
	},
	{
		id: "REMOVE_SURVEY_BY_KEY",
		label: "Remove Survey",
		category: "participant",
		color: "green",
		returnType: "action",
		slots: [
			{ key: "surveyKey", label: "Survey", required: true, type: { kind: "select", options: [] } },
		],
	},
	{
		id: "UPDATE_STUDY_STATUS",
		label: "Update Status",
		category: "participant",
		color: "green",
		returnType: "action",
		description: "Change participant study status",
		slots: [
			{
				key: "status", label: "Status", required: true, type: {
					kind: "select", options: [
						{ value: "active", label: "Active" },
						{ value: "inactive", label: "Inactive" },
						{ value: "paused", label: "Paused" },
						{ value: "finished", label: "Finished" },
					]
				}
			},
		],
	},

	// Study variable updates
	{
		id: "UPDATE_STUDY_VARIABLE_BOOLEAN",
		label: "Set Variable (Boolean)",
		category: "study",
		color: "yellow",
		returnType: "action",
		slots: [
			{ key: "key", label: "Variable Name", required: true, type: { kind: "str" } },
			{ key: "value", label: "Value", required: true, type: { kind: "select", options: [{ value: "true", label: "True" }, { value: "false", label: "False" }] } },
		],
	},
	{
		id: "UPDATE_STUDY_VARIABLE_STRING",
		label: "Set Variable (Text)",
		category: "study",
		color: "yellow",
		returnType: "action",
		slots: [
			{ key: "key", label: "Variable Name", required: true, type: { kind: "str" } },
			{ key: "value", label: "Value", required: true, type: { kind: "str" } },
		],
	},
	{
		id: "UPDATE_STUDY_VARIABLE_INT",
		label: "Set Variable (Integer)",
		category: "study",
		color: "yellow",
		returnType: "action",
		slots: [
			{ key: "key", label: "Variable Name", required: true, type: { kind: "str" } },
			{ key: "value", label: "Value", required: true, type: { kind: "num" } },
		],
	},

	// Survey/response checkers
	{
		id: "checkSurveyResponseKey",
		label: "Has Response",
		category: "survey",
		color: "cyan",
		returnType: "boolean",
		description: "Check if a survey was submitted",
		slots: [
			{ key: "surveyKey", label: "Survey", required: true, type: { kind: "select", options: [] } },
		],
	},
	{
		id: "responseHasKeysAny",
		label: "Response Has Keys",
		category: "survey",
		color: "cyan",
		returnType: "boolean",
		description: "Check if response contains any of the specified keys",
		slots: [
			{ key: "surveyKey", label: "Survey", required: true, type: { kind: "select", options: [] } },
			{ key: "itemKey", label: "Item Key", required: true, type: { kind: "str" } },
			{ key: "keys", label: "Keys", required: true, type: { kind: "str" } },
		],
	},
	{
		id: "getResponseValueAsNum",
		label: "Response Value (Number)",
		category: "survey",
		color: "cyan",
		returnType: "num",
		description: "Get numeric response value",
		slots: [
			{ key: "surveyKey", label: "Survey", required: true, type: { kind: "select", options: [] } },
			{ key: "itemKey", label: "Item Key", required: true, type: { kind: "str" } },
		],
	},
	{
		id: "getResponseValueAsStr",
		label: "Response Value (Text)",
		category: "survey",
		color: "cyan",
		returnType: "str",
		slots: [
			{ key: "surveyKey", label: "Survey", required: true, type: { kind: "select", options: [] } },
			{ key: "itemKey", label: "Item Key", required: true, type: { kind: "str" } },
		],
	},

	// Participant state checkers
	{
		id: "hasParticipantFlag",
		label: "Has Flag",
		category: "participant",
		color: "green",
		returnType: "boolean",
		description: "Check if participant has a specific flag",
		slots: [
			{ key: "key", label: "Flag Name", required: true, type: { kind: "str" } },
		],
	},
	{
		id: "getParticipantFlagValue",
		label: "Get Flag Value",
		category: "participant",
		color: "green",
		returnType: "str",
		slots: [
			{ key: "key", label: "Flag Name", required: true, type: { kind: "str" } },
		],
	},
	{
		id: "hasStudyStatus",
		label: "Has Status",
		category: "participant",
		color: "green",
		returnType: "boolean",
		description: "Check participant study status",
		slots: [
			{
				key: "status", label: "Status", required: true, type: {
					kind: "select", options: [
						{ value: "active", label: "Active" },
						{ value: "inactive", label: "Inactive" },
						{ value: "paused", label: "Paused" },
						{ value: "finished", label: "Finished" },
					]
				}
			},
		],
	},
	{
		id: "hasSurveyKeyAssigned",
		label: "Has Survey Assigned",
		category: "participant",
		color: "green",
		returnType: "boolean",
		description: "Check if participant has a survey assigned",
		slots: [
			{ key: "surveyKey", label: "Survey", required: true, type: { kind: "select", options: [] } },
		],
	},
	{
		id: "lastSubmissionDateOlderThan",
		label: "Last Submission Older Than",
		category: "participant",
		color: "green",
		returnType: "boolean",
		description: "Check if last survey submission is older than a threshold",
		slots: [
			{ key: "threshold", label: "Threshold (seconds)", required: true, type: { kind: "expression", returnTypes: ["num"] } },
		],
	},

	// Value helpers
	{
		id: "timestampWithOffset",
		label: "Timestamp + Offset",
		category: "value",
		color: "slate",
		returnType: "num",
		description: "Current time plus an offset in seconds",
		slots: [
			{ key: "offset", label: "Offset (seconds)", required: true, type: { kind: "num" } },
		],
	},
	{
		id: "isDefined",
		label: "Is Defined",
		category: "value",
		color: "slate",
		returnType: "boolean",
		description: "Check if a value is defined",
		slots: [
			{ key: "value", label: "Value", required: true, type: { kind: "expression" } },
		],
	},
	{
		id: "parseValueAsNum",
		label: "Parse as Number",
		category: "value",
		color: "slate",
		returnType: "num",
		description: "Convert a value to a number",
		slots: [
			{ key: "value", label: "Value", required: true, type: { kind: "expression" } },
		],
	},

	// Messaging
	{
		id: "ADD_MESSAGE",
		label: "Send Message",
		category: "messaging",
		color: "pink",
		returnType: "action",
		description: "Send a message to the participant",
		slots: [
			{ key: "messageType", label: "Message Type", required: true, type: { kind: "str" } },
		],
	},
	{
		id: "NOTIFY_RESEARCHER",
		label: "Notify Researcher",
		category: "messaging",
		color: "pink",
		returnType: "action",
		description: "Send an email notification to a researcher",
		slots: [
			{ key: "messageType", label: "Message Type", required: true, type: { kind: "str" } },
		],
	},
];

export const EXPRESSION_DEFS_MAP = new Map(EXPRESSION_DEFS.map((d) => [d.id, d]));

export function getExpressionDef(id: string): ExpressionDef | undefined {
	return EXPRESSION_DEFS_MAP.get(id);
}

export function getExpressionsByCategory(category: string): ExpressionDef[] {
	return EXPRESSION_DEFS.filter((d) => d.category === category);
}

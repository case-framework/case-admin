import { ExpressionCategory, ExpressionDef } from "@/lib/expression-types";

// ─── Categories ──────────────────────────────────────────────────────────────

export const expressionCategories: ExpressionCategory[] = [
  { id: "variables", label: "Variables" },
  { id: "control-flow", label: "Control flow" },
  { id: "logical", label: "Logical operators" },
  { id: "comparison", label: "Comparisons" },
  { id: "mathematical-operators", label: "Mathematical operators" },
  { id: "survey-submission-checkers", label: "Survey submission methods" },
  { id: "event-checkers", label: "Event properties" },
  { id: "study-variables", label: "Study variables" },
  { id: "general-study-actions", label: "General study actions" },
  { id: "participant-state-actions", label: "Change participant state" },
  { id: "misc", label: "Misc" },
  { id: "advanced", label: "Advanced" },
  { id: "templates", label: "Templates" },
  { id: "date-helpers", label: "Date helpers" },
  { id: "response-checkers", label: "Response checkers" },
  { id: "participant-state-checkers", label: "Participant state checkers" },
];

// ─── Logical Operators ───────────────────────────────────────────────────────

export const logicalOperators: ExpressionDef[] = [
  {
    categories: ["logical"],
    id: "and",
    label: "and",
    returnType: "boolean",
    icon: "ampersands",
    color: "blue",
    slots: [
      {
        label: "if all true:",
        required: true,
        isListSlot: true,
        allowedTypes: [{ type: "expression", allowedExpressionTypes: ["boolean"] }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "and", data: [] } },
  },
  {
    categories: ["logical"],
    id: "or",
    label: "or",
    returnType: "boolean",
    icon: "tally",
    color: "blue",
    slots: [
      {
        label: "if any true:",
        required: true,
        isListSlot: true,
        allowedTypes: [{ type: "expression", allowedExpressionTypes: ["boolean"] }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "or", data: [] } },
  },
  {
    categories: ["logical"],
    id: "not",
    label: "not",
    returnType: "boolean",
    icon: "circle-slash",
    color: "orange",
    slots: [
      {
        label: "if not true:",
        required: true,
        allowedTypes: [{ type: "expression", allowedExpressionTypes: ["boolean"] }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "not", data: [] } },
  },
];

// ─── Comparison Operators ────────────────────────────────────────────────────

export const comparisonOperators: ExpressionDef[] = [
  {
    categories: ["comparison"],
    id: "eq",
    label: "Equals",
    returnType: "boolean",
    icon: "equal",
    color: "teal",
    slots: [
      {
        label: "Left side",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["num", "str"] },
        ],
      },
      {
        label: "Right side",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["num", "str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "eq", data: [] } },
  },
  {
    categories: ["comparison"],
    id: "lt",
    label: "Less than",
    returnType: "boolean",
    icon: "less-than",
    color: "teal",
    slots: [
      {
        label: "Left side",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "date" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
      {
        label: "Right side",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "date" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "lt", data: [{ dtype: "num", num: 0 }, { dtype: "num", num: 1 }] } },
  },
  {
    categories: ["comparison"],
    id: "lte",
    label: "Less than or equal",
    returnType: "boolean",
    icon: "less-than-or-equal",
    color: "teal",
    slots: [
      {
        label: "Left side",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "date" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
      {
        label: "Right side",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "date" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "lte", data: [{ dtype: "num", num: 0 }, { dtype: "num", num: 1 }] } },
  },
  {
    categories: ["comparison"],
    id: "gt",
    label: "Greater than",
    returnType: "boolean",
    icon: "greater-than",
    color: "blue",
    slots: [
      {
        label: "Left side",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "date" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
      {
        label: "Right side",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "date" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "gt", data: [{ dtype: "num", num: 1 }, { dtype: "num", num: 0 }] } },
  },
  {
    categories: ["comparison"],
    id: "gte",
    label: "Greater than or equal",
    returnType: "boolean",
    icon: "greater-than-or-equal",
    color: "teal",
    slots: [
      {
        label: "Left side",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "date" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
      {
        label: "Right side",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "date" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "gte", data: [{ dtype: "num", num: 1 }, { dtype: "num", num: 0 }] } },
  },
];

// ─── Mathematical Operators ──────────────────────────────────────────────────

export const mathOperators: ExpressionDef[] = [
  {
    categories: ["mathematical-operators"],
    id: "sum",
    label: "Sum",
    returnType: "num",
    icon: "sigma",
    color: "emerald",
    slots: [
      {
        label: "Values to sum",
        required: false,
        isListSlot: true,
        allowedTypes: [
          { type: "num" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "sum", data: [] } },
  },
  {
    categories: ["mathematical-operators"],
    id: "neg",
    label: "Negate",
    returnType: "num",
    icon: "minus",
    color: "emerald",
    slots: [
      {
        label: "Value",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "neg", data: [{ dtype: "num", num: 0 }] } },
  },
];

// ─── Control Flow ────────────────────────────────────────────────────────────

export const controlFlowOperators: ExpressionDef[] = [
  {
    categories: ["control-flow"],
    id: "IF",
    label: "If",
    returnType: "action",
    icon: "signpost",
    color: "amber",
    slots: [
      {
        label: "Condition",
        required: true,
        allowedTypes: [{ type: "expression", allowedExpressionTypes: ["boolean"] }],
      },
      {
        label: "Then",
        required: true,
        isListSlot: true,
        allowedTypes: [{ type: "expression", allowedExpressionTypes: ["action"] }],
      },
      {
        label: "Else",
        required: false,
        isListSlot: true,
        allowedTypes: [{ type: "expression", allowedExpressionTypes: ["action"] }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "IF", data: [{ dtype: "exp", exp: { name: "eq", data: [] } }, { dtype: "exp", exp: { name: "UPDATE_STUDY_STATUS", data: [] } }] } },
  },
  {
    categories: ["control-flow"],
    id: "IFTHEN",
    label: "If-Then",
    returnType: "action",
    icon: "layout-list",
    color: "amber",
    slots: [
      {
        label: "Condition",
        required: true,
        allowedTypes: [{ type: "expression", allowedExpressionTypes: ["boolean"] }],
      },
      {
        label: "Actions",
        required: true,
        isListSlot: true,
        allowedTypes: [{ type: "expression", allowedExpressionTypes: ["action"] }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "IFTHEN", data: [{ dtype: "exp", exp: { name: "eq", data: [] } }, { dtype: "exp", exp: { name: "UPDATE_STUDY_STATUS", data: [] } }] } },
  },
  {
    categories: ["control-flow"],
    id: "DO",
    label: "Do",
    returnType: "action",
    icon: "play",
    color: "amber",
    slots: [
      {
        label: "Actions",
        required: true,
        isListSlot: true,
        allowedTypes: [{ type: "expression", allowedExpressionTypes: ["action"] }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "DO", data: [{ dtype: "exp", exp: { name: "UPDATE_STUDY_STATUS", data: [] } }] } },
  },
];

// ─── Event Checkers ──────────────────────────────────────────────────────────

export const eventCheckers: ExpressionDef[] = [
  {
    categories: ["event-checkers"],
    id: "checkEventType",
    label: "Event type",
    returnType: "boolean",
    icon: "terminal",
    color: "indigo",
    slots: [
      {
        label: "Event type",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "checkEventType", data: [{ dtype: "str", str: "ENTER" }] } },
  },
  {
    categories: ["event-checkers"],
    id: "checkEventKey",
    label: "Event key",
    returnType: "boolean",
    icon: "tag",
    color: "indigo",
    slots: [
      {
        label: "Event key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "checkEventKey", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["event-checkers"],
    id: "checkSurveyResponseKey",
    label: "Survey response key",
    returnType: "boolean",
    icon: "clipboard-check",
    color: "indigo",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "checkSurveyResponseKey", data: [{ dtype: "str", str: "" }] } },
  },
];

// ─── Response Checkers ───────────────────────────────────────────────────────

export const responseCheckers: ExpressionDef[] = [
  {
    categories: ["response-checkers"],
    id: "hasResponse",
    label: "Has response",
    returnType: "boolean",
    icon: "clipboard-check",
    color: "green",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasResponse", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["response-checkers"],
    id: "hasResponseKey",
    label: "Has response key",
    returnType: "boolean",
    icon: "list-checks",
    color: "green",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
      {
        label: "Response key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasResponseKey", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
  {
    categories: ["response-checkers"],
    id: "hasResponseKeyWithValue",
    label: "Has response key with value",
    returnType: "boolean",
    icon: "copy-check",
    color: "green",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
      {
        label: "Response key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
      {
        label: "Value",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasResponseKeyWithValue", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
  {
    categories: ["response-checkers"],
    id: "responseHasKeysAny",
    label: "Response has any keys",
    returnType: "boolean",
    icon: "list-checks",
    color: "green",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
      {
        label: "Keys to check",
        required: true,
        isListSlot: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "responseHasKeysAny", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["response-checkers"],
    id: "getResponseValueAsNum",
    label: "Response value as number",
    returnType: "num",
    icon: "form-input",
    color: "lime",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
      {
        label: "Response key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getResponseValueAsNum", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
  {
    categories: ["response-checkers"],
    id: "getResponseValueAsStr",
    label: "Response value as string",
    returnType: "str",
    icon: "form-input",
    color: "lime",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
      {
        label: "Response key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getResponseValueAsStr", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
  {
    categories: ["response-checkers"],
    id: "countResponseItems",
    label: "Count response items",
    returnType: "num",
    icon: "tally-5",
    color: "lime",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
      {
        label: "Response key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "countResponseItems", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
  {
    categories: ["response-checkers"],
    id: "getSelectedKeys",
    label: "Get selected keys",
    returnType: "str",
    icon: "tags",
    color: "lime",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
      {
        label: "Response key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getSelectedKeys", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
];

// ─── Study Variables ─────────────────────────────────────────────────────────

export const studyVariableOperators: ExpressionDef[] = [
  {
    categories: ["study-variables"],
    id: "getStudyVariableBoolean",
    label: "Study variable (boolean)",
    returnType: "boolean",
    icon: "variable",
    color: "purple",
    slots: [
      {
        label: "Variable key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getStudyVariableBoolean", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["study-variables"],
    id: "getStudyVariableInt",
    label: "Study variable (int)",
    returnType: "num",
    icon: "variable",
    color: "purple",
    slots: [
      {
        label: "Variable key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getStudyVariableInt", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["study-variables"],
    id: "getStudyVariableFloat",
    label: "Study variable (float)",
    returnType: "num",
    icon: "variable",
    color: "purple",
    slots: [
      {
        label: "Variable key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getStudyVariableFloat", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["study-variables"],
    id: "getStudyVariableString",
    label: "Study variable (string)",
    returnType: "str",
    icon: "variable",
    color: "purple",
    slots: [
      {
        label: "Variable key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getStudyVariableString", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["study-variables"],
    id: "getStudyVariableDate",
    label: "Study variable (date)",
    returnType: "num",
    icon: "variable",
    color: "purple",
    slots: [
      {
        label: "Variable key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getStudyVariableDate", data: [{ dtype: "str", str: "" }] } },
  },
];

// ─── Study Counters ──────────────────────────────────────────────────────────

export const studyCounterOperators: ExpressionDef[] = [
  {
    categories: ["study-variables"],
    id: "getCurrentStudyCounterValue",
    label: "Current counter value",
    returnType: "num",
    icon: "tally",
    color: "purple",
    slots: [
      {
        label: "Counter key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getCurrentStudyCounterValue", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["study-variables"],
    id: "getNextStudyCounterValue",
    label: "Next counter value",
    returnType: "num",
    icon: "tally",
    color: "purple",
    slots: [
      {
        label: "Counter key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getNextStudyCounterValue", data: [{ dtype: "str", str: "" }] } },
  },
];

// ─── Participant State Checkers ──────────────────────────────────────────────

export const participantStateCheckers: ExpressionDef[] = [
  {
    categories: ["participant-state-checkers"],
    id: "hasStudyStatus",
    label: "Has study status",
    returnType: "boolean",
    icon: "badge-check",
    color: "indigo",
    slots: [
      {
        label: "Status",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasStudyStatus", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "hasParticipantFlag",
    label: "Has participant flag",
    returnType: "boolean",
    icon: "user-check",
    color: "indigo",
    slots: [
      {
        label: "Flag key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
      {
        label: "Flag value",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasParticipantFlag", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "hasParticipantFlagKey",
    label: "Has participant flag key",
    returnType: "boolean",
    icon: "key-round",
    color: "indigo",
    slots: [
      {
        label: "Flag key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasParticipantFlagKey", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "getParticipantFlagValue",
    label: "Get participant flag value",
    returnType: "str",
    icon: "key-round",
    color: "indigo",
    slots: [
      {
        label: "Flag key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getParticipantFlagValue", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "hasLinkingCode",
    label: "Has linking code",
    returnType: "boolean",
    icon: "link",
    color: "indigo",
    slots: [
      {
        label: "Code key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasLinkingCode", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "getLinkingCodeValue",
    label: "Get linking code value",
    returnType: "str",
    icon: "link-2",
    color: "indigo",
    slots: [
      {
        label: "Code key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getLinkingCodeValue", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "hasSurveyKeyAssigned",
    label: "Has survey assigned",
    returnType: "boolean",
    icon: "package",
    color: "indigo",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasSurveyKeyAssigned", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "getStudyEntryTime",
    label: "Study entry time",
    returnType: "num",
    icon: "clock",
    color: "indigo",
    slots: [],
    defaultValue: { dtype: "exp", exp: { name: "getStudyEntryTime", data: [] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "getLastSubmissionDate",
    label: "Last submission date",
    returnType: "num",
    icon: "calendar-clock",
    color: "indigo",
    slots: [
      {
        label: "Survey key (optional)",
        required: false,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getLastSubmissionDate", data: [] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "lastSubmissionDateOlderThan",
    label: "Last submission older than",
    returnType: "boolean",
    icon: "calendar-x-2",
    color: "indigo",
    slots: [
      {
        label: "Timestamp",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
      {
        label: "Survey key (optional)",
        required: false,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "lastSubmissionDateOlderThan", data: [{ dtype: "num", num: 0 }] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "hasMessageTypeAssigned",
    label: "Has message type",
    returnType: "boolean",
    icon: "mail",
    color: "indigo",
    slots: [
      {
        label: "Message type",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasMessageTypeAssigned", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "getMessageNextTime",
    label: "Get message next time",
    returnType: "num",
    icon: "mail",
    color: "indigo",
    slots: [
      {
        label: "Message type",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getMessageNextTime", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-checkers"],
    id: "getCurrentStudySession",
    label: "Current study session",
    returnType: "str",
    icon: "app-window",
    color: "indigo",
    slots: [],
    defaultValue: { dtype: "exp", exp: { name: "getCurrentStudySession", data: [] } },
  },
];

// ─── General Study Actions ───────────────────────────────────────────────────

export const generalStudyActions: ExpressionDef[] = [
  {
    categories: ["general-study-actions"],
    id: "UPDATE_STUDY_STATUS",
    label: "Update study status",
    returnType: "action",
    icon: "signpost",
    color: "green",
    slots: [
      {
        label: "Status",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "UPDATE_STUDY_STATUS", data: [{ dtype: "str", str: "inactive" }] } },
  },
  {
    categories: ["general-study-actions"],
    id: "START_SESSION",
    label: "Start session",
    returnType: "action",
    icon: "play",
    color: "green",
    slots: [],
    defaultValue: { dtype: "exp", exp: { name: "START_SESSION", data: [] } },
  },
  {
    categories: ["general-study-actions"],
    id: "ADD_NEW_SURVEY",
    label: "Add new survey",
    returnType: "action",
    icon: "file-plus",
    color: "green",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "ADD_NEW_SURVEY", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["general-study-actions"],
    id: "REMOVE_SURVEY",
    label: "Remove survey",
    returnType: "action",
    icon: "file-x",
    color: "green",
    slots: [
      {
        label: "Survey key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "REMOVE_SURVEY", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["general-study-actions"],
    id: "REMOVE_CODES",
    label: "Remove codes",
    returnType: "action",
    icon: "file-pen",
    color: "green",
    slots: [
      {
        label: "Code type",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "REMOVE_CODES", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["general-study-actions"],
    id: "NOTIFY_RESEARCHER",
    label: "Notify researcher",
    returnType: "action",
    icon: "mail",
    color: "green",
    slots: [
      {
        label: "Message",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "NOTIFY_RESEARCHER", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["general-study-actions"],
    id: "SEND_MESSAGE",
    label: "Send message",
    returnType: "action",
    icon: "send-horizontal",
    color: "green",
    slots: [
      {
        label: "Message type",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "SEND_MESSAGE", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["general-study-actions"],
    id: "SCHEDULE_MESSAGE",
    label: "Schedule message",
    returnType: "action",
    icon: "calendar-days",
    color: "green",
    slots: [
      {
        label: "Message type",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
      {
        label: "Offset",
        required: true,
        allowedTypes: [
          { type: "time-delta" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "SCHEDULE_MESSAGE", data: [{ dtype: "str", str: "" }, { dtype: "num", num: 0 }] } },
  },
  {
    categories: ["general-study-actions"],
    id: "RESET_COUNTER",
    label: "Reset counter",
    returnType: "action",
    icon: "refresh-ccw",
    color: "green",
    slots: [
      {
        label: "Counter key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "RESET_COUNTER", data: [{ dtype: "str", str: "" }] } },
  },
];

// ─── Participant State Actions ───────────────────────────────────────────────

export const participantStateActions: ExpressionDef[] = [
  {
    categories: ["participant-state-actions"],
    id: "UPDATE_FLAG",
    label: "Update flag",
    returnType: "action",
    icon: "badge-check",
    color: "teal",
    slots: [
      {
        label: "Flag key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
      {
        label: "Flag value",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "UPDATE_FLAG", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-actions"],
    id: "REMOVE_FLAG",
    label: "Remove flag",
    returnType: "action",
    icon: "copy-x",
    color: "teal",
    slots: [
      {
        label: "Flag key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "REMOVE_FLAG", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-actions"],
    id: "ADD_LINKING_CODE",
    label: "Add linking code",
    returnType: "action",
    icon: "link",
    color: "teal",
    slots: [
      {
        label: "Code key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
      {
        label: "Code value",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "ADD_LINKING_CODE", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-actions"],
    id: "REMOVE_LINKING_CODE",
    label: "Remove linking code",
    returnType: "action",
    icon: "link-2-off",
    color: "teal",
    slots: [
      {
        label: "Code key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "REMOVE_LINKING_CODE", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-actions"],
    id: "ADD_REPORT",
    label: "Add report",
    returnType: "action",
    icon: "file-plus",
    color: "teal",
    slots: [
      {
        label: "Report key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "ADD_REPORT", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["participant-state-actions"],
    id: "EXTERNAL_HANDLER",
    label: "External handler",
    returnType: "action",
    icon: "external-link",
    color: "teal",
    slots: [
      {
        label: "Handler key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "EXTERNAL_HANDLER", data: [{ dtype: "str", str: "" }] } },
  },
];

// ─── Date Helpers ────────────────────────────────────────────────────────────

export const dateHelpers: ExpressionDef[] = [
  {
    categories: ["date-helpers"],
    id: "timestampWithOffset",
    label: "Get timestamp",
    returnType: "num",
    icon: "calendar-days",
    color: "lime",
    slots: [
      {
        label: "Offset",
        required: true,
        allowedTypes: [
          { type: "time-delta" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
      {
        label: "Reference date (optional)",
        required: false,
        allowedTypes: [
          { type: "date" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "timestampWithOffset", data: [{ dtype: "num", num: 0 }] } },
  },
  {
    categories: ["date-helpers"],
    id: "getTsForNextStartOfMonth",
    label: "Next month start",
    returnType: "num",
    icon: "calendar-range",
    color: "lime",
    slots: [
      {
        label: "Month (1-12)",
        required: true,
        allowedTypes: [{ type: "num" }],
      },
      {
        label: "Offset (optional)",
        required: false,
        allowedTypes: [
          { type: "time-delta" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getTsForNextStartOfMonth", data: [{ dtype: "num", num: 1 }] } },
  },
  {
    categories: ["date-helpers"],
    id: "getISOWeekForTs",
    label: "ISO week number",
    returnType: "num",
    icon: "calendar",
    color: "lime",
    slots: [
      {
        label: "Timestamp",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getISOWeekForTs", data: [{ dtype: "num", num: 0 }] } },
  },
  {
    categories: ["date-helpers"],
    id: "getTsForNextISOWeek",
    label: "Next ISO week",
    returnType: "num",
    icon: "calendar",
    color: "lime",
    slots: [
      {
        label: "Week number (1-53)",
        required: true,
        allowedTypes: [{ type: "num" }],
      },
      {
        label: "Offset (optional)",
        required: false,
        allowedTypes: [
          { type: "time-delta" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getTsForNextISOWeek", data: [{ dtype: "num", num: 1 }] } },
  },
  {
    categories: ["date-helpers"],
    id: "dateToStr",
    label: "Date to string",
    returnType: "str",
    icon: "text-cursor",
    color: "lime",
    slots: [
      {
        label: "Timestamp",
        required: true,
        allowedTypes: [
          { type: "num" },
          { type: "expression", allowedExpressionTypes: ["num"] },
        ],
      },
      {
        label: "Format string",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "dateToStr", data: [{ dtype: "num", num: 0 }, { dtype: "str", str: "yyyy-MM-dd" }] } },
  },
];

// ─── Advanced ────────────────────────────────────────────────────────────────

export const advancedOperators: ExpressionDef[] = [
  {
    categories: ["advanced"],
    id: "isDefined",
    label: "Is defined",
    returnType: "boolean",
    icon: "clipboard-check",
    color: "violet",
    slots: [
      {
        label: "Value",
        required: true,
        allowedTypes: [
          { type: "expression", allowedExpressionTypes: ["num", "str", "boolean"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "isDefined", data: [] } },
  },
  {
    categories: ["advanced"],
    id: "getAttribute",
    label: "Get attribute",
    returnType: "str",
    icon: "database",
    color: "violet",
    slots: [
      {
        label: "Attribute key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getAttribute", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["advanced"],
    id: "getContext",
    label: "Get context",
    returnType: "object",
    icon: "box",
    color: "violet",
    slots: [
      {
        label: "Context key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getContext", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["advanced"],
    id: "isLoggedIn",
    label: "Is logged in",
    returnType: "boolean",
    icon: "user-check",
    color: "violet",
    slots: [],
    defaultValue: { dtype: "exp", exp: { name: "isLoggedIn", data: [] } },
  },
  {
    categories: ["advanced"],
    id: "hasEventPayload",
    label: "Has event payload",
    returnType: "boolean",
    icon: "package-search",
    color: "violet",
    slots: [],
    defaultValue: { dtype: "exp", exp: { name: "hasEventPayload", data: [] } },
  },
  {
    categories: ["advanced"],
    id: "getEventPayloadValueAsStr",
    label: "Event payload (string)",
    returnType: "str",
    icon: "package",
    color: "violet",
    slots: [
      {
        label: "Payload key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getEventPayloadValueAsStr", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["advanced"],
    id: "getEventPayloadValueAsNum",
    label: "Event payload (number)",
    returnType: "num",
    icon: "package",
    color: "violet",
    slots: [
      {
        label: "Payload key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getEventPayloadValueAsNum", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["advanced"],
    id: "hasEventPayloadKey",
    label: "Has event payload key",
    returnType: "boolean",
    icon: "package-open",
    color: "violet",
    slots: [
      {
        label: "Payload key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasEventPayloadKey", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["advanced"],
    id: "hasEventPayloadKeyWithValue",
    label: "Has event payload key with value",
    returnType: "boolean",
    icon: "copy-check",
    color: "violet",
    slots: [
      {
        label: "Payload key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
      {
        label: "Value",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasEventPayloadKeyWithValue", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
  {
    categories: ["advanced"],
    id: "isStudyCodePresent",
    label: "Study code present",
    returnType: "boolean",
    icon: "database",
    color: "violet",
    slots: [
      {
        label: "Code list key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
      {
        label: "Code value",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "isStudyCodePresent", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
];

// ─── Misc ────────────────────────────────────────────────────────────────────

export const miscOperators: ExpressionDef[] = [
  {
    categories: ["misc"],
    id: "parseValueAsNum",
    label: "Parse value as number",
    returnType: "num",
    icon: "function",
    color: "amber",
    slots: [
      {
        label: "Value",
        required: true,
        allowedTypes: [
          { type: "str" },
          { type: "expression", allowedExpressionTypes: ["str"] },
        ],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "parseValueAsNum", data: [{ dtype: "str", str: "" }] } },
  },
  {
    categories: ["misc"],
    id: "generateRandomNumber",
    label: "Random number",
    returnType: "num",
    icon: "dice",
    color: "amber",
    slots: [
      {
        label: "Min",
        required: true,
        allowedTypes: [{ type: "num" }],
      },
      {
        label: "Max",
        required: true,
        allowedTypes: [{ type: "num" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "generateRandomNumber", data: [{ dtype: "num", num: 0 }, { dtype: "num", num: 100 }] } },
  },
];

// ─── Templates ───────────────────────────────────────────────────────────────

export const templates: ExpressionDef[] = [
  {
    categories: ["templates"],
    id: "consentGiven",
    label: "Consent given",
    returnType: "boolean",
    icon: "book-check",
    color: "emerald",
    slots: [
      {
        label: "Consent survey key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "hasResponse", data: [{ dtype: "str", str: "consent" }] } },
  },
  {
    categories: ["templates"],
    id: "singleChoiceGetNumOptionValue",
    label: "Single choice value",
    returnType: "num",
    icon: "diamond",
    color: "emerald",
    slots: [
      {
        label: "Item key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
      {
        label: "Slot key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
      {
        label: "Option key",
        required: true,
        allowedTypes: [{ type: "str" }],
      },
    ],
    defaultValue: { dtype: "exp", exp: { name: "getResponseValueAsNum", data: [{ dtype: "str", str: "" }, { dtype: "str", str: "" }] } },
  },
  {
    categories: ["templates"],
    id: "stopParticipation",
    label: "Stop participation",
    returnType: "action",
    icon: "circle-slash",
    color: "rose",
    slots: [],
    defaultValue: { dtype: "exp", exp: { name: "UPDATE_STUDY_STATUS", data: [{ dtype: "str", str: "inactive" }] } },
  },
];

// ─── All Expression Definitions ──────────────────────────────────────────────

export const allExpressionDefs: ExpressionDef[] = [
  ...logicalOperators,
  ...comparisonOperators,
  ...mathOperators,
  ...controlFlowOperators,
  ...eventCheckers,
  ...responseCheckers,
  ...studyVariableOperators,
  ...studyCounterOperators,
  ...participantStateCheckers,
  ...generalStudyActions,
  ...participantStateActions,
  ...dateHelpers,
  ...advancedOperators,
  ...miscOperators,
  ...templates,
];

// ─── Built-in slot type definitions ──────────────────────────────────────────

export const builtInSlotTypes = [
  {
    id: "text-input",
    type: "str",
    icon: "form-input",
    label: "Text constant",
    categories: ["variables"],
  },
  {
    id: "number-input",
    type: "num",
    icon: "form-input",
    label: "Number constant",
    categories: ["variables"],
  },
  {
    id: "date-picker",
    type: "date",
    icon: "calendar",
    label: "Date",
    color: "lime",
    categories: ["variables"],
  },
  {
    id: "time-delta-picker",
    type: "time-delta",
    icon: "circle-slash",
    label: "Time delta",
    color: "lime",
    categories: ["variables"],
  },
  {
    id: "study-status-picker",
    type: "list-selector",
    contextArrayKey: "studyStatusValues",
    label: "Study status",
    icon: "tag",
    color: "green",
    categories: ["variables"],
  },
  {
    id: "survey-key-selector",
    type: "list-selector",
    contextArrayKey: "surveyKeys",
    label: "Survey key",
    icon: "tag",
    color: "dark",
    categories: ["variables"],
  },
  {
    id: "custom-event-key-selector",
    type: "list-selector",
    contextArrayKey: "customEventKeys",
    label: "Event key",
    icon: "tag",
    color: "dark",
    categories: ["variables"],
  },
  {
    id: "participant-flag-key-selector",
    type: "list-selector",
    contextArrayKey: "participantFlagKeys",
    label: "Flag key",
    icon: "tag",
    color: "dark",
    categories: ["variables"],
  },
  {
    id: "participant-flag-selector",
    type: "key-value",
    contextObjectKey: "participantFlags",
    label: "Participant flag",
    icon: "tag",
    color: "dark",
    categories: ["variables"],
    allowExpressionsForValue: true,
  },
  {
    id: "message-type-picker",
    type: "list-selector",
    contextArrayKey: "messageTypes",
    label: "Message type",
    icon: "diamond",
    color: "green",
    categories: ["variables"],
  },
  {
    id: "month-selector",
    type: "list-selector",
    contextArrayKey: "monthValues",
    label: "Month",
    icon: "calendar",
    color: "green",
    categories: ["variables"],
  },
  {
    id: "study-code-list-selector",
    type: "list-selector",
    contextArrayKey: "codeLists",
    label: "Study code list",
    icon: "database",
    color: "green",
    categories: ["variables"],
  },
];

// ─── Build the full registry ─────────────────────────────────────────────────

export interface ExpressionRegistry {
  expressionDefs: ExpressionDef[];
  categories: ExpressionCategory[];
  builtInSlotTypes: typeof builtInSlotTypes;
}

export const expressionRegistry: ExpressionRegistry = {
  expressionDefs: allExpressionDefs,
  categories: expressionCategories,
  builtInSlotTypes,
};

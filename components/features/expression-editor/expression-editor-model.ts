export type ExpressionReturnType = "boolean" | "number" | "string" | "time" | "action" | "any";

export type CategoryKey =
    | "logic"
    | "comparison"
    | "event"
    | "response"
    | "participant"
    | "variables"
    | "timeMath"
    | "actions"
    | "external";

export type ReferenceSource =
    | "eventTypes"
    | "eventKeys"
    | "surveyKeys"
    | "itemKeys"
    | "responseKeys"
    | "flagKeys"
    | "flagValues"
    | "studyStatuses"
    | "studyVariableBooleans"
    | "studyVariableInts"
    | "studyVariableFloats"
    | "studyVariableStrings"
    | "studyVariableDates"
    | "messageTypes"
    | "payloadKeys"
    | "oldResponseModes"
    | "timeReferences"
    | "externalServices"
    | "counterScopes";

export interface SlotDefinition {
    id: string;
    labelKey: string;
    placeholderKey: string;
    kind: "select" | "text" | "number";
    source?: ReferenceSource;
}

export interface ExpressionDefinition {
    type: string;
    functionName: string;
    labelKey: string;
    category: CategoryKey;
    returnType: ExpressionReturnType;
    slots: SlotDefinition[];
    defaultSlots: Record<string, string>;
    childAccepts?: ExpressionReturnType[];
    childLaneTitleKey?: string;
}

export interface ExpressionNode {
    id: string;
    type: string;
    name?: string;
    nameKey?: string;
    collapsed: boolean;
    slots: Record<string, string>;
    childLaneId?: string;
}

export interface LaneMeta {
    titleKey: string;
    emptyKey: string;
    accepts: ExpressionReturnType[];
}

export interface EditorState {
    blocks: Record<string, ExpressionNode>;
    lanes: Record<string, string[]>;
    laneMeta: Record<string, LaneMeta>;
}

export interface ExpressionSnapshot {
    rootId: string;
    blocks: Record<string, ExpressionNode>;
    lanes: Record<string, string[]>;
    laneMeta: Record<string, LaneMeta>;
}

export const ROOT_CONDITION_LANE = "conditions";
export const ROOT_ACTION_LANE = "actions";
export const SHELF_LANE = "shelf";

export const categoryKeys: CategoryKey[] = [
    "logic",
    "comparison",
    "event",
    "response",
    "participant",
    "variables",
    "timeMath",
    "actions",
    "external",
];

export const categoryLabelKeys: Record<CategoryKey, string> = {
    logic: "categoryLogic",
    comparison: "categoryComparison",
    event: "categoryEvent",
    response: "categoryResponse",
    participant: "categoryParticipant",
    variables: "categoryVariables",
    timeMath: "categoryTimeMath",
    actions: "categoryActions",
    external: "categoryExternal",
};

export const returnTypeLabelKeys: Record<ExpressionReturnType, string> = {
    boolean: "returnBoolean",
    number: "returnNumber",
    string: "returnString",
    time: "returnTime",
    action: "returnAction",
    any: "returnAny",
};

export const categoryAccentClasses: Record<CategoryKey, string> = {
    logic: "border-l-primary",
    comparison: "border-l-chart-2",
    event: "border-l-chart-3",
    response: "border-l-chart-4",
    participant: "border-l-chart-5",
    variables: "border-l-foreground",
    timeMath: "border-l-chart-1",
    actions: "border-l-destructive",
    external: "border-l-muted-foreground",
};

export const referenceOptions: Record<ReferenceSource, string[]> = {
    eventTypes: ["ENTER", "SUBMIT", "TIMER", "CUSTOM", "MERGE", "LEAVE"],
    eventKeys: ["daily-check-in", "weekly-review", "risk-alert", "medication-reminder", "external-webhook"],
    surveyKeys: ["intake", "daily", "weekly", "follow-up"],
    itemKeys: ["mood", "pain", "sleep", "medication", "symptoms"],
    responseKeys: ["value", "score", "selected", "other", "timestamp"],
    flagKeys: ["consent", "risk-level", "cohort", "needs-call"],
    flagValues: ["yes", "no", "high", "low", "A", "B"],
    studyStatuses: ["active", "paused", "finished", "dropped-out"],
    studyVariableBooleans: ["isEligible", "needsReview", "hasCompletedBaseline"],
    studyVariableInts: ["age", "riskScore", "missedDays"],
    studyVariableFloats: ["weeklyAverage", "painTrend", "sleepHours"],
    studyVariableStrings: ["timezone", "assignedCoach", "preferredLanguage"],
    studyVariableDates: ["lastVisit", "nextAppointment", "baselineDate"],
    messageTypes: ["welcome", "daily-reminder", "risk-alert", "follow-up"],
    payloadKeys: ["source", "externalId", "severity", "channel"],
    oldResponseModes: ["any", "all", "latest"],
    timeReferences: ["now", "studyEntryTime", "lastSubmission", "eventTime"],
    externalServices: ["risk-service", "scheduler", "eligibility-check"],
    counterScopes: ["global", "participant", "session"],
};

const selectSlot = (id: string, labelKey: string, source: ReferenceSource): SlotDefinition => ({
    id,
    labelKey,
    source,
    kind: "select",
    placeholderKey: "slotSelectPlaceholder",
});

const textSlot = (id: string, labelKey: string): SlotDefinition => ({
    id,
    labelKey,
    kind: "text",
    placeholderKey: "slotTextPlaceholder",
});

const numberSlot = (id: string, labelKey: string): SlotDefinition => ({
    id,
    labelKey,
    kind: "number",
    placeholderKey: "slotNumberPlaceholder",
});

export const expressionDefinitions: ExpressionDefinition[] = [
    {
        type: "and",
        functionName: "and",
        labelKey: "operatorAnd",
        category: "logic",
        returnType: "boolean",
        slots: [],
        defaultSlots: {},
        childAccepts: ["boolean"],
        childLaneTitleKey: "laneNestedConditionsTitle",
    },
    {
        type: "or",
        functionName: "or",
        labelKey: "operatorOr",
        category: "logic",
        returnType: "boolean",
        slots: [],
        defaultSlots: {},
        childAccepts: ["boolean"],
        childLaneTitleKey: "laneNestedConditionsTitle",
    },
    {
        type: "not",
        functionName: "not",
        labelKey: "operatorNot",
        category: "logic",
        returnType: "boolean",
        slots: [],
        defaultSlots: {},
        childAccepts: ["boolean"],
        childLaneTitleKey: "laneNestedConditionsTitle",
    },
    {
        type: "checkConditionForOldResponses",
        functionName: "checkConditionForOldResponses",
        labelKey: "operatorOldResponses",
        category: "logic",
        returnType: "boolean",
        slots: [
            selectSlot("mode", "slotMode", "oldResponseModes"),
            selectSlot("survey", "slotSurveyKey", "surveyKeys"),
            selectSlot("since", "slotSince", "timeReferences"),
            selectSlot("until", "slotUntil", "timeReferences"),
        ],
        defaultSlots: { mode: "any", survey: "daily", since: "studyEntryTime", until: "now" },
        childAccepts: ["boolean"],
        childLaneTitleKey: "laneNestedConditionsTitle",
    },
    {
        type: "eq",
        functionName: "eq",
        labelKey: "operatorEq",
        category: "comparison",
        returnType: "boolean",
        slots: [textSlot("left", "slotLeft"), textSlot("right", "slotRight")],
        defaultSlots: { left: "riskScore", right: "7" },
    },
    {
        type: "lt",
        functionName: "lt",
        labelKey: "operatorLt",
        category: "comparison",
        returnType: "boolean",
        slots: [textSlot("left", "slotLeft"), textSlot("right", "slotRight")],
        defaultSlots: { left: "age", right: "18" },
    },
    {
        type: "lte",
        functionName: "lte",
        labelKey: "operatorLte",
        category: "comparison",
        returnType: "boolean",
        slots: [textSlot("left", "slotLeft"), textSlot("right", "slotRight")],
        defaultSlots: { left: "painTrend", right: "3" },
    },
    {
        type: "gt",
        functionName: "gt",
        labelKey: "operatorGt",
        category: "comparison",
        returnType: "boolean",
        slots: [textSlot("left", "slotLeft"), textSlot("right", "slotRight")],
        defaultSlots: { left: "riskScore", right: "6" },
    },
    {
        type: "gte",
        functionName: "gte",
        labelKey: "operatorGte",
        category: "comparison",
        returnType: "boolean",
        slots: [textSlot("left", "slotLeft"), textSlot("right", "slotRight")],
        defaultSlots: { left: "sleepHours", right: "7" },
    },
    {
        type: "checkEventType",
        functionName: "checkEventType",
        labelKey: "operatorCheckEventType",
        category: "event",
        returnType: "boolean",
        slots: [selectSlot("eventType", "slotEventType", "eventTypes")],
        defaultSlots: { eventType: "ENTER" },
    },
    {
        type: "checkEventKey",
        functionName: "checkEventKey",
        labelKey: "operatorCheckEventKey",
        category: "event",
        returnType: "boolean",
        slots: [selectSlot("eventKey", "slotEventKey", "eventKeys")],
        defaultSlots: { eventKey: "daily-check-in" },
    },
    {
        type: "checkSurveyResponseKey",
        functionName: "checkSurveyResponseKey",
        labelKey: "operatorSurveyResponseKey",
        category: "event",
        returnType: "boolean",
        slots: [selectSlot("surveyKey", "slotSurveyKey", "surveyKeys")],
        defaultSlots: { surveyKey: "daily" },
    },
    {
        type: "hasEventPayloadKeyWithValue",
        functionName: "hasEventPayloadKeyWithValue",
        labelKey: "operatorPayloadValue",
        category: "event",
        returnType: "boolean",
        slots: [selectSlot("payloadKey", "slotPayloadKey", "payloadKeys"), textSlot("value", "slotValue")],
        defaultSlots: { payloadKey: "severity", value: "high" },
    },
    {
        type: "hasResponseKey",
        functionName: "hasResponseKey",
        labelKey: "operatorHasResponseKey",
        category: "response",
        returnType: "boolean",
        slots: [selectSlot("itemKey", "slotItemKey", "itemKeys"), selectSlot("responseKey", "slotResponseKey", "responseKeys")],
        defaultSlots: { itemKey: "mood", responseKey: "value" },
    },
    {
        type: "hasResponseKeyWithValue",
        functionName: "hasResponseKeyWithValue",
        labelKey: "operatorResponseValue",
        category: "response",
        returnType: "boolean",
        slots: [selectSlot("itemKey", "slotItemKey", "itemKeys"), selectSlot("responseKey", "slotResponseKey", "responseKeys"), textSlot("expected", "slotExpectedValue")],
        defaultSlots: { itemKey: "mood", responseKey: "value", expected: "high" },
    },
    {
        type: "getResponseValueAsNum",
        functionName: "getResponseValueAsNum",
        labelKey: "operatorResponseNumber",
        category: "response",
        returnType: "number",
        slots: [selectSlot("itemKey", "slotItemKey", "itemKeys"), selectSlot("responseKey", "slotResponseKey", "responseKeys")],
        defaultSlots: { itemKey: "pain", responseKey: "score" },
    },
    {
        type: "getResponseValueAsStr",
        functionName: "getResponseValueAsStr",
        labelKey: "operatorResponseString",
        category: "response",
        returnType: "string",
        slots: [selectSlot("itemKey", "slotItemKey", "itemKeys"), selectSlot("responseKey", "slotResponseKey", "responseKeys")],
        defaultSlots: { itemKey: "symptoms", responseKey: "other" },
    },
    {
        type: "responseHasKeysAny",
        functionName: "responseHasKeysAny",
        labelKey: "operatorResponseAny",
        category: "response",
        returnType: "boolean",
        slots: [selectSlot("itemKey", "slotItemKey", "itemKeys"), textSlot("keys", "slotResponseKeys")],
        defaultSlots: { itemKey: "symptoms", keys: "headache;nausea" },
    },
    {
        type: "countResponseItems",
        functionName: "countResponseItems",
        labelKey: "operatorCountResponses",
        category: "response",
        returnType: "number",
        slots: [selectSlot("itemKey", "slotItemKey", "itemKeys"), textSlot("groupKey", "slotGroupKey")],
        defaultSlots: { itemKey: "symptoms", groupKey: "selected" },
    },
    {
        type: "hasStudyStatus",
        functionName: "hasStudyStatus",
        labelKey: "operatorStudyStatus",
        category: "participant",
        returnType: "boolean",
        slots: [selectSlot("status", "slotStatus", "studyStatuses")],
        defaultSlots: { status: "active" },
    },
    {
        type: "hasParticipantFlag",
        functionName: "hasParticipantFlag",
        labelKey: "operatorParticipantFlag",
        category: "participant",
        returnType: "boolean",
        slots: [selectSlot("flagKey", "slotFlagKey", "flagKeys"), selectSlot("flagValue", "slotFlagValue", "flagValues")],
        defaultSlots: { flagKey: "consent", flagValue: "yes" },
    },
    {
        type: "getParticipantFlagValue",
        functionName: "getParticipantFlagValue",
        labelKey: "operatorFlagValue",
        category: "participant",
        returnType: "string",
        slots: [selectSlot("flagKey", "slotFlagKey", "flagKeys")],
        defaultSlots: { flagKey: "risk-level" },
    },
    {
        type: "hasSurveyKeyAssigned",
        functionName: "hasSurveyKeyAssigned",
        labelKey: "operatorSurveyAssigned",
        category: "participant",
        returnType: "boolean",
        slots: [selectSlot("surveyKey", "slotSurveyKey", "surveyKeys")],
        defaultSlots: { surveyKey: "weekly" },
    },
    {
        type: "lastSubmissionDateOlderThan",
        functionName: "lastSubmissionDateOlderThan",
        labelKey: "operatorLastSubmission",
        category: "participant",
        returnType: "boolean",
        slots: [selectSlot("refTime", "slotReferenceTime", "timeReferences"), selectSlot("surveyKey", "slotSurveyKey", "surveyKeys")],
        defaultSlots: { refTime: "now", surveyKey: "daily" },
    },
    {
        type: "hasMessageTypeAssigned",
        functionName: "hasMessageTypeAssigned",
        labelKey: "operatorMessageAssigned",
        category: "participant",
        returnType: "boolean",
        slots: [selectSlot("messageType", "slotMessageType", "messageTypes")],
        defaultSlots: { messageType: "daily-reminder" },
    },
    {
        type: "getCurrentStudySession",
        functionName: "getCurrentStudySession",
        labelKey: "operatorCurrentSession",
        category: "participant",
        returnType: "string",
        slots: [],
        defaultSlots: {},
    },
    {
        type: "getStudyVariableBoolean",
        functionName: "getStudyVariableBoolean",
        labelKey: "operatorVariableBoolean",
        category: "variables",
        returnType: "boolean",
        slots: [selectSlot("variableKey", "slotVariableKey", "studyVariableBooleans")],
        defaultSlots: { variableKey: "isEligible" },
    },
    {
        type: "getStudyVariableInt",
        functionName: "getStudyVariableInt",
        labelKey: "operatorVariableInt",
        category: "variables",
        returnType: "number",
        slots: [selectSlot("variableKey", "slotVariableKey", "studyVariableInts")],
        defaultSlots: { variableKey: "riskScore" },
    },
    {
        type: "getStudyVariableFloat",
        functionName: "getStudyVariableFloat",
        labelKey: "operatorVariableFloat",
        category: "variables",
        returnType: "number",
        slots: [selectSlot("variableKey", "slotVariableKey", "studyVariableFloats")],
        defaultSlots: { variableKey: "weeklyAverage" },
    },
    {
        type: "getStudyVariableString",
        functionName: "getStudyVariableString",
        labelKey: "operatorVariableString",
        category: "variables",
        returnType: "string",
        slots: [selectSlot("variableKey", "slotVariableKey", "studyVariableStrings")],
        defaultSlots: { variableKey: "timezone" },
    },
    {
        type: "getStudyVariableDate",
        functionName: "getStudyVariableDate",
        labelKey: "operatorVariableDate",
        category: "variables",
        returnType: "time",
        slots: [selectSlot("variableKey", "slotVariableKey", "studyVariableDates")],
        defaultSlots: { variableKey: "lastVisit" },
    },
    {
        type: "timestampWithOffset",
        functionName: "timestampWithOffset",
        labelKey: "operatorTimestampOffset",
        category: "timeMath",
        returnType: "time",
        slots: [numberSlot("delta", "slotDeltaSeconds"), selectSlot("reference", "slotReferenceTime", "timeReferences")],
        defaultSlots: { delta: "604800", reference: "now" },
    },
    {
        type: "sum",
        functionName: "sum",
        labelKey: "operatorSum",
        category: "timeMath",
        returnType: "number",
        slots: [],
        defaultSlots: {},
        childAccepts: ["number"],
        childLaneTitleKey: "laneNestedValuesTitle",
    },
    {
        type: "neg",
        functionName: "neg",
        labelKey: "operatorNegate",
        category: "timeMath",
        returnType: "number",
        slots: [],
        defaultSlots: {},
        childAccepts: ["number"],
        childLaneTitleKey: "laneNestedValuesTitle",
    },
    {
        type: "parseValueAsNum",
        functionName: "parseValueAsNum",
        labelKey: "operatorParseNumber",
        category: "timeMath",
        returnType: "number",
        slots: [textSlot("value", "slotValue")],
        defaultSlots: { value: "12.5" },
    },
    {
        type: "generateRandomNumber",
        functionName: "generateRandomNumber",
        labelKey: "operatorRandomNumber",
        category: "timeMath",
        returnType: "number",
        slots: [numberSlot("min", "slotMinimum"), numberSlot("max", "slotMaximum")],
        defaultSlots: { min: "0", max: "1" },
    },
    {
        type: "IF",
        functionName: "IF",
        labelKey: "operatorIf",
        category: "actions",
        returnType: "action",
        slots: [],
        defaultSlots: {},
        childAccepts: ["boolean", "action"],
        childLaneTitleKey: "laneNestedBranchesTitle",
    },
    {
        type: "DO",
        functionName: "DO",
        labelKey: "operatorDo",
        category: "actions",
        returnType: "action",
        slots: [],
        defaultSlots: {},
        childAccepts: ["action"],
        childLaneTitleKey: "laneNestedActionsTitle",
    },
    {
        type: "UPDATE_STUDY_STATUS",
        functionName: "UPDATE_STUDY_STATUS",
        labelKey: "operatorUpdateStatus",
        category: "actions",
        returnType: "action",
        slots: [selectSlot("status", "slotStatus", "studyStatuses"), textSlot("message", "slotMessage")],
        defaultSlots: { status: "paused", message: "risk alert" },
    },
    {
        type: "UPDATE_STUDY_VARIABLE_STRING",
        functionName: "UPDATE_STUDY_VARIABLE_STRING",
        labelKey: "operatorUpdateStringVariable",
        category: "actions",
        returnType: "action",
        slots: [selectSlot("variableKey", "slotVariableKey", "studyVariableStrings"), textSlot("value", "slotValue")],
        defaultSlots: { variableKey: "assignedCoach", value: "coach-a" },
    },
    {
        type: "START_NEW_STUDY_SESSION",
        functionName: "START_NEW_STUDY_SESSION",
        labelKey: "operatorStartSession",
        category: "actions",
        returnType: "action",
        slots: [textSlot("session", "slotSessionName")],
        defaultSlots: { session: "follow-up" },
    },
    {
        type: "NOTIFY_RESEARCHER",
        functionName: "NOTIFY_RESEARCHER",
        labelKey: "operatorNotifyResearcher",
        category: "actions",
        returnType: "action",
        slots: [textSlot("message", "slotMessage")],
        defaultSlots: { message: "participant needs review" },
    },
    {
        type: "externalEventEval",
        functionName: "externalEventEval",
        labelKey: "operatorExternalEval",
        category: "external",
        returnType: "any",
        slots: [selectSlot("service", "slotService", "externalServices"), selectSlot("eventKey", "slotEventKey", "eventKeys")],
        defaultSlots: { service: "risk-service", eventKey: "risk-alert" },
    },
];

export const expressionDefinitionsByType: Record<string, ExpressionDefinition> = Object.fromEntries(
    expressionDefinitions.map((definition) => [definition.type, definition])
);

export function getDefinition(type: string): ExpressionDefinition {
    const definition = expressionDefinitionsByType[type];
    if (!definition) {
        throw new Error(`Unknown expression type: ${type}`);
    }
    return definition;
}

export function isCompatible(accepts: ExpressionReturnType[], returnType: ExpressionReturnType): boolean {
    return accepts.includes("any") || returnType === "any" || accepts.includes(returnType);
}

export function createChildLaneMeta(type: string): LaneMeta | undefined {
    const definition = getDefinition(type);
    if (!definition.childAccepts) {
        return undefined;
    }

    return {
        titleKey: definition.childLaneTitleKey ?? "laneNestedTitle",
        emptyKey: "emptyNested",
        accepts: definition.childAccepts,
    };
}

export function createNode(type: string, id: string): ExpressionNode {
    const definition = getDefinition(type);
    const childLaneId = definition.childAccepts ? `children:${id}` : undefined;

    return {
        id,
        type,
        collapsed: false,
        slots: { ...definition.defaultSlots },
        childLaneId,
    };
}

const initialState: EditorState = {
    blocks: {
        nodeEligible: {
            id: "nodeEligible",
            type: "and",
            nameKey: "sampleEligibleName",
            collapsed: false,
            slots: {},
            childLaneId: "children:nodeEligible",
        },
        nodeEnterEvent: {
            id: "nodeEnterEvent",
            type: "checkEventType",
            collapsed: false,
            slots: { eventType: "ENTER" },
        },
        nodeActiveStatus: {
            id: "nodeActiveStatus",
            type: "hasStudyStatus",
            collapsed: false,
            slots: { status: "active" },
        },
        nodeRecentSignal: {
            id: "nodeRecentSignal",
            type: "or",
            nameKey: "sampleRecentSignalName",
            collapsed: false,
            slots: {},
            childLaneId: "children:nodeRecentSignal",
        },
        nodeConsentFlag: {
            id: "nodeConsentFlag",
            type: "hasParticipantFlag",
            collapsed: false,
            slots: { flagKey: "consent", flagValue: "yes" },
        },
        nodeMoodResponse: {
            id: "nodeMoodResponse",
            type: "hasResponseKeyWithValue",
            collapsed: false,
            slots: { itemKey: "mood", responseKey: "value", expected: "high" },
        },
        nodeFollowUp: {
            id: "nodeFollowUp",
            type: "IF",
            nameKey: "sampleFollowUpName",
            collapsed: false,
            slots: {},
            childLaneId: "children:nodeFollowUp",
        },
        nodeNotify: {
            id: "nodeNotify",
            type: "NOTIFY_RESEARCHER",
            collapsed: false,
            slots: { message: "participant needs review" },
        },
        nodePause: {
            id: "nodePause",
            type: "UPDATE_STUDY_STATUS",
            collapsed: false,
            slots: { status: "paused", message: "risk alert" },
        },
        nodeTimer: {
            id: "nodeTimer",
            type: "timestampWithOffset",
            nameKey: "sampleTimerName",
            collapsed: false,
            slots: { delta: "604800", reference: "now" },
        },
        nodeRiskScore: {
            id: "nodeRiskScore",
            type: "getStudyVariableInt",
            collapsed: false,
            slots: { variableKey: "riskScore" },
        },
    },
    lanes: {
        [ROOT_CONDITION_LANE]: ["nodeEligible"],
        [ROOT_ACTION_LANE]: ["nodeFollowUp"],
        [SHELF_LANE]: ["nodeTimer", "nodeRiskScore"],
        "children:nodeEligible": ["nodeEnterEvent", "nodeActiveStatus", "nodeRecentSignal"],
        "children:nodeRecentSignal": ["nodeConsentFlag", "nodeMoodResponse"],
        "children:nodeFollowUp": ["nodeNotify", "nodePause"],
    },
    laneMeta: {
        [ROOT_CONDITION_LANE]: {
            titleKey: "laneConditionsTitle",
            emptyKey: "emptyConditions",
            accepts: ["boolean"],
        },
        [ROOT_ACTION_LANE]: {
            titleKey: "laneActionsTitle",
            emptyKey: "emptyActions",
            accepts: ["action"],
        },
        [SHELF_LANE]: {
            titleKey: "laneShelfTitle",
            emptyKey: "emptyShelf",
            accepts: ["any"],
        },
        "children:nodeEligible": {
            titleKey: "laneNestedConditionsTitle",
            emptyKey: "emptyNested",
            accepts: ["boolean"],
        },
        "children:nodeRecentSignal": {
            titleKey: "laneNestedConditionsTitle",
            emptyKey: "emptyNested",
            accepts: ["boolean"],
        },
        "children:nodeFollowUp": {
            titleKey: "laneNestedBranchesTitle",
            emptyKey: "emptyNested",
            accepts: ["boolean", "action"],
        },
    },
};

export function cloneEditorState(state: EditorState): EditorState {
    return {
        blocks: Object.fromEntries(
            Object.entries(state.blocks).map(([id, node]) => [
                id,
                {
                    ...node,
                    slots: { ...node.slots },
                },
            ])
        ),
        lanes: Object.fromEntries(
            Object.entries(state.lanes).map(([id, nodeIds]) => [id, [...nodeIds]])
        ),
        laneMeta: Object.fromEntries(
            Object.entries(state.laneMeta).map(([id, meta]) => [
                id,
                {
                    ...meta,
                    accepts: [...meta.accepts],
                },
            ])
        ),
    };
}

export function createInitialEditorState(): EditorState {
    return cloneEditorState(initialState);
}

export function findLaneForBlock(state: EditorState, blockId: string): string | undefined {
    return Object.entries(state.lanes).find(([, nodeIds]) => nodeIds.includes(blockId))?.[0];
}

export function createSnapshot(state: EditorState, rootId: string): ExpressionSnapshot | undefined {
    if (!state.blocks[rootId]) {
        return undefined;
    }

    const snapshot: ExpressionSnapshot = {
        rootId,
        blocks: {},
        lanes: {},
        laneMeta: {},
    };

    const visit = (blockId: string) => {
        const node = state.blocks[blockId];
        if (!node) {
            return;
        }

        snapshot.blocks[blockId] = {
            ...node,
            slots: { ...node.slots },
        };

        if (!node.childLaneId) {
            return;
        }

        snapshot.lanes[node.childLaneId] = [...(state.lanes[node.childLaneId] ?? [])];
        if (state.laneMeta[node.childLaneId]) {
            snapshot.laneMeta[node.childLaneId] = {
                ...state.laneMeta[node.childLaneId],
                accepts: [...state.laneMeta[node.childLaneId].accepts],
            };
        }
        snapshot.lanes[node.childLaneId].forEach(visit);
    };

    visit(rootId);
    return snapshot;
}

export function cloneSnapshot(snapshot: ExpressionSnapshot, getId: () => string): ExpressionSnapshot {
    const cloned: ExpressionSnapshot = {
        rootId: "",
        blocks: {},
        lanes: {},
        laneMeta: {},
    };

    const visit = (sourceId: string): string => {
        const sourceNode = snapshot.blocks[sourceId];
        const nextId = getId();
        const nextChildLaneId = sourceNode.childLaneId ? `children:${nextId}` : undefined;

        cloned.blocks[nextId] = {
            ...sourceNode,
            id: nextId,
            childLaneId: nextChildLaneId,
            slots: { ...sourceNode.slots },
        };

        if (sourceNode.childLaneId && nextChildLaneId) {
            cloned.lanes[nextChildLaneId] = (snapshot.lanes[sourceNode.childLaneId] ?? []).map(visit);
            const sourceMeta = snapshot.laneMeta[sourceNode.childLaneId] ?? createChildLaneMeta(sourceNode.type);
            if (sourceMeta) {
                cloned.laneMeta[nextChildLaneId] = {
                    ...sourceMeta,
                    accepts: [...sourceMeta.accepts],
                };
            }
        }

        return nextId;
    };

    cloned.rootId = visit(snapshot.rootId);
    return cloned;
}

export function removeNodeTree(state: EditorState, blockId: string): EditorState {
    const next = cloneEditorState(state);

    Object.keys(next.lanes).forEach((laneId) => {
        next.lanes[laneId] = next.lanes[laneId].filter((id) => id !== blockId);
    });

    const visit = (id: string) => {
        const node = next.blocks[id];
        if (!node) {
            return;
        }

        if (node.childLaneId) {
            (next.lanes[node.childLaneId] ?? []).forEach(visit);
            delete next.lanes[node.childLaneId];
            delete next.laneMeta[node.childLaneId];
        }

        delete next.blocks[id];
    };

    visit(blockId);
    return next;
}
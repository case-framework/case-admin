export type ReturnType = "action" | "boolean" | "num" | "str";

export type CategoryId = "actions" | "comparison" | "context" | "logic" | "values";

export type SuggestionSource = "eventTypes" | "flagKeys" | "messageKeys" | "statuses" | "surveyKeys" | "variableKeys";

export interface FieldSpec {
	id: string;
	labelKey: string;
	type: "text" | "number";
	suggestions?: SuggestionSource;
}

export interface SlotSpec {
	id: string;
	labelKey: string;
	accepts: ReturnType[];
	list?: boolean;
}

export interface NodeSpec {
	id: string;
	labelKey: string;
	category: CategoryId;
	returnType: ReturnType;
	fields?: FieldSpec[];
	slots: SlotSpec[];
}

export interface NodeInstance {
	id: string;
	specId: string;
	alias: string;
	collapsed: boolean;
	fields: Record<string, string>;
	slots: Record<string, string[]>;
}

export interface HandlerLane {
	id: string;
	rootIds: string[];
}

export interface FragmentDefinition {
	id: string;
	name: string;
	rootType: ReturnType;
	rootIds: string[];
}

export interface StudioState {
	handlers: HandlerLane[];
	fragments: FragmentDefinition[];
	scratch: string[];
	nodes: Record<string, NodeInstance>;
}

export type SurfaceRef =
	| { kind: "handler"; id: string }
	| { kind: "fragment"; id: string }
	| { kind: "scratch" };

export type ContainerRef = SurfaceRef | { kind: "slot"; nodeId: string; slotId: string };

export interface TreeSnapshot {
	specId: string;
	alias: string;
	collapsed: boolean;
	fields: Record<string, string>;
	slots: Record<string, TreeSnapshot[]>;
}

export const CATEGORY_ORDER: CategoryId[] = ["logic", "comparison", "context", "actions", "values"];

export const HANDLER_DEFS = [
	{ id: "entry", labelKey: "handlerEntry", descriptionKey: "handlerEntryDescription" },
	{ id: "submission", labelKey: "handlerSubmission", descriptionKey: "handlerSubmissionDescription" },
	{ id: "timer", labelKey: "handlerTimer", descriptionKey: "handlerTimerDescription" },
] as const;

export const MOCK_CONTEXT_DATA = {
	surveyKeys: ["baseline", "daily-checkin", "week-4-follow-up"],
	flagKeys: ["eligible", "needsFollowUp", "highRisk"],
	variableKeys: ["dailyStress", "adherenceScore", "sleepTrend"],
	messageKeys: ["reminder-24h", "coach-alert", "recovery-nudge"],
	statuses: ["active", "paused", "completed", "withdrawn"],
	eventTypes: ["ENTRY", "SUBMIT", "LEAVE", "MERGE", "CUSTOM", "TIMER"],
} satisfies Record<SuggestionSource, string[]>;

export const NODE_SPECS: NodeSpec[] = [
	{
		id: "allOf",
		labelKey: "nodeAllOf",
		category: "logic",
		returnType: "boolean",
		slots: [{ id: "conditions", labelKey: "slotConditions", accepts: ["boolean"], list: true }],
	},
	{
		id: "anyOf",
		labelKey: "nodeAnyOf",
		category: "logic",
		returnType: "boolean",
		slots: [{ id: "conditions", labelKey: "slotConditions", accepts: ["boolean"], list: true }],
	},
	{
		id: "not",
		labelKey: "nodeNot",
		category: "logic",
		returnType: "boolean",
		slots: [{ id: "condition", labelKey: "slotCondition", accepts: ["boolean"] }],
	},
	{
		id: "equals",
		labelKey: "nodeEquals",
		category: "comparison",
		returnType: "boolean",
		slots: [
			{ id: "left", labelKey: "slotLeft", accepts: ["num", "str"] },
			{ id: "right", labelKey: "slotRight", accepts: ["num", "str"] },
		],
	},
	{
		id: "greaterThan",
		labelKey: "nodeGreaterThan",
		category: "comparison",
		returnType: "boolean",
		slots: [
			{ id: "left", labelKey: "slotLeft", accepts: ["num"] },
			{ id: "right", labelKey: "slotRight", accepts: ["num"] },
		],
	},
	{
		id: "eventTypeIs",
		labelKey: "nodeEventTypeIs",
		category: "context",
		returnType: "boolean",
		fields: [{ id: "eventType", labelKey: "fieldEventType", type: "text", suggestions: "eventTypes" }],
		slots: [],
	},
	{
		id: "hasFlag",
		labelKey: "nodeHasFlag",
		category: "context",
		returnType: "boolean",
		fields: [
			{ id: "flagKey", labelKey: "fieldFlagKey", type: "text", suggestions: "flagKeys" },
			{ id: "expectedValue", labelKey: "fieldExpectedValue", type: "text" },
		],
		slots: [],
	},
	{
		id: "readVariable",
		labelKey: "nodeReadVariable",
		category: "context",
		returnType: "num",
		fields: [{ id: "variableKey", labelKey: "fieldVariableKey", type: "text", suggestions: "variableKeys" }],
		slots: [],
	},
	{
		id: "responseCount",
		labelKey: "nodeResponseCount",
		category: "context",
		returnType: "num",
		fields: [{ id: "surveyKey", labelKey: "fieldSurveyKey", type: "text", suggestions: "surveyKeys" }],
		slots: [],
	},
	{
		id: "ifThen",
		labelKey: "nodeIfThen",
		category: "actions",
		returnType: "action",
		slots: [
			{ id: "condition", labelKey: "slotCondition", accepts: ["boolean"] },
			{ id: "thenActions", labelKey: "slotThenActions", accepts: ["action"], list: true },
			{ id: "elseActions", labelKey: "slotElseActions", accepts: ["action"], list: true },
		],
	},
	{
		id: "doAll",
		labelKey: "nodeDoAll",
		category: "actions",
		returnType: "action",
		slots: [{ id: "actions", labelKey: "slotActions", accepts: ["action"], list: true }],
	},
	{
		id: "updateStatus",
		labelKey: "nodeUpdateStatus",
		category: "actions",
		returnType: "action",
		fields: [{ id: "status", labelKey: "fieldStatus", type: "text", suggestions: "statuses" }],
		slots: [],
	},
	{
		id: "addSurvey",
		labelKey: "nodeAddSurvey",
		category: "actions",
		returnType: "action",
		fields: [{ id: "surveyKey", labelKey: "fieldSurveyKey", type: "text", suggestions: "surveyKeys" }],
		slots: [],
	},
	{
		id: "setFlag",
		labelKey: "nodeSetFlag",
		category: "actions",
		returnType: "action",
		fields: [
			{ id: "flagKey", labelKey: "fieldFlagKey", type: "text", suggestions: "flagKeys" },
			{ id: "value", labelKey: "fieldValue", type: "text" },
		],
		slots: [],
	},
	{
		id: "sendMessage",
		labelKey: "nodeSendMessage",
		category: "actions",
		returnType: "action",
		fields: [{ id: "messageKey", labelKey: "fieldMessageKey", type: "text", suggestions: "messageKeys" }],
		slots: [],
	},
	{
		id: "numberValue",
		labelKey: "nodeNumberValue",
		category: "values",
		returnType: "num",
		fields: [{ id: "value", labelKey: "fieldValue", type: "number" }],
		slots: [],
	},
	{
		id: "textValue",
		labelKey: "nodeTextValue",
		category: "values",
		returnType: "str",
		fields: [{ id: "value", labelKey: "fieldValue", type: "text" }],
		slots: [],
	},
	{
		id: "fragmentCall",
		labelKey: "nodeFragmentCall",
		category: "actions",
		returnType: "action",
		fields: [{ id: "fragmentId", labelKey: "fieldFragment", type: "text" }],
		slots: [],
	},
];

export const NODE_SPEC_BY_ID: Record<string, NodeSpec> = Object.fromEntries(
	NODE_SPECS.map((spec) => [spec.id, spec])
);

export function createStudioId(prefix: string = "node") {
	return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getNodeSpec(node: NodeInstance) {
	return NODE_SPEC_BY_ID[node.specId]!;
}

function createNodeInstance(
	specId: string,
	options: Partial<Pick<NodeInstance, "id" | "alias" | "collapsed">> & {
		fields?: Record<string, string>;
		slots?: Record<string, string[]>;
	} = {}
): NodeInstance {
	const spec = NODE_SPEC_BY_ID[specId]!;
	return {
		id: options.id ?? createStudioId("node"),
		specId,
		alias: options.alias ?? "",
		collapsed: options.collapsed ?? false,
		fields: Object.fromEntries(spec.fields?.map((field) => [field.id, ""]) ?? []),
		slots: Object.fromEntries(spec.slots.map((slot) => [slot.id, []])),
		...options,
		fields: {
			...Object.fromEntries(spec.fields?.map((field) => [field.id, ""]) ?? []),
			...(options.fields ?? {}),
		},
		slots: {
			...Object.fromEntries(spec.slots.map((slot) => [slot.id, []])),
			...(options.slots ?? {}),
		},
	};
}

export function createSnapshotFromSpec(
	specId: string,
	options: Partial<Omit<TreeSnapshot, "specId">> = {}
): TreeSnapshot {
	const spec = NODE_SPEC_BY_ID[specId]!;
	return {
		specId,
		alias: options.alias ?? "",
		collapsed: options.collapsed ?? false,
		fields: {
			...Object.fromEntries(spec.fields?.map((field) => [field.id, ""]) ?? []),
			...(options.fields ?? {}),
		},
		slots: {
			...Object.fromEntries(spec.slots.map((slot) => [slot.id, []])),
			...(options.slots ?? {}),
		},
	};
}

export function createFragmentCallSnapshot(fragmentId: string) {
	return createSnapshotFromSpec("fragmentCall", { fields: { fragmentId } });
}

export function buildInitialStudioState(seed: { eligibilityName: string; reengagementName: string }): StudioState {
	const nodes: Record<string, NodeInstance> = {};
	const addNode = (
		specId: string,
		options: Partial<Pick<NodeInstance, "alias" | "collapsed">> & {
			fields?: Record<string, string>;
			slots?: Record<string, string[]>;
		} = {}
	) => {
		const node = createNodeInstance(specId, options);
		nodes[node.id] = node;
		return node.id;
	};

	const responseCount = addNode("responseCount", { fields: { surveyKey: "daily-checkin" } });
	const zero = addNode("numberValue", { fields: { value: "0" } });
	const greaterThan = addNode("greaterThan", { slots: { left: [responseCount], right: [zero] } });
	const eventType = addNode("eventTypeIs", { fields: { eventType: "SUBMIT" } });
	const eligibleFlag = addNode("hasFlag", { fields: { flagKey: "eligible", expectedValue: "yes" } });
	const eligibilityTree = addNode("allOf", { slots: { conditions: [eventType, eligibleFlag, greaterThan] } });

	const needsFollowUp = addNode("hasFlag", { fields: { flagKey: "needsFollowUp", expectedValue: "true" } });
	const notNeedsFollowUp = addNode("not", { slots: { condition: [needsFollowUp] } });
	const recoveryMessage = addNode("sendMessage", { fields: { messageKey: "recovery-nudge" } });
	const addFollowUpSurvey = addNode("addSurvey", { fields: { surveyKey: "week-4-follow-up" } });
	const pauseStatus = addNode("updateStatus", { fields: { status: "paused" } });
	const reengagementTree = addNode("ifThen", {
		slots: {
			condition: [notNeedsFollowUp],
			thenActions: [recoveryMessage, addFollowUpSurvey],
			elseActions: [pauseStatus],
		},
	});

	const eligibilityFragmentId = "fragment-eligibility";
	const reengagementFragmentId = "fragment-reengagement";

	const entryCondition = addNode("fragmentCall", { fields: { fragmentId: eligibilityFragmentId } });
	const activateStatus = addNode("updateStatus", { fields: { status: "active" } });
	const entryMessage = addNode("sendMessage", { fields: { messageKey: "reminder-24h" } });
	const pauseEntryStatus = addNode("updateStatus", { fields: { status: "paused" } });
	const entryHandler = addNode("ifThen", {
		slots: {
			condition: [entryCondition],
			thenActions: [activateStatus, entryMessage],
			elseActions: [pauseEntryStatus],
		},
	});

	const markNeedsFollowUp = addNode("setFlag", { fields: { flagKey: "needsFollowUp", value: "review" } });
	const followUpPlan = addNode("fragmentCall", { fields: { fragmentId: reengagementFragmentId } });
	const submissionHandler = addNode("doAll", { slots: { actions: [markNeedsFollowUp, followUpPlan] } });
	const timerHandler = addNode("sendMessage", { fields: { messageKey: "coach-alert" } });

	const scratchText = addNode("textValue", { fields: { value: "custom-event" } });
	const scratchSurvey = addNode("addSurvey", { fields: { surveyKey: "baseline" } });

	return {
		handlers: [
			{ id: "entry", rootIds: [entryHandler] },
			{ id: "submission", rootIds: [submissionHandler] },
			{ id: "timer", rootIds: [timerHandler] },
		],
		fragments: [
			{ id: eligibilityFragmentId, name: seed.eligibilityName, rootType: "boolean", rootIds: [eligibilityTree] },
			{ id: reengagementFragmentId, name: seed.reengagementName, rootType: "action", rootIds: [reengagementTree] },
		],
		scratch: [scratchText, scratchSurvey],
		nodes,
	};
}

export function getNodeReturnType(state: StudioState, nodeId: string): ReturnType {
	const node = state.nodes[nodeId];
	if (!node) {
		return "action";
	}

	if (node.specId === "fragmentCall") {
		return state.fragments.find((fragment) => fragment.id === node.fields.fragmentId)?.rootType ?? "action";
	}

	return getNodeSpec(node).returnType;
}

export function getListForContainer(state: StudioState, container: ContainerRef): string[] {
	if (container.kind === "scratch") {
		return state.scratch;
	}

	if (container.kind === "handler") {
		return state.handlers.find((handler) => handler.id === container.id)?.rootIds ?? [];
	}

	if (container.kind === "fragment") {
		return state.fragments.find((fragment) => fragment.id === container.id)?.rootIds ?? [];
	}

	return state.nodes[container.nodeId]?.slots[container.slotId] ?? [];
}

function updateListInContainer(state: StudioState, container: ContainerRef, nextList: string[]): StudioState {
	if (container.kind === "scratch") {
		return { ...state, scratch: nextList };
	}

	if (container.kind === "handler") {
		return {
			...state,
			handlers: state.handlers.map((handler) => (
				handler.id === container.id ? { ...handler, rootIds: nextList } : handler
			)),
		};
	}

	if (container.kind === "fragment") {
		return {
			...state,
			fragments: state.fragments.map((fragment) => (
				fragment.id === container.id ? { ...fragment, rootIds: nextList } : fragment
			)),
		};
	}

	const node = state.nodes[container.nodeId];
	if (!node) {
		return state;
	}

	return {
		...state,
		nodes: {
			...state.nodes,
			[container.nodeId]: {
				...node,
				slots: {
					...node.slots,
					[container.slotId]: nextList,
				},
			},
		},
	};
}

function sameContainer(left: ContainerRef, right: ContainerRef) {
	if (left.kind !== right.kind) {
		return false;
	}

	if (left.kind === "scratch") {
		return true;
	}

	if (left.kind === "handler" || left.kind === "fragment") {
		return left.id === right.id;
	}

	return left.nodeId === right.nodeId && left.slotId === right.slotId;
}

function findNodeLocationInTree(state: StudioState, nodeId: string, currentId: string): { container: ContainerRef; index: number } | null {
	const currentNode = state.nodes[currentId];
	if (!currentNode) {
		return null;
	}

	for (const [slotId, childIds] of Object.entries(currentNode.slots)) {
		const index = childIds.indexOf(nodeId);
		if (index >= 0) {
			return { container: { kind: "slot", nodeId: currentNode.id, slotId }, index };
		}

		for (const childId of childIds) {
			const nested = findNodeLocationInTree(state, nodeId, childId);
			if (nested) {
				return nested;
			}
		}
	}

	return null;
}

export function findNodeLocation(state: StudioState, nodeId: string): { container: ContainerRef; index: number } | null {
	const scratchIndex = state.scratch.indexOf(nodeId);
	if (scratchIndex >= 0) {
		return { container: { kind: "scratch" }, index: scratchIndex };
	}

	for (const handler of state.handlers) {
		const rootIndex = handler.rootIds.indexOf(nodeId);
		if (rootIndex >= 0) {
			return { container: { kind: "handler", id: handler.id }, index: rootIndex };
		}

		for (const rootId of handler.rootIds) {
			const nested = findNodeLocationInTree(state, nodeId, rootId);
			if (nested) {
				return nested;
			}
		}
	}

	for (const fragment of state.fragments) {
		const rootIndex = fragment.rootIds.indexOf(nodeId);
		if (rootIndex >= 0) {
			return { container: { kind: "fragment", id: fragment.id }, index: rootIndex };
		}

		for (const rootId of fragment.rootIds) {
			const nested = findNodeLocationInTree(state, nodeId, rootId);
			if (nested) {
				return nested;
			}
		}
	}

	return null;
}

export function collectSubtreeIds(state: StudioState, nodeId: string): string[] {
	const node = state.nodes[nodeId];
	if (!node) {
		return [];
	}

	const descendantIds = Object.values(node.slots).flatMap((childIds) => childIds.flatMap((childId) => collectSubtreeIds(state, childId)));
	return [nodeId, ...descendantIds];
}

export function setNodeAlias(state: StudioState, nodeId: string, alias: string): StudioState {
	const node = state.nodes[nodeId];
	if (!node) {
		return state;
	}

	return {
		...state,
		nodes: {
			...state.nodes,
			[nodeId]: {
				...node,
				alias,
			},
		},
	};
}

export function setNodeField(state: StudioState, nodeId: string, fieldId: string, value: string): StudioState {
	const node = state.nodes[nodeId];
	if (!node) {
		return state;
	}

	return {
		...state,
		nodes: {
			...state.nodes,
			[nodeId]: {
				...node,
				fields: {
					...node.fields,
					[fieldId]: value,
				},
			},
		},
	};
}

export function setNodeCollapsed(state: StudioState, nodeId: string, collapsed: boolean): StudioState {
	const node = state.nodes[nodeId];
	if (!node) {
		return state;
	}

	return {
		...state,
		nodes: {
			...state.nodes,
			[nodeId]: {
				...node,
				collapsed,
			},
		},
	};
}

export function cloneNodeTree(state: StudioState, nodeId: string): TreeSnapshot | null {
	const node = state.nodes[nodeId];
	if (!node) {
		return null;
	}

	return {
		specId: node.specId,
		alias: node.alias,
		collapsed: node.collapsed,
		fields: { ...node.fields },
		slots: Object.fromEntries(
			Object.entries(node.slots).map(([slotId, childIds]) => [
				slotId,
				childIds.map((childId) => cloneNodeTree(state, childId)).filter((value): value is TreeSnapshot => value !== null),
			])
		),
	};
}

function materializeSnapshot(snapshot: TreeSnapshot): { rootId: string; nodes: Record<string, NodeInstance> } {
	const nodes: Record<string, NodeInstance> = {};

	const build = (current: TreeSnapshot): string => {
		const nodeId = createStudioId("node");
		const childSlots = Object.fromEntries(
			Object.entries(current.slots).map(([slotId, children]) => [slotId, children.map((child) => build(child))])
		);

		nodes[nodeId] = createNodeInstance(current.specId, {
			id: nodeId,
			alias: current.alias,
			collapsed: current.collapsed,
			fields: current.fields,
			slots: childSlots,
		});

		return nodeId;
	};

	const rootId = build(snapshot);
	return { rootId, nodes };
}

function getSnapshotReturnType(state: StudioState, snapshot: TreeSnapshot): ReturnType {
	if (snapshot.specId !== "fragmentCall") {
		return NODE_SPEC_BY_ID[snapshot.specId]!.returnType;
	}

	return state.fragments.find((fragment) => fragment.id === snapshot.fields.fragmentId)?.rootType ?? "action";
}

export function getAcceptedTypesForContainer(state: StudioState, container: ContainerRef): ReturnType[] | "any" {
	if (container.kind === "scratch") {
		return "any";
	}

	if (container.kind === "handler") {
		return ["action"];
	}

	if (container.kind === "fragment") {
		return [state.fragments.find((fragment) => fragment.id === container.id)?.rootType ?? "action"];
	}

	const slot = getNodeSpec(state.nodes[container.nodeId]).slots.find((candidate) => candidate.id === container.slotId);
	return slot?.accepts ?? "any";
}

export function canInsertReturnType(state: StudioState, container: ContainerRef, returnType: ReturnType, movingNodeId?: string) {
	const acceptedTypes = getAcceptedTypesForContainer(state, container);
	if (acceptedTypes !== "any" && !acceptedTypes.includes(returnType)) {
		return false;
	}

	if (container.kind !== "slot") {
		return true;
	}

	const slotDef = getNodeSpec(state.nodes[container.nodeId]).slots.find((candidate) => candidate.id === container.slotId);
	if (slotDef?.list) {
		return true;
	}

	const existing = getListForContainer(state, container);
	return existing.length === 0 || (movingNodeId !== undefined && existing.length === 1 && existing[0] === movingNodeId);
}

export function moveNodeToTarget(state: StudioState, nodeId: string, target: ContainerRef, index: number): StudioState {
	const source = findNodeLocation(state, nodeId);
	if (!source) {
		return state;
	}

	if (target.kind === "slot" && collectSubtreeIds(state, nodeId).includes(target.nodeId)) {
		return state;
	}

	const nodeType = getNodeReturnType(state, nodeId);
	if (!canInsertReturnType(state, target, nodeType, nodeId)) {
		return state;
	}

	const nextState = updateListInContainer(
		state,
		source.container,
		getListForContainer(state, source.container).filter((currentId) => currentId !== nodeId)
	);

	const targetList = [...getListForContainer(nextState, target)];
	const adjustedIndex = sameContainer(source.container, target) && source.index < index ? index - 1 : index;
	const boundedIndex = Math.max(0, Math.min(adjustedIndex, targetList.length));
	targetList.splice(boundedIndex, 0, nodeId);
	return updateListInContainer(nextState, target, targetList);
}

export function insertSnapshot(state: StudioState, snapshot: TreeSnapshot, target: ContainerRef, index: number): { state: StudioState; insertedId: string | null } {
	const returnType = getSnapshotReturnType(state, snapshot);
	if (!canInsertReturnType(state, target, returnType)) {
		return { state, insertedId: null };
	}

	const materialized = materializeSnapshot(snapshot);
	const nextState = {
		...state,
		nodes: {
			...state.nodes,
			...materialized.nodes,
		},
	};

	const targetList = [...getListForContainer(nextState, target)];
	const boundedIndex = Math.max(0, Math.min(index, targetList.length));
	targetList.splice(boundedIndex, 0, materialized.rootId);
	return {
		state: updateListInContainer(nextState, target, targetList),
		insertedId: materialized.rootId,
	};
}

export function removeNodeTree(state: StudioState, nodeId: string): StudioState {
	const source = findNodeLocation(state, nodeId);
	if (!source) {
		return state;
	}

	const nextState = updateListInContainer(
		state,
		source.container,
		getListForContainer(state, source.container).filter((currentId) => currentId !== nodeId)
	);

	const nodesToRemove = new Set(collectSubtreeIds(state, nodeId));
	return {
		...nextState,
		nodes: Object.fromEntries(
			Object.entries(nextState.nodes).filter(([currentId]) => !nodesToRemove.has(currentId))
		),
	};
}

export function createFragment(state: StudioState, rootType: ReturnType, name: string): { state: StudioState; fragmentId: string } {
	const fragmentId = createStudioId("fragment");
	return {
		fragmentId,
		state: {
			...state,
			fragments: [
				...state.fragments,
				{
					id: fragmentId,
					name,
					rootType,
					rootIds: [],
				},
			],
		},
	};
}

export function countNodesByReturnType(state: StudioState, returnType: ReturnType) {
	return Object.keys(state.nodes).filter((nodeId) => getNodeReturnType(state, nodeId) === returnType).length;
}
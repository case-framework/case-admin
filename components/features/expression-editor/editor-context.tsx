"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { EditorNode, EditorState, NodeMap, SlotValue } from "./types";

// ─── ID generation ────────────────────────────────────────────────────────────

let counter = 0;
export function generateId(): string {
	return `node_${Date.now()}_${++counter}`;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type EditorAction =
	| { type: "ADD_NODE"; node: EditorNode; target: "root" | "scratch" }
	| { type: "REMOVE_NODE"; nodeId: string }
	| { type: "UPDATE_SLOT"; nodeId: string; slotKey: string; value: SlotValue }
	| { type: "SET_SELECTED"; nodeId: string | null }
	| { type: "TOGGLE_COLLAPSE"; nodeId: string }
	| { type: "SET_LABEL"; nodeId: string; label: string | undefined }
	| { type: "MOVE_TO_SCRATCH"; nodeId: string }
	| { type: "MOVE_TO_ROOT"; nodeId: string; index?: number }
	| { type: "REORDER_ROOT"; fromIndex: number; toIndex: number }
	| { type: "REORDER_SCRATCH"; fromIndex: number; toIndex: number }
	| { type: "CUT_NODE"; nodeId: string }
	| { type: "COPY_NODE"; nodeId: string }
	| { type: "PASTE_NODE"; target: "root" | "scratch" | { nodeId: string; slotKey: string } }
	| { type: "ADD_TO_LIST_SLOT"; nodeId: string; slotKey: string; childNodeId: string }
	| { type: "REMOVE_FROM_LIST_SLOT"; nodeId: string; slotKey: string; childNodeId: string }
	| { type: "REORDER_LIST_SLOT"; nodeId: string; slotKey: string; fromIndex: number; toIndex: number }
	| { type: "ADD_FUNCTION"; id: string; name: string; rootNodeId: string }
	| { type: "REMOVE_FUNCTION"; id: string }
	| { type: "LOAD_STATE"; state: EditorState }
	| { type: "MOVE_BETWEEN"; fromArea: "root" | "scratch"; toArea: "root" | "scratch"; nodeId: string; toIndex: number };

// ─── Deep clone helper ────────────────────────────────────────────────────────

function deepCloneNode(nodeId: string, nodes: NodeMap): { clonedNodes: NodeMap; rootId: string } {
	const clonedNodes: NodeMap = {};
	function cloneRec(id: string): string {
		const original = nodes[id];
		if (!original) return id;
		const newId = generateId();
		const newSlots: Record<string, SlotValue> = {};
		for (const [key, val] of Object.entries(original.slots)) {
			if (val.kind === "node") {
				const clonedChildId = cloneRec(val.nodeId);
				newSlots[key] = { kind: "node", nodeId: clonedChildId };
			} else if (val.kind === "nodeList") {
				newSlots[key] = { kind: "nodeList", nodeIds: val.nodeIds.map(cloneRec) };
			} else {
				newSlots[key] = { ...val };
			}
		}
		clonedNodes[newId] = { ...original, id: newId, slots: newSlots };
		return newId;
	}
	const rootId = cloneRec(nodeId);
	return { clonedNodes, rootId };
}

function collectNodeIds(nodeId: string, nodes: NodeMap): string[] {
	const ids: string[] = [nodeId];
	const node = nodes[nodeId];
	if (!node) return ids;
	for (const val of Object.values(node.slots)) {
		if (val.kind === "node") ids.push(...collectNodeIds(val.nodeId, nodes));
		else if (val.kind === "nodeList") {
			for (const childId of val.nodeIds) ids.push(...collectNodeIds(childId, nodes));
		}
	}
	return ids;
}

function removeNodeAndChildren(nodeId: string, nodes: NodeMap): NodeMap {
	const idsToRemove = new Set(collectNodeIds(nodeId, nodes));
	const newNodes: NodeMap = {};
	for (const [id, node] of Object.entries(nodes)) {
		if (!idsToRemove.has(id)) newNodes[id] = node;
	}
	return newNodes;
}

// Remove a node ID from any root/scratch list and any slot it appears in
function detachNode(nodeId: string, state: EditorState): EditorState {
	let newState = { ...state };
	newState.rootIds = state.rootIds.filter((id) => id !== nodeId);
	newState.scratchIds = state.scratchIds.filter((id) => id !== nodeId);

	// Also remove from parent slot references
	const newNodes = { ...state.nodes };
	for (const [nid, node] of Object.entries(newNodes)) {
		let changed = false;
		const newSlots = { ...node.slots };
		for (const [key, val] of Object.entries(newSlots)) {
			if (val.kind === "node" && val.nodeId === nodeId) {
				newSlots[key] = { kind: "empty" };
				changed = true;
			} else if (val.kind === "nodeList" && val.nodeIds.includes(nodeId)) {
				newSlots[key] = { kind: "nodeList", nodeIds: val.nodeIds.filter((id) => id !== nodeId) };
				changed = true;
			}
		}
		if (changed) newNodes[nid] = { ...node, slots: newSlots };
	}
	newState.nodes = newNodes;
	return newState;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function editorReducer(state: EditorState, action: EditorAction): EditorState {
	switch (action.type) {
		case "ADD_NODE": {
			const newNodes = { ...state.nodes, [action.node.id]: action.node };
			return {
				...state,
				nodes: newNodes,
				rootIds: action.target === "root" ? [...state.rootIds, action.node.id] : state.rootIds,
				scratchIds: action.target === "scratch" ? [...state.scratchIds, action.node.id] : state.scratchIds,
			};
		}
		case "REMOVE_NODE": {
			const cleaned = detachNode(action.nodeId, state);
			return {
				...cleaned,
				nodes: removeNodeAndChildren(action.nodeId, cleaned.nodes),
				selectedNodeId: state.selectedNodeId === action.nodeId ? null : state.selectedNodeId,
			};
		}
		case "UPDATE_SLOT": {
			const node = state.nodes[action.nodeId];
			if (!node) return state;
			return {
				...state,
				nodes: {
					...state.nodes,
					[action.nodeId]: { ...node, slots: { ...node.slots, [action.slotKey]: action.value } },
				},
			};
		}
		case "SET_SELECTED":
			return { ...state, selectedNodeId: action.nodeId };
		case "TOGGLE_COLLAPSE": {
			const node = state.nodes[action.nodeId];
			if (!node) return state;
			return {
				...state,
				nodes: { ...state.nodes, [action.nodeId]: { ...node, collapsed: !node.collapsed } },
			};
		}
		case "SET_LABEL": {
			const node = state.nodes[action.nodeId];
			if (!node) return state;
			return {
				...state,
				nodes: { ...state.nodes, [action.nodeId]: { ...node, label: action.label } },
			};
		}
		case "MOVE_TO_SCRATCH": {
			return {
				...state,
				rootIds: state.rootIds.filter((id) => id !== action.nodeId),
				scratchIds: [...state.scratchIds, action.nodeId],
			};
		}
		case "MOVE_TO_ROOT": {
			const newRootIds = state.rootIds.filter((id) => id !== action.nodeId);
			const newScratchIds = state.scratchIds.filter((id) => id !== action.nodeId);
			const idx = action.index ?? newRootIds.length;
			newRootIds.splice(idx, 0, action.nodeId);
			return { ...state, rootIds: newRootIds, scratchIds: newScratchIds };
		}
		case "REORDER_ROOT": {
			const ids = [...state.rootIds];
			const [moved] = ids.splice(action.fromIndex, 1);
			ids.splice(action.toIndex, 0, moved);
			return { ...state, rootIds: ids };
		}
		case "REORDER_SCRATCH": {
			const ids = [...state.scratchIds];
			const [moved] = ids.splice(action.fromIndex, 1);
			ids.splice(action.toIndex, 0, moved);
			return { ...state, scratchIds: ids };
		}
		case "CUT_NODE": {
			return { ...state, clipboard: { nodeIds: [action.nodeId], operation: "cut" } };
		}
		case "COPY_NODE": {
			return { ...state, clipboard: { nodeIds: [action.nodeId], operation: "copy" } };
		}
		case "PASTE_NODE": {
			if (!state.clipboard) return state;
			const sourceNodeId = state.clipboard.nodeIds[0];
			if (!sourceNodeId || !state.nodes[sourceNodeId]) return state;

			let newState = { ...state };
			let pasteNodeId: string;

			if (state.clipboard.operation === "copy") {
				const { clonedNodes, rootId } = deepCloneNode(sourceNodeId, state.nodes);
				pasteNodeId = rootId;
				newState.nodes = { ...state.nodes, ...clonedNodes };
			} else {
				// Cut: detach from current location
				newState = detachNode(sourceNodeId, newState);
				pasteNodeId = sourceNodeId;
			}

			if (action.target === "root") {
				newState.rootIds = [...newState.rootIds, pasteNodeId];
			} else if (action.target === "scratch") {
				newState.scratchIds = [...newState.scratchIds, pasteNodeId];
			} else {
				// Paste into a specific slot
				newState.nodes = {
					...newState.nodes,
					[action.target.nodeId]: {
						...newState.nodes[action.target.nodeId],
						slots: {
							...newState.nodes[action.target.nodeId].slots,
							[action.target.slotKey]: { kind: "node", nodeId: pasteNodeId },
						},
					},
				};
			}

			newState.clipboard = state.clipboard.operation === "cut" ? null : state.clipboard;
			return newState;
		}
		case "ADD_TO_LIST_SLOT": {
			const node = state.nodes[action.nodeId];
			if (!node) return state;
			const slot = node.slots[action.slotKey];
			const currentIds = slot?.kind === "nodeList" ? slot.nodeIds : [];
			return {
				...state,
				nodes: {
					...state.nodes,
					[action.nodeId]: {
						...node,
						slots: {
							...node.slots,
							[action.slotKey]: { kind: "nodeList", nodeIds: [...currentIds, action.childNodeId] },
						},
					},
				},
			};
		}
		case "REMOVE_FROM_LIST_SLOT": {
			const node = state.nodes[action.nodeId];
			if (!node) return state;
			const slot = node.slots[action.slotKey];
			if (slot?.kind !== "nodeList") return state;
			return {
				...state,
				nodes: {
					...state.nodes,
					[action.nodeId]: {
						...node,
						slots: {
							...node.slots,
							[action.slotKey]: { kind: "nodeList", nodeIds: slot.nodeIds.filter((id) => id !== action.childNodeId) },
						},
					},
				},
			};
		}
		case "REORDER_LIST_SLOT": {
			const node = state.nodes[action.nodeId];
			if (!node) return state;
			const slot = node.slots[action.slotKey];
			if (slot?.kind !== "nodeList") return state;
			const ids = [...slot.nodeIds];
			const [moved] = ids.splice(action.fromIndex, 1);
			ids.splice(action.toIndex, 0, moved);
			return {
				...state,
				nodes: {
					...state.nodes,
					[action.nodeId]: {
						...node,
						slots: { ...node.slots, [action.slotKey]: { kind: "nodeList", nodeIds: ids } },
					},
				},
			};
		}
		case "ADD_FUNCTION":
			return {
				...state,
				functions: [...state.functions, { id: action.id, name: action.name, rootNodeId: action.rootNodeId }],
			};
		case "REMOVE_FUNCTION":
			return {
				...state,
				functions: state.functions.filter((f) => f.id !== action.id),
			};
		case "LOAD_STATE":
			return action.state;
		case "MOVE_BETWEEN": {
			const fromList = action.fromArea === "root" ? "rootIds" : "scratchIds";
			const toList = action.toArea === "root" ? "rootIds" : "scratchIds";
			const newFrom = state[fromList].filter((id) => id !== action.nodeId);
			const newTo = fromList === toList ? newFrom : [...state[toList]];
			if (fromList !== toList) {
				newTo.splice(action.toIndex, 0, action.nodeId);
			} else {
				newTo.splice(action.toIndex, 0, action.nodeId);
			}
			return {
				...state,
				[fromList]: fromList === toList ? newTo : newFrom,
				[toList]: newTo,
			};
		}
		default:
			return state;
	}
}

// ─── Context ──────────────────────────────────────────────────────────────────

const initialState: EditorState = {
	nodes: {},
	rootIds: [],
	scratchIds: [],
	functions: [],
	selectedNodeId: null,
	clipboard: null,
};

interface EditorContextValue {
	state: EditorState;
	dispatch: React.Dispatch<EditorAction>;
	addNode: (defId: string, target: "root" | "scratch") => string;
	removeNode: (nodeId: string) => void;
	updateSlot: (nodeId: string, slotKey: string, value: SlotValue) => void;
	selectNode: (nodeId: string | null) => void;
	toggleCollapse: (nodeId: string) => void;
	setLabel: (nodeId: string, label: string | undefined) => void;
	cutNode: (nodeId: string) => void;
	copyNode: (nodeId: string) => void;
	pasteNode: (target: "root" | "scratch" | { nodeId: string; slotKey: string }) => void;
	moveToScratch: (nodeId: string) => void;
	moveToRoot: (nodeId: string) => void;
	addToListSlot: (nodeId: string, slotKey: string, defId: string) => string;
	removeFromListSlot: (nodeId: string, slotKey: string, childNodeId: string) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children, initial }: { children: ReactNode; initial?: EditorState }) {
	const [state, dispatch] = useReducer(editorReducer, initial ?? initialState);

	const addNode = useCallback((defId: string, target: "root" | "scratch") => {
		const id = generateId();
		const node: EditorNode = { id, defId, slots: {}, collapsed: false };
		dispatch({ type: "ADD_NODE", node, target });
		return id;
	}, []);

	const removeNode = useCallback((nodeId: string) => dispatch({ type: "REMOVE_NODE", nodeId }), []);
	const updateSlot = useCallback((nodeId: string, slotKey: string, value: SlotValue) => dispatch({ type: "UPDATE_SLOT", nodeId, slotKey, value }), []);
	const selectNode = useCallback((nodeId: string | null) => dispatch({ type: "SET_SELECTED", nodeId }), []);
	const toggleCollapse = useCallback((nodeId: string) => dispatch({ type: "TOGGLE_COLLAPSE", nodeId }), []);
	const setLabel = useCallback((nodeId: string, label: string | undefined) => dispatch({ type: "SET_LABEL", nodeId, label }), []);
	const cutNode = useCallback((nodeId: string) => dispatch({ type: "CUT_NODE", nodeId }), []);
	const copyNode = useCallback((nodeId: string) => dispatch({ type: "COPY_NODE", nodeId }), []);
	const pasteNode = useCallback((target: "root" | "scratch" | { nodeId: string; slotKey: string }) => dispatch({ type: "PASTE_NODE", target }), []);
	const moveToScratch = useCallback((nodeId: string) => dispatch({ type: "MOVE_TO_SCRATCH", nodeId }), []);
	const moveToRoot = useCallback((nodeId: string) => dispatch({ type: "MOVE_TO_ROOT", nodeId }), []);

	const addToListSlot = useCallback((nodeId: string, slotKey: string, defId: string) => {
		const childId = generateId();
		const childNode: EditorNode = { id: childId, defId, slots: {}, collapsed: false };
		dispatch({ type: "ADD_NODE", node: childNode, target: "root" }); // add to flat map
		// Remove from root since it's a child
		dispatch({ type: "ADD_TO_LIST_SLOT", nodeId, slotKey, childNodeId: childId });
		return childId;
	}, []);

	const removeFromListSlot = useCallback((nodeId: string, slotKey: string, childNodeId: string) => {
		dispatch({ type: "REMOVE_FROM_LIST_SLOT", nodeId, slotKey, childNodeId });
	}, []);

	const value = useMemo(() => ({
		state, dispatch, addNode, removeNode, updateSlot, selectNode,
		toggleCollapse, setLabel, cutNode, copyNode, pasteNode,
		moveToScratch, moveToRoot, addToListSlot, removeFromListSlot,
	}), [state, addNode, removeNode, updateSlot, selectNode, toggleCollapse, setLabel, cutNode, copyNode, pasteNode, moveToScratch, moveToRoot, addToListSlot, removeFromListSlot]);

	return <EditorContext value={value}>{children}</EditorContext>;
}

export function useEditor(): EditorContextValue {
	const ctx = useContext(EditorContext);
	if (!ctx) throw new Error("useEditor must be used within an EditorProvider");
	return ctx;
}

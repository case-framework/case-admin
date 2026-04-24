"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { StudyContext } from "./types";
import { MOCK_STUDY_CONTEXT } from "./mock-data";

const StudyContextCtx = createContext<StudyContext>(MOCK_STUDY_CONTEXT);

export function StudyContextProvider({ children, context }: { children: ReactNode; context?: StudyContext }) {
	return <StudyContextCtx value={context ?? MOCK_STUDY_CONTEXT}>{children}</StudyContextCtx>;
}

export function useStudyContext(): StudyContext {
	return useContext(StudyContextCtx);
}

/**
 * Given a slot definition and study context, resolves dynamic select options.
 * This handles cases like survey key dropdowns, message type dropdowns, etc.
 */
export function resolveSelectOptions(
	slotKey: string,
	defId: string,
	context: StudyContext,
): { value: string; label: string }[] | null {
	// Survey key slots
	if (slotKey === "surveyKey") {
		return context.surveyKeys.map((k) => ({ value: k, label: k }));
	}
	// Message type slots
	if (slotKey === "messageType") {
		return context.messageKeys.map((k) => ({ value: k, label: k }));
	}
	// Flag name slots — suggest known flag keys
	if (slotKey === "key" && (defId === "UPDATE_FLAG" || defId === "REMOVE_FLAG" || defId === "hasParticipantFlag" || defId === "getParticipantFlagValue")) {
		return context.participantFlags.map((f) => ({ value: f.key, label: f.key }));
	}
	// Flag value — if the parent is UPDATE_FLAG, suggest values for the selected key
	if (slotKey === "value" && defId === "UPDATE_FLAG") {
		return null; // Will be resolved dynamically based on selected key
	}
	// Status slots
	if (slotKey === "status") {
		return context.studyStatuses.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }));
	}
	return null;
}

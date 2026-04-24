import type { EditorState } from "./types";

/**
 * Mock study context for the prototype — provides realistic dropdown options.
 */
export const MOCK_STUDY_CONTEXT = {
	surveyKeys: ["weekly_survey", "intake_survey", "followup_survey", "vaccination_survey", "exit_survey"],
	messageKeys: ["welcome_email", "reminder_email", "weekly_reminder", "study_complete"],
	participantFlags: [
		{ key: "vaccinated", values: ["yes", "no", "unknown"] },
		{ key: "age_group", values: ["18-29", "30-49", "50-64", "65+"] },
		{ key: "consent_given", values: ["true", "false"] },
		{ key: "completed_intake", values: ["true", "false"] },
		{ key: "risk_group", values: ["low", "medium", "high"] },
	],
	studyStatuses: ["active", "inactive", "paused", "finished"],
	eventKeys: ["enrollment", "submission", "timer_weekly", "timer_daily", "custom_event"],
};

/**
 * Pre-built demo expression tree:
 *
 * IF participant completed intake AND is vaccinated
 *   THEN assign weekly survey + set flag
 *   ELSE assign intake survey
 */
export const DEMO_STATE: EditorState = {
	nodes: {
		"demo_if": {
			id: "demo_if",
			defId: "IF",
			collapsed: false,
			label: "Main enrollment rule",
			slots: {
				condition: { kind: "node", nodeId: "demo_and" },
				then: { kind: "node", nodeId: "demo_do_then" },
				else: { kind: "node", nodeId: "demo_assign_intake" },
			},
		},
		"demo_and": {
			id: "demo_and",
			defId: "and",
			collapsed: false,
			slots: {
				conditions: { kind: "nodeList", nodeIds: ["demo_has_intake", "demo_has_flag_vacc"] },
			},
		},
		"demo_has_intake": {
			id: "demo_has_intake",
			defId: "hasParticipantFlag",
			collapsed: false,
			slots: {
				key: { kind: "str", value: "completed_intake" },
			},
		},
		"demo_has_flag_vacc": {
			id: "demo_has_flag_vacc",
			defId: "eq",
			collapsed: false,
			label: "Is vaccinated?",
			slots: {
				left: { kind: "node", nodeId: "demo_get_vacc" },
				right: { kind: "node", nodeId: "demo_str_yes" },
			},
		},
		"demo_get_vacc": {
			id: "demo_get_vacc",
			defId: "getParticipantFlagValue",
			collapsed: false,
			slots: {
				key: { kind: "str", value: "vaccinated" },
			},
		},
		"demo_str_yes": {
			id: "demo_str_yes",
			defId: "getResponseValueAsStr",
			collapsed: false,
			slots: {
				surveyKey: { kind: "str", value: "intake_survey" },
				itemKey: { kind: "str", value: "Q_vaccination_status" },
			},
		},
		"demo_do_then": {
			id: "demo_do_then",
			defId: "DO",
			collapsed: false,
			label: "Assign weekly + set flag",
			slots: {
				actions: { kind: "nodeList", nodeIds: ["demo_assign_weekly", "demo_set_flag"] },
			},
		},
		"demo_assign_weekly": {
			id: "demo_assign_weekly",
			defId: "ADD_NEW_SURVEY",
			collapsed: false,
			slots: {
				surveyKey: { kind: "str", value: "weekly_survey" },
				priority: { kind: "num", value: 1 },
			},
		},
		"demo_set_flag": {
			id: "demo_set_flag",
			defId: "UPDATE_FLAG",
			collapsed: false,
			slots: {
				key: { kind: "str", value: "enrolled_weekly" },
				value: { kind: "str", value: "true" },
			},
		},
		"demo_assign_intake": {
			id: "demo_assign_intake",
			defId: "ADD_NEW_SURVEY",
			collapsed: false,
			slots: {
				surveyKey: { kind: "str", value: "intake_survey" },
				priority: { kind: "num", value: 10 },
			},
		},
		// Scratch pad items
		"demo_scratch_1": {
			id: "demo_scratch_1",
			defId: "UPDATE_STUDY_STATUS",
			collapsed: false,
			slots: {
				status: { kind: "str", value: "finished" },
			},
		},
		"demo_scratch_2": {
			id: "demo_scratch_2",
			defId: "lastSubmissionDateOlderThan",
			collapsed: false,
			slots: {
				threshold: { kind: "node", nodeId: "demo_scratch_2_ts" },
			},
		},
		"demo_scratch_2_ts": {
			id: "demo_scratch_2_ts",
			defId: "timestampWithOffset",
			collapsed: false,
			slots: {
				offset: { kind: "num", value: 604800 },
			},
		},
	},
	rootIds: ["demo_if"],
	scratchIds: ["demo_scratch_1", "demo_scratch_2"],
	functions: [
		{ id: "fn_1", name: "isVaccinated", rootNodeId: "demo_has_flag_vacc" },
	],
	selectedNodeId: null,
	clipboard: null,
};

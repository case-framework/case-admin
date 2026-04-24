"use client";

import {
	useDeferredValue,
	useEffect,
	useEffectEvent,
	useRef,
	useState,
	startTransition,
	type DragEvent,
} from "react";
import {
	ArrowRightIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	CopyIcon,
	GripVerticalIcon,
	MoreHorizontalIcon,
	PlusIcon,
	RotateCcwIcon,
	ScissorsIcon,
	SearchIcon,
	Trash2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
	CATEGORY_ORDER,
	HANDLER_DEFS,
	MOCK_CONTEXT_DATA,
	NODE_SPECS,
	buildInitialStudioState,
	canInsertReturnType,
	cloneNodeTree,
	collectSubtreeIds,
	countNodesByReturnType,
	createFragment,
	createFragmentCallSnapshot,
	createSnapshotFromSpec,
	findNodeLocation,
	getListForContainer,
	getNodeReturnType,
	getNodeSpec,
	insertSnapshot,
	moveNodeToTarget,
	removeNodeTree,
	setNodeAlias,
	setNodeCollapsed,
	setNodeField,
	type CategoryId,
	type ContainerRef,
	type ReturnType,
	type StudioState,
	type SurfaceRef,
	type TreeSnapshot,
} from "@/components/features/expression-studio/expression-studio-model";

type DragPayload =
	| { kind: "palette"; specId: string }
	| { kind: "node"; nodeId: string }
	| { kind: "fragment"; fragmentId: string };

const returnTypeKey: Record<ReturnType, string> = {
	action: "typeAction",
	boolean: "typeBoolean",
	num: "typeNumber",
	str: "typeText",
};

const categoryKey: Record<CategoryId, string> = {
	actions: "categoryActions",
	comparison: "categoryComparison",
	context: "categoryContext",
	logic: "categoryLogic",
	values: "categoryValues",
};

type CategoryFilter = CategoryId | "all";

export function ExpressionStudioPrototype() {
	const t = useTranslations("ExpressionStudio");
	const [studio, setStudio] = useState<StudioState>(() => buildInitialStudioState({
		eligibilityName: t("fragmentEligibility"),
		reengagementName: t("fragmentReengagement"),
	}));
	const [selectedSurface, setSelectedSurface] = useState<SurfaceRef>({ kind: "handler", id: "entry" });
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [clipboard, setClipboard] = useState<TreeSnapshot | null>(null);
	const [paletteQuery, setPaletteQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
	const [activeDropTarget, setActiveDropTarget] = useState<string | null>(null);
	const deferredPaletteQuery = useDeferredValue(paletteQuery);
	const dragPayloadRef = useRef<DragPayload | null>(null);

	const activeContainer = selectedSurface;
	const activeRootIds = getListForContainer(studio, activeContainer);
	const activeActionCount = countNodesByReturnType(studio, "action");

	const filteredPalette = NODE_SPECS.filter((spec) => spec.id !== "fragmentCall").filter((spec) => {
		if (categoryFilter !== "all" && spec.category !== categoryFilter) {
			return false;
		}

		if (!deferredPaletteQuery.trim()) {
			return true;
		}

		return t(spec.labelKey).toLowerCase().includes(deferredPaletteQuery.trim().toLowerCase());
	});

	const handleReset = () => {
		startTransition(() => {
			setStudio(buildInitialStudioState({
				eligibilityName: t("fragmentEligibility"),
				reengagementName: t("fragmentReengagement"),
			}));
			setSelectedSurface({ kind: "handler", id: "entry" });
			setSelectedNodeId(null);
			setClipboard(null);
			setActiveDropTarget(null);
		});
	};

	const removeSelectionIfNeeded = (nodeId: string) => {
		if (!selectedNodeId) {
			return;
		}

		if (collectSubtreeIds(studio, nodeId).includes(selectedNodeId)) {
			setSelectedNodeId(null);
		}
	};

	const handleCopyNode = (nodeId: string) => {
		const snapshot = cloneNodeTree(studio, nodeId);
		if (snapshot) {
			setClipboard(snapshot);
		}
	};

	const handleCutNode = (nodeId: string) => {
		const snapshot = cloneNodeTree(studio, nodeId);
		if (!snapshot) {
			return;
		}

		setClipboard(snapshot);
		removeSelectionIfNeeded(nodeId);
		setStudio(removeNodeTree(studio, nodeId));
	};

	const handleDeleteNode = (nodeId: string) => {
		removeSelectionIfNeeded(nodeId);
		setStudio(removeNodeTree(studio, nodeId));
	};

	const handleDuplicateNode = (nodeId: string) => {
		const snapshot = cloneNodeTree(studio, nodeId);
		const location = findNodeLocation(studio, nodeId);
		if (!snapshot || !location) {
			return;
		}

		const result = insertSnapshot(studio, snapshot, location.container, location.index + 1);
		setStudio(result.state);
		if (result.insertedId) {
			setSelectedNodeId(result.insertedId);
		}
	};

	const handlePaste = (target: ContainerRef, index: number) => {
		if (!clipboard) {
			return;
		}

		const result = insertSnapshot(studio, clipboard, target, index);
		setStudio(result.state);
		if (result.insertedId) {
			setSelectedNodeId(result.insertedId);
		}
	};

	const applyPayload = (payload: DragPayload, target: ContainerRef, index: number) => {
		if (payload.kind === "palette") {
			const result = insertSnapshot(studio, createSnapshotFromSpec(payload.specId), target, index);
			setStudio(result.state);
			if (result.insertedId) {
				setSelectedNodeId(result.insertedId);
			}
			return;
		}

		if (payload.kind === "fragment") {
			const result = insertSnapshot(studio, createFragmentCallSnapshot(payload.fragmentId), target, index);
			setStudio(result.state);
			if (result.insertedId) {
				setSelectedNodeId(result.insertedId);
			}
			return;
		}

		setStudio(moveNodeToTarget(studio, payload.nodeId, target, index));
		setSelectedNodeId(payload.nodeId);
	};

	const getPayloadFromEvent = (event: DragEvent<HTMLElement>) => {
		if (dragPayloadRef.current) {
			return dragPayloadRef.current;
		}

		const raw = event.dataTransfer.getData("text/plain");
		if (!raw) {
			return null;
		}

		try {
			return JSON.parse(raw) as DragPayload;
		} catch {
			return null;
		}
	};

	const canDropPayload = (payload: DragPayload | null, target: ContainerRef) => {
		if (!payload) {
			return false;
		}

		if (payload.kind === "palette") {
			const spec = NODE_SPECS.find((candidate) => candidate.id === payload.specId);
			return spec ? canInsertReturnType(studio, target, spec.returnType) : false;
		}

		if (payload.kind === "fragment") {
			const fragment = studio.fragments.find((candidate) => candidate.id === payload.fragmentId);
			return fragment ? canInsertReturnType(studio, target, fragment.rootType) : false;
		}

		const node = studio.nodes[payload.nodeId];
		if (!node) {
			return false;
		}

		return canInsertReturnType(studio, target, getNodeReturnType(studio, payload.nodeId), payload.nodeId);
	};

	const surfaceLabel = (surface: SurfaceRef) => {
		if (surface.kind === "scratch") {
			return t("scratchTitle");
		}

		if (surface.kind === "fragment") {
			return studio.fragments.find((fragment) => fragment.id === surface.id)?.name ?? t("fragmentsTitle");
		}

		const handler = HANDLER_DEFS.find((candidate) => candidate.id === surface.id);
		return handler ? t(handler.labelKey) : t("handlersTitle");
	};

	const surfaceDescription = (surface: SurfaceRef) => {
		if (surface.kind === "scratch") {
			return t("scratchDescription");
		}

		if (surface.kind === "fragment") {
			const fragment = studio.fragments.find((candidate) => candidate.id === surface.id);
			return fragment ? t(returnTypeKey[fragment.rootType]) : t("fragmentsTitle");
		}

		const handler = HANDLER_DEFS.find((candidate) => candidate.id === surface.id);
		return handler ? t(handler.descriptionKey) : t("handlersTitle");
	};

	const rootSummary = (ids: string[]) => {
		if (!ids.length) {
			return t("noBlocks");
		}

		return ids
			.slice(0, 2)
			.map((nodeId) => t(getNodeSpec(studio.nodes[nodeId]).labelKey))
			.join(" • ");
	};

	const targetKey = (target: ContainerRef, index: number) => {
		switch (target.kind) {
			case "scratch":
				return `scratch:${index}`;
			case "handler":
				return `handler:${target.id}:${index}`;
			case "fragment":
				return `fragment:${target.id}:${index}`;
			case "slot":
				return `slot:${target.nodeId}:${target.slotId}:${index}`;
		}
	};

	const startDrag = (event: DragEvent<HTMLElement>, payload: DragPayload) => {
		dragPayloadRef.current = payload;
		event.dataTransfer.effectAllowed = payload.kind === "node" ? "move" : "copy";
		event.dataTransfer.setData("text/plain", JSON.stringify(payload));
	};

	const endDrag = () => {
		dragPayloadRef.current = null;
		setActiveDropTarget(null);
	};

	const onDropTarget = (event: DragEvent<HTMLElement>, target: ContainerRef, index: number) => {
		const payload = getPayloadFromEvent(event);
		if (!canDropPayload(payload, target)) {
			return;
		}

		event.preventDefault();
		applyPayload(payload!, target, index);
		setActiveDropTarget(null);
		if (target.kind !== "slot") {
			setSelectedSurface(target);
		}
	};

	const onDragOverTarget = (event: DragEvent<HTMLElement>, target: ContainerRef, index: number) => {
		const payload = getPayloadFromEvent(event);
		if (!canDropPayload(payload, target)) {
			return;
		}

		event.preventDefault();
		setActiveDropTarget(targetKey(target, index));
	};

	const onLeaveTarget = () => {
		setActiveDropTarget(null);
	};

	const addFragment = (rootType: ReturnType) => {
		const label = `${t(rootType === "action" ? "newActionFragment" : "newBooleanFragment")} ${studio.fragments.length + 1}`;
		const result = createFragment(studio, rootType, label);
		setStudio(result.state);
		setSelectedSurface({ kind: "fragment", id: result.fragmentId });
	};

	const handleKeyboardShortcut = useEffectEvent((event: KeyboardEvent) => {
		const target = event.target;
		if (target instanceof HTMLElement) {
			const tagName = target.tagName.toLowerCase();
			if (target.isContentEditable || tagName === "input" || tagName === "textarea" || tagName === "select") {
				return;
			}
		}

		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "c" && selectedNodeId) {
			event.preventDefault();
			handleCopyNode(selectedNodeId);
			return;
		}

		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "x" && selectedNodeId) {
			event.preventDefault();
			handleCutNode(selectedNodeId);
			return;
		}

		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "v") {
			event.preventDefault();
			if (selectedNodeId) {
				const location = findNodeLocation(studio, selectedNodeId);
				if (location) {
					handlePaste(location.container, location.index + 1);
					return;
				}
			}

			handlePaste(activeContainer, activeRootIds.length);
			return;
		}

		if ((event.key === "Backspace" || event.key === "Delete") && selectedNodeId) {
			event.preventDefault();
			handleDeleteNode(selectedNodeId);
		}
	});

	useEffect(() => {
		const listener = (event: KeyboardEvent) => handleKeyboardShortcut(event);
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	}, []);

	const renderDropTarget = (target: ContainerRef, index: number, expanded: boolean = false) => {
		const key = targetKey(target, index);
		const highlighted = activeDropTarget === key;
		return (
			<div
				key={key}
				className={cn(
					"rounded-lg border border-dashed text-xs text-muted-foreground transition",
					expanded ? "min-h-14 px-3 py-3" : "min-h-3 px-2 py-1",
					highlighted ? "border-primary bg-primary/5 text-foreground" : "border-border/70 bg-muted/20"
				)}
				onDragOver={(event) => onDragOverTarget(event, target, index)}
				onDrop={(event) => onDropTarget(event, target, index)}
				onDragLeave={onLeaveTarget}
			>
				{expanded ? t("dropHere") : null}
			</div>
		);
	};

	const renderNodeList = (target: ContainerRef, nodeIds: string[], depth: number = 0) => {
		if (!nodeIds.length) {
			return renderDropTarget(target, 0, true);
		}

		return (
			<div className="flex flex-col gap-2">
				{renderDropTarget(target, 0)}
				{nodeIds.map((nodeId, index) => (
					<div key={nodeId} className="flex flex-col gap-2">
						{renderNode(nodeId, depth)}
						{renderDropTarget(target, index + 1)}
					</div>
				))}
			</div>
		);
	};

	const renderNode = (nodeId: string, depth: number) => {
		const node = studio.nodes[nodeId];
		const spec = getNodeSpec(node);
		const isSelected = selectedNodeId === nodeId;

		return (
			<Collapsible
				key={nodeId}
				open={!node.collapsed}
				onOpenChange={(open) => setStudio(setNodeCollapsed(studio, nodeId, !open))}
			>
				<div
					className={cn(
						"rounded-xl border bg-background shadow-xs transition",
						isSelected ? "border-primary/60 ring-2 ring-primary/10" : "border-border/70",
						depth > 0 ? "ml-3" : ""
					)}
					draggable
					onDragStart={(event) => startDrag(event, { kind: "node", nodeId })}
					onDragEnd={endDrag}
					onClick={() => setSelectedNodeId(nodeId)}
				>
					<div className="flex items-start gap-3 px-4 py-3">
						<div className="mt-0.5 text-muted-foreground">
							<GripVerticalIcon />
						</div>
						<div className="min-w-0 flex-1">
							<div className="flex flex-wrap items-center gap-2">
								<button
									className="inline-flex items-center gap-2 text-left text-sm font-medium"
									onClick={(event) => {
										event.stopPropagation();
										setStudio(setNodeCollapsed(studio, nodeId, !node.collapsed));
									}}
									type="button"
								>
									{node.collapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
									<span>{t(spec.labelKey)}</span>
								</button>
								{node.alias ? (
									<span className="rounded-full border border-border/70 bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
										{node.alias}
									</span>
								) : null}
								<span className="rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
									{t(categoryKey[spec.category])}
								</span>
								<span className="rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
									{t(returnTypeKey[getNodeReturnType(studio, nodeId)])}
								</span>
							</div>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									aria-label={t("nodeMenuLabel")}
									onClick={(event) => event.stopPropagation()}
									size="icon-xs"
									type="button"
									variant="ghost"
								>
									<MoreHorizontalIcon />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onSelect={() => handleCopyNode(nodeId)}>
									<CopyIcon />
									{t("copyBlock")}
								</DropdownMenuItem>
								<DropdownMenuItem onSelect={() => handleCutNode(nodeId)}>
									<ScissorsIcon />
									{t("cutBlock")}
								</DropdownMenuItem>
								<DropdownMenuItem onSelect={() => handleDuplicateNode(nodeId)}>
									<PlusIcon />
									{t("duplicateBlock")}
								</DropdownMenuItem>
								{clipboard ? (
									<DropdownMenuItem
										onSelect={() => {
											const location = findNodeLocation(studio, nodeId);
											if (location) {
												handlePaste(location.container, location.index + 1);
											}
										}}
									>
										<ArrowRightIcon />
										{t("pasteAfter")}
									</DropdownMenuItem>
								) : null}
								<DropdownMenuSeparator />
								<DropdownMenuItem variant="destructive" onSelect={() => handleDeleteNode(nodeId)}>
									<Trash2Icon />
									{t("deleteBlock")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<CollapsibleContent>
						<Separator />
						<div className="flex flex-col gap-4 px-4 py-4">
							<FieldGroup className="gap-4">
								<Field>
									<FieldLabel htmlFor={`${nodeId}-alias`}>{t("aliasLabel")}</FieldLabel>
									<FieldContent>
										<Input
											id={`${nodeId}-alias`}
											onChange={(event) => setStudio(setNodeAlias(studio, nodeId, event.target.value))}
											placeholder={t("aliasPlaceholder")}
											value={node.alias}
										/>
									</FieldContent>
								</Field>
								{spec.fields?.map((field) => {
									const listId = `${nodeId}-${field.id}-suggestions`;
									const suggestions = field.suggestions ? MOCK_CONTEXT_DATA[field.suggestions] : [];
									return (
										<Field key={field.id}>
											<FieldLabel htmlFor={`${nodeId}-${field.id}`}>{t(field.labelKey)}</FieldLabel>
											<FieldContent>
												<Input
													id={`${nodeId}-${field.id}`}
													list={suggestions.length ? listId : undefined}
													onChange={(event) => setStudio(setNodeField(studio, nodeId, field.id, event.target.value))}
													type={field.type === "number" ? "number" : "text"}
													value={node.fields[field.id] ?? ""}
												/>
												{suggestions.length ? (
													<datalist id={listId}>
														{suggestions.map((option) => (
															<option key={option} value={option} />
														))}
													</datalist>
												) : null}
											</FieldContent>
										</Field>
									);
								})}
							</FieldGroup>
							{spec.slots.length ? <Separator /> : null}
							{spec.slots.map((slot) => {
								const slotTarget: ContainerRef = { kind: "slot", nodeId, slotId: slot.id };
								return (
									<div key={slot.id} className="flex flex-col gap-2">
										<div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
											{t(slot.labelKey)}
										</div>
										{renderNodeList(slotTarget, node.slots[slot.id] ?? [], depth + 1)}
									</div>
								);
							})}
						</div>
					</CollapsibleContent>
				</div>
			</Collapsible>
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<Card className="border-dashed bg-muted/20">
				<CardHeader>
					<CardAction>
						<Button onClick={handleReset} size="sm" type="button" variant="outline">
							<RotateCcwIcon data-icon="inline-start" />
							{t("resetDemo")}
						</Button>
					</CardAction>
					<div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
						{t("prototypeBadge")}
					</div>
					<CardTitle>{t("prototypeTitle")}</CardTitle>
					<CardDescription>{t("prototypeDescription")}</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3 md:grid-cols-4">
					{[
						{ label: t("summaryHandlers"), value: studio.handlers.length },
						{ label: t("summaryFragments"), value: studio.fragments.length },
						{ label: t("summaryLoose"), value: studio.scratch.length },
						{ label: t("summaryActionBlocks"), value: activeActionCount },
					].map((item) => (
						<div key={item.label} className="rounded-xl border border-border/70 bg-background px-4 py-3">
							<div className="text-2xl font-semibold">{item.value}</div>
							<div className="text-sm text-muted-foreground">{item.label}</div>
						</div>
					))}
				</CardContent>
			</Card>

			<div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
				<div className="flex flex-col gap-4">
					<Card>
						<CardHeader>
							<CardTitle>{t("paletteTitle")}</CardTitle>
							<CardDescription>{t("paletteDescription")}</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<div className="relative">
								<SearchIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
								<Input
									className="pl-9"
									onChange={(event) => setPaletteQuery(event.target.value)}
									placeholder={t("paletteSearchPlaceholder")}
									value={paletteQuery}
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button
									onClick={() => setCategoryFilter("all")}
									size="xs"
									type="button"
									variant={categoryFilter === "all" ? "default" : "outline"}
								>
									{t("categoryAll")}
								</Button>
								{CATEGORY_ORDER.map((category) => (
									<Button
										key={category}
										onClick={() => setCategoryFilter(category)}
										size="xs"
										type="button"
										variant={categoryFilter === category ? "default" : "outline"}
									>
										{t(categoryKey[category])}
									</Button>
								))}
							</div>
							<div className="flex flex-col gap-2">
								{filteredPalette.map((spec) => (
									<div
										key={spec.id}
										className="rounded-xl border border-border/70 bg-background p-3"
										draggable
										onDragEnd={endDrag}
										onDragStart={(event) => startDrag(event, { kind: "palette", specId: spec.id })}
									>
										<div className="flex items-start gap-3">
											<div className="min-w-0 flex-1">
												<div className="text-sm font-medium">{t(spec.labelKey)}</div>
												<div className="text-xs text-muted-foreground">
													{t(categoryKey[spec.category])} • {t(returnTypeKey[spec.returnType])}
												</div>
											</div>
											<Button
												onClick={() => {
													const result = insertSnapshot(studio, createSnapshotFromSpec(spec.id), activeContainer, activeRootIds.length);
													setStudio(result.state);
													if (result.insertedId) {
														setSelectedNodeId(result.insertedId);
													}
												}}
												size="xs"
												type="button"
												variant="outline"
											>
												<PlusIcon data-icon="inline-start" />
												{t("addToCanvas")}
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t("contextTitle")}</CardTitle>
							<CardDescription>{t("contextDescription")}</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							{[
								{ label: t("contextSurveys"), values: MOCK_CONTEXT_DATA.surveyKeys },
								{ label: t("contextFlags"), values: MOCK_CONTEXT_DATA.flagKeys },
								{ label: t("contextVariables"), values: MOCK_CONTEXT_DATA.variableKeys },
								{ label: t("contextMessages"), values: MOCK_CONTEXT_DATA.messageKeys },
							].map((group) => (
								<div key={group.label} className="flex flex-col gap-2">
									<div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
										{group.label}
									</div>
									<div className="flex flex-wrap gap-2">
										{group.values.map((value) => (
											<span key={value} className="rounded-full border border-border/70 bg-muted px-2 py-1 text-xs text-muted-foreground">
												{value}
											</span>
										))}
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardAction>
							{clipboard ? (
								<Button
									onClick={() => handlePaste(activeContainer, activeRootIds.length)}
									size="sm"
									type="button"
									variant="outline"
								>
									{t("pasteToCanvas")}
								</Button>
							) : null}
						</CardAction>
						<CardTitle>{t("builderTitle")}</CardTitle>
						<CardDescription>{t("builderDescription")}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="rounded-xl border border-border/70 bg-muted/20 p-4">
							<div className="flex flex-wrap items-center gap-2">
								<div className="text-base font-semibold">{surfaceLabel(selectedSurface)}</div>
								<span className="rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
									{surfaceDescription(selectedSurface)}
								</span>
								{selectedSurface.kind === "fragment" ? (
									<span className="rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
										{t(returnTypeKey[studio.fragments.find((fragment) => fragment.id === selectedSurface.id)?.rootType ?? "action"])}
									</span>
								) : null}
							</div>
							{selectedSurface.kind === "fragment" ? (
								<div className="mt-4">
									<Field>
										<FieldLabel htmlFor={`fragment-${selectedSurface.id}`}>{t("fieldFragmentName")}</FieldLabel>
										<FieldContent>
											<Input
												id={`fragment-${selectedSurface.id}`}
												onChange={(event) => {
													setStudio({
														...studio,
														fragments: studio.fragments.map((fragment) => (
															fragment.id === selectedSurface.id
																? { ...fragment, name: event.target.value }
																: fragment
														)),
													});
												}}
												value={studio.fragments.find((fragment) => fragment.id === selectedSurface.id)?.name ?? ""}
											/>
										</FieldContent>
									</Field>
								</div>
							) : null}
						</div>
						{activeRootIds.length ? (
							renderNodeList(activeContainer, activeRootIds)
						) : (
							<div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
								{t("noBlocks")}
							</div>
						)}
					</CardContent>
				</Card>

				<div className="flex flex-col gap-4">
					<Card>
						<CardHeader>
							<CardAction>
								<div className="flex gap-2">
									<Button onClick={() => addFragment("action")} size="xs" type="button" variant="outline">
										<PlusIcon data-icon="inline-start" />
										{t("newActionFragment")}
									</Button>
									<Button onClick={() => addFragment("boolean")} size="xs" type="button" variant="outline">
										<PlusIcon data-icon="inline-start" />
										{t("newBooleanFragment")}
									</Button>
								</div>
							</CardAction>
							<CardTitle>{t("fragmentsTitle")}</CardTitle>
							<CardDescription>{t("fragmentsDescription")}</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							{studio.fragments.map((fragment) => {
								const fragmentSurface: SurfaceRef = { kind: "fragment", id: fragment.id };
								const rootTarget: ContainerRef = fragmentSurface;
								return (
									<button
										key={fragment.id}
										className={cn(
											"rounded-xl border px-4 py-3 text-left transition",
											selectedSurface.kind === "fragment" && selectedSurface.id === fragment.id
												? "border-primary/60 bg-primary/5"
												: "border-border/70 bg-background"
										)}
										onClick={() => setSelectedSurface(fragmentSurface)}
										onDragLeave={onLeaveTarget}
										onDragOver={(event) => onDragOverTarget(event, rootTarget, fragment.rootIds.length)}
										onDrop={(event) => onDropTarget(event, rootTarget, fragment.rootIds.length)}
										type="button"
									>
										<div className="flex items-center justify-between gap-3">
											<div className="min-w-0">
												<div className="truncate text-sm font-medium">{fragment.name}</div>
												<div className="text-xs text-muted-foreground">
													{t(returnTypeKey[fragment.rootType])} • {rootSummary(fragment.rootIds)}
												</div>
											</div>
											<Button
												onClick={(event) => {
													event.stopPropagation();
													const result = insertSnapshot(studio, createFragmentCallSnapshot(fragment.id), activeContainer, activeRootIds.length);
													setStudio(result.state);
													if (result.insertedId) {
														setSelectedNodeId(result.insertedId);
													}
												}}
												size="xs"
												type="button"
												variant="outline"
											>
												<ArrowRightIcon data-icon="inline-start" />
												{t("insertFragmentCall")}
											</Button>
										</div>
									</button>
								);
							})}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t("scratchTitle")}</CardTitle>
							<CardDescription>{t("scratchDescription")}</CardDescription>
						</CardHeader>
						<CardContent>
							<button
								className={cn(
									"w-full rounded-xl border px-4 py-4 text-left transition",
									selectedSurface.kind === "scratch"
										? "border-primary/60 bg-primary/5"
										: "border-border/70 bg-background"
								)}
								onClick={() => setSelectedSurface({ kind: "scratch" })}
								onDragLeave={onLeaveTarget}
								onDragOver={(event) => onDragOverTarget(event, { kind: "scratch" }, studio.scratch.length)}
								onDrop={(event) => onDropTarget(event, { kind: "scratch" }, studio.scratch.length)}
								type="button"
							>
								<div className="text-sm font-medium">{t("scratchTitle")}</div>
								<div className="mt-1 text-xs text-muted-foreground">{rootSummary(studio.scratch)}</div>
							</button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t("clipboardTitle")}</CardTitle>
							<CardDescription>{t("commandsDescription")}</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
								{clipboard ? t((NODE_SPECS.find((spec) => spec.id === clipboard.specId)?.labelKey ?? "clipboardEmpty")) : t("clipboardEmpty")}
							</div>
							<div className="text-xs text-muted-foreground">{t("commandsHint")}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t("handlersTitle")}</CardTitle>
							<CardDescription>{t("handlersDescription")}</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							{HANDLER_DEFS.map((handler) => {
								const rootTarget: ContainerRef = { kind: "handler", id: handler.id };
								const rootIds = studio.handlers.find((candidate) => candidate.id === handler.id)?.rootIds ?? [];
								return (
									<button
										key={handler.id}
										className={cn(
											"rounded-xl border px-4 py-3 text-left transition",
											selectedSurface.kind === "handler" && selectedSurface.id === handler.id
												? "border-primary/60 bg-primary/5"
												: "border-border/70 bg-background"
										)}
										onClick={() => setSelectedSurface({ kind: "handler", id: handler.id })}
										onDragLeave={onLeaveTarget}
										onDragOver={(event) => onDragOverTarget(event, rootTarget, rootIds.length)}
										onDrop={(event) => onDropTarget(event, rootTarget, rootIds.length)}
										type="button"
									>
										<div className="text-sm font-medium">{t(handler.labelKey)}</div>
										<div className="mt-1 text-xs text-muted-foreground">
											{t(handler.descriptionKey)} • {rootSummary(rootIds)}
										</div>
									</button>
								);
							})}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
"use client";

import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useDroppable,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    type DraggableAttributes,
    type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useRef, useState, type ButtonHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
    ChevronDownIcon,
    ChevronRightIcon,
    ClipboardPasteIcon,
    CopyIcon,
    GripVerticalIcon,
    MoreHorizontalIcon,
    PlusIcon,
    RefreshCcwIcon,
    SaveIcon,
    ScissorsIcon,
    SearchIcon,
    Trash2Icon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    ROOT_ACTION_LANE,
    ROOT_CONDITION_LANE,
    SHELF_LANE,
    categoryAccentClasses,
    categoryKeys,
    categoryLabelKeys,
    cloneEditorState,
    cloneSnapshot,
    createChildLaneMeta,
    createInitialEditorState,
    createNode,
    createSnapshot,
    expressionDefinitions,
    findLaneForBlock,
    getDefinition,
    isCompatible,
    referenceOptions,
    removeNodeTree,
    returnTypeLabelKeys,
    type EditorState,
    type ExpressionDefinition,
    type ExpressionNode,
    type ExpressionReturnType,
    type ExpressionSnapshot,
    type ReferenceSource,
    type SlotDefinition,
} from "./expression-editor-model";

type Translate = (key: string, values?: Record<string, string | number>) => string;
type PaletteCategory = "all" | (typeof categoryKeys)[number];

interface SavedFragment {
    id: string;
    name: string;
    snapshot: ExpressionSnapshot;
    returnType: ExpressionReturnType;
}

interface LaneProps {
    laneId: string;
    compact?: boolean;
    state: EditorState;
    selectedLane: string;
    selectedBlockId?: string;
    t: Translate;
    onSelectLane: (laneId: string) => void;
    onSelectBlock: (blockId: string) => void;
    onPaste: (laneId: string) => void;
    onCopy: (blockId: string) => void;
    onCut: (blockId: string) => void;
    onDuplicate: (blockId: string) => void;
    onDelete: (blockId: string) => void;
    onSaveFragment: (blockId: string) => void;
    onUpdateNode: (blockId: string, update: Partial<ExpressionNode>) => void;
    onUpdateSlot: (blockId: string, slotId: string, value: string) => void;
}

interface BlockProps extends Omit<LaneProps, "laneId" | "compact" | "onPaste"> {
    blockId: string;
    nestingLevel: number;
    active?: boolean;
    dragOverlay?: boolean;
    onPaste: (laneId: string) => void;
}

const paletteCategoryOptions: PaletteCategory[] = ["all", ...categoryKeys];
const clipboardSource = "case-admin-expression-prototype";

export function ExpressionEditorPrototype() {
    const t = useTranslations("ExpressionEditor");
    const [state, setState] = useState(createInitialEditorState);
    const [selectedLane, setSelectedLane] = useState(ROOT_CONDITION_LANE);
    const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>("nodeEligible");
    const [activeBlockId, setActiveBlockId] = useState<string | undefined>();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<PaletteCategory>("all");
    const [clipboardSnapshot, setClipboardSnapshot] = useState<ExpressionSnapshot | undefined>();
    const [fragments, setFragments] = useState<SavedFragment[]>([]);
    const nextId = useRef(1);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const selectedLaneMeta = state.laneMeta[selectedLane] ?? state.laneMeta[SHELF_LANE];
    const selectedBlock = selectedBlockId ? state.blocks[selectedBlockId] : undefined;
    const activeNode = activeBlockId ? state.blocks[activeBlockId] : undefined;
    const preview = useMemo(() => buildPreview(state, t), [state, t]);
    const visibleDefinitions = useMemo(() => {
        const query = search.trim().toLocaleLowerCase();

        return expressionDefinitions.filter((definition) => {
            const categoryMatches = category === "all" || definition.category === category;
            const textMatches = !query || [
                t(definition.labelKey),
                definition.functionName,
                t(categoryLabelKeys[definition.category]),
            ].some((value) => value.toLocaleLowerCase().includes(query));

            return categoryMatches && textMatches;
        });
    }, [category, search, t]);

    const getId = () => `prototypeNode${nextId.current++}`;

    const writeClipboard = (snapshot: ExpressionSnapshot) => {
        setClipboardSnapshot(snapshot);

        if (typeof navigator === "undefined" || !navigator.clipboard) {
            return;
        }

        void navigator.clipboard.writeText(JSON.stringify({ source: clipboardSource, snapshot }));
    };

    const readClipboard = async () => {
        if (clipboardSnapshot) {
            return clipboardSnapshot;
        }

        if (typeof navigator === "undefined" || !navigator.clipboard) {
            return undefined;
        }

        try {
            const value = JSON.parse(await navigator.clipboard.readText()) as unknown;
            if (isClipboardPayload(value)) {
                return value.snapshot;
            }
        } catch {
            return undefined;
        }

        return undefined;
    };

    const canInsertDefinition = (definition: ExpressionDefinition, laneId = selectedLane) => {
        const laneMeta = state.laneMeta[laneId] ?? state.laneMeta[SHELF_LANE];
        return isCompatible(laneMeta.accepts, definition.returnType);
    };

    const insertDefinition = (type: string, laneId = selectedLane) => {
        const targetLane = state.laneMeta[laneId] ? laneId : SHELF_LANE;
        const definition = getDefinition(type);

        if (!canInsertDefinition(definition, targetLane)) {
            toast.error(t("toastIncompatible"));
            return;
        }

        const id = getId();
        const node = createNode(type, id);
        const childLaneMeta = createChildLaneMeta(type);

        setState((current) => {
            const next = cloneEditorState(current);
            next.blocks[id] = node;
            next.lanes[targetLane] = [...(next.lanes[targetLane] ?? []), id];

            if (node.childLaneId && childLaneMeta) {
                next.lanes[node.childLaneId] = [];
                next.laneMeta[node.childLaneId] = childLaneMeta;
            }

            return next;
        });
        setSelectedLane(targetLane);
        setSelectedBlockId(id);
    };

    const insertSnapshot = (snapshot: ExpressionSnapshot, laneId: string, index?: number) => {
        const rootNode = snapshot.blocks[snapshot.rootId];
        if (!rootNode) {
            return;
        }

        const targetLane = state.laneMeta[laneId] ? laneId : SHELF_LANE;
        const targetMeta = state.laneMeta[targetLane] ?? state.laneMeta[SHELF_LANE];
        const definition = getDefinition(rootNode.type);

        if (!isCompatible(targetMeta.accepts, definition.returnType)) {
            toast.error(t("toastIncompatible"));
            return;
        }

        const cloned = cloneSnapshot(snapshot, getId);

        setState((current) => {
            const next = cloneEditorState(current);
            Object.assign(next.blocks, cloned.blocks);
            Object.assign(next.lanes, cloned.lanes);
            Object.assign(next.laneMeta, cloned.laneMeta);

            const targetIds = [...(next.lanes[targetLane] ?? [])];
            targetIds.splice(index ?? targetIds.length, 0, cloned.rootId);
            next.lanes[targetLane] = targetIds;

            return next;
        });
        setSelectedLane(targetLane);
        setSelectedBlockId(cloned.rootId);
    };

    const pasteIntoLane = async (laneId: string) => {
        const snapshot = await readClipboard();

        if (!snapshot) {
            toast.error(t("toastClipboardEmpty"));
            return;
        }

        insertSnapshot(snapshot, laneId);
        toast.success(t("toastPasted"));
    };

    const copyBlock = (blockId: string) => {
        const snapshot = createSnapshot(state, blockId);

        if (!snapshot) {
            return;
        }

        writeClipboard(snapshot);
        setSelectedBlockId(blockId);
        toast.success(t("toastCopied"));
    };

    const cutBlock = (blockId: string) => {
        const snapshot = createSnapshot(state, blockId);

        if (!snapshot) {
            return;
        }

        writeClipboard(snapshot);
        setState((current) => {
            const next = cloneEditorState(current);
            const sourceLane = findLaneForBlock(next, blockId);

            if (sourceLane && sourceLane !== SHELF_LANE) {
                next.lanes[sourceLane] = next.lanes[sourceLane].filter((id) => id !== blockId);
                next.lanes[SHELF_LANE] = [...next.lanes[SHELF_LANE], blockId];
            }

            return next;
        });
        setSelectedLane(SHELF_LANE);
        setSelectedBlockId(blockId);
        toast.success(t("toastCut"));
    };

    const duplicateBlock = (blockId: string) => {
        const snapshot = createSnapshot(state, blockId);
        const laneId = findLaneForBlock(state, blockId);

        if (!snapshot || !laneId) {
            return;
        }

        const index = (state.lanes[laneId] ?? []).indexOf(blockId) + 1;
        insertSnapshot(snapshot, laneId, index);
        toast.success(t("toastDuplicated"));
    };

    const deleteBlock = (blockId: string) => {
        setState((current) => removeNodeTree(current, blockId));
        setSelectedBlockId((current) => current === blockId ? undefined : current);
        toast.success(t("toastDeleted"));
    };

    const saveFragment = (blockId: string) => {
        const snapshot = createSnapshot(state, blockId);
        const node = state.blocks[blockId];

        if (!snapshot || !node) {
            return;
        }

        const definition = getDefinition(node.type);
        const fragment: SavedFragment = {
            id: `fragment-${Date.now()}-${fragments.length}`,
            name: getNodeTitle(node, t),
            snapshot,
            returnType: definition.returnType,
        };

        setFragments((current) => [fragment, ...current]);
        toast.success(t("toastSavedFragment"));
    };

    const updateNode = (blockId: string, update: Partial<ExpressionNode>) => {
        setState((current) => ({
            ...current,
            blocks: {
                ...current.blocks,
                [blockId]: {
                    ...current.blocks[blockId],
                    ...update,
                    slots: update.slots ?? current.blocks[blockId].slots,
                },
            },
        }));
    };

    const updateSlot = (blockId: string, slotId: string, value: string) => {
        setState((current) => ({
            ...current,
            blocks: {
                ...current.blocks,
                [blockId]: {
                    ...current.blocks[blockId],
                    slots: {
                        ...current.blocks[blockId].slots,
                        [slotId]: value,
                    },
                },
            },
        }));
    };

    const resetPrototype = () => {
        setState(createInitialEditorState());
        setSelectedLane(ROOT_CONDITION_LANE);
        setSelectedBlockId("nodeEligible");
        setClipboardSnapshot(undefined);
        setFragments([]);
        toast.success(t("toastReset"));
    };

    const handleDragStart = ({ active }: DragStartEvent) => {
        const blockId = String(active.id);
        setActiveBlockId(blockId);
        setSelectedBlockId(blockId);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        setActiveBlockId(undefined);

        if (!over) {
            return;
        }

        const blockId = String(active.id);
        const overId = String(over.id);
        const sourceLane = findLaneForBlock(state, blockId);
        const targetLane = state.lanes[overId] ? overId : findLaneForBlock(state, overId);

        if (!sourceLane || !targetLane || blockId === overId) {
            return;
        }

        const node = state.blocks[blockId];
        const targetMeta = state.laneMeta[targetLane];

        if (!node || !targetMeta || ownsLane(state, blockId, targetLane)) {
            toast.error(t("toastIncompatible"));
            return;
        }

        if (!isCompatible(targetMeta.accepts, getDefinition(node.type).returnType)) {
            toast.error(t("toastIncompatible"));
            return;
        }

        setState((current) => {
            const next = cloneEditorState(current);
            const currentSourceLane = findLaneForBlock(next, blockId);
            const currentTargetLane = next.lanes[overId] ? overId : findLaneForBlock(next, overId);

            if (!currentSourceLane || !currentTargetLane) {
                return current;
            }

            const sourceIds = [...next.lanes[currentSourceLane]];

            if (currentSourceLane === currentTargetLane) {
                const oldIndex = sourceIds.indexOf(blockId);
                const newIndex = next.lanes[overId] ? sourceIds.length - 1 : sourceIds.indexOf(overId);
                next.lanes[currentSourceLane] = arrayMove(sourceIds, oldIndex, Math.max(newIndex, 0));
                return next;
            }

            next.lanes[currentSourceLane] = sourceIds.filter((id) => id !== blockId);
            const targetIds = [...next.lanes[currentTargetLane]];
            const insertIndex = next.lanes[overId] ? targetIds.length : targetIds.indexOf(overId);
            targetIds.splice(insertIndex >= 0 ? insertIndex : targetIds.length, 0, blockId);
            next.lanes[currentTargetLane] = targetIds;

            return next;
        });
        setSelectedLane(targetLane);
        setSelectedBlockId(blockId);
    };

    return (
        <TooltipProvider>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveBlockId(undefined)}
            >
                <div className="grid gap-4 xl:grid-cols-[minmax(220px,280px)_minmax(0,1fr)_minmax(240px,320px)]">
                    <section className="flex min-h-136 flex-col gap-3 rounded-md border bg-card p-3">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-medium">{t("paletteTitle")}</h2>
                            <Badge variant="outline">{t("selectedLane", { lane: t(selectedLaneMeta.titleKey) })}</Badge>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="relative">
                                <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder={t("paletteSearchPlaceholder")}
                                    className="pl-8"
                                />
                            </div>
                            <Select value={category} onValueChange={(value) => setCategory(value as PaletteCategory)}>
                                <SelectTrigger className="w-full" size="sm" aria-label={t("categoryLabel")}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>{t("categoryLabel")}</SelectLabel>
                                        {paletteCategoryOptions.map((categoryKey) => (
                                            <SelectItem key={categoryKey} value={categoryKey}>
                                                {categoryKey === "all" ? t("categoryAll") : t(categoryLabelKeys[categoryKey])}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
                            {visibleDefinitions.length === 0 ? (
                                <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                                    {t("paletteEmpty")}
                                </p>
                            ) : visibleDefinitions.map((definition) => {
                                const compatible = canInsertDefinition(definition);

                                return (
                                    <Button
                                        key={definition.type}
                                        type="button"
                                        variant="ghost"
                                        disabled={!compatible}
                                        className="h-auto justify-start rounded-md border border-transparent p-2 text-left hover:border-border disabled:opacity-40"
                                        onClick={() => insertDefinition(definition.type)}
                                    >
                                        <span className={cn("mt-1 size-2 shrink-0 rounded-full", dotClassForCategory(definition.category))} />
                                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                                            <span className="truncate text-sm font-medium">{t(definition.labelKey)}</span>
                                            <span className="truncate font-mono text-xs text-muted-foreground">{definition.functionName}</span>
                                        </span>
                                        <Badge variant="secondary">{t(returnTypeLabelKeys[definition.returnType])}</Badge>
                                    </Button>
                                );
                            })}
                        </div>
                    </section>

                    <main className="flex min-w-0 flex-col gap-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <ExpressionLane
                                laneId={ROOT_CONDITION_LANE}
                                state={state}
                                selectedLane={selectedLane}
                                selectedBlockId={selectedBlockId}
                                t={t}
                                onSelectLane={setSelectedLane}
                                onSelectBlock={setSelectedBlockId}
                                onPaste={(laneId) => void pasteIntoLane(laneId)}
                                onCopy={copyBlock}
                                onCut={cutBlock}
                                onDuplicate={duplicateBlock}
                                onDelete={deleteBlock}
                                onSaveFragment={saveFragment}
                                onUpdateNode={updateNode}
                                onUpdateSlot={updateSlot}
                            />
                            <ExpressionLane
                                laneId={ROOT_ACTION_LANE}
                                state={state}
                                selectedLane={selectedLane}
                                selectedBlockId={selectedBlockId}
                                t={t}
                                onSelectLane={setSelectedLane}
                                onSelectBlock={setSelectedBlockId}
                                onPaste={(laneId) => void pasteIntoLane(laneId)}
                                onCopy={copyBlock}
                                onCut={cutBlock}
                                onDuplicate={duplicateBlock}
                                onDelete={deleteBlock}
                                onSaveFragment={saveFragment}
                                onUpdateNode={updateNode}
                                onUpdateSlot={updateSlot}
                            />
                        </div>
                        <ExpressionLane
                            laneId={SHELF_LANE}
                            state={state}
                            selectedLane={selectedLane}
                            selectedBlockId={selectedBlockId}
                            t={t}
                            onSelectLane={setSelectedLane}
                            onSelectBlock={setSelectedBlockId}
                            onPaste={(laneId) => void pasteIntoLane(laneId)}
                            onCopy={copyBlock}
                            onCut={cutBlock}
                            onDuplicate={duplicateBlock}
                            onDelete={deleteBlock}
                            onSaveFragment={saveFragment}
                            onUpdateNode={updateNode}
                            onUpdateSlot={updateSlot}
                        />
                    </main>

                    <aside className="flex min-h-136 flex-col gap-3 rounded-md border bg-card p-3">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-medium">{t("inspectorTitle")}</h2>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type="button" variant="ghost" size="icon-xs" aria-label={t("actionReset")} onClick={resetPrototype}>
                                        <RefreshCcwIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{t("actionReset")}</TooltipContent>
                            </Tooltip>
                        </div>
                        {selectedBlock ? (
                            <SelectedBlockPanel
                                node={selectedBlock}
                                t={t}
                                onCopy={copyBlock}
                                onCut={cutBlock}
                                onDuplicate={duplicateBlock}
                                onDelete={deleteBlock}
                                onSaveFragment={saveFragment}
                            />
                        ) : (
                            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                                {t("inspectorEmpty")}
                            </p>
                        )}
                        <Separator />
                        <div className="flex min-h-0 flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-medium">{t("fragmentsTitle")}</h3>
                                <Badge variant="outline">{fragments.length}</Badge>
                            </div>
                            {fragments.length === 0 ? (
                                <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                                    {t("fragmentsEmpty")}
                                </p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {fragments.map((fragment) => (
                                        <Button
                                            key={fragment.id}
                                            type="button"
                                            variant="outline"
                                            className="h-auto justify-start p-2 text-left"
                                            onClick={() => insertSnapshot(fragment.snapshot, selectedLane)}
                                            disabled={!isCompatible(selectedLaneMeta.accepts, fragment.returnType)}
                                        >
                                            <PlusIcon data-icon="inline-start" />
                                            <span className="min-w-0 flex-1 truncate">{fragment.name}</span>
                                            <Badge variant="secondary">{t(returnTypeLabelKeys[fragment.returnType])}</Badge>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Separator />
                        <div className="flex min-h-0 flex-1 flex-col gap-2">
                            <h3 className="text-sm font-medium">{t("previewTitle")}</h3>
                            <Textarea
                                readOnly
                                value={preview}
                                aria-label={t("previewTitle")}
                                className="min-h-40 flex-1 resize-none font-mono text-xs"
                            />
                        </div>
                    </aside>
                </div>

                <DragOverlay>
                    {activeNode ? (
                        <ExpressionBlockCard
                            blockId={activeNode.id}
                            nestingLevel={0}
                            dragOverlay
                            active
                            state={state}
                            selectedLane={selectedLane}
                            selectedBlockId={selectedBlockId}
                            t={t}
                            onSelectLane={setSelectedLane}
                            onSelectBlock={setSelectedBlockId}
                            onCopy={copyBlock}
                            onCut={cutBlock}
                            onDuplicate={duplicateBlock}
                            onDelete={deleteBlock}
                            onSaveFragment={saveFragment}
                            onUpdateNode={updateNode}
                            onUpdateSlot={updateSlot}
                            onPaste={(laneId) => void pasteIntoLane(laneId)}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </TooltipProvider>
    );
}

function ExpressionLane({
    laneId,
    compact,
    state,
    selectedLane,
    selectedBlockId,
    t,
    onSelectLane,
    onSelectBlock,
    onPaste,
    onCopy,
    onCut,
    onDuplicate,
    onDelete,
    onSaveFragment,
    onUpdateNode,
    onUpdateSlot,
}: LaneProps) {
    const lane = state.lanes[laneId] ?? [];
    const meta = state.laneMeta[laneId];
    const { setNodeRef, isOver } = useDroppable({ id: laneId });

    if (!meta) {
        return null;
    }

    return (
        <section
            className={cn(
                "flex min-h-0 flex-col gap-2 rounded-md border bg-card p-3",
                compact && "bg-background/60 p-2",
                selectedLane === laneId && "border-ring ring-2 ring-ring/15",
                isOver && "border-primary"
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                    <h3 className={cn("truncate font-medium", compact ? "text-xs" : "text-sm")}>{t(meta.titleKey)}</h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                        {meta.accepts.map((returnType) => (
                            <Badge key={returnType} variant="outline">{t(returnTypeLabelKeys[returnType])}</Badge>
                        ))}
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="button" variant={selectedLane === laneId ? "secondary" : "ghost"} size="icon-xs" aria-label={t("actionSelectLane")} onClick={() => onSelectLane(laneId)}>
                                <PlusIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("actionSelectLane")}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="button" variant="ghost" size="icon-xs" aria-label={t("actionPaste")} onClick={() => onPaste(laneId)}>
                                <ClipboardPasteIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("actionPaste")}</TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <SortableContext items={lane} strategy={verticalListSortingStrategy}>
                <div ref={setNodeRef} className={cn("flex min-h-20 flex-col gap-2 rounded-md", lane.length === 0 && "border border-dashed p-3")}>
                    {lane.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t(meta.emptyKey)}</p>
                    ) : lane.map((blockId) => (
                        <SortableExpressionBlock
                            key={blockId}
                            blockId={blockId}
                            nestingLevel={compact ? 1 : 0}
                            state={state}
                            selectedLane={selectedLane}
                            selectedBlockId={selectedBlockId}
                            t={t}
                            onSelectLane={onSelectLane}
                            onSelectBlock={onSelectBlock}
                            onPaste={onPaste}
                            onCopy={onCopy}
                            onCut={onCut}
                            onDuplicate={onDuplicate}
                            onDelete={onDelete}
                            onSaveFragment={onSaveFragment}
                            onUpdateNode={onUpdateNode}
                            onUpdateSlot={onUpdateSlot}
                        />
                    ))}
                </div>
            </SortableContext>
        </section>
    );
}

function SortableExpressionBlock(props: BlockProps) {
    const {
        attributes,
        listeners,
        setActivatorNodeRef,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.blockId });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={cn(isDragging && "opacity-45")}
        >
            <ExpressionBlockCard
                {...props}
                active={props.selectedBlockId === props.blockId}
                dragHandleProps={{ attributes, listeners, setActivatorNodeRef }}
            />
        </div>
    );
}

function ExpressionBlockCard({
    blockId,
    nestingLevel,
    active,
    dragOverlay,
    state,
    selectedLane,
    selectedBlockId,
    t,
    onSelectLane,
    onSelectBlock,
    onPaste,
    onCopy,
    onCut,
    onDuplicate,
    onDelete,
    onSaveFragment,
    onUpdateNode,
    onUpdateSlot,
    dragHandleProps,
}: BlockProps & {
    dragHandleProps?: {
        attributes: DraggableAttributes;
        listeners: DraggableSyntheticListeners;
        setActivatorNodeRef: (element: HTMLElement | null) => void;
    };
}) {
    const node = state.blocks[blockId];

    if (!node) {
        return null;
    }

    const definition = getDefinition(node.type);
    const title = getNodeTitle(node, t);
    const dragAttributes = dragHandleProps?.attributes as ButtonHTMLAttributes<HTMLButtonElement> | undefined;
    const dragListeners = dragHandleProps?.listeners as ButtonHTMLAttributes<HTMLButtonElement> | undefined;

    return (
        <article
            className={cn(
                "rounded-md border border-l-4 bg-background shadow-xs transition-colors",
                categoryAccentClasses[definition.category],
                active && "border-ring ring-2 ring-ring/15",
                dragOverlay && "w-88 shadow-lg"
            )}
            onClick={() => onSelectBlock(blockId)}
        >
            <div className="flex items-start gap-2 p-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t("actionDrag")}
                    className="mt-0.5 cursor-grab active:cursor-grabbing"
                    ref={dragHandleProps?.setActivatorNodeRef}
                    {...dragAttributes}
                    {...dragListeners}
                >
                    <GripVerticalIcon />
                </Button>
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onUpdateNode(blockId, { collapsed: !node.collapsed })}>
                    <span className="flex min-w-0 items-center gap-2">
                        {node.collapsed ? <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" /> : <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />}
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">{title}</span>
                    </span>
                    <span className="mt-1 flex min-w-0 flex-wrap items-center gap-1">
                        <Badge variant="secondary">{t(returnTypeLabelKeys[definition.returnType])}</Badge>
                        <Badge variant="outline">{t(categoryLabelKeys[definition.category])}</Badge>
                        <span className="truncate font-mono text-xs text-muted-foreground">{definition.functionName}</span>
                    </span>
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" size="icon-xs" aria-label={t("actionsMenu")}>
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => onCopy(blockId)}>
                                <CopyIcon data-icon="inline-start" />
                                {t("actionCopy")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onCut(blockId)}>
                                <ScissorsIcon data-icon="inline-start" />
                                {t("actionCut")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicate(blockId)}>
                                <PlusIcon data-icon="inline-start" />
                                {t("actionDuplicate")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSaveFragment(blockId)}>
                                <SaveIcon data-icon="inline-start" />
                                {t("actionSaveFragment")}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem variant="destructive" onClick={() => onDelete(blockId)}>
                                <Trash2Icon data-icon="inline-start" />
                                {t("actionDelete")}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {node.collapsed ? (
                <div className="border-t px-3 py-2 font-mono text-xs text-muted-foreground">
                    {nodeToExpression(state, blockId)}
                </div>
            ) : (
                <div className="flex flex-col gap-3 border-t p-3">
                    <Input
                        value={node.name ?? (node.nameKey ? t(node.nameKey) : "")}
                        onChange={(event) => onUpdateNode(blockId, { name: event.target.value, nameKey: undefined })}
                        placeholder={t("namePlaceholder")}
                        aria-label={t("nameLabel")}
                    />
                    {definition.slots.length > 0 ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                            {definition.slots.map((slot) => (
                                <SlotEditor
                                    key={slot.id}
                                    slot={slot}
                                    value={node.slots[slot.id] ?? ""}
                                    t={t}
                                    onChange={(value) => onUpdateSlot(blockId, slot.id, value)}
                                />
                            ))}
                        </div>
                    ) : null}
                    {node.childLaneId ? (
                        <ExpressionLane
                            compact={nestingLevel > 0}
                            laneId={node.childLaneId}
                            state={state}
                            selectedLane={selectedLane}
                            selectedBlockId={selectedBlockId}
                            t={t}
                            onSelectLane={onSelectLane}
                            onSelectBlock={onSelectBlock}
                            onPaste={onPaste}
                            onCopy={onCopy}
                            onCut={onCut}
                            onDuplicate={onDuplicate}
                            onDelete={onDelete}
                            onSaveFragment={onSaveFragment}
                            onUpdateNode={onUpdateNode}
                            onUpdateSlot={onUpdateSlot}
                        />
                    ) : null}
                </div>
            )}
        </article>
    );
}

function SlotEditor({ slot, value, t, onChange }: {
    slot: SlotDefinition;
    value: string;
    t: Translate;
    onChange: (value: string) => void;
}) {
    return (
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">
            <span className="truncate text-muted-foreground">{t(slot.labelKey)}</span>
            {slot.kind === "select" && slot.source ? (
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full" size="sm" aria-label={t(slot.labelKey)}>
                        <SelectValue placeholder={t(slot.placeholderKey)} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t(slot.labelKey)}</SelectLabel>
                            {referenceOptions[slot.source as ReferenceSource].map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            ) : (
                <Input
                    type={slot.kind === "number" ? "number" : "text"}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={t(slot.placeholderKey)}
                    aria-label={t(slot.labelKey)}
                />
            )}
        </label>
    );
}

function SelectedBlockPanel({ node, t, onCopy, onCut, onDuplicate, onDelete, onSaveFragment }: {
    node: ExpressionNode;
    t: Translate;
    onCopy: (blockId: string) => void;
    onCut: (blockId: string) => void;
    onDuplicate: (blockId: string) => void;
    onDelete: (blockId: string) => void;
    onSaveFragment: (blockId: string) => void;
}) {
    const definition = getDefinition(node.type);

    return (
        <div className="flex flex-col gap-2 rounded-md border p-3">
            <div className="min-w-0">
                <p className="truncate text-sm font-medium">{getNodeTitle(node, t)}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">{definition.functionName}</p>
            </div>
            <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">{t(returnTypeLabelKeys[definition.returnType])}</Badge>
                <Badge variant="outline">{t(categoryLabelKeys[definition.category])}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => onCopy(node.id)}>
                    <CopyIcon data-icon="inline-start" />
                    {t("actionCopy")}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => onCut(node.id)}>
                    <ScissorsIcon data-icon="inline-start" />
                    {t("actionCut")}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => onDuplicate(node.id)}>
                    <PlusIcon data-icon="inline-start" />
                    {t("actionDuplicate")}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => onSaveFragment(node.id)}>
                    <SaveIcon data-icon="inline-start" />
                    {t("actionSaveFragment")}
                </Button>
            </div>
            <Button type="button" variant="ghost" size="sm" className="justify-start text-destructive hover:text-destructive" onClick={() => onDelete(node.id)}>
                <Trash2Icon data-icon="inline-start" />
                {t("actionDelete")}
            </Button>
        </div>
    );
}

function getNodeTitle(node: ExpressionNode, t: Translate): string {
    if (node.name?.trim()) {
        return node.name.trim();
    }

    if (node.nameKey) {
        return t(node.nameKey);
    }

    return t(getDefinition(node.type).labelKey);
}

function nodeToExpression(state: EditorState, blockId: string): string {
    const node = state.blocks[blockId];

    if (!node) {
        return "";
    }

    const definition = getDefinition(node.type);
    const slotValues = definition.slots.map((slot) => node.slots[slot.id] || "_");
    const childValues = node.childLaneId
        ? (state.lanes[node.childLaneId] ?? []).map((childId) => nodeToExpression(state, childId))
        : [];
    const args = [...slotValues, ...childValues].join(", ");

    return `${definition.functionName}(${args})`;
}

function buildPreview(state: EditorState, t: Translate): string {
    return [
        `${t("previewConditions")}: ${lanePreview(state, ROOT_CONDITION_LANE, t)}`,
        `${t("previewActions")}: ${lanePreview(state, ROOT_ACTION_LANE, t)}`,
        `${t("previewShelf")}: ${lanePreview(state, SHELF_LANE, t)}`,
    ].join("\n");
}

function lanePreview(state: EditorState, laneId: string, t: Translate): string {
    const lane = state.lanes[laneId] ?? [];
    return lane.length > 0 ? lane.map((blockId) => nodeToExpression(state, blockId)).join("; ") : t("previewEmptyValue");
}

function dotClassForCategory(category: ExpressionDefinition["category"]): string {
    return {
        logic: "bg-primary",
        comparison: "bg-chart-2",
        event: "bg-chart-3",
        response: "bg-chart-4",
        participant: "bg-chart-5",
        variables: "bg-foreground",
        timeMath: "bg-chart-1",
        actions: "bg-destructive",
        external: "bg-muted-foreground",
    }[category];
}

function ownsLane(state: EditorState, blockId: string, laneId: string): boolean {
    const node = state.blocks[blockId];

    if (!node?.childLaneId) {
        return false;
    }

    if (node.childLaneId === laneId) {
        return true;
    }

    return (state.lanes[node.childLaneId] ?? []).some((childId) => ownsLane(state, childId, laneId));
}

function isClipboardPayload(value: unknown): value is { source: string; snapshot: ExpressionSnapshot } {
    if (!value || typeof value !== "object") {
        return false;
    }

    const payload = value as { source?: unknown; snapshot?: unknown };
    const snapshot = payload.snapshot as Partial<ExpressionSnapshot> | undefined;

    return payload.source === clipboardSource
        && !!snapshot
        && typeof snapshot.rootId === "string"
        && typeof snapshot.blocks === "object"
        && typeof snapshot.lanes === "object"
        && typeof snapshot.laneMeta === "object";
}
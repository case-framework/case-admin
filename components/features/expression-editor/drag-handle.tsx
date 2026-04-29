"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface DragHandleProps {
  instanceId: string;
  className?: string;
}

export function DragHandle({ instanceId, className }: DragHandleProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: instanceId,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 ${className || ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <GripVertical className="w-4 h-4" />
    </div>
  );
}

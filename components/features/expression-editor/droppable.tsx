"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  isOver?: boolean;
}

export function Droppable({ id, children, className, isOver }: DroppableProps) {
  const { setNodeRef, isOver: droppableOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "transition-colors",
        (isOver || droppableOver) && "bg-blue-500/10 border-blue-500/30",
        className
      )}
    >
      {children}
    </div>
  );
}

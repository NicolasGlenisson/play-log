"use client";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { AlignJustify, Trash2 } from "lucide-react";
import { suggestionType } from "../searchBar";
import { Button } from "@/components/custom/buttons";

export default function SortableGameList(props: {
  sortableGames: suggestionType[];
  handleDragEnd: (e: DragEndEvent) => void;
  handleGameListRemove: (slug: string) => void;
}) {
  const { sortableGames, handleDragEnd, handleGameListRemove } = props;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  return (
    <DndContext
      id="dnd-context"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => handleDragEnd(e)}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={sortableGames.map((game) => game.slug)}
        strategy={verticalListSortingStrategy}
      >
        {sortableGames.map((game) => (
          <SortableItem
            key={game.id}
            game={game}
            handleGameListRemove={handleGameListRemove}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableItem(props: {
  game: suggestionType;
  handleGameListRemove: (slug: string) => void;
}) {
  const { game, handleGameListRemove } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: game.slug });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 border rounded hover:bg-[#faf3e0] mb-2 shadow-md bg-[#FAEDCD] flex justify-between items-center"
    >
      <div className="flex-grow">{game.name}</div>
      <div className="flex items-center space-x-2">
        <AlignJustify />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => handleGameListRemove(game.slug)}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

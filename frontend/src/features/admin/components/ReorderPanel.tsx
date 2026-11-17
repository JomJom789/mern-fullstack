import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Project } from '@jomel/shared';
import { GripVertical, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ProjectImage } from '../../../components/ui/ProjectImage';
import { errorMessage } from '../../../lib/api';
import { cn } from '../../../lib/utils';
import { useAllAdminProjects, useReorderProjects } from '../api';
import { Drawer } from './Overlay';

function SortableRow({ project, index }: { project: Project; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-4 rounded-xl border bg-graphite/60 p-3',
        isDragging ? 'z-10 border-gold/60 shadow-2xl' : 'border-smoke',
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none rounded-md p-1.5 text-stone hover:text-gold active:cursor-grabbing"
        aria-label={`Drag to reorder ${project.title}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-5" />
      </button>
      <span className="w-6 text-center font-mono text-xs text-gold">{index + 1}</span>
      <ProjectImage
        src={project.imageUrl}
        alt={project.title}
        seed={project.slug}
        className="h-10 w-16 shrink-0 rounded-md"
        imgClassName="object-top"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ivory">{project.title}</p>
        <p className="text-xs text-stone">
          {project.status === 'published' ? 'Published' : 'Draft'}
          {project.featured ? ' · Featured' : ''}
        </p>
      </div>
    </li>
  );
}

function ReorderList({ projects, onDone }: { projects: Project[]; onDone: () => void }) {
  const [items, setItems] = useState(projects);
  const reorder = useReorderProjects();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setItems((current) => {
      const from = current.findIndex((p) => p.id === active.id);
      const to = current.findIndex((p) => p.id === over.id);
      return arrayMove(current, from, to);
    });
  };

  const changed = items.some((p, i) => p.id !== projects[i]?.id);

  const save = async () => {
    try {
      await reorder.mutateAsync({ items: items.map((p, i) => ({ id: p.id, sortOrder: i + 1 })) });
      toast.success('Order saved');
      onDone();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="space-y-5">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <ol className="space-y-2">
            {items.map((project, i) => (
              <SortableRow key={project.id} project={project} index={i} />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setItems(projects)}
          disabled={!changed}
          className="rounded-full px-5 py-2.5 text-sm text-ivory hover:bg-ivory/5 disabled:opacity-40"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={!changed || reorder.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gold-gradient)] px-6 py-2.5 text-sm font-semibold text-ink disabled:opacity-50"
        >
          {reorder.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          Save order
        </button>
      </div>
    </div>
  );
}

export function ReorderPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, isPending, isError, error, dataUpdatedAt } = useAllAdminProjects(open);
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Reorder projects"
      description="Drag (or use Space + arrow keys) to set the curated order."
      width="max-w-xl"
    >
      {isPending ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 animate-spin text-gold" aria-label="Loading" />
        </div>
      ) : isError ? (
        <p className="text-sm text-danger">{errorMessage(error)}</p>
      ) : (
        <ReorderList key={dataUpdatedAt} projects={data} onDone={onClose} />
      )}
    </Drawer>
  );
}

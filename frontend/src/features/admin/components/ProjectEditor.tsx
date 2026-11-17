import { zodResolver } from '@hookform/resolvers/zod';
import {
  SUGGESTED_CATEGORIES,
  projectInputSchema,
  slugify,
  type Project,
  type ProjectFormValues,
  type ProjectInput,
} from '@jomel/shared';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { errorMessage } from '../../../lib/api';
import { useProjectMeta } from '../../projects/hooks';
import { useCreateProject, useUpdateProject } from '../api';
import { FieldError, FieldLabel, TagInput, Toggle } from './FormControls';
import { ImageUploader } from './ImageUploader';
import { Drawer } from './Overlay';

interface ProjectEditorProps {
  open: boolean;
  /** Null when creating. */
  project: Project | null;
  nextSortOrder: number;
  onClose: () => void;
}

function toFormValues(project: Project | null, nextSortOrder: number): ProjectFormValues {
  return {
    slug: project?.slug ?? '',
    title: project?.title ?? '',
    tagline: project?.tagline ?? '',
    description: project?.description ?? '',
    category: project?.category ?? 'Web App',
    techStack: project?.techStack ?? [],
    liveUrl: project?.liveUrl ?? '',
    repoUrl: project?.repoUrl ?? '',
    imagePath: project?.imagePath ?? null,
    featured: project?.featured ?? false,
    status: project?.status ?? 'draft',
    sortOrder: project?.sortOrder ?? nextSortOrder,
  };
}

export function ProjectEditor({ open, project, nextSortOrder, onClose }: ProjectEditorProps) {
  const create = useCreateProject();
  const update = useUpdateProject();
  const meta = useProjectMeta();
  const [previewUrl, setPreviewUrl] = useState<string | null>(project?.imageUrl ?? null);
  const [slugTouched, setSlugTouched] = useState(Boolean(project));

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProjectFormValues, unknown, ProjectInput>({
    resolver: zodResolver(projectInputSchema),
    defaultValues: toFormValues(project, nextSortOrder),
  });

  // Auto-generate the slug from the title until the slug is edited by hand.
  const title = useWatch({ control, name: 'title' });
  useEffect(() => {
    if (!slugTouched) setValue('slug', slugify(title ?? ''), { shouldValidate: false });
  }, [title, slugTouched, setValue]);

  const saving = create.isPending || update.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (project) {
        await update.mutateAsync({ id: project.id, input: values });
        toast.success('Project updated');
      } else {
        await create.mutateAsync(values);
        toast.success('Project created');
      }
      onClose();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  });

  const categoryOptions = [...new Set([...SUGGESTED_CATEGORIES, ...(meta.data?.categories ?? [])])];

  return (
    <Drawer
      open={open}
      onClose={() => {
        if (!isDirty || window.confirm('Discard unsaved changes?')) onClose();
      }}
      title={project ? 'Edit project' : 'New project'}
      description={project ? project.title : 'Drafts stay private until you publish them.'}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm text-ivory hover:bg-ivory/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="project-form"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gold-gradient)] px-6 py-2.5 text-sm font-semibold text-ink disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            {project ? 'Save changes' : 'Create project'}
          </button>
        </div>
      }
    >
      <form
        id="project-form"
        onSubmit={(event) => void onSubmit(event)}
        noValidate
        className="space-y-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="p-title">Title</FieldLabel>
            <input
              id="p-title"
              className="field-luxe mt-2"
              maxLength={120}
              data-autofocus
              aria-invalid={Boolean(errors.title)}
              {...register('title')}
            />
            <FieldError message={errors.title?.message} />
          </div>
          <div>
            <FieldLabel htmlFor="p-slug" hint={slugTouched ? 'custom' : 'auto from title'}>
              Slug
            </FieldLabel>
            <input
              id="p-slug"
              className="field-luxe mt-2 font-mono"
              maxLength={80}
              aria-invalid={Boolean(errors.slug)}
              {...register('slug', {
                onChange: (event: { target: { value: string } }) => {
                  setSlugTouched(event.target.value.length > 0);
                },
              })}
            />
            <FieldError message={errors.slug?.message} />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="p-tagline" hint="max 160">
            Tagline
          </FieldLabel>
          <input
            id="p-tagline"
            className="field-luxe mt-2"
            maxLength={160}
            {...register('tagline')}
          />
          <FieldError message={errors.tagline?.message} />
        </div>

        <div>
          <FieldLabel htmlFor="p-description" hint="plain text, max 5000">
            Description
          </FieldLabel>
          <textarea
            id="p-description"
            rows={6}
            className="field-luxe mt-2 resize-y"
            maxLength={5000}
            aria-invalid={Boolean(errors.description)}
            {...register('description')}
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="p-category">Category</FieldLabel>
            <input
              id="p-category"
              list="p-category-list"
              className="field-luxe mt-2"
              maxLength={40}
              aria-invalid={Boolean(errors.category)}
              {...register('category')}
            />
            <datalist id="p-category-list">
              {categoryOptions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <FieldError message={errors.category?.message} />
          </div>
          <div>
            <FieldLabel htmlFor="p-sort" hint="lower shows first">
              Sort order
            </FieldLabel>
            <input
              id="p-sort"
              type="number"
              min={0}
              max={100000}
              className="field-luxe mt-2"
              {...register('sortOrder', { valueAsNumber: true })}
            />
            <FieldError message={errors.sortOrder?.message} />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="p-tech">Tech stack</FieldLabel>
          <Controller
            control={control}
            name="techStack"
            render={({ field, fieldState }) => (
              <TagInput
                id="p-tech"
                value={field.value ?? []}
                onChange={field.onChange}
                suggestions={meta.data?.tech ?? []}
                invalid={Boolean(fieldState.error)}
              />
            )}
          />
          <FieldError message={errors.techStack?.message ?? errors.techStack?.root?.message} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="p-live">Live URL</FieldLabel>
            <input
              id="p-live"
              type="url"
              inputMode="url"
              placeholder="https://"
              className="field-luxe mt-2"
              aria-invalid={Boolean(errors.liveUrl)}
              {...register('liveUrl')}
            />
            <FieldError message={errors.liveUrl?.message} />
          </div>
          <div>
            <FieldLabel htmlFor="p-repo">Repository URL</FieldLabel>
            <input
              id="p-repo"
              type="url"
              inputMode="url"
              placeholder="https://"
              className="field-luxe mt-2"
              aria-invalid={Boolean(errors.repoUrl)}
              {...register('repoUrl')}
            />
            <FieldError message={errors.repoUrl?.message} />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="p-image">Image</FieldLabel>
          <Controller
            control={control}
            name="imagePath"
            render={({ field }) => (
              <ImageUploader
                previewUrl={field.value ? previewUrl : null}
                onUploaded={(path, publicUrl) => {
                  field.onChange(path);
                  setPreviewUrl(publicUrl);
                }}
                onRemove={() => {
                  field.onChange(null);
                  setPreviewUrl(null);
                }}
              />
            )}
          />
          <FieldError message={errors.imagePath?.message} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Toggle
                id="p-status"
                label={field.value === 'published' ? 'Published' : 'Draft'}
                description="Visible on the public site"
                checked={field.value === 'published'}
                onChange={(checked) => field.onChange(checked ? 'published' : 'draft')}
              />
            )}
          />
          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <Toggle
                id="p-featured"
                label="Featured"
                description="Shown in Selected Work"
                checked={Boolean(field.value)}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </form>
    </Drawer>
  );
}

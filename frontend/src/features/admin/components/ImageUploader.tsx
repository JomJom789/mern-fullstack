import { ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useRef, useState, type DragEvent } from 'react';
import { errorMessage } from '../../../lib/api';
import { cn } from '../../../lib/utils';
import { compressImage, uploadProjectImage } from '../upload';

interface ImageUploaderProps {
  /** Public URL of the current image, if any. */
  previewUrl: string | null;
  onUploaded: (path: string, publicUrl: string) => void;
  onRemove: () => void;
}

type Phase =
  | { kind: 'idle' }
  | { kind: 'compressing' }
  | { kind: 'uploading'; progress: number }
  | { kind: 'error'; message: string };

export function ImageUploader({ previewUrl, onUploaded, onRemove }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const [dragging, setDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Cancel an in-flight upload only when the uploader unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Release the previous object URL whenever the local preview changes (and on unmount).
  useEffect(
    () => () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    },
    [localPreview],
  );

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      setPhase({ kind: 'compressing' });
      const image = await compressImage(file);
      const objectUrl = URL.createObjectURL(image.blob);
      setLocalPreview(objectUrl);
      setPhase({ kind: 'uploading', progress: 0 });
      const result = await uploadProjectImage(
        image,
        (progress) => setPhase({ kind: 'uploading', progress }),
        controller.signal,
      );
      onUploaded(result.path, result.publicUrl);
      setPhase({ kind: 'idle' });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setLocalPreview(null);
      setPhase({ kind: 'error', message: errorMessage(error) });
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void handleFile(event.dataTransfer.files[0]);
  };

  const busy = phase.kind === 'compressing' || phase.kind === 'uploading';
  const shown = localPreview ?? previewUrl;

  return (
    <div className="mt-2 space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors',
          dragging ? 'border-gold bg-gold/5' : 'border-smoke bg-graphite/50',
        )}
      >
        {shown ? (
          <img
            src={shown}
            alt="Project image preview"
            className="absolute inset-0 size-full object-cover object-top"
          />
        ) : null}
        <div
          className={cn(
            'relative z-10 flex flex-col items-center gap-3 p-6 text-center',
            shown && 'rounded-xl bg-ink/75 backdrop-blur',
          )}
        >
          {busy ? (
            <>
              <Loader2 className="size-6 animate-spin text-gold" aria-hidden="true" />
              <p className="text-sm text-ivory">
                {phase.kind === 'compressing'
                  ? 'Optimising image…'
                  : `Uploading… ${Math.round((phase.kind === 'uploading' ? phase.progress : 0) * 100)}%`}
              </p>
              {phase.kind === 'uploading' ? (
                <div
                  className="h-1 w-48 overflow-hidden rounded-full bg-smoke"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(phase.progress * 100)}
                >
                  <div
                    className="h-full origin-left bg-gold transition-transform"
                    style={{ transform: `scaleX(${phase.progress})` }}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <>
              {shown ? (
                <ImagePlus className="size-6 text-gold" aria-hidden="true" />
              ) : (
                <UploadCloud className="size-7 text-gold" aria-hidden="true" />
              )}
              <p className="text-sm text-ivory">Drag an image here, or</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full border border-gold/40 px-4 py-1.5 text-xs font-semibold text-gold hover:bg-gold hover:text-ink"
              >
                {shown ? 'Replace image' : 'Choose a file'}
              </button>
              <p className="text-[0.7rem] text-stone">Converted to WebP, max 1920px · up to 5 MB</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>
      {phase.kind === 'error' ? (
        <p className="text-xs text-danger" role="alert">
          {phase.message}
        </p>
      ) : null}
      {shown && !busy ? (
        <button
          type="button"
          onClick={() => {
            setLocalPreview(null);
            onRemove();
          }}
          className="inline-flex items-center gap-2 text-xs text-stone hover:text-danger"
        >
          <Trash2 className="size-3.5" aria-hidden="true" /> Remove image
        </button>
      ) : null}
    </div>
  );
}

import { SAFE_TAG_REGEX } from '@jomel/shared';
import { X } from 'lucide-react';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../../lib/utils';

export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold tracking-wider text-stone uppercase"
      >
        {children}
      </label>
      {hint ? <span className="text-[0.7rem] text-stone-dark">{hint}</span> : null}
    </div>
  );
}

export function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-danger" role="alert">
      {message}
    </p>
  );
}

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function Toggle({ id, checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-smoke px-4 py-3">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-ivory">
          {label}
        </label>
        {description ? <p className="text-xs text-stone">{description}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300',
          checked ? 'border-gold bg-gold' : 'border-smoke bg-graphite',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-4.5 rounded-full transition-transform duration-300',
            checked ? 'translate-x-5 bg-ink' : 'translate-x-0 bg-stone',
          )}
        />
      </button>
    </div>
  );
}

interface TagInputProps {
  id: string;
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  max?: number;
  invalid?: boolean;
}

/** Enter or comma adds a tag; Backspace on an empty input removes the last one. */
export function TagInput({
  id,
  value,
  onChange,
  suggestions = [],
  max = 30,
  invalid,
}: TagInputProps) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  const add = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (!SAFE_TAG_REGEX.test(tag)) {
      setError('Letters, numbers, spaces and . + # - _ only (max 40)');
      return;
    }
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setDraft('');
      return;
    }
    if (value.length >= max) {
      setError(`Up to ${max} technologies`);
      return;
    }
    onChange([...value, tag]);
    setDraft('');
    setError(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      add(draft);
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const listId = `${id}-suggestions`;
  return (
    <div>
      <div
        className={cn(
          'mt-2 flex flex-wrap items-center gap-1.5 rounded-lg border bg-charcoal/70 p-2 focus-within:border-gold/70',
          invalid || error ? 'border-danger/60' : 'border-smoke',
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 py-1 pr-1 pl-2.5 text-xs text-gold-light"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="rounded-full p-0.5 hover:bg-gold/20"
              aria-label={`Remove ${tag}`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          list={listId}
          onChange={(event) => {
            setDraft(event.target.value.slice(0, 40));
            setError(null);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          placeholder={value.length === 0 ? 'Type and press Enter…' : ''}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm text-ivory placeholder:text-stone-dark focus:outline-none"
        />
        <datalist id={listId}>
          {suggestions
            .filter((s) => !value.includes(s))
            .map((s) => (
              <option key={s} value={s} />
            ))}
        </datalist>
      </div>
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </div>
  );
}

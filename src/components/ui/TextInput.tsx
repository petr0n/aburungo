import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'id'
> & {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
  className?: string;
};

export function TextInput(props: TextInputProps) {
  const {
    label,
    hint,
    error,
    id,
    className,
    disabled,
    'aria-describedby': describedByProp,
    ...rest
  } = props;

  const autoId = useId();
  const inputId = id ?? `text-input-${autoId}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy =
    [
      error !== undefined ? errorId : undefined,
      error === undefined && hint !== undefined ? hintId : undefined,
      describedByProp,
    ]
      .filter((v): v is string => typeof v === 'string' && v !== '')
      .join(' ') || undefined;

  const inputClasses = [
    'min-h-[44px] w-full rounded-md border bg-bg px-3 py-2',
    'text-body text-fg placeholder:text-fg-faint',
    'focus:ring-brand-500 focus:outline-none focus:ring-2',
    'disabled:opacity-50',
    error !== undefined
      ? 'border-error-500'
      : 'border-border-strong focus:border-fg-subtle',
    className ?? '',
  ]
    .filter((c) => c !== '')
    .join(' ');

  return (
    <div className='flex flex-col gap-1'>
      <label
        htmlFor={inputId}
        className='text-body-sm font-medium text-fg-muted'
      >
        {label}
      </label>
      <input
        id={inputId}
        disabled={disabled}
        aria-invalid={error !== undefined ? true : undefined}
        aria-describedby={describedBy}
        className={inputClasses}
        {...rest}
      />
      {error !== undefined ? (
        <p id={errorId} role='alert' className='text-body-sm text-error-fg'>
          {error}
        </p>
      ) : hint !== undefined ? (
        <p id={hintId} className='text-body-sm text-fg-subtle'>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

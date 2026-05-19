import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'sm';

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-fg text-fg-inverse active:bg-fg-muted disabled:opacity-40',
  secondary:
    'border border-border-strong bg-bg text-fg-muted active:bg-surface-2 disabled:opacity-50',
  ghost: 'bg-transparent text-fg-muted active:bg-surface-2 disabled:opacity-50',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'min-h-[44px] h-12 px-5 text-body',
  sm: 'min-h-[44px] h-11 px-4 text-body-sm',
};

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled,
    children,
    className,
    type,
    ...rest
  } = props;

  const classes = [
    'inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium transition-colors',
    'focus-visible:ring-brand-500 focus-visible:outline-none focus-visible:ring-2',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    className ?? '',
  ]
    .filter((c) => c !== '')
    .join(' ');

  return (
    <button
      type={type ?? 'button'}
      disabled={disabled === true || loading}
      className={classes}
      {...rest}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}

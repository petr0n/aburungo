import type { HTMLAttributes, ReactNode } from 'react';

type BadgeVariant = 'neutral' | 'success' | 'error';

type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'className'> & {
  variant?: BadgeVariant;
  children: ReactNode;
  emphasis?: boolean;
  className?: string;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-2 text-fg-subtle',
  success: 'bg-success-bg text-success-fg',
  error: 'bg-error-bg text-error-fg',
};

export function Badge(props: BadgeProps) {
  const {
    variant = 'neutral',
    emphasis = false,
    children,
    className,
    ...rest
  } = props;

  const classes = [
    'inline-flex items-center rounded-md px-2 py-0.5 font-medium',
    emphasis ? 'text-caption uppercase tracking-wider' : 'text-body-sm',
    VARIANT_CLASSES[variant],
    className ?? '',
  ]
    .filter((c) => c !== '')
    .join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}

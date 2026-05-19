import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = Omit<HTMLAttributes<HTMLDivElement>, 'className'> & {
  children: ReactNode;
  compact?: boolean;
  className?: string;
};

export function Card(props: CardProps) {
  const { children, compact = false, className, ...rest } = props;

  const classes = [
    'rounded-2xl border border-border bg-bg shadow-card',
    compact ? 'p-4' : 'p-6',
    className ?? '',
  ]
    .filter((c) => c !== '')
    .join(' ');

  return (
    <article className={classes} {...rest}>
      {children}
    </article>
  );
}

type SlotProps = { children: ReactNode; className?: string };

export function CardHeader({ children, className }: SlotProps) {
  return (
    <header
      className={[
        'flex items-start justify-between gap-4',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </header>
  );
}

export function CardBody({ children, className }: SlotProps) {
  return (
    <div className={['flex flex-col gap-3', className ?? ''].join(' ')}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: SlotProps) {
  return (
    <footer className={['flex items-center gap-3', className ?? ''].join(' ')}>
      {children}
    </footer>
  );
}

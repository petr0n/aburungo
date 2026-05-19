import type { SVGProps } from 'react';

export type IconBaseProps = SVGProps<SVGSVGElement>;

function withDefaults(props: IconBaseProps): IconBaseProps {
  return {
    viewBox: '0 0 24 24',
    'aria-hidden': true,
    ...props,
  };
}

export function SpeakerIcon(props: IconBaseProps) {
  return (
    <svg {...withDefaults(props)}>
      <path
        fill='currentColor'
        d='M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06A9 9 0 0 0 14 3.23z'
      />
    </svg>
  );
}

export function MicIcon(props: IconBaseProps) {
  return (
    <svg {...withDefaults(props)}>
      <path
        fill='currentColor'
        d='M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z'
      />
    </svg>
  );
}

export function BackspaceIcon(props: IconBaseProps) {
  return (
    <svg {...withDefaults(props)}>
      <path
        fill='currentColor'
        d='M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z'
      />
    </svg>
  );
}

export function SpinnerIcon(props: IconBaseProps) {
  return (
    <svg {...withDefaults(props)} fill='none'>
      <circle
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
        opacity='0.25'
      />
      <path
        fill='currentColor'
        opacity='0.75'
        d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
      />
    </svg>
  );
}

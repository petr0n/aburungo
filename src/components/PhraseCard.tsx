import type { ReactNode } from 'react';
import { Badge } from './ui/Badge';
import { Card, CardBody, CardHeader } from './ui/Card';

type PhraseCardProps = {
  japanese: string;
  reading: string;
  english?: string;
  scenario?: string;
  audioSlot?: ReactNode;
  footer?: ReactNode;
  notes?: string;
};

export function PhraseCard(props: PhraseCardProps) {
  const { japanese, reading, english, scenario, audioSlot, footer, notes } =
    props;

  return (
    <Card>
      <div className='flex flex-col gap-6'>
        <CardHeader>
          {scenario !== undefined ? (
            <Badge emphasis>{scenario}</Badge>
          ) : (
            <span aria-hidden='true' />
          )}
          {audioSlot ?? null}
        </CardHeader>

        <CardBody className='items-center text-center'>
          <p
            lang='ja'
            className='font-jp text-jp-display text-fg sm:text-jp-display-lg'
          >
            {japanese}
          </p>
          <p lang='ja' className='font-jp text-jp text-fg-muted'>
            {reading}
          </p>
        </CardBody>

        {english !== undefined ? (
          <>
            <hr className='border-border' />
            <div className='flex flex-col items-center gap-2 text-center'>
              <p className='text-body-lg text-fg'>{english}</p>
              {notes !== undefined ? (
                <p className='text-body-sm text-fg-subtle'>{notes}</p>
              ) : null}
            </div>
          </>
        ) : null}

        {footer ?? null}
      </div>
    </Card>
  );
}

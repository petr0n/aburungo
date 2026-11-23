type Props = { text: string; link: string; licence: string; licenceUrl: string };

const LINK = "inline-flex min-h-[44px] items-center underline";

/** A source and its licence, each its own 44px touch target. */
export function SourceCredit({ text, link, licence, licenceUrl }: Props) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 text-caption text-fg-subtle">
      <a href={link} className={LINK}>{text}</a>
      <span aria-hidden="true">·</span>
      <a href={licenceUrl} className={LINK}>{licence}</a>
    </p>
  );
}

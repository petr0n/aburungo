import { Button } from "aburungo-design-system";

type Props = {
  /** "guest": practised here signed out. "legacy": saved before accounts were kept apart. */
  source: "guest" | "legacy";
  signedIn: boolean;
  onBring: () => void;
  onKeep: () => void;
};

/**
 * The one explicit choice DR-036 requires before progress crosses owners.
 * Nothing moves unless the learner picks "Bring it in".
 *
 * Copy is provisional, pending the owner's review.
 */
export function AdoptionPrompt({ source, signedIn, onBring, onKeep }: Props) {
  const guest = source === "guest";
  return (
    <div className="flex w-full flex-col gap-6 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-heading font-semibold text-fg">
          {guest ? "Progress from before you signed in" : "Older progress on this device"}
        </p>
        {guest ? (
          <p className="text-body text-fg-subtle">
            You practised on this device without an account. You can bring that progress into this account,
            or keep it separate for when you use the app signed out.
          </p>
        ) : (
          <p className="text-body text-fg-subtle">
            This device has progress saved before each account kept its own. It may include more than one
            person's work, so bring it in only if it is yours.{" "}
            {signedIn ? "It will be added to this account." : "It will be added to your progress without an account."}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Button fullWidth onClick={onBring}>
          Bring it in
        </Button>
        <Button fullWidth variant="secondary" onClick={onKeep}>
          {guest ? "Keep separate" : "Leave it"}
        </Button>
      </div>
    </div>
  );
}

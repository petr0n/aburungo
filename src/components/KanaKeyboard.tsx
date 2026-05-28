import { useState } from "react";
import { KanaKeyboard as KanaKeyboardDisplay } from "aburungo-design-system";
import type { KanaScript, KanaSection } from "aburungo-design-system";

type Props = {
  onKey: (kana: string) => void;
  onBackspace: () => void;
};

export function KanaKeyboard({ onKey, onBackspace }: Props) {
  const [script, setScript] = useState<KanaScript>("hiragana");
  const [section, setSection] = useState<KanaSection>("basic");

  return (
    <KanaKeyboardDisplay
      script={script}
      section={section}
      onScriptChange={setScript}
      onSectionChange={setSection}
      onKey={onKey}
      onBackspace={onBackspace}
    />
  );
}

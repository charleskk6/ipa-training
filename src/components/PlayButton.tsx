import { useState } from "react";
import type { IPASound } from "../types";
import { playPhoneme, playWord } from "../lib/audio";
import { exampleWord } from "../lib/audioPaths";
import { categoryStyles, cx } from "../lib/ui";

type Mode = "phoneme" | "word";

type Props = {
  sound: IPASound;
  /** "phoneme" plays the isolated sound; "word" plays the example word. */
  mode?: Mode;
  label?: string;
  className?: string;
};

/**
 * Play button for a sound. The phoneme button is solid (filled); the word
 * button is outlined, so the two are easy to tell apart at a glance.
 */
export default function PlayButton({ sound, mode = "phoneme", label, className }: Props) {
  const [playing, setPlaying] = useState(false);
  const styles = categoryStyles[sound.category];

  const text =
    label ?? (mode === "phoneme" ? `Sound /${sound.symbol}/` : `Word: ${exampleWord(sound)}`);

  const handlePlay = async () => {
    setPlaying(true);
    try {
      await (mode === "phoneme" ? playPhoneme(sound) : playWord(sound));
    } finally {
      // Keep the visual cue brief; audio length is unknown for the fallback.
      setTimeout(() => setPlaying(false), 700);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      className={cx(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2",
        styles.ring,
        mode === "phoneme"
          ? styles.solid
          : cx("border-2 bg-white", styles.card, styles.accentText),
        className
      )}
      aria-label={`${text}`}
    >
      <span aria-hidden="true">{playing ? "🔊" : "▶"}</span>
      {text}
    </button>
  );
}

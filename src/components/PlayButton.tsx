import { useState } from "react";
import type { IPASound } from "../types";
import { playModelSound } from "../lib/audio";
import { categoryStyles, cx } from "../lib/ui";

type Props = {
  sound: IPASound;
  className?: string;
  label?: string;
};

/** "Play model sound" button with a tiny playing state. */
export default function PlayButton({ sound, className, label = "Play model sound" }: Props) {
  const [playing, setPlaying] = useState(false);
  const styles = categoryStyles[sound.category];

  const handlePlay = async () => {
    setPlaying(true);
    try {
      await playModelSound(sound);
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
        styles.solid,
        styles.ring,
        className
      )}
      aria-label={`${label} for /${sound.symbol}/`}
    >
      <span aria-hidden="true">{playing ? "🔊" : "▶"}</span>
      {label}
    </button>
  );
}

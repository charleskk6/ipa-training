import type { SoundCategory } from "../types";

/** Tailwind class bundles keyed by category, for consistent colour coding. */
export const categoryStyles: Record<
  SoundCategory,
  { card: string; chip: string; accentText: string; ring: string; solid: string }
> = {
  vowel: {
    card: "bg-vowel-50 border-vowel-200 hover:border-vowel-500",
    chip: "bg-vowel-100 text-vowel-700",
    accentText: "text-vowel-700",
    ring: "ring-vowel-500",
    solid: "bg-vowel-600 hover:bg-vowel-700 text-white",
  },
  consonant: {
    card: "bg-consonant-50 border-consonant-200 hover:border-consonant-500",
    chip: "bg-consonant-100 text-consonant-700",
    accentText: "text-consonant-700",
    ring: "ring-consonant-500",
    solid: "bg-consonant-600 hover:bg-consonant-700 text-white",
  },
};

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

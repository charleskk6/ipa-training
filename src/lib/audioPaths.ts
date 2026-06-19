import type { IPASound } from "../types";

/**
 * Helpers that map a sound to its audio file paths. Kept in one place so the
 * generator script (scripts/generate-audio.mjs) and the runtime player agree on
 * exactly where files live.
 *
 * - The isolated phoneme lives at `sound.audioPath` (e.g. /audio/ipa/iː.mp3).
 * - The example word is derived from the first example, so the dataset stays
 *   the single source of truth and the two never drift apart.
 */

/** Turn an example word into a safe, lowercase file slug, e.g. "Bath" -> "bath". */
export function wordSlug(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** The example word that the "word" button plays for a sound. */
export function exampleWord(sound: IPASound): string {
  return sound.examples[0] ?? sound.name;
}

/** Path to the full example-word clip for a sound. */
export function wordAudioPath(sound: IPASound): string {
  return `/audio/words/${wordSlug(exampleWord(sound))}.mp3`;
}

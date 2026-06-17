import type { ComparisonFeedback } from "../types";
import { SOUND_BY_SYMBOL } from "../data/ipaData";

/**
 * Pronunciation comparison.
 *
 * For the MVP this returns *mock* feedback so the rest of the UI can be built
 * and tested without any speech model. The signature and return shape are
 * deliberately designed to survive being swapped for a real implementation
 * later — for example one backed by:
 *
 *   - OpenAI Whisper / a speech-to-text endpoint
 *   - a dedicated phoneme-recognition API
 *   - a custom audio-similarity model
 *
 * To go live, replace the body of `comparePronunciation` with an async call to
 * your service and map its response onto `ComparisonFeedback`. Keep the inputs
 * (the recorded audio blob + the target symbol) and the output shape stable and
 * no UI changes will be required.
 */

export type CompareInput = {
  /** The user's recorded audio. Optional so the UI can request mock-only feedback. */
  recording?: Blob | null;
  /** The IPA symbol the user was trying to produce. */
  targetSymbol: string;
};

/**
 * A small deterministic-ish hash so repeated attempts at the same sound feel
 * coherent rather than purely random, while still varying between sounds.
 */
function seededScore(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) % 1000;
  }
  // Spread mock scores across a believable 55–95 range.
  return 55 + (h % 41);
}

/**
 * Returns mock pronunciation feedback for a target sound.
 *
 * @example
 * const fb = await comparePronunciation({ targetSymbol: "ɪ", recording });
 * // => { accuracy: 72, likelyConfusedWith: "iː", tip: "You may be ..." }
 */
export async function comparePronunciation(
  input: CompareInput
): Promise<ComparisonFeedback> {
  const { targetSymbol, recording } = input;
  const sound = SOUND_BY_SYMBOL[targetSymbol];

  // Simulate a little processing latency so the UI's loading state is exercised.
  await new Promise((r) => setTimeout(r, 450));

  // Mix the recording size into the seed (if present) so different takes differ.
  const sizeSeed = recording ? String(recording.size % 97) : "";
  const accuracy = Math.min(
    98,
    Math.max(40, seededScore(targetSymbol + sizeSeed))
  );

  const confusion = sound?.commonConfusions?.[0] ?? null;

  let tip: string;
  if (accuracy >= 85) {
    tip = `Great work — that was a clear /${targetSymbol}/. Keep it consistent.`;
  } else if (confusion) {
    tip = buildConfusionTip(targetSymbol, confusion);
  } else {
    tip = `Listen to the model again and match the length and mouth shape of /${targetSymbol}/.`;
  }

  return {
    accuracy,
    likelyConfusedWith: accuracy >= 85 ? null : confusion,
    tip,
  };
}

/** Hand-written tips for the most common confusions, with a generic fallback. */
function buildConfusionTip(target: string, confusion: string): string {
  const key = `${target}|${confusion}`;
  const tips: Record<string, string> = {
    "ɪ|iː":
      "You may be pronouncing /ɪ/ too close to /iː/. Try making the sound shorter and more relaxed.",
    "iː|ɪ":
      "You may be pronouncing /iː/ too close to /ɪ/. Make it longer and add a slight smile.",
    "æ|e":
      "Your /æ/ sounds close to /e/. Drop your jaw further and open your mouth more.",
    "e|æ":
      "Your /e/ is drifting towards /æ/. Close your mouth slightly and keep the tongue higher.",
    "θ|s":
      "Your /θ/ sounds like /s/. Push your tongue tip between your teeth and blow gently.",
    "ð|d":
      "Your /ð/ sounds like /d/. Keep the tongue between your teeth and let it buzz, don't tap.",
    "ʌ|ɑː":
      "Your /ʌ/ is too long, like /ɑː/. Keep it short, central and relaxed.",
    "v|w":
      "Your /v/ sounds like /w/. Touch your top teeth to your lower lip instead of rounding your lips.",
  };
  return (
    tips[key] ??
    `You may be pronouncing /${target}/ too close to /${confusion}/. Listen to both models and exaggerate the difference.`
  );
}

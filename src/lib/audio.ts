import type { IPASound } from "../types";

/**
 * Plays the model sound for an IPA entry.
 *
 * MVP behaviour: try to play the placeholder audio file at `sound.audioPath`.
 * Because those files don't ship yet, we fall back to the browser's
 * SpeechSynthesis voice (reading an example word) so the button still does
 * something useful. Once real clips are dropped into `public/audio/ipa/`, the
 * file will load and the fallback won't be reached.
 */
export async function playModelSound(sound: IPASound): Promise<void> {
  const ok = await tryPlayFile(sound.audioPath);
  if (!ok) speakFallback(sound);
}

function tryPlayFile(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio(src);
    let settled = false;
    const done = (result: boolean) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };
    audio.addEventListener("playing", () => done(true), { once: true });
    audio.addEventListener("error", () => done(false), { once: true });
    audio.play().then(
      () => {
        /* 'playing' will resolve */
      },
      () => done(false)
    );
    // Safety timeout in case neither event fires.
    setTimeout(() => done(false), 1200);
  });
}

function speakFallback(sound: IPASound): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const word = sound.examples[0] ?? sound.name;
  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = "en-GB";
  utter.rate = 0.85;
  // Prefer a British English voice when one is installed.
  const voices = window.speechSynthesis.getVoices();
  const gb = voices.find((v) => v.lang === "en-GB");
  if (gb) utter.voice = gb;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

/** Speak an arbitrary word (used by minimal-pair listening exercises). */
export function speakWord(word: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = "en-GB";
  utter.rate = 0.9;
  const gb = window.speechSynthesis.getVoices().find((v) => v.lang === "en-GB");
  if (gb) utter.voice = gb;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

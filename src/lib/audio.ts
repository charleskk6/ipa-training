import type { IPASound } from "../types";
import { exampleWord, wordAudioPath } from "./audioPaths";

/**
 * Audio playback for IPA entries. There are two distinct models:
 *
 *  - playPhoneme: the isolated sound on its own (e.g. just /ɪ/).
 *  - playWord:    the first example word read in full (e.g. "ship").
 *
 * Both try a generated MP3 first (see scripts/generate-audio.mjs); if the file
 * is missing or can't play, they fall back to the browser's SpeechSynthesis
 * voice so the button still does something useful. (For the phoneme there is no
 * good speech fallback, so it reads the example word as a last resort.)
 */

/** Play the isolated phoneme for a sound (the "sound itself"). */
export async function playPhoneme(sound: IPASound): Promise<void> {
  const ok = await tryPlayFile(sound.audioPath);
  if (!ok) speak(exampleWord(sound));
}

/** Play the full example word for a sound. */
export async function playWord(sound: IPASound): Promise<void> {
  const ok = await tryPlayFile(wordAudioPath(sound));
  if (!ok) speak(exampleWord(sound));
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

/** Speak an arbitrary word with a British English voice when available. */
export function speakWord(word: string): void {
  speak(word, 0.9);
}

function speak(text: string, rate = 0.85): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-GB";
  utter.rate = rate;
  const gb = window.speechSynthesis.getVoices().find((v) => v.lang === "en-GB");
  if (gb) utter.voice = gb;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

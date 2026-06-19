# IPA Trainer

A responsive, browser-only web app for **learning, practising and memorising
English IPA sounds**, with a British English (RP) focus. No backend required.

Built with **React + TypeScript + Vite + Tailwind CSS**, using the **Web Audio /
MediaRecorder** APIs for in-browser recording.

## Features

- **Learn** — Browse all vowels and consonants in a colour-coded grid (vowels
  warm, consonants cool). Each sound shows a large IPA symbol, a beginner-friendly
  description, mouth/tongue/lip tips, British English example words, a
  "Play model sound" button and tappable "common confusion" sounds.
- **Practice** — Pick a sound, hear the model, record yourself with a live timer,
  play your take back, run a self-check checklist, and get instant feedback.
  Results are saved to `localStorage`.
- **Flashcards** — Symbol on the front, words + tips on the back. Rate each card
  Easy / Medium / Hard; weaker sounds resurface more often (weighted spaced
  repetition).
- **Minimal Pairs** — Drill confusing contrasts (`/ɪ/` vs `/iː/`, `/æ/` vs `/e/`,
  `/ʌ/` vs `/ɑː/`, `/θ/` vs `/s/`, `/ð/` vs `/d/`, `/v/` vs `/w/`) with a
  listen-and-choose quiz or record-yourself mode.
- **Progress** — Sounds practised today, weak sounds, average mock accuracy,
  day streak, and vowel/consonant coverage bars.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
  data/ipaData.ts          # The IPA dataset (vowels, consonants, minimal pairs)
  types.ts                 # Shared types (IPASound, progress, feedback…)
  lib/
    storage.ts             # localStorage wrapper: progress, results, streak
    comparePronunciation.ts# Mock pronunciation feedback (swap for a real model)
    audio.ts               # Model-sound playback + SpeechSynthesis fallback
    ui.ts                  # Shared Tailwind class bundles + helpers
  hooks/useRecorder.ts     # MediaRecorder hook (permission, timer, playback)
  components/              # IPACard, SoundDetail, RecorderPanel, Nav, PlayButton
  views/                  # Learn, Practice, Flashcards, MinimalPairs, Progress
```

## Audio

Every sound has **two** model clips, played by two separate buttons:

- **Sound** — the isolated phoneme on its own (e.g. just /ɪ/), in
  `public/audio/ipa/<symbol>.mp3`.
- **Word** — the first example word read in full (e.g. "ship"), in
  `public/audio/words/<word>.mp3`.

All clips are generated offline with the espeak-ng WASM build (`text2wav`) using
a British English voice and encoded to MP3 with a pure-JS LAME encoder — no
network or paid service needed. Isolated sounds use espeak-ng's Kirshenbaum
phoneme notation; words are synthesised from the dataset's first example.

Regenerate them at any time with:

```bash
npm run generate:audio
```

To use higher-quality human recordings instead, replace the files in
`public/audio/ipa/` and `public/audio/words/` with your own (keeping the same
file names). If a clip is ever missing, the app falls back to the browser's
British English speech voice.

## Plugging in real pronunciation scoring

`src/lib/comparePronunciation.ts` exports `comparePronunciation()`, which
currently returns **mock** feedback (`accuracy`, `likelyConfusedWith`, `tip`).
It's deliberately async and takes the recorded audio blob + target symbol, so
you can replace the body with a call to OpenAI Whisper / a speech-to-text
service, a phoneme-recognition API, or a custom audio-similarity model — without
touching the UI.

## Notes

- Everything runs locally; recordings and progress never leave the device.
- Microphone access requires `https://` (or `localhost`) and user permission.

# Model sound audio

This folder holds the **isolated phoneme** clips played by the "Sound" button
(the IPA sound on its own). Full **example-word** clips played by the "Word"
button live alongside it in `../words/`.

Files are referenced by IPA symbol, e.g.:

```
/audio/ipa/iː.mp3     <- isolated /iː/
/audio/ipa/θ.mp3      <- isolated /θ/
/audio/words/ship.mp3 <- the word "ship"
```

The phoneme path for each sound comes from the `audioPath` field in
`src/data/ipaData.ts`; the word path is derived from the first example word by
`src/lib/audioPaths.ts`.

These files are generated — see `scripts/generate-audio.mjs` and run
`npm run generate:audio` to (re)create them. To use real human recordings,
replace the files here (and in `../words/`) with the same file names; no code
changes are needed. If a file is missing, the player falls back to the
browser's SpeechSynthesis voice.

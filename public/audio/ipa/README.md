# Model sound audio

This folder holds the model pronunciation clips played by the **Learn** and
**Practice** modes.

The app references files by IPA symbol, e.g.:

```
/audio/ipa/iː.mp3
/audio/ipa/θ.mp3
```

The exact path for each sound comes from the `audioPath` field in
`src/data/ipaData.ts`. To wire up real audio:

1. Record or source one clip per sound (British English / RP).
2. Save each clip here using the file name that matches its `audioPath`.
3. No code changes are needed — the player picks them up automatically.

Until real files are added, the player falls back to the browser's
SpeechSynthesis voice (when available) so the app remains usable.

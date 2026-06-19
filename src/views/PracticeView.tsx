import { useState } from "react";
import { ALL_SOUNDS, VOWELS, CONSONANTS, SOUND_BY_SYMBOL } from "../data/ipaData";
import type { ComparisonFeedback } from "../types";
import SoundButtons from "../components/SoundButtons";
import RecorderPanel from "../components/RecorderPanel";
import { comparePronunciation } from "../lib/comparePronunciation";
import { addResult, recordAttempt, touchStreak } from "../lib/storage";
import { categoryStyles, cx } from "../lib/ui";

type Checklist = {
  mouthShape: boolean;
  tonguePosition: boolean;
  soundedClose: boolean;
};

const EMPTY_CHECK: Checklist = {
  mouthShape: false,
  tonguePosition: false,
  soundedClose: false,
};

const CHECK_ITEMS: Array<{ key: keyof Checklist; label: string }> = [
  { key: "mouthShape", label: "Was the mouth shape correct?" },
  { key: "tonguePosition", label: "Was the tongue position correct?" },
  { key: "soundedClose", label: "Did it sound close to the model?" },
];

export default function PracticeView() {
  const [symbol, setSymbol] = useState(ALL_SOUNDS[0].symbol);
  const [recording, setRecording] = useState<Blob | null>(null);
  const [check, setCheck] = useState<Checklist>(EMPTY_CHECK);
  const [feedback, setFeedback] = useState<ComparisonFeedback | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [saved, setSaved] = useState(false);

  const sound = SOUND_BY_SYMBOL[symbol];
  const styles = categoryStyles[sound.category];

  const reset = () => {
    setRecording(null);
    setCheck(EMPTY_CHECK);
    setFeedback(null);
    setSaved(false);
  };

  const handleSelect = (next: string) => {
    setSymbol(next);
    reset();
  };

  const getFeedback = async () => {
    setAnalysing(true);
    try {
      const fb = await comparePronunciation({ targetSymbol: symbol, recording });
      setFeedback(fb);
    } finally {
      setAnalysing(false);
    }
  };

  const saveResult = () => {
    recordAttempt(symbol, feedback?.accuracy);
    addResult({
      symbol,
      date: new Date().toISOString(),
      selfCheck: check,
      accuracy: feedback?.accuracy,
    });
    touchStreak();
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Practice</h2>
        <p className="mt-1 text-sm text-slate-600">
          Pick a sound, listen to the model, record yourself, then self-check and
          get instant feedback.
        </p>
      </header>

      {/* Sound picker */}
      <div className="space-y-3">
        <SoundPickerRow
          title="Vowels"
          dotClass="bg-vowel-500"
          symbols={VOWELS.map((s) => s.symbol)}
          active={symbol}
          onPick={handleSelect}
        />
        <SoundPickerRow
          title="Consonants"
          dotClass="bg-consonant-500"
          symbols={CONSONANTS.map((s) => s.symbol)}
          active={symbol}
          onPick={handleSelect}
        />
      </div>

      {/* Current sound */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={cx(
                "ipa flex h-20 w-20 items-center justify-center rounded-2xl border-2 text-3xl font-bold text-slate-900",
                styles.card
              )}
            >
              /{sound.symbol}/
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{sound.name}</h3>
              <p className="max-w-md text-sm text-slate-600">{sound.mouthTip}</p>
            </div>
          </div>
          <SoundButtons sound={sound} />
        </div>

        <div className="mt-5">
          <RecorderPanel
            onRecorded={(blob) => {
              setRecording(blob);
              setSaved(false);
            }}
          />
        </div>

        {/* Self-check */}
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-slate-900">Self-check</legend>
          <div className="mt-2 space-y-2">
            {CHECK_ITEMS.map((item) => (
              <label
                key={item.key}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={check[item.key]}
                  onChange={(e) =>
                    setCheck((c) => ({ ...c, [item.key]: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={getFeedback}
            disabled={analysing}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {analysing ? "Analysing…" : "Get feedback"}
          </button>
          <button
            type="button"
            onClick={saveResult}
            disabled={saved}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {saved ? "Saved ✓" : "Save result"}
          </button>
          {!recording && (
            <span className="text-xs text-slate-400">
              Feedback works without a recording too (mock mode).
            </span>
          )}
        </div>

        {feedback && <FeedbackCard feedback={feedback} />}
      </div>
    </div>
  );
}

function SoundPickerRow({
  title,
  dotClass,
  symbols,
  active,
  onPick,
}: {
  title: string;
  dotClass: string;
  symbols: string[];
  active: string;
  onPick: (s: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span className={cx("h-2 w-2 rounded-full", dotClass)} aria-hidden="true" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {symbols.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className={cx(
              "ipa rounded-lg border px-2.5 py-1.5 text-sm font-semibold transition",
              s === active
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
            )}
          >
            /{s}/
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: ComparisonFeedback }) {
  const colour =
    feedback.accuracy >= 85
      ? "text-emerald-600"
      : feedback.accuracy >= 70
        ? "text-amber-600"
        : "text-rose-600";
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900">
          Mock pronunciation feedback
        </span>
        <span className={cx("text-2xl font-bold tabular-nums", colour)}>
          {feedback.accuracy}
          <span className="text-sm font-medium text-slate-400">/100</span>
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${feedback.accuracy}%` }}
        />
      </div>
      {feedback.likelyConfusedWith && (
        <p className="mt-3 text-sm text-slate-600">
          Likely confused with{" "}
          <span className="ipa font-semibold text-slate-900">
            /{feedback.likelyConfusedWith}/
          </span>
          .
        </p>
      )}
      <p className="mt-1 text-sm text-slate-700">{feedback.tip}</p>
      <p className="mt-3 text-[11px] text-slate-400">
        Scores are simulated for the MVP. Wire up{" "}
        <code className="rounded bg-slate-200 px-1">comparePronunciation()</code> to
        a real speech model to make them live.
      </p>
    </div>
  );
}

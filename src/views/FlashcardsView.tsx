import { useMemo, useState } from "react";
import { ALL_SOUNDS } from "../data/ipaData";
import type { Difficulty, IPASound } from "../types";
import { getProgressMap, recordDifficulty, touchStreak } from "../lib/storage";
import { categoryStyles, cx } from "../lib/ui";
import SoundButtons from "../components/SoundButtons";

/**
 * Pick the next card using weakness weights from storage so struggling sounds
 * resurface more often. Avoids immediately repeating the current card.
 */
function pickWeighted(exclude?: string): IPASound {
  const progress = getProgressMap();
  const pool = ALL_SOUNDS.filter((s) => s.symbol !== exclude);
  const weights = pool.map((s) => progress[s.symbol]?.weight ?? 1);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

const DIFFICULTIES: Array<{ key: Difficulty; label: string; cls: string }> = [
  { key: "easy", label: "Easy", cls: "bg-emerald-600 hover:bg-emerald-700" },
  { key: "medium", label: "Medium", cls: "bg-amber-500 hover:bg-amber-600" },
  { key: "hard", label: "Hard", cls: "bg-rose-600 hover:bg-rose-700" },
];

export default function FlashcardsView() {
  const [card, setCard] = useState<IPASound>(() => pickWeighted());
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  const styles = categoryStyles[card.category];

  // Recompute weak sounds for the helper strip whenever a rating is given.
  const weakSounds = useMemo(() => {
    const progress = getProgressMap();
    return Object.values(progress)
      .filter((p) => p.weight >= 2)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 6)
      .map((p) => p.symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewed]);

  const rate = (difficulty: Difficulty) => {
    recordDifficulty(card.symbol, difficulty);
    touchStreak();
    setReviewed((n) => n + 1);
    setFlipped(false);
    setCard((prev) => pickWeighted(prev.symbol));
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Flashcards</h2>
        <p className="mt-1 text-sm text-slate-600">
          See the symbol, recall the words and tips, then rate yourself. Sounds you
          mark <strong>Hard</strong> come back more often.
        </p>
      </header>

      <div className="mx-auto max-w-xl">
        {/* Card */}
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className={cx(
            "flex min-h-[18rem] w-full flex-col items-center justify-center rounded-2xl border-2 p-6 text-center shadow-sm transition",
            styles.card
          )}
          aria-label="Flip card"
        >
          {!flipped ? (
            <>
              <span className="ipa text-7xl font-bold text-slate-900">
                /{card.symbol}/
              </span>
              <span
                className={cx(
                  "mt-4 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
                  styles.chip
                )}
              >
                {card.category}
              </span>
              <span className="mt-4 text-xs text-slate-500">Tap to reveal</span>
            </>
          ) : (
            <div className="w-full">
              <h3 className="text-lg font-bold text-slate-900">{card.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{card.mouthTip}</p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {card.examples.map((w) => (
                  <li
                    key={w}
                    className="rounded-md bg-white/70 px-2.5 py-1 text-sm text-slate-700"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </button>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <SoundButtons sound={card} />
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {flipped ? "Show symbol" : "Show answer"}
          </button>
        </div>

        {/* Rating */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => rate(d.key)}
              className={cx(
                "rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition",
                d.cls
              )}
            >
              {d.label}
            </button>
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-slate-500">
          Reviewed this session: <strong>{reviewed}</strong>
        </p>

        {weakSounds.length > 0 && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Currently weak
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {weakSounds.map((s) => (
                <span
                  key={s}
                  className="ipa rounded-md bg-rose-50 px-2 py-0.5 text-sm font-semibold text-rose-700"
                >
                  /{s}/
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

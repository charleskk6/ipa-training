import { useState } from "react";
import { MINIMAL_PAIRS, SOUND_BY_SYMBOL } from "../data/ipaData";
import type { MinimalPair } from "../data/ipaData";
import { speakWord } from "../lib/audio";
import RecorderPanel from "../components/RecorderPanel";
import { cx } from "../lib/ui";

type Mode = "listen" | "record";

export default function MinimalPairsView() {
  const [pair, setPair] = useState<MinimalPair>(MINIMAL_PAIRS[0]);
  const [mode, setMode] = useState<Mode>("listen");

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Minimal pairs</h2>
        <p className="mt-1 text-sm text-slate-600">
          Train the contrasts that trip learners up. Listen and choose the word
          you hear, or record yourself saying both.
        </p>
      </header>

      {/* Pair selector */}
      <div className="flex flex-wrap gap-2">
        {MINIMAL_PAIRS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPair(p)}
            className={cx(
              "ipa rounded-lg border px-3 py-1.5 text-sm font-semibold transition",
              p.id === pair.id
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="ipa text-xl font-bold text-slate-900">{pair.label}</h3>
            <p className="mt-1 max-w-lg text-sm text-slate-600">{pair.tip}</p>
          </div>
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-sm">
            {(["listen", "record"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cx(
                  "rounded-md px-3 py-1.5 font-medium capitalize transition",
                  mode === m
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          {mode === "listen" ? (
            <ListenQuiz pair={pair} key={pair.id} />
          ) : (
            <RecordPractice pair={pair} key={pair.id + "-rec"} />
          )}
        </div>
      </div>
    </div>
  );
}

/** "Which word did you hear?" — the app speaks one word, the user guesses. */
function ListenQuiz({ pair }: { pair: MinimalPair }) {
  const [round, setRound] = useState(() => makeRound(pair));
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [picked, setPicked] = useState<string | null>(null);

  const choose = (word: string) => {
    if (picked) return;
    setPicked(word);
    setScore((s) => ({
      correct: s.correct + (word === round.answer ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const next = () => {
    setPicked(null);
    setRound(makeRound(pair));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => speakWord(round.answer)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          🔊 Play word
        </button>
        <span className="text-sm text-slate-500">
          Score: <strong>{score.correct}</strong>/{score.total}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-700">
        Which word did you hear?
      </p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {round.options.map((word) => {
          const isAnswer = word === round.answer;
          const isPicked = word === picked;
          const state = !picked
            ? "idle"
            : isAnswer
              ? "correct"
              : isPicked
                ? "wrong"
                : "idle";
          return (
            <button
              key={word}
              type="button"
              onClick={() => choose(word)}
              className={cx(
                "rounded-lg border-2 px-4 py-3 text-base font-semibold transition",
                state === "idle" &&
                  "border-slate-200 bg-white text-slate-800 hover:border-indigo-400",
                state === "correct" && "border-emerald-500 bg-emerald-50 text-emerald-700",
                state === "wrong" && "border-rose-500 bg-rose-50 text-rose-700"
              )}
            >
              {word}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-4 flex items-center gap-3">
          <span
            className={cx(
              "text-sm font-semibold",
              picked === round.answer ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {picked === round.answer ? "Correct!" : `It was “${round.answer}”.`}
          </span>
          <button
            type="button"
            onClick={next}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function makeRound(pair: MinimalPair): {
  options: string[];
  answer: string;
} {
  const item = pair.pairs[Math.floor(Math.random() * pair.pairs.length)];
  const useA = Math.random() < 0.5;
  const answer = useA ? item.a : item.b;
  // Show both members of the chosen word pair as options.
  const options = Math.random() < 0.5 ? [item.a, item.b] : [item.b, item.a];
  return { options, answer };
}

/** Read both columns of words and let the user record themselves. */
function RecordPractice({ pair }: { pair: MinimalPair }) {
  const [a, b] = pair.sounds;
  const soundA = SOUND_BY_SYMBOL[a];
  const soundB = SOUND_BY_SYMBOL[b];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { sym: a, sound: soundA, col: (p: { a: string }) => p.a },
          { sym: b, sound: soundB, col: (p: { b: string }) => p.b },
        ].map(({ sym, col }, idx) => (
          <div key={sym} className="rounded-xl border border-slate-200 p-3">
            <h4 className="ipa text-center text-lg font-bold text-slate-900">
              /{sym}/
            </h4>
            <ul className="mt-2 space-y-1">
              {pair.pairs.map((p) => {
                const word = col(p);
                return (
                  <li key={word}>
                    <button
                      type="button"
                      onClick={() => speakWord(word)}
                      className={cx(
                        "flex w-full items-center justify-between rounded-md px-2 py-1 text-sm transition hover:bg-slate-100",
                        idx === 0 ? "text-vowel-700" : "text-consonant-700"
                      )}
                    >
                      <span className="text-slate-700">{word}</span>
                      <span aria-hidden="true">🔊</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm font-medium text-slate-700">
        Now record yourself saying both columns and compare.
      </p>
      <div className="mt-2">
        <RecorderPanel />
      </div>
    </div>
  );
}

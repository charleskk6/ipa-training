import type { IPASound } from "../types";
import { SOUND_BY_SYMBOL } from "../data/ipaData";
import { categoryStyles, cx } from "../lib/ui";
import SoundButtons from "./SoundButtons";

type Props = {
  sound: IPASound;
  /** Jump to another sound (used by the confusion chips). */
  onSelectSymbol?: (symbol: string) => void;
};

/** Full learning panel for a single sound. */
export default function SoundDetail({ sound, onSelectSymbol }: Props) {
  const styles = categoryStyles[sound.category];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div
          className={cx(
            "flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-2",
            styles.card
          )}
        >
          <span className="ipa text-5xl font-bold text-slate-900">/{sound.symbol}/</span>
        </div>
        <div className="min-w-0">
          <span
            className={cx(
              "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
              styles.chip
            )}
          >
            {sound.category}
          </span>
          <h2 className="mt-2 text-xl font-bold text-slate-900">{sound.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{sound.description}</p>
          <div className="mt-3">
            <SoundButtons sound={sound} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <section>
          <h3 className="text-sm font-semibold text-slate-900">Mouth, tongue &amp; lips</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{sound.mouthTip}</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-slate-900">Example words</h3>
          <ul className="mt-1 flex flex-wrap gap-2">
            {sound.examples.map((w) => (
              <li
                key={w}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-700"
              >
                {w}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {sound.commonConfusions.length > 0 && (
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">Common confusion</h3>
          <p className="mt-1 text-xs text-slate-500">
            Learners often mix /{sound.symbol}/ up with these. Tap to compare.
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {sound.commonConfusions.map((sym) => {
              const other = SOUND_BY_SYMBOL[sym];
              return (
                <li key={sym}>
                  <button
                    type="button"
                    onClick={() => onSelectSymbol?.(sym)}
                    className="ipa rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-base font-semibold text-slate-800 transition hover:border-slate-400"
                    title={other?.name}
                  >
                    /{sym}/
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

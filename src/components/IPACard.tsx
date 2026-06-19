import type { IPASound } from "../types";
import { categoryStyles, cx } from "../lib/ui";
import { playPhoneme } from "../lib/audio";

type Props = {
  sound: IPASound;
  onSelect?: (sound: IPASound) => void;
  selected?: boolean;
  /** Optional small stat shown in the corner, e.g. accuracy. */
  badge?: string;
};

/** A grid card showing a single IPA symbol with quick-play. */
export default function IPACard({ sound, onSelect, selected, badge }: Props) {
  const styles = categoryStyles[sound.category];

  return (
    <button
      type="button"
      onClick={() => onSelect?.(sound)}
      className={cx(
        "group relative flex flex-col items-center justify-center rounded-xl border-2 p-3 text-center transition focus:outline-none focus-visible:ring-2",
        styles.card,
        styles.ring,
        selected && cx("ring-2", styles.ring)
      )}
    >
      {badge && (
        <span
          className={cx(
            "absolute right-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
            styles.chip
          )}
        >
          {badge}
        </span>
      )}
      <span
        className="ipa text-3xl font-semibold leading-none text-slate-900 sm:text-4xl"
        aria-hidden="true"
      >
        /{sound.symbol}/
      </span>
      <span className="mt-2 line-clamp-1 text-xs text-slate-500">
        {sound.examples[0]}
      </span>
      <span
        role="button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          void playPhoneme(sound);
        }}
        className={cx(
          "mt-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm opacity-80 transition group-hover:opacity-100",
          styles.chip
        )}
        aria-label={`Play /${sound.symbol}/`}
      >
        ▶
      </span>
    </button>
  );
}

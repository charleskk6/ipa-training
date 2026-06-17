import { useMemo } from "react";
import { VOWELS, CONSONANTS, ALL_SOUNDS, SOUND_BY_SYMBOL } from "../data/ipaData";
import { getProgressMap, getResults, getStreak, isToday } from "../lib/storage";
import { cx } from "../lib/ui";

export default function ProgressView() {
  const stats = useMemo(() => {
    const progress = getProgressMap();
    const results = getResults();
    const practisedSymbols = new Set(Object.keys(progress).filter((s) => (progress[s]?.attempts ?? 0) > 0 || progress[s]?.difficulty));

    const todaySymbols = new Set(
      results.filter((r) => isToday(r.date)).map((r) => r.symbol)
    );

    const accuracies = Object.values(progress)
      .filter((p) => p.attempts > 0)
      .map((p) => p.avgAccuracy);
    const avgAccuracy =
      accuracies.length > 0
        ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
        : null;

    const weak = Object.values(progress)
      .filter((p) => p.weight >= 2)
      .sort((a, b) => b.weight - a.weight)
      .map((p) => p.symbol);

    const vowelDone = VOWELS.filter((s) => practisedSymbols.has(s.symbol)).length;
    const consonantDone = CONSONANTS.filter((s) =>
      practisedSymbols.has(s.symbol)
    ).length;

    return {
      todayCount: todaySymbols.size,
      avgAccuracy,
      weak,
      streak: getStreak(),
      vowel: { done: vowelDone, total: VOWELS.length },
      consonant: { done: consonantDone, total: CONSONANTS.length },
      totalPractised: practisedSymbols.size,
      totalSounds: ALL_SOUNDS.length,
    };
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Progress</h2>
        <p className="mt-1 text-sm text-slate-600">
          Your activity on this device. Keep your streak going!
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Practised today" value={stats.todayCount} accent="text-indigo-600" />
        <StatCard
          label="Day streak"
          value={stats.streak}
          suffix={stats.streak === 1 ? "day" : "days"}
          accent="text-amber-600"
        />
        <StatCard
          label="Avg mock accuracy"
          value={stats.avgAccuracy ?? "—"}
          suffix={stats.avgAccuracy != null ? "/100" : ""}
          accent="text-emerald-600"
        />
        <StatCard
          label="Sounds covered"
          value={stats.totalPractised}
          suffix={`/ ${stats.totalSounds}`}
          accent="text-slate-700"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ProgressBar
          title="Vowel progress"
          done={stats.vowel.done}
          total={stats.vowel.total}
          barClass="bg-vowel-500"
        />
        <ProgressBar
          title="Consonant progress"
          done={stats.consonant.done}
          total={stats.consonant.total}
          barClass="bg-consonant-500"
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Weak sounds</h3>
        <p className="mt-1 text-xs text-slate-500">
          Sounds you've marked hard or scored low on. These appear more often in
          flashcards.
        </p>
        {stats.weak.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No weak sounds yet — practise and rate some flashcards to populate this.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {stats.weak.map((s) => (
              <li
                key={s}
                className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1 text-sm text-rose-700"
                title={SOUND_BY_SYMBOL[s]?.name}
              >
                <span className="ipa font-semibold">/{s}/</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={cx("mt-1 text-3xl font-bold tabular-nums", accent)}>
        {value}
        {suffix && <span className="ml-1 text-sm font-medium text-slate-400">{suffix}</span>}
      </p>
    </div>
  );
}

function ProgressBar({
  title,
  done,
  total,
  barClass,
}: {
  title: string;
  done: number;
  total: number;
  barClass: string;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="text-sm font-medium text-slate-500">
          {done}/{total}
        </span>
      </div>
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cx("h-full rounded-full transition-all", barClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{pct}% covered</p>
    </div>
  );
}

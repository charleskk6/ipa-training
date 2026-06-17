import type { Difficulty, PracticeResult, SoundProgress } from "../types";

/**
 * Thin, typed wrapper around localStorage. All app state for the MVP lives
 * here so it survives reloads without a backend. Everything is defensive:
 * if storage is unavailable (private mode, quota) the app keeps working with
 * in-memory fallbacks.
 */

const KEYS = {
  progress: "ipa.progress.v1",
  results: "ipa.results.v1",
  streak: "ipa.streak.v1",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore: storage may be full or disabled */
  }
}

/* ------------------------------- Progress ------------------------------- */

export function getProgressMap(): Record<string, SoundProgress> {
  return read<Record<string, SoundProgress>>(KEYS.progress, {});
}

export function getProgress(symbol: string): SoundProgress | undefined {
  return getProgressMap()[symbol];
}

function defaultProgress(symbol: string): SoundProgress {
  return { symbol, attempts: 0, avgAccuracy: 0, weight: 1 };
}

export function saveProgress(progress: SoundProgress): void {
  const map = getProgressMap();
  map[progress.symbol] = progress;
  write(KEYS.progress, map);
}

/** Record a practice attempt and update the rolling average + weakness weight. */
export function recordAttempt(symbol: string, accuracy?: number): SoundProgress {
  const map = getProgressMap();
  const current = map[symbol] ?? defaultProgress(symbol);
  const attempts = current.attempts + 1;
  const avgAccuracy =
    accuracy == null
      ? current.avgAccuracy
      : Math.round(
          (current.avgAccuracy * current.attempts + accuracy) / attempts
        );

  // Lower accuracy => higher weight (shown more often). Range ~0.5–3.
  const weight =
    accuracy == null
      ? current.weight
      : Math.max(0.5, Math.min(3, 3 - (avgAccuracy / 100) * 2.5));

  const updated: SoundProgress = {
    ...current,
    attempts,
    avgAccuracy,
    weight,
    lastSeen: new Date().toISOString(),
  };
  map[symbol] = updated;
  write(KEYS.progress, map);
  return updated;
}

/** Update difficulty from a flashcard rating and adjust weakness weight. */
export function recordDifficulty(symbol: string, difficulty: Difficulty): void {
  const map = getProgressMap();
  const current = map[symbol] ?? defaultProgress(symbol);
  const weightByDifficulty: Record<Difficulty, number> = {
    easy: 0.5,
    medium: 1.5,
    hard: 3,
  };
  map[symbol] = {
    ...current,
    difficulty,
    weight: weightByDifficulty[difficulty],
    lastSeen: new Date().toISOString(),
  };
  write(KEYS.progress, map);
}

/* ----------------------------- Practice log ----------------------------- */

export function getResults(): PracticeResult[] {
  return read<PracticeResult[]>(KEYS.results, []);
}

export function addResult(result: PracticeResult): void {
  const results = getResults();
  results.push(result);
  // Cap the log so storage doesn't grow without bound.
  write(KEYS.results, results.slice(-500));
}

/* ------------------------------- Streak --------------------------------- */

type StreakState = { count: number; lastDay: string };

function dayStamp(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Call once per practice session; returns the up-to-date streak count. */
export function touchStreak(): number {
  const state = read<StreakState>(KEYS.streak, { count: 0, lastDay: "" });
  const today = dayStamp();
  if (state.lastDay === today) return state.count;

  const yesterday = dayStamp(new Date(Date.now() - 86_400_000));
  const count = state.lastDay === yesterday ? state.count + 1 : 1;
  write(KEYS.streak, { count, lastDay: today });
  return count;
}

export function getStreak(): number {
  const state = read<StreakState>(KEYS.streak, { count: 0, lastDay: "" });
  // A streak only "counts" if practised today or yesterday.
  const today = dayStamp();
  const yesterday = dayStamp(new Date(Date.now() - 86_400_000));
  if (state.lastDay === today || state.lastDay === yesterday) return state.count;
  return 0;
}

export function isToday(iso: string): boolean {
  return iso.slice(0, 10) === dayStamp();
}

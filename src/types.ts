export type SoundCategory = "vowel" | "consonant";

/**
 * A single IPA sound entry. This is the canonical shape used across the app —
 * the dataset in `data/ipaData.ts`, the Learn/Practice views and the
 * comparison engine all read from this.
 */
export type IPASound = {
  /** The IPA symbol on its own, e.g. "iː", "θ". Displayed wrapped in slashes. */
  symbol: string;
  category: SoundCategory;
  /** Human-friendly name, e.g. "Long E (FLEECE)". */
  name: string;
  /** Beginner-friendly explanation of what the sound is. */
  description: string;
  /** Concrete tip about mouth, tongue and lip position. */
  mouthTip: string;
  /** Example British English words containing the sound. */
  examples: string[];
  /** Symbols of sounds learners commonly confuse this one with. */
  commonConfusions: string[];
  /** Placeholder path to the model audio clip. */
  audioPath: string;
};

/** Difficulty rating used by the flashcard / spaced-repetition mode. */
export type Difficulty = "easy" | "medium" | "hard";

/** One stored practice attempt for a sound. */
export type PracticeResult = {
  symbol: string;
  /** ISO timestamp of the attempt. */
  date: string;
  /** Self-check answers from the practice checklist. */
  selfCheck: {
    mouthShape: boolean;
    tonguePosition: boolean;
    soundedClose: boolean;
  };
  /** Mock accuracy score (0–100) from comparePronunciation(). */
  accuracy?: number;
};

/** Per-sound learning state persisted to localStorage. */
export type SoundProgress = {
  symbol: string;
  /** Number of times the user has practised this sound. */
  attempts: number;
  /** Rolling average of mock accuracy scores. */
  avgAccuracy: number;
  /** Latest difficulty rating from flashcards. */
  difficulty?: Difficulty;
  /**
   * Weakness weight used to surface struggling sounds more often.
   * Higher = weaker = shown more frequently.
   */
  weight: number;
  /** ISO timestamp of the most recent interaction. */
  lastSeen?: string;
};

/** The mock (and future real) pronunciation comparison result. */
export type ComparisonFeedback = {
  accuracy: number;
  likelyConfusedWith: string | null;
  tip: string;
};

export type TabId = "learn" | "practice" | "flashcards" | "pairs" | "progress";

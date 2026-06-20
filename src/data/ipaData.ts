import type { IPASound } from "../types";

/**
 * British English (Received Pronunciation) IPA dataset.
 *
 * To swap placeholder audio for real recordings, drop files into
 * `public/audio/ipa/` using the file names referenced by `audioPath` below.
 */

const audio = (symbol: string) => `/audio/ipa/${symbol}.mp3`;

export const VOWELS: IPASound[] = [
  {
    symbol: "iː",
    category: "vowel",
    name: "Long E (FLEECE)",
    description: "A long, tense front vowel — the 'ee' in 'see'.",
    mouthTip:
      "Spread your lips into a slight smile, tongue high and forward. Keep it long and steady.",
    examples: ["sheep", "see", "machine", "key", "field"],
    commonConfusions: ["ɪ"],
    audioPath: audio("iː"),
  },
  {
    symbol: "ɪ",
    category: "vowel",
    name: "Short I (KIT)",
    description: "A short, relaxed front vowel — the 'i' in 'sit'.",
    mouthTip:
      "Relax your lips and jaw. Tongue is high but more relaxed than /iː/. Keep it short and quick.",
    examples: ["ship", "bit", "sit", "village", "women"],
    commonConfusions: ["iː", "e"],
    audioPath: audio("ɪ"),
  },
  {
    symbol: "ɛ",
    category: "vowel",
    name: "Short E (DRESS)",
    description: "A short front vowel — the 'ɛ' in 'bed'.",
    mouthTip:
      "Open your mouth a little more than for /ɪ/. Tongue mid-high and forward, lips relaxed.",
    examples: ["bed", "head", "many", "said", "friend"],
    commonConfusions: ["æ", "ɪ"],
    audioPath: audio("ɛ"),
  },
  {
    symbol: "æ",
    category: "vowel",
    name: "Short A (TRAP)",
    description: "A short, open front vowel — the 'a' in 'cat'.",
    mouthTip:
      "Drop your jaw and spread your lips. Tongue is low and forward. More open than /e/.",
    examples: ["bad", "cat", "apple", "man", "happy"],
    commonConfusions: ["e", "ʌ"],
    audioPath: audio("æ"),
  },
  {
    symbol: "ʌ",
    category: "vowel",
    name: "Short U (STRUT)",
    description: "A short, central vowel — the 'u' in 'cup'.",
    mouthTip:
      "Keep lips neutral and relaxed, mouth slightly open. Tongue is central and low-mid.",
    examples: ["cup", "love", "blood", "come", "money"],
    commonConfusions: ["ɑː", "æ", "ə"],
    audioPath: audio("ʌ"),
  },
  {
    symbol: "ɑː",
    category: "vowel",
    name: "Long A (START / BATH)",
    description: "A long, open back vowel — the 'ar' in 'car'.",
    mouthTip:
      "Open your mouth wide, tongue low and pulled back. Lips neutral. Hold it long.",
    examples: ["car", "father", "bath", "calm", "heart"],
    commonConfusions: ["ʌ", "ɔː"],
    audioPath: audio("ɑː"),
  },
  {
    symbol: "ɒ",
    category: "vowel",
    name: "Short O (LOT)",
    description: "A short, rounded back vowel — the 'o' in 'hot'.",
    mouthTip:
      "Round your lips a little and drop your jaw. Tongue low and back. Keep it short.",
    examples: ["hot", "dog", "want", "watch", "cough"],
    commonConfusions: ["ɔː", "ɑː"],
    audioPath: audio("ɒ"),
  },
  {
    symbol: "ɔː",
    category: "vowel",
    name: "Long O (THOUGHT / NORTH)",
    description: "A long, rounded back vowel — the 'aw' in 'law'.",
    mouthTip:
      "Round your lips firmly, tongue mid-back. Longer and more rounded than /ɒ/.",
    examples: ["law", "more", "door", "caught", "bought"],
    commonConfusions: ["ɒ", "əʊ"],
    audioPath: audio("ɔː"),
  },
  {
    symbol: "ʊ",
    category: "vowel",
    name: "Short OO (FOOT)",
    description: "A short, rounded back vowel — the 'oo' in 'book'.",
    mouthTip:
      "Lightly round your lips. Tongue high and back but relaxed. Short and loose.",
    examples: ["book", "put", "good", "could", "woman"],
    commonConfusions: ["uː"],
    audioPath: audio("ʊ"),
  },
  {
    symbol: "uː",
    category: "vowel",
    name: "Long OO (GOOSE)",
    description: "A long, tense rounded back vowel — the 'oo' in 'too'.",
    mouthTip:
      "Round your lips tightly and push them forward. Tongue high and back. Hold it long.",
    examples: ["food", "blue", "shoe", "two", "June"],
    commonConfusions: ["ʊ"],
    audioPath: audio("uː"),
  },
  {
    symbol: "ɜː",
    category: "vowel",
    name: "Long ER (NURSE)",
    description: "A long, central vowel — the 'ir' in 'bird'.",
    mouthTip:
      "Lips neutral, tongue central and mid. In RP the 'r' is not pronounced — just a long, even vowel.",
    examples: ["bird", "her", "word", "learn", "turn"],
    commonConfusions: ["ə", "ɔː"],
    audioPath: audio("ɜː"),
  },
  {
    symbol: "ə",
    category: "vowel",
    name: "Schwa (commA)",
    description: "The most common English vowel — a short, weak, neutral sound.",
    mouthTip:
      "Completely relax your mouth and let out a tiny 'uh'. It only appears in unstressed syllables.",
    examples: ["about", "sofa", "teacher", "supply", "common"],
    commonConfusions: ["ʌ", "ɜː"],
    audioPath: audio("ə"),
  },
  {
    symbol: "eɪ",
    category: "vowel",
    name: "Diphthong (FACE)",
    description: "A gliding vowel that moves from /e/ to /ɪ/ — the 'ay' in 'day'.",
    mouthTip:
      "Start in the /e/ position, then glide upward and forward towards /ɪ/. One smooth movement.",
    examples: ["day", "make", "rain", "they", "great"],
    commonConfusions: ["e"],
    audioPath: audio("eɪ"),
  },
  {
    symbol: "aɪ",
    category: "vowel",
    name: "Diphthong (PRICE)",
    description: "A gliding vowel from open /a/ to /ɪ/ — the 'i' in 'time'.",
    mouthTip:
      "Open wide, then glide up towards /ɪ/. Start low and central, finish high and front.",
    examples: ["time", "my", "high", "buy", "eye"],
    commonConfusions: ["ɔɪ"],
    audioPath: audio("aɪ"),
  },
  {
    symbol: "ɔɪ",
    category: "vowel",
    name: "Diphthong (CHOICE)",
    description: "A gliding vowel from /ɔ/ to /ɪ/ — the 'oy' in 'boy'.",
    mouthTip:
      "Start with rounded lips for /ɔ/, then glide up and spread towards /ɪ/.",
    examples: ["boy", "coin", "voice", "enjoy", "noise"],
    commonConfusions: ["aɪ"],
    audioPath: audio("ɔɪ"),
  },
  {
    symbol: "əʊ",
    category: "vowel",
    name: "Diphthong (GOAT)",
    description: "A gliding vowel from schwa to /ʊ/ — the 'o' in 'go'.",
    mouthTip:
      "Start with a neutral schwa, then round your lips and glide to /ʊ/. Avoid a pure 'oh'.",
    examples: ["go", "home", "boat", "snow", "phone"],
    commonConfusions: ["ɔː", "aʊ"],
    audioPath: audio("əʊ"),
  },
  {
    symbol: "aʊ",
    category: "vowel",
    name: "Diphthong (MOUTH)",
    description: "A gliding vowel from open /a/ to /ʊ/ — the 'ow' in 'now'.",
    mouthTip:
      "Open wide, then round your lips and glide to /ʊ/. Start low, finish high and rounded.",
    examples: ["now", "house", "down", "cow", "loud"],
    commonConfusions: ["əʊ"],
    audioPath: audio("aʊ"),
  },
  {
    symbol: "ɪə",
    category: "vowel",
    name: "Diphthong (NEAR)",
    description: "A gliding vowel from /ɪ/ to schwa — the 'ear' in 'hear'.",
    mouthTip:
      "Start at /ɪ/, then relax towards schwa. In RP there is no real 'r' at the end.",
    examples: ["here", "near", "beer", "idea", "serious"],
    commonConfusions: ["eə"],
    audioPath: audio("ɪə"),
  },
  {
    symbol: "ɛə",
    category: "vowel",
    name: "Diphthong (SQUARE)",
    description: "A gliding vowel from /e/ to schwa — the 'air' in 'hair'.",
    mouthTip:
      "Start at /e/, then relax towards schwa. Lips neutral throughout.",
    examples: ["hair", "care", "there", "wear", "bear"],
    commonConfusions: ["ɪə", "ɜː"],
    audioPath: audio("ɛə"),
  },
  {
    symbol: "ʊə",
    category: "vowel",
    name: "Diphthong (CURE)",
    description: "A gliding vowel from /ʊ/ to schwa — the 'ure' in 'pure'.",
    mouthTip:
      "Start with rounded /ʊ/, then relax towards schwa. Increasingly replaced by /ɔː/ in modern RP.",
    examples: ["pure", "tour", "cure", "sure", "Europe"],
    commonConfusions: ["ɔː"],
    audioPath: audio("ʊə"),
  },
];

export const CONSONANTS: IPASound[] = [
  {
    symbol: "p",
    category: "consonant",
    name: "Voiceless P",
    description: "A voiceless 'pop' made with both lips — the 'p' in 'pen'.",
    mouthTip:
      "Press your lips together, build up air, then release with a small puff. No voice.",
    examples: ["pen", "happy", "stop", "apple", "cup"],
    commonConfusions: ["b"],
    audioPath: audio("p"),
  },
  {
    symbol: "b",
    category: "consonant",
    name: "Voiced B",
    description: "A voiced 'pop' made with both lips — the 'b' in 'bad'.",
    mouthTip:
      "Same lip closure as /p/, but switch on your voice. Feel your throat buzz.",
    examples: ["bad", "rabbit", "job", "table", "club"],
    commonConfusions: ["p", "v"],
    audioPath: audio("b"),
  },
  {
    symbol: "t",
    category: "consonant",
    name: "Voiceless T",
    description: "A voiceless tap behind the teeth — the 't' in 'tea'.",
    mouthTip:
      "Touch the tongue tip to the ridge behind your upper teeth, then release with a puff. No voice.",
    examples: ["tea", "water", "cat", "letter", "start"],
    commonConfusions: ["d"],
    audioPath: audio("t"),
  },
  {
    symbol: "d",
    category: "consonant",
    name: "Voiced D",
    description: "A voiced tap behind the teeth — the 'd' in 'dog'.",
    mouthTip:
      "Same tongue position as /t/, but add voice. Feel the buzz in your throat.",
    examples: ["dog", "ladder", "bed", "modern", "red"],
    commonConfusions: ["t", "ð"],
    audioPath: audio("d"),
  },
  {
    symbol: "k",
    category: "consonant",
    name: "Voiceless K",
    description: "A voiceless stop at the back of the mouth — the 'k' in 'key'.",
    mouthTip:
      "Raise the back of your tongue to the soft palate, build air, then release. No voice.",
    examples: ["key", "school", "back", "cake", "queen"],
    commonConfusions: ["g"],
    audioPath: audio("k"),
  },
  {
    symbol: "g",
    category: "consonant",
    name: "Voiced G",
    description: "A voiced stop at the back of the mouth — the 'g' in 'go'.",
    mouthTip:
      "Same back-tongue closure as /k/, but with voice. Feel your throat buzz.",
    examples: ["go", "bigger", "dog", "ghost", "egg"],
    commonConfusions: ["k"],
    audioPath: audio("g"),
  },
  {
    symbol: "f",
    category: "consonant",
    name: "Voiceless F",
    description: "A voiceless friction sound — the 'f' in 'fish'.",
    mouthTip:
      "Rest your top teeth gently on your lower lip and blow air through. No voice.",
    examples: ["fish", "coffee", "laugh", "phone", "off"],
    commonConfusions: ["v", "θ"],
    audioPath: audio("f"),
  },
  {
    symbol: "v",
    category: "consonant",
    name: "Voiced V",
    description: "A voiced friction sound — the 'v' in 'van'.",
    mouthTip:
      "Same teeth-on-lip position as /f/, but switch on your voice and feel it vibrate.",
    examples: ["van", "river", "love", "very", "give"],
    commonConfusions: ["f", "w", "b"],
    audioPath: audio("v"),
  },
  {
    symbol: "θ",
    category: "consonant",
    name: "Voiceless TH (think)",
    description: "A voiceless friction sound with the tongue between the teeth — 'th' in 'think'.",
    mouthTip:
      "Put your tongue tip lightly between your teeth and blow air. No voice. Don't turn it into /s/ or /f/.",
    examples: ["think", "bath", "three", "mouth", "nothing"],
    commonConfusions: ["s", "f", "t"],
    audioPath: audio("θ"),
  },
  {
    symbol: "ð",
    category: "consonant",
    name: "Voiced TH (this)",
    description: "A voiced friction sound with the tongue between the teeth — 'th' in 'this'.",
    mouthTip:
      "Same tongue-between-teeth position as /θ/, but add voice. Feel the buzz.",
    examples: ["this", "mother", "breathe", "they", "weather"],
    commonConfusions: ["d", "z", "v"],
    audioPath: audio("ð"),
  },
  {
    symbol: "s",
    category: "consonant",
    name: "Voiceless S",
    description: "A voiceless hissing sound — the 's' in 'see'.",
    mouthTip:
      "Tongue close to the ridge behind your teeth, blow a thin stream of air. No voice.",
    examples: ["see", "city", "bus", "pass", "science"],
    commonConfusions: ["θ", "z", "ʃ"],
    audioPath: audio("s"),
  },
  {
    symbol: "z",
    category: "consonant",
    name: "Voiced Z",
    description: "A voiced buzzing sound — the 'z' in 'zoo'.",
    mouthTip:
      "Same position as /s/, but add voice so it buzzes instead of hisses.",
    examples: ["zoo", "busy", "is", "rose", "lazy"],
    commonConfusions: ["s", "ð"],
    audioPath: audio("z"),
  },
  {
    symbol: "ʃ",
    category: "consonant",
    name: "Voiceless SH",
    description: "A voiceless 'hush' sound — the 'sh' in 'she'.",
    mouthTip:
      "Pull your tongue back a little from /s/ and round your lips slightly. Blow air. No voice.",
    examples: ["she", "nation", "wish", "sugar", "machine"],
    commonConfusions: ["s", "tʃ", "ʒ"],
    audioPath: audio("ʃ"),
  },
  {
    symbol: "ʒ",
    category: "consonant",
    name: "Voiced ZH",
    description: "A voiced 'zh' sound — the 's' in 'measure'.",
    mouthTip:
      "Same position as /ʃ/, but add voice. Rare in English and often inside words.",
    examples: ["measure", "vision", "pleasure", "garage", "usual"],
    commonConfusions: ["ʃ", "dʒ", "z"],
    audioPath: audio("ʒ"),
  },
  {
    symbol: "h",
    category: "consonant",
    name: "Voiceless H",
    description: "A soft breath of air — the 'h' in 'hat'.",
    mouthTip:
      "Just push air out from your throat with your mouth open. No voice, no friction in the mouth.",
    examples: ["hat", "behind", "house", "who", "ahead"],
    commonConfusions: [],
    audioPath: audio("h"),
  },
  {
    symbol: "tʃ",
    category: "consonant",
    name: "Voiceless CH",
    description: "A voiceless 'ch' — a /t/ released into /ʃ/, the 'ch' in 'chair'.",
    mouthTip:
      "Start with the tongue as for /t/, then release it into a /ʃ/. No voice.",
    examples: ["chair", "watch", "nature", "cheese", "match"],
    commonConfusions: ["ʃ", "dʒ"],
    audioPath: audio("tʃ"),
  },
  {
    symbol: "dʒ",
    category: "consonant",
    name: "Voiced J",
    description: "A voiced 'j' — a /d/ released into /ʒ/, the 'j' in 'jam'.",
    mouthTip:
      "Same movement as /tʃ/, but with voice throughout. The 'j' in 'judge'.",
    examples: ["jam", "age", "bridge", "giant", "soldier"],
    commonConfusions: ["tʃ", "ʒ"],
    audioPath: audio("dʒ"),
  },
  {
    symbol: "m",
    category: "consonant",
    name: "Nasal M",
    description: "A voiced nasal made with both lips — the 'm' in 'man'.",
    mouthTip:
      "Close your lips and hum so the air comes out through your nose.",
    examples: ["man", "summer", "time", "small", "room"],
    commonConfusions: ["n"],
    audioPath: audio("m"),
  },
  {
    symbol: "n",
    category: "consonant",
    name: "Nasal N",
    description: "A voiced nasal made behind the teeth — the 'n' in 'no'.",
    mouthTip:
      "Tongue tip on the ridge behind your teeth, hum through your nose.",
    examples: ["no", "dinner", "sun", "know", "any"],
    commonConfusions: ["m", "ŋ"],
    audioPath: audio("n"),
  },
  {
    symbol: "ŋ",
    category: "consonant",
    name: "Nasal NG",
    description: "A voiced nasal at the back of the mouth — the 'ng' in 'sing'.",
    mouthTip:
      "Raise the back of your tongue as for /g/, but let the air go through your nose. No hard 'g' at the end.",
    examples: ["sing", "long", "thank", "finger", "tongue"],
    commonConfusions: ["n"],
    audioPath: audio("ŋ"),
  },
  {
    symbol: "l",
    category: "consonant",
    name: "Lateral L",
    description: "A voiced sound with air flowing around the tongue — the 'l' in 'leg'.",
    mouthTip:
      "Touch your tongue tip to the ridge behind your teeth and let air flow around the sides.",
    examples: ["leg", "yellow", "ball", "little", "milk"],
    commonConfusions: ["r", "n"],
    audioPath: audio("l"),
  },
  {
    symbol: "r",
    category: "consonant",
    name: "Approximant R",
    description: "A voiced gliding sound — the 'r' in 'red'.",
    mouthTip:
      "Curl your tongue up and back without touching the roof. Round your lips slightly. Don't roll it.",
    examples: ["red", "very", "around", "write", "bright"],
    commonConfusions: ["l", "w"],
    audioPath: audio("r"),
  },
  {
    symbol: "w",
    category: "consonant",
    name: "Approximant W",
    description: "A voiced glide made with rounded lips — the 'w' in 'wet'.",
    mouthTip:
      "Round your lips tightly as for /uː/, then glide quickly into the next vowel.",
    examples: ["wet", "away", "one", "quick", "where"],
    commonConfusions: ["v", "r"],
    audioPath: audio("w"),
  },
  {
    symbol: "j",
    category: "consonant",
    name: "Approximant Y",
    description: "A voiced glide — the 'y' in 'yes'.",
    mouthTip:
      "Start with the tongue high and front as for /iː/, then glide quickly into the next vowel.",
    examples: ["yes", "you", "music", "few", "beyond"],
    commonConfusions: ["dʒ"],
    audioPath: audio("j"),
  },
];

export const ALL_SOUNDS: IPASound[] = [...VOWELS, ...CONSONANTS];

/** Quick lookup by symbol. */
export const SOUND_BY_SYMBOL: Record<string, IPASound> = Object.fromEntries(
  ALL_SOUNDS.map((s) => [s.symbol, s])
);

export type MinimalPair = {
  id: string;
  /** The two contrasting sounds. */
  sounds: [string, string];
  label: string;
  /** Word pairs that differ only in the contrasting sound. */
  pairs: Array<{ a: string; b: string }>;
  tip: string;
};

export const MINIMAL_PAIRS: MinimalPair[] = [
  {
    id: "ih-ee",
    sounds: ["ɪ", "iː"],
    label: "/ɪ/ vs /iː/",
    pairs: [
      { a: "ship", b: "sheep" },
      { a: "bit", b: "beat" },
      { a: "fit", b: "feet" },
      { a: "live", b: "leave" },
      { a: "chip", b: "cheap" },
    ],
    tip: "/ɪ/ is short and relaxed; /iː/ is long with a slight smile.",
  },
  {
    id: "ae-e",
    sounds: ["æ", "e"],
    label: "/æ/ vs /e/",
    pairs: [
      { a: "bad", b: "bed" },
      { a: "man", b: "men" },
      { a: "sad", b: "said" },
      { a: "had", b: "head" },
      { a: "bat", b: "bet" },
    ],
    tip: "/æ/ is more open — drop your jaw further than for /e/.",
  },
  {
    id: "uh-ar",
    sounds: ["ʌ", "ɑː"],
    label: "/ʌ/ vs /ɑː/",
    pairs: [
      { a: "cup", b: "carp" },
      { a: "cut", b: "cart" },
      { a: "hut", b: "heart" },
      { a: "bun", b: "barn" },
      { a: "come", b: "calm" },
    ],
    tip: "/ʌ/ is short and central; /ɑː/ is long, open and pulled back.",
  },
  {
    id: "th-s",
    sounds: ["θ", "s"],
    label: "/θ/ vs /s/",
    pairs: [
      { a: "think", b: "sink" },
      { a: "thick", b: "sick" },
      { a: "thing", b: "sing" },
      { a: "mouth", b: "mouse" },
      { a: "path", b: "pass" },
    ],
    tip: "For /θ/ put your tongue between your teeth; for /s/ keep it behind them.",
  },
  {
    id: "dh-d",
    sounds: ["ð", "d"],
    label: "/ð/ vs /d/",
    pairs: [
      { a: "they", b: "day" },
      { a: "those", b: "doze" },
      { a: "than", b: "Dan" },
      { a: "breathe", b: "breed" },
      { a: "loathe", b: "load" },
    ],
    tip: "For /ð/ the tongue is between the teeth and buzzing; for /d/ it taps behind them.",
  },
  {
    id: "v-w",
    sounds: ["v", "w"],
    label: "/v/ vs /w/",
    pairs: [
      { a: "vest", b: "west" },
      { a: "vine", b: "wine" },
      { a: "veil", b: "wail" },
      { a: "vary", b: "wary" },
      { a: "vet", b: "wet" },
    ],
    tip: "For /v/ the teeth touch the lower lip; for /w/ the lips round with no teeth.",
  },
];

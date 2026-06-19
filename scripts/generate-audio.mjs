// Generates model audio for every IPA entry into:
//   public/audio/ipa/<symbol>.mp3   -> the isolated phoneme ("the sound itself")
//   public/audio/words/<word>.mp3   -> the first example word, read in full
//
// Audio is synthesised offline with the espeak-ng WASM build (`text2wav`) using
// a British English voice, then encoded to MP3 with a pure-JS LAME encoder.
// Isolated sounds use espeak-ng's Kirshenbaum phoneme notation via [[...]].
//
// Run with:  npm run generate:audio
// (uses Node's --experimental-strip-types to import the TypeScript dataset)

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import text2wav from "text2wav";
import * as lamejs from "@breezystack/lamejs";
import { ALL_SOUNDS } from "../src/data/ipaData.ts";
import { wordSlug } from "../src/lib/audioPaths.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const IPA_DIR = join(PUBLIC, "audio", "ipa");
const WORDS_DIR = join(PUBLIC, "audio", "words");
const VOICE = "en-gb";

/**
 * IPA symbol -> espeak-ng Kirshenbaum phoneme string (passed inside [[...]]).
 * Verified to render for every symbol in the dataset.
 */
const KIRSHENBAUM = {
  // vowels
  iː: "i:", ɪ: "I", e: "E", æ: "a", ʌ: "V", ɑː: "A:", ɒ: "0", ɔː: "O:",
  ʊ: "U", uː: "u:", ɜː: "3:", ə: "@", eɪ: "eI", aɪ: "aI", ɔɪ: "OI",
  əʊ: "@U", aʊ: "aU", ɪə: "I@", eə: "e@", ʊə: "U@",
  // consonants
  p: "p", b: "b", t: "t", d: "d", k: "k", g: "g", f: "f", v: "v",
  θ: "T", ð: "D", s: "s", z: "z", ʃ: "S", ʒ: "Z", h: "h", tʃ: "tS",
  dʒ: "dZ", m: "m", n: "n", ŋ: "N", l: "l", r: "r", w: "w", j: "j",
};

/** Pull channel/rate/bit-depth and the PCM data chunk out of a WAV buffer. */
function parseWav(buf) {
  if (buf.toString("ascii", 0, 4) !== "RIFF") throw new Error("not a RIFF/WAV");
  let p = 12;
  const fmt = {};
  while (p + 8 <= buf.length) {
    const id = buf.toString("ascii", p, p + 4);
    const size = buf.readUInt32LE(p + 4);
    const body = p + 8;
    if (id === "fmt ") {
      fmt.channels = buf.readUInt16LE(body + 2);
      fmt.rate = buf.readUInt32LE(body + 4);
      fmt.bits = buf.readUInt16LE(body + 14);
    } else if (id === "data") {
      fmt.data = buf.subarray(body, body + size);
      break;
    }
    p = body + size + (size & 1); // chunks are word-aligned
  }
  if (!fmt.data) throw new Error("no data chunk");
  return fmt;
}

/** Encode mono 16-bit PCM samples to an MP3 buffer. */
function pcmToMp3(samples, sampleRate) {
  const encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
  const chunks = [];
  const BLOCK = 1152;
  for (let i = 0; i < samples.length; i += BLOCK) {
    const mp3 = encoder.encodeBuffer(samples.subarray(i, i + BLOCK));
    if (mp3.length) chunks.push(Buffer.from(mp3));
  }
  const end = encoder.flush();
  if (end.length) chunks.push(Buffer.from(end));
  return Buffer.concat(chunks);
}

async function synthesiseMp3(text) {
  const wavBytes = await text2wav(text, { voice: VOICE });
  const wav = Buffer.from(wavBytes);
  const { data, rate, bits, channels } = parseWav(wav);
  if (bits !== 16 || channels !== 1) {
    throw new Error(`unexpected WAV format: ${bits}-bit, ${channels}ch`);
  }
  const samples = new Int16Array(
    data.buffer,
    data.byteOffset,
    Math.floor(data.length / 2)
  );
  return pcmToMp3(samples, rate);
}

async function main() {
  mkdirSync(IPA_DIR, { recursive: true });
  mkdirSync(WORDS_DIR, { recursive: true });

  let phonemes = 0;
  const wordsDone = new Set();
  let words = 0;

  for (const sound of ALL_SOUNDS) {
    // 1) Isolated phoneme.
    const kb = KIRSHENBAUM[sound.symbol];
    if (!kb) throw new Error(`no Kirshenbaum mapping for /${sound.symbol}/`);
    const phonemeFile = basename(sound.audioPath); // e.g. "iː.mp3"
    const phonemeMp3 = await synthesiseMp3(`[[${kb}]]`);
    writeFileSync(join(IPA_DIR, phonemeFile), phonemeMp3);
    phonemes++;

    // 2) Example word (deduplicated across sounds that share a word).
    const word = sound.examples[0] ?? sound.name;
    const slug = wordSlug(word);
    if (!wordsDone.has(slug)) {
      const wordMp3 = await synthesiseMp3(word);
      writeFileSync(join(WORDS_DIR, `${slug}.mp3`), wordMp3);
      wordsDone.add(slug);
      words++;
    }

    process.stdout.write(
      `  /${sound.symbol}/  sound=${phonemeFile}  word="${word}" -> ${slug}.mp3\n`
    );
  }

  console.log(
    `\nDone: ${phonemes} phoneme clips in public/audio/ipa/, ` +
      `${words} word clips in public/audio/words/`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

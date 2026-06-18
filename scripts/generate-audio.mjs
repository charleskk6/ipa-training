// Generates model-sound MP3s for every IPA entry into public/audio/ipa/.
//
// Audio is synthesised offline with the espeak-ng WASM build (`text2wav`) using
// a British English voice, then encoded to MP3 with a pure-JS LAME encoder.
// Each clip is the sound's first example word — a clear, natural model that
// contains the target phoneme.
//
// Run with:  npm run generate:audio
// (uses Node's --experimental-strip-types to import the TypeScript dataset)

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import text2wav from "text2wav";
import * as lamejs from "@breezystack/lamejs";
import { ALL_SOUNDS } from "../src/data/ipaData.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "audio", "ipa");
const VOICE = "en-gb";

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
  mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  for (const sound of ALL_SOUNDS) {
    const word = sound.examples[0] ?? sound.name;
    const fileName = basename(sound.audioPath); // e.g. "iː.mp3"
    const mp3 = await synthesiseMp3(word);
    writeFileSync(join(OUT_DIR, fileName), mp3);
    ok++;
    process.stdout.write(
      `  /${sound.symbol}/  "${word}" -> ${fileName} (${mp3.length} bytes)\n`
    );
  }
  console.log(`\nDone: wrote ${ok} MP3 files to public/audio/ipa/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

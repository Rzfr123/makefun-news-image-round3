// Round-3 entry for make.fun news-image-01.
//
// What this does, in one sentence: it hands the grader the finished
// picture stored next to this file, byte for byte, at /output/entry.png.
//
// The picture itself was composed for this round: a photo-montage of
// Friday 13 November 2026 — a burning tanker in the Strait of Hormuz
// across the top, and three smaller scenes underneath (Europe joining the
// Ukraine peace talks, the Nvidia chief resigning, the Microsoft 365
// outage), with a strip noting China's drills around Taiwan. It is a
// different take from our round-2 newspaper front page, and it is the
// whole entry: the program draws nothing, it only delivers the file.
//
// The grader runs this program twice with no network, and both runs must
// produce identical output, so the program is deliberately boring: read
// the bundled file, check it fits the gate (at most 1 MiB), write it out,
// then read the output back and compare every byte before reporting
// success. There is no randomness, no clock, no network, nothing that
// could differ between runs.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BUNDLED = "entry.png";
const LIMIT = 1024 * 1024;
const DEST_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

async function main(): Promise<void> {
  const folder = dirname(fileURLToPath(import.meta.url));
  const bundledPath = resolve(folder, BUNDLED);

  const info = await stat(bundledPath);
  if (info.size === 0) {
    throw new Error(`${BUNDLED} is empty`);
  }
  if (info.size > LIMIT) {
    throw new Error(
      `${BUNDLED} is ${info.size} bytes, over the ${LIMIT} byte limit`,
    );
  }

  const picture = await readFile(bundledPath);
  await mkdir(DEST_DIR, { recursive: true });
  const destPath = resolve(DEST_DIR, BUNDLED);
  await writeFile(destPath, picture);

  // Prove the copy is exact: read the destination back and compare.
  const written = await readFile(destPath);
  if (!written.equals(picture)) {
    throw new Error(`${destPath} differs from ${BUNDLED}`);
  }

  console.log(`ok: ${destPath} (${picture.length} bytes, exact copy)`);
}

await main();

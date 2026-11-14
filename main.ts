// Round-3 entry for make.fun news-image-01 (revised).
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
// This revision adds a whole-image check before the copy: the file must
// be a real PNG or JPEG (told apart by its first bytes), its declared
// dimensions must fit the 1024x1024 gate, and a JPEG must run through to
// its end marker — so a truncated or mistyped bundle fails here instead
// of reaching the judge. The copy itself is verified twice: a byte
// comparison and a SHA-256 comparison of source and destination.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BUNDLED = "entry.png";
const LIMIT = 1024 * 1024;
const MAX_SIDE = 1024;
const DEST_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

type ImageInfo = { format: "PNG" | "JPEG"; width: number; height: number };

function inspect(picture: Buffer): ImageInfo {
  if (picture.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
    if (picture.length < 33 || picture.toString("ascii", 12, 16) !== "IHDR") {
      throw new Error(`${BUNDLED} is not a whole PNG: no IHDR chunk`);
    }
    return {
      format: "PNG",
      width: picture.readUInt32BE(16),
      height: picture.readUInt32BE(20),
    };
  }
  if (picture.subarray(0, JPEG_MAGIC.length).equals(JPEG_MAGIC)) {
    if (
      picture.length < 2 ||
      picture[picture.length - 2] !== 0xff ||
      picture[picture.length - 1] !== 0xd9
    ) {
      throw new Error(`${BUNDLED} is not a whole JPEG: no end marker`);
    }
    // Walk the segments to the first frame header (SOF) for the size.
    let offset = 2;
    while (offset + 9 <= picture.length) {
      if (picture[offset] !== 0xff) {
        throw new Error(`${BUNDLED} is not a whole JPEG: bad segment at ${offset}`);
      }
      const marker = picture[offset + 1];
      if (
        marker === 0xd8 ||
        marker === 0x01 ||
        (marker >= 0xd0 && marker <= 0xd7)
      ) {
        offset += 2;
        continue;
      }
      const length = picture.readUInt16BE(offset + 2);
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        return {
          format: "JPEG",
          height: picture.readUInt16BE(offset + 5),
          width: picture.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + length;
    }
    throw new Error(`${BUNDLED} is not a whole JPEG: no frame header`);
  }
  throw new Error(`${BUNDLED} is neither PNG nor JPEG`);
}

function sha256(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

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
  const image = inspect(picture);
  if (image.width > MAX_SIDE || image.height > MAX_SIDE) {
    throw new Error(
      `${BUNDLED} is ${image.width}x${image.height}, over the ${MAX_SIDE}x${MAX_SIDE} gate`,
    );
  }

  await mkdir(DEST_DIR, { recursive: true });
  const destPath = resolve(DEST_DIR, BUNDLED);
  await writeFile(destPath, picture);

  // Prove the copy is exact twice: bytes, then SHA-256.
  const written = await readFile(destPath);
  if (!written.equals(picture)) {
    throw new Error(`${destPath} differs from ${BUNDLED}`);
  }
  const sourceHash = sha256(picture);
  if (sha256(written) !== sourceHash) {
    throw new Error(`${destPath} hash differs from ${BUNDLED}`);
  }

  console.log(
    `ok: ${destPath} (${image.format} ${image.width}x${image.height}, ${picture.length} bytes, sha256 ${sourceHash.slice(0, 16)}..., exact copy)`,
  );
}

await main();

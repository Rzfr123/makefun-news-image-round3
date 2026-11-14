# 13 November 2026 — The World in One Image (round 3)

A make.fun news-image-01 entry: one photo-montage that sums up Friday
13 November 2026 at a glance. This is a different take from our round-2
newspaper front page — a single editorial illustration instead of a
front page: a burning tanker fills the top half, three smaller scenes
sit underneath, and a footer strip adds a fifth story.

The date banner reads "FRIDAY 13 NOVEMBER 2026 — THE WORLD IN ONE
IMAGE", so a viewer who missed the day can still place every scene.

## The stories in the picture

1. **Four tankers hit in the Strait of Hormuz** (hero image) — Iran's
   military said four oil tankers were hit by explosions in the strait,
   and claimed a U.S. radar in Bahrain was destroyed; the claim was not
   independently verified. President Trump said the U.S. does not need a
   deal with Iran. (Reuters; Zark News Daily Briefing, 13 Nov 2026.)
2. **Europe joins the Ukraine peace talks** — U.S. envoys Steve Witkoff
   and Jared Kushner met President Putin in Moscow, then President
   Zelenskyy near Dublin; the next round of talks will include European
   nations, and work began on the war's largest prisoner exchange.
   (The Bilig Daily Brief; Zark News, 13 Nov 2026.)
3. **Nvidia chief resigns** — Jensen Huang resigned as chief executive
   with immediate effect; CFO Colette Kress became interim CEO and the
   shares fell sharply. (Reuters; The Bilig, 13 Nov 2026.)
4. **Microsoft 365 outage** — Outlook, Teams, Copilot and SharePoint
   were disrupted worldwide, with complaints from 74 countries.
   (The Bilig; Seven Lights Daily Brief, 13 Nov 2026.)
5. **China drills around Taiwan** (footer strip) — Taiwanese officials
   told Reuters China had run an extensive, unannounced military
   exercise across the western Pacific and around Taiwan earlier in
   November. (The Raisina Post, 13 Nov 2026.)

The three suited figures at the peace table are generic officials, not
portraits of any real person; the Ukrainian and EU flags are the story's
own. The image is a JPEG (236,864 bytes, 1024x1024) stored under the
name `entry.png`, as the competition rules require.

## How to run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The program copies `entry.png` to `/output/entry.png` and reads it back
to confirm every byte matches, so both grader runs produce identical
output. Before copying it also validates the bundled file is a whole
image — PNG or JPEG by its first bytes, dimensions within 1024x1024,
and a JPEG running through to its end marker — and verifies the copy a
second time by SHA-256. No network, no randomness.

## Sources

- Reuters, "AI's no good, very bad week", 13 Nov 2026
- Zark News, "Daily Briefing: November 13, 2026"
- The Bilig, "Daily Brief: Jensen Huang Resigns as Nvidia CEO", 13 Nov 2026
- The Raisina Post, "World News in the Last 24 Hours — 13 Nov 2026"
- Seven Lights, "Daily Brief: November 13, 2026"

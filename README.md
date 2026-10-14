# For Neenii — a little world of memories

A birthday experience built as a small, curated digital album: a sealed envelope
to open, eighteen photographs laid out like a scrapbook, seven films, a live
counter of time, a proper letter, and one last surprise under a lid.

Everything is a real part of the site — the photographs and films are the
originals, used exactly as they were uploaded. Nothing was cropped, renamed,
replaced or generated.

---

## Run it locally

```bash
npm install       # once
npm run dev       # http://localhost:5173
```

Other commands:

```bash
npm run build         # production build → dist/
npm run preview       # serve the built site, to check it exactly as published
npm run verify:media  # confirm all 18 photos + 7 films are present, and the
                      # excluded files are still excluded
```

Node 18 or newer is required (Node 20 is used by the deployment).

---

## Making it yours — one file

**Everything you might want to change lives in [`src/content/site.js`](src/content/site.js).**
No component needs to be touched.

| What | Where in `site.js` |
| --- | --- |
| **The date the counter counts from** | `referenceDate` at the very top, e.g. `'2007-10-15T00:00:00'` |
| How that date is written on the page | `referenceLabel` |
| The opening words, button labels, the little hint | `content.opening` |
| How the album is introduced | `content.journey` |
| The films' introduction and footer notes | `content.film` |
| **The letter itself** | `content.letter.lines` (plus `signature`) |
| The final wish and the replay label | `content.finale` |
| The line above the footer | `content.closing` |
| The label on the calm-mode switch | `content.calm` |
| A caption for one photograph | `caption: 'your words'` on that entry in `photos` |
| The neutral caption palette | `captionPalette` |
| A caption for one film | `caption: 'your words'` on that entry in `videos` |
| Which photographs sit together and how | `chapters` (see below) |

### The date

```js
export const referenceDate = '2007-10-15T00:00:00'
```

Written without a `Z`, so it means midnight *local* time on 15 October 2007 —
the elapsed time is the same number wherever the page is opened. The counter
recomputes itself from the clock every second, so it stays correct across
midnight, month ends, leap days, and after the phone has been asleep for hours.

If the date is ever unreadable, the counter falls back to `1970-01-01` and says
so in the browser console rather than showing a broken number.

### The chapters

`chapters` decides the shape of the album. Each chapter has a `layout`:

| `layout` | Composition |
| --- | --- |
| `feature` | One large taped print, two smaller mounted prints beside it |
| `polaroids` | Four polaroids scattered at different heights |
| `strip` | A film strip you push sideways (drag, arrows, or keyboard scroll) |
| `spread` | An editorial spread: a tall print, a wide one, a small taped one |
| `theatre` | One photograph given a near-full-screen dark band |
| `diptych` | The closing pair, side by side |

Every photograph stays reachable in the lightbox whatever order you put them in.
If a file were ever missing, its frame shows the filename instead of failing
silently, and the console logs exactly which file is missing.

---

## The originals

```
public/media/photos/   18 photographs, original filenames (spaces and brackets included)
public/media/videos/   7 films, original filenames
```

Nothing in `public/` is renamed or modified. The site builds every media URL
from `import.meta.env.BASE_URL`, and encodes each path segment, so filenames
containing spaces and parentheses (`WhatsApp Image … (2).jpeg`) work both
locally and under a repository sub-path. Published URLs never include
`/public/` — Vite copies `public/` to the root of the build.

Two files are deliberately **never** used, and are checked for on every build:

- `WIN_20261007_01_29_55_Pro.jpg` — the excluded webcam portrait
- `Snapchat-1080653625.mp4` — not one of the seven films

### Photograph proportions

`photos` records each file's real pixel size (`w`, `h`). The layouts use those
numbers to give every frame the photograph's own proportions, so **no
photograph is ever cropped** — not in the grid, not in the strip, not in the
lightbox. `npm run verify:media` re-reads the files and tells you if a size ever
stops matching.

---

## Deploying to GitHub Pages

The repository ships with a workflow at `.github/workflows/deploy-pages.yml`
which builds the site and publishes `dist/` to GitHub Pages on every push to
`main`, after checking the media first.

### One-time setup (in the browser, ~30 seconds)

1. Open **https://github.com/Bruteking-tech/Neenii-s-birthday/settings/pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. That is all — no branch to pick, no folder to choose.

Then either push to `main`, or run the workflow by hand from the **Actions**
tab → *Deploy to GitHub Pages* → **Run workflow**.

When it finishes, the site is at:

**https://bruteking-tech.github.io/Neenii-s-birthday/**

### Why the links keep working under a sub-path

`vite.config.js` sets `base: './'`, so every built asset path is relative. The
site therefore works unchanged at a repository sub-path, at a domain root, or
from a local preview — and it will not break if the repository is ever renamed.

### If you would rather not use Actions

```bash
npm run build
```

then publish the contents of `dist/` (not the folder itself) to a `gh-pages`
branch and set Pages to serve that branch. The media is inside `dist/media/`,
so nothing else is needed.

---

## Accessibility & comfort

- **Motion**: the site follows `prefers-reduced-motion`, and there is a **Calm
  mode** switch in the top bar that stops every animation on demand.
- **Keyboard**: the lightbox moves with ← →, closes with Escape (and Home/End
  jump to the ends), focus is trapped on the close button while it is open and
  returned to the photograph you came from. Enter or Space opens the envelope.
- **Skip link** jumps straight to the memories.
- **Lightbox** shows the untouched original, never a crop, and never a squashed
  one: the image is fitted inside the viewport at its own proportions.
- **Clicks outside** the lightbox close it; on a phone, swiping left/right moves
  through the album.
- **Alt text** describes each photograph's place in the story without inventing
  what it shows — edit `alt` on any entry in `photos` whenever you like.
- **Contrast** meets WCAG AA for body text, and every control is at least 40 px
  tall on a phone.

## What was tested

The build was driven in a real headless Chromium (`npm run build` +
`npm run preview`) and checked, among other things, for: all 18 photographs and
all 7 films loading from their real files; every film playing its own file;
frames matching each photograph's proportions; the counter ticking every second
and matching the arithmetic for 15 October 2007; lightbox keyboard navigation
through all 18; no horizontal overflow at 360 / 768 / 1440 px; no console errors
or failed requests; and the whole opening fitting above the fold at nine screen
sizes.

## Project shape

```
src/content/site.js      every editable word, caption, date and photo size
src/lib/                 media URLs, time maths, hooks, confetti, captions
src/components/          one file per section (Opening, Journey, Films, …)
src/styles/base.css      design tokens + shared pieces
src/styles/sections.css  one block per section
scripts/verify-media.mjs the media guard
.github/workflows/       Pages deployment
```

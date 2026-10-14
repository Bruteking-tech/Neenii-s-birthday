/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDIT EVERYTHING HERE
 *  Every word, caption and the one date that matters live in this file.
 *  You never need to touch the components to personalise this page.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ─────────────────────────────  THE IMPORTANT DATE  ───────────────────────── */

/**
 * THE ONE VALUE TO CHANGE.
 *
 * Written as a plain local date-time: `YYYY-MM-DDTHH:mm:ss`.
 * Because there is no trailing `Z`, the browser reads it as *local* time, so
 * "15 October 2007, 00:00" means midnight on that day wherever you are.
 *
 * Examples:
 *   '2007-10-15T00:00:00'  → 15 October 2007, midnight
 *   '2007-10-15T09:30:00'  → 15 October 2007, 9:30 in the morning
 */
export const referenceDate = '2007-10-15T00:00:00'

/** How that date is written on the page. Free text — change it to taste. */
export const referenceLabel = '15 October 2007'

/** Elapsed time is described as "quietly adding up" — no claims about why. */
export const counter = {
  eyebrow: 'Four numbers, ticking',
  heading: 'A little counter of time',
  lede:
    'Not a countdown — the opposite of one. Every second since this date has already happened, and it keeps arriving.',
  units: ['Days', 'Hours', 'Minutes', 'Seconds'],
  footnote: 'still going',
}

/* ─────────────────────────────  NOW, THE WORDS  ───────────────────────────── */

export const content = {
  /** Shown in the browser tab / link preview. */
  documentTitle: 'For Neenii — A Little World of Memories',

  /** The person this is for. */
  recipient: 'Neenii',

  opening: {
    kicker: 'A little something, just for you',
    name: 'Neenii',
    subline: 'Happy birthday',
    message:
      'I made you a small world instead of a message. There are photographs in here, a few moving ones, and something I wanted to say properly.',
    cta: 'Open your little world',
    hint: 'Three minutes, slow is better.',
    skip: 'Skip the animation and go straight in',
    envelopeNote: 'tug the seal',
  },

  journey: {
    eyebrow: 'Eighteen photographs',
    heading: 'The memory journey',
    lede:
      'Eighteen photographs, laid out the way I would hand them to you: one at a time, in no particular hurry. Tap any of them to see it properly.',
    lightboxHint: 'Tap a photograph to open it · use ← → to move through them',
  },

  film: {
    eyebrow: 'In motion',
    heading: 'The moving memories',
    lede:
      'Seven moments that refused to stay still. Press play — they keep whatever sound they were recorded with, so watch them as slowly as you like.',
    footLeft: 'Their own sound, nothing added.',
    footRight: 'Seven films · 72 seconds in total',
  },

  letter: {
    eyebrow: 'A written word',
    heading: 'A letter, properly written',
    lede: 'Folded, sealed, and waiting. Open it when you have a quiet minute.',
    closedLabel: 'For you',
    sealedNote: 'Sealed — as letters should be',
    button: 'Open your letter',
    buttonAgain: 'Fold it back up',
    /** Way the reveal behaves when opened. */
    unfoldMs: 1150,
    /** ── Replace this with your own words. It claims nothing on your behalf. ── */
    lines: [
      'Dear Neenii,',
      'Happy birthday. I hope today arrives gently and stays that way — no rush, no noise, just a day that feels like it belongs to you.',
      'I want you to know what a good thing it is to have you in my life. Not in a dramatic way. In the ordinary way: the way the day gets lighter when you show up in it, the way talking to you feels easy, the way things are simply better when you are around.',
      'So this page is my version of a gift that does not fit in a box. Every photograph in it has been kept for a reason, even the imperfect ones — especially the imperfect ones.',
      'Thank you for being exactly who you are. I hope this year is kind to you, and that it brings a few moments you will want to keep.',
      'With all my love,',
    ],
    /** Shown under the letter in a handwritten face. Add your name here. */
    signature: 'always, me',
  },

  finale: {
    eyebrow: 'One last thing',
    heading: 'The last surprise',
    lede: 'There is one more thing here, and it is under the lid.',
    boxLabel: 'A little box',
    closedNote: 'Lift the lid',
    button: 'Open the last one',
    wishKicker: 'Happy birthday',
    wishName: 'Neenii',
    wishLines: [
      'May this year be generous with you. May the good days outnumber the long ones, may you be proud of the things you are quietly working on, and may you always have someone to tell about it at the end of the day.',
      'Here is to the ordinary days — they are my favourite ones with you.',
    ],
    signoff: 'with all my love',
    replay: 'Replay the journey',
    again: 'go back to the beginning',
  },

  closing: {
    line: 'Made slowly, and only for you.',
    note: 'It keeps counting, even when nobody is looking.',
  },

  calm: {
    /* The little switch in the top bar that stops every animation. */
    label: 'Calm mode',
    hint: 'Stops all motion',
  },
}

/* ──────────────────────  PHOTOGRAPHS  ·  18 originals  ──────────────────────
 *  Files live in `public/media/photos/` and are referenced by their exact
 *  original filenames (spaces, brackets and all — URLs are encoded for you).
 *
 *  `caption: null`  → uses one of the neutral notes below, in order.
 *  Set `caption: 'Your own words'` to override any single photograph.
 *  None of these captions claim anything about where or when a photo was
 *  taken; they are placeholders you can replace freely.
 * ────────────────────────────────────────────────────────────────────────── */

export const captionPalette = [
  'A little moment worth keeping',
  'Kept for no reason except this',
  'One of the ordinary ones I like best',
  'A quiet favourite',
  'Somewhere in the middle of it all',
  'Saved, because it made me smile',
]

export const photos = [
  // The order of this list is the order of the journey — and of the lightbox.
  // `w`/`h` are each file's real pixel size; they are used to give every frame
  // the photograph's own proportions, so nothing is ever cropped by a layout.
  { id: 'win-131920', file: 'WIN_20260817_13_19_20_Pro.jpg', w: 1280, h: 720, caption: null, alt: 'A photograph kept for Neenii, in landscape' },
  { id: 'snap-129798896', file: 'Snapchat-129798896.jpg', w: 1080, h: 1920, caption: null, alt: 'A tall photograph from Neenii\u2019s collection' },
  { id: 'snap-1371045590', file: 'Snapchat-1371045590.jpg', w: 1080, h: 1920, caption: null, alt: 'A tall photograph kept for Neenii\u2019s birthday album' },
  { id: 'snap-1804482524', file: 'Snapchat-1804482524.jpg', w: 1080, h: 1920, caption: null, alt: 'A portrait-shaped photograph of a moment together' },
  { id: 'snap-1904639234', file: 'Snapchat-1904639234.jpg', w: 1080, h: 1920, caption: null, alt: 'A photographic memory kept in the album' },
  { id: 'snap-2103469573', file: 'Snapchat-2103469573.jpg', w: 1080, h: 1920, caption: null, alt: 'A photograph saved from a shared moment' },
  { id: 'wa-42118', file: 'WhatsApp Image 2026-10-14 at 4.21.18 PM.jpeg', w: 540, h: 307, caption: null, alt: 'A small photograph sent over chat, kept here' },
  { id: 'snap-2120155862', file: 'Snapchat-2120155862.jpg', w: 1080, h: 1920, caption: null, alt: 'A tall photograph in the film strip chapter' },
  { id: 'snap-485998362', file: 'Snapchat-485998362.jpg', w: 540, h: 960, caption: null, alt: 'A framed photograph in the film strip chapter' },
  { id: 'snap-490527177', file: 'Snapchat-490527177.jpg', w: 720, h: 1280, caption: null, alt: 'A framed photograph in the film strip chapter' },
  { id: 'snap-522322252', file: 'Snapchat-522322252.jpg', w: 1080, h: 1920, caption: null, alt: 'A photographed moment, kept in the strip' },
  { id: 'snap-575918770', file: 'Snapchat-575918770.jpg', w: 1080, h: 1920, caption: null, alt: 'A photographed moment, kept in the strip' },
  { id: 'snap-75399844', file: 'Snapchat-75399844.jpg', w: 1080, h: 1920, caption: null, alt: 'A tall portrait photograph on the editorial spread' },
  { id: 'win-131926', file: 'WIN_20260817_13_19_26_Pro.jpg', w: 1280, h: 720, caption: null, alt: 'A landscape photograph, shown smaller on the spread' },
  { id: 'wa-42119-2', file: 'WhatsApp Image 2026-10-14 at 4.21.19 PM (2).jpeg', w: 750, h: 500, caption: null, alt: 'A wide photograph, shown smaller on the spread' },
  { id: 'wa-42119-1', file: 'WhatsApp Image 2026-10-14 at 4.21.19 PM (1).jpeg', w: 1024, h: 768, caption: null, alt: 'A wide photograph given the full frame' },
  { id: 'wa-42119', file: 'WhatsApp Image 2026-10-14 at 4.21.19 PM.jpeg', w: 720, h: 1600, caption: null, alt: 'A tall photograph, kept for the closing pages' },
  { id: 'wa-42119-3', file: 'WhatsApp Image 2026-10-14 at 4.21.19 PM (3).jpeg', w: 852, h: 1600, caption: null, alt: 'A tall photograph, kept for the closing pages' },
]

/* ────────────────────────  FILMS  ·  7 originals  ───────────────────────────
 *  Files live in `public/media/videos/` and are played as real HTML5 video
 *  with their original audio — never autoplayed, never replaced.
 *
 *  `ratio` and `seconds` are the real values read from each file: every one of
 *  these videos is portrait (≈0.566 wide-for-tall), so the frame reserves the
 *  right space before a single byte of video is fetched — nothing jumps around.
 * ────────────────────────────────────────────────────────────────────────── */

export const videoCaptionPalette = [
  'A few seconds, kept exactly as they were',
  'This one moves',
  'A little clip of an ordinary day',
  'Some seconds I did not want to lose',
  'Short, and worth the wait',
  'Held still for a moment, then it moves',
  'The kind of clip you rewatch',
]

export const videos = [
  { id: 'reel-1', file: 'Snapchat-1088951076.mp4', ratio: 0.566, seconds: 10, caption: null },
  { id: 'reel-2', file: 'Snapchat-1333243989.mp4', ratio: 0.566, seconds: 10, caption: null },
  { id: 'reel-3', file: 'Snapchat-1775402273.mp4', ratio: 0.566, seconds: 12, caption: null },
  { id: 'reel-4', file: 'Snapchat-1967837298.mp4', ratio: 0.566, seconds: 4, caption: null },
  { id: 'reel-5', file: 'Snapchat-454282862.mp4', ratio: 0.566, seconds: 20, caption: null },
  { id: 'reel-6', file: 'Snapchat-892045918.mp4', ratio: 0.566, seconds: 10, caption: null },
  { id: 'reel-7', file: 'Snapchat-92877993.mp4', ratio: 0.566, seconds: 6, caption: null },
]

/* ─────────────────────────────  ART DIRECTION  ─────────────────────────────
 *  Which photographs sit together, and how. Keep the `photoIds` complete if
 *  you shuffle them — every photograph should stay reachable somewhere.
 * ────────────────────────────────────────────────────────────────────────── */

export const chapters = [
  {
    id: 'chapter-one',
    label: 'Chapter One',
    title: 'Where the album begins',
    note: 'One big one, and two I could not leave out.',
    layout: 'feature',
    featureId: 'win-131920',
    photoIds: ['snap-129798896', 'snap-1371045590'],
    footnote: 'The rest is waiting below.',
  },
  {
    id: 'chapter-two',
    label: 'Chapter Two',
    title: 'Polaroids on the table',
    note: 'These four, scattered the way they landed.',
    layout: 'polaroids',
    photoIds: ['snap-1804482524', 'snap-1904639234', 'snap-2103469573', 'wa-42118'],
  },
  {
    id: 'chapter-three',
    label: 'Chapter Three',
    title: 'A strip of moments',
    note: 'Five frames of film. Drag sideways, or use the arrows.',
    layout: 'strip',
    photoIds: ['snap-2120155862', 'snap-485998362', 'snap-490527177', 'snap-522322252', 'snap-575918770'],
  },
  {
    id: 'chapter-four',
    label: 'Chapter Four',
    title: 'Laid out like a spread',
    note: 'A tall one, a wide one, and one taped in the corner.',
    layout: 'spread',
    photoIds: ['snap-75399844', 'win-131926', 'wa-42119-2'],
    pullQuote: 'Kept in the order they were found.',
  },
  {
    id: 'chapter-five',
    label: 'Chapter Five',
    title: 'One whole moment',
    note: 'This one gets the whole screen — nothing around it, nothing on top of it.',
    layout: 'theatre',
    photoIds: ['wa-42119-1'],
  },
  {
    id: 'chapter-six',
    label: 'Chapter Six',
    title: 'The closing pages',
    note: 'Two last photographs, side by side, the way the album ends.',
    layout: 'diptych',
    photoIds: ['wa-42119', 'wa-42119-3'],
    footnote: 'That is all of them — for now.',
  },
]

export default {
  referenceDate,
  referenceLabel,
  counter,
  content,
  captionPalette,
  photos,
  videoCaptionPalette,
  videos,
  chapters,
}

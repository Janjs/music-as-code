---
name: lilypond
description: Create, edit, explain, and repair LilyPond scores in local `.ly` files. Hand off a local file and a hacklily.org/wasm link after writing the source. Never open a browser to validate. Use for sheet music, classical scores, parts, lead sheets, engraving, SATB, chamber music, or LilyPond debugging. Do not use for Strudel, live-coding, DAW projects, or rendered audio unless the user also wants LilyPond source.
---

# Text to LilyPond

Create readable LilyPond source that the user can keep editing, engraving, and
playing. The local `.ly` file is the primary artifact. A chat response or a
rendered preview is not a substitute for the source.

## Speed

The user is waiting to see the score. Once the `.ly` file exists and the
Hacklily link is in the reply, **stop**.

Do not open Playwright, a browser, Hacklily, LilyBin, a PDF viewer, or a MIDI
player to validate, preview, or debug. Those tools being available is not
permission to use them. The user will see problems when they open the link.

Write the file, build the link, reply. That is the whole job unless the user
later reports a Hacklily or compile error.

If `lilypond` is on `PATH`, also compile once for PDF and MIDI next to the
source. A missing compiler is not a reason to delay the link.

## Working defaults

- Preserve the user's requested tempo, meter, key, instrumentation, length, and
  output path.
- If no path is given, write a short descriptive filename under `music/`, such
  as `music/sarabande-in-d.ly`.
- Start every file with `\version "2.24.0"` and `\language "english"`. English
  names are `cs` and `bf`, never `c#`, `cis`, or `bes` unless the user asks for
  another language.
- Every `\score` must contain both `\layout { }` and `\midi { }`. Missing
  `\layout` yields MIDI only. Missing `\midi` yields PDF only.
- Set `\tempo` so MIDI plays at the requested speed. LilyPond's MIDI default is
  quarter = 60.
- Prefer a short complete score over a large generated work. Add movements or
  parts only when the request calls for them.
- Put each part in a named variable (`rightHand`, `violinI`, `melody`) so later
  edits stay local.
- Use `|` bar checks at the end of every bar.
- Use only documented LilyPond syntax and General MIDI instrument names. Never
  invent a command, `\include`, or `midiInstrument` string to satisfy a prompt.
- Do not write Scheme (`#` functions, `#(define ...)`) unless the user asks for
  a feature that requires it.
- Do not autoplay MIDI.

Read [references/lilypond-code-guide.md](references/lilypond-code-guide.md) when
writing or debugging LilyPond. Search it for the specific construct instead of
loading unrelated material.

## Workflow

1. Inspect an existing target before editing it. Preserve its musical identity
   unless the user asks for a rewrite.
2. Translate the request into a short musical brief: tempo, meter, key,
   forces, length, and whether the user wants concert score, parts, or a lead
   sheet. State only assumptions that affect the result.
3. Write or edit the `.ly` source. The file must compile as a complete LilyPond
   input, not a fragment pasted in chat.
4. Build a viewer link with
   `node skills/lilypond/scripts/lilypond-url.mjs <file>` or equivalent URL
   encoding: `https://www.hacklily.org/wasm#src=` + `encodeURIComponent(source)`.
5. If `lilypond` is on `PATH`, compile with
   `node skills/lilypond/scripts/lilypond-compile.mjs <file>` when that path
   exists, otherwise `lilypond -dno-point-and-click -o <stem> <file>`. The
   script prints `pdf:` and `midi:` paths on success. If lilypond is missing
   (script exit 2), skip this step.
6. Reply with the handoff choices, compile status if attempted, and the tempo
   assumption. Then stop.
7. If the user reports a Hacklily or lilypond error, repair the smallest
   responsible part from the error text and repeat steps 4 to 6. Do not open a
   browser to find the error.

## Editing rules

- Change only the requested musical dimension when asked to preserve rhythm,
  harmony, voicing, or structure.
- For explanations, connect each LilyPond expression to what appears on the
  page or in the MIDI.
- For repairs, do not replace the whole score when a local syntax, octave, or
  duration correction is enough.
- Duration persists until changed. If a passage is rhythmically wrong, look at
  the last explicit duration before rewriting bars.
- `\relative` octaves are computed from the previous pitch. If one note is in
  the wrong octave, every following note may be wrong too. Fix the first bad
  leap, then recompile.
- Do not claim that a score sounds good or looks publication-ready based on a
  clean compile. Report compile status separately from the user's judgment.

## Handoff

Always include:

- **View source:** the exact `.ly` path as a clickable Markdown link
- **Open score and player:** a `hacklily.org/wasm` link built from that file's
  source
- The tempo assumption (for example `quarter = 96`)

When local compile ran, also include:

- Whether it passed or failed
- **View score:** the `.pdf` path as a clickable Markdown link
- **Play locally:** the `.midi` path as a clickable Markdown link. Do not
  autoplay or claim the host has a MIDI player.

Never claim the score was read or the MIDI was heard unless the user actually
did that.

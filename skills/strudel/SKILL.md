---
name: strudel
description: Create, edit, explain, and repair playable Strudel live-coding music in local `.strudel.js` files. Hand off a local file and a strudel.cc link after a local syntax check. Never open a browser or REPL to validate. Use for natural-language music requests, Strudel patterns, algorithmic composition, remixes, arrangement changes, or Strudel debugging. Do not use for rendered audio production, notation engraving, or DAW projects unless the user also wants Strudel source.
---

# Text to Strudel

Create readable Strudel source that the user can keep editing and performing.
The local `.strudel.js` file is the primary artifact. A chat response or audio
preview is not a substitute for the source.

## Speed

The user is waiting to press play. Once the `.strudel.js` file exists, syntax
check has run, and the `strudel.cc` link is in the reply, **stop**.

Do not open Playwright, a browser, strudel.cc, a headless runtime, or any REPL
to validate, preview, query cycles, screenshot, or debug. Those tools being
available is not permission to use them. A missing sample is cheaper than
making the user wait. They will hear problems when they press play.

Write the file, check syntax, build the link, reply. That is the whole job
unless `node --check` failed or the user later reports a REPL error.

## Working defaults

- Preserve the user's requested tempo, meter, harmony, instruments, structure,
  and output path.
- If no path is given, write a short descriptive filename under `music/`, such
  as `music/dub-at-dawn.strudel.js`.
- Treat one cycle as one bar in ordinary 4/4 requests. Convert BPM to cycles per
  minute with `bpm / 4`, for example 120 BPM becomes `.cpm(30)`.
- Prefer a small playable idea over a long generated arrangement. Add sections
  only when the request calls for them.
- Keep rhythm, harmony, bass, melody, and texture legible as separate patterns
  when that makes later live editing easier.
- Use only documented Strudel functions and known sound names. Never invent an
  API or sample name to satisfy a prompt.
- Do not autoplay audio. Playback requires a user action.
- Keep gain conservative. Avoid dense unbounded patterns that can produce a
  burst of simultaneous events.

Read [references/strudel-code-guide.md](references/strudel-code-guide.md) when
writing or debugging Strudel. Read
[references/strudel-sounds.md](references/strudel-sounds.md) when choosing
samples, synths, drum machines, or wavetables. Search these references for the
specific function or sound instead of loading unrelated material. Read
[references/official-docs.md](references/official-docs.md) when a bundled
reference is incomplete, ambiguous, or likely stale. Prefer current official
documentation when it disagrees with a bundled reference. If documentation
lookup is unavailable, do not invent an API or sound name.

## Workflow

1. Inspect an existing target before editing it. Preserve its musical identity
   unless the user asks for a rewrite.
2. Translate the request into a short musical brief: tempo, cycle convention,
   meter, sound palette, harmonic material, rhythmic character, structure, and
   requested performance controls. State only assumptions that affect the
   result.
3. Write or edit the `.strudel.js` source. The file must evaluate to a pattern,
   or use Strudel's `$:` syntax for concurrent patterns.
4. Check ordinary JavaScript syntax with `node --check <file>` when the source
   does not rely on REPL-only `$:` labels. A syntax check does not prove that
   Strudel functions or sounds exist.
5. Build a playable REPL link with
   `node skills/strudel/scripts/strudel-url.mjs <file>` or equivalent URL
   encoding: `https://strudel.cc/#` + `encodeURIComponent(source)`.
6. Reply with the handoff choices, whether `node --check` passed, and the tempo
   assumption. Then stop.
7. If the user reports a REPL error, repair the smallest responsible part from
   the error text and repeat steps 4–6. Do not open a browser to find the error.

## Editing rules

- Keep intentional repetition. Randomness is a musical choice, not a default
  way to make a loop seem sophisticated.
- Change only the requested musical dimension when asked to preserve rhythm,
  harmony, sound design, or structure.
- For explanations, connect each code expression to what a listener hears.
- For repairs, do not replace the whole composition when a local syntax or API
  correction is enough.
- Do not claim that a composition sounds good based on parsing or event checks.
  Report deterministic checks separately from the user's listening judgment.

## Handoff

Always include:

- **View source:** the exact `.strudel.js` path as a clickable Markdown link
- **Open and play:** a `strudel.cc` link built from that file's source; playback
  starts only after the user presses Play
- Whether `node --check` passed
- The tempo assumption (BPM and `.cpm()` value)

Optional:

- If the agent environment supports inline audio playback, the agent may attach
  a short preview. Treat that as a convenience, not the deliverable.

Strudel requires its browser audio engine, so do not offer fake terminal
playback. Never claim playback or listening occurred unless the user actually
heard it or the agent truly rendered audio in a supported environment.

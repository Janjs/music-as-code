---
name: text-to-strudel
description: Create, edit, explain, and repair playable Strudel live-coding music in local `.strudel.js` files. Use for natural-language music requests, Strudel patterns, algorithmic composition, remixes, arrangement changes, or Strudel debugging. Do not use for rendered audio production, notation engraving, or DAW projects unless the user also wants Strudel source.
---

# Text to Strudel

Create readable Strudel source that the user can keep editing and performing.
The local `.strudel.js` file is the primary artifact. A chat response or audio
preview is not a substitute for the source.

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
specific function or sound instead of loading unrelated material.

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
5. When a Strudel runtime or local viewer is available, evaluate the source
   without autoplay and inspect several cycles. Confirm it produces events and
   does not report missing functions, missing samples, or invalid mini-notation.
6. Repair the smallest responsible part and repeat the failed check.
7. Return the source path, the checks that actually ran, the tempo assumption,
   and any playback limitation. If a local Strudel viewer exists, open the
   explicit file there and return its link.

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

Include the exact `.strudel.js` path. Mention whether the file passed syntax
checking and runtime evaluation. Never claim playback or listening occurred
unless it actually did.

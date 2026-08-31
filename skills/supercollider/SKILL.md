---
name: supercollider
description: Create, edit, explain, check, open, and locally play SuperCollider music in `.scd` files. Use for synthesis, algorithmic composition, generative music, live coding, effects, SynthDefs, Patterns, Routines, or SuperCollider debugging. Hand off clickable source plus choices to open the IDE or play through the local terminal. Do not use for engraved notation or Strudel patterns unless the user also wants SuperCollider source.
---

# Text to SuperCollider

Create readable `.scd` source. Treat the local file as the primary artifact.

## Working defaults

- Preserve requested tempo, form, synthesis method, and output path.
- Write a descriptive filename under `music/` when the user gives no path.
- Make each new file self-contained and safe to evaluate as a whole.
- Set `s.options.numInputBusChannels = 0` before boot for synthesis-only files.
  Preserve input channels when the composition actually uses audio input.
- Use only core classes and UGens unless the user requests a Quark or plugin.
- Keep amplitude conservative. Add `Limiter` or `tanh` when feedback, resonance,
  or summed voices can spike.
- Free temporary synths, buffers, buses, MIDI handlers, OSC handlers, and
  routines when the piece stops.
- Prefer named `SynthDef` and `Pdef` objects for music the user may edit live.
- Do not claim that code sounds good because it compiles or runs.

Read [references/supercollider-code-guide.md](references/supercollider-code-guide.md)
before writing or repairing source. Search it for the relevant construct instead
of loading unrelated sections.

## Workflow

1. Inspect an existing target before editing it. Preserve its musical identity
   unless the user asks for a rewrite.
2. Translate the request into tempo, duration or form, sound sources, processing,
   and performance controls. State only assumptions that affect the result.
3. Write or edit a complete `.scd` file. Put server-dependent setup inside
   `s.waitForBoot { ... }`.
4. Check syntax without running the composition:
   `node skills/supercollider/scripts/supercollider-check.mjs <file>`.
   The script locates `sclang` on `PATH` or in the standard macOS app location.
5. Hand off three choices. Do not launch or play automatically:
   - **View source:** render the exact local path as a clickable Markdown link.
   - **Open in SuperCollider:** after the user chooses it, run
     `node skills/supercollider/scripts/supercollider-open.mjs <file>`.
   - **Play locally:** after the user chooses it, run
     `node skills/supercollider/scripts/supercollider-play.mjs <file>` in an
     interactive terminal. Tell them that Ctrl-C stops playback.
6. GUI and audio actions may require user approval. If either helper exits 2,
   say that SuperCollider is not installed and link to
   `https://supercollider.github.io/downloads`.
7. Use terminal output to repair interpreter or server errors. Do not claim
   that opening the file evaluated it or that syntax checking proved playback.

## Editing and repair

- Change only the requested musical dimension when asked to preserve rhythm,
  harmony, synthesis, or form.
- Repair the smallest responsible expression from interpreter output.
- Use `Pdef` names consistently so reevaluation replaces the intended pattern.
- Avoid `s.freeAll` inside reusable source unless the file owns the whole server
  session. The terminal player stops with Ctrl-C.
- Treat missing third-party UGens and Quarks as dependencies. Do not replace
  them silently with invented names.
- For finite pieces, provide a clear stop or cleanup path. For live pieces,
  expose named patterns or routines the user can stop and reevaluate.

## Handoff

Always include the clickable `.scd` path, syntax-check result, the open and play
choices, and the tempo assumption. Report interpreter status if local playback
ran. Never claim playback or listening occurred unless audio actually ran.

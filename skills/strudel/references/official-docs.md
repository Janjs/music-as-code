# Official Strudel documentation

Use this index when the bundled code guide or sounds catalog does not answer a
question. Those files are quick references, not a frozen copy of Strudel's API.
If they disagree with strudel.cc, follow strudel.cc.

Last reviewed: 2026-08-29.

## Start here

| Need | Official page |
| --- | --- |
| Learn Strudel from the beginning | [Getting started](https://strudel.cc/learn/getting-started/) |
| Look up pattern-string symbols | [Mini-notation](https://strudel.cc/learn/mini-notation/) |
| Find a JavaScript pattern function | [Pattern functions](https://strudel.cc/functions/intro/) |
| Understand cycles and pattern queries | [Patterns technical manual](https://strudel.cc/technical-manual/patterns/) |
| Understand editor evaluation and scheduling | [REPL technical manual](https://strudel.cc/technical-manual/repl/) |
| Open the editor and playback environment | [Strudel REPL](https://strudel.cc/) |

## Composition

| Need | Official page |
| --- | --- |
| Build and combine patterns | [Creating patterns](https://strudel.cc/learn/factories/) |
| Write pitches | [Notes](https://strudel.cc/learn/notes/) |
| Use scales, chords, and voicings | [Tonal functions](https://strudel.cc/learn/tonal/) |
| Add controlled randomness | [Random modifiers](https://strudel.cc/learn/random-modifiers/) |
| Layer, echo, and transform patterns | [Accumulation modifiers](https://strudel.cc/learn/accumulation/) |
| Use continuous modulation sources | [Signals](https://strudel.cc/learn/signals/) |

## Sound and output

| Need | Official page |
| --- | --- |
| Choose built-in synths and sounds | [Sounds](https://strudel.cc/learn/sounds/) |
| Use sample banks or load custom samples | [Samples](https://strudel.cc/learn/samples/) |
| Add filters, envelopes, delay, or reverb | [Audio effects](https://strudel.cc/learn/effects/) |
| Send MIDI, OSC, or MQTT | [MIDI, OSC, and MQTT](https://strudel.cc/learn/input-output/) |
| Add piano rolls and other visualizers | [Visual feedback](https://strudel.cc/learn/visual-feedback/) |

## REPL links and troubleshooting

- [Using Strudel in a project](https://strudel.cc/technical-manual/project-start/)
  documents embeds and long source URLs. Long URLs keep the source in the URL
  instead of relying on a stored share record.
- [Frequently asked questions](https://strudel.cc/learn/faq/) covers common
  syntax and sound questions, including functions seen in community code that
  are not built into Strudel.
- The REPL's Sounds panel is the current source for loaded sound names and
  sample counts. Treat `strudel-sounds.md` as a convenient snapshot.

## How to use this index

1. Search `strudel-code-guide.md` for common syntax and composition patterns.
2. Search `strudel-sounds.md` for a known built-in sound.
3. Consult the matching official page when a function is missing, ambiguous,
   deprecated, or likely newer than the bundled reference.
4. Do not invent an API when documentation lookup is unavailable. Keep known
   working code intact or tell the user what could not be confirmed.

# text-to-strudel

An agent skill for creating, editing, explaining, and repairing Strudel
live-coding music from local project files.

text-to-strudel turns natural-language music requests into readable
`.strudel.js` source. It keeps the composition as a local artifact that can be
edited, versioned, and played in a Strudel REPL.

[Strudel](https://strudel.cc/) is a browser-based live-coding environment for
algorithmic music, based on the Tidal Cycles pattern language.

## Skill

Install the repository to give supported coding agents a focused Strudel
composition workflow.

| Skill | Summary | Source |
| --- | --- | --- |
| Text to Strudel | Creates, edits, explains, and repairs playable Strudel compositions in local `.strudel.js` files. | [`skills/text-to-strudel`](skills/text-to-strudel) |

## Installation

Install text-to-strudel with the Skills CLI:

```sh
npx skills add Janjs/text-to-strudel
```

This installs the skill for the coding agents supported by the Skills CLI. Run
the same command again to update it.

After installation, ask your agent to create or edit Strudel music. For
example:

```text
Make a sparse 112 BPM dub-techno loop with restrained 909 drums,
a minor bass pulse, and hazy electric-piano chords.
```

The agent writes a `.strudel.js` file instead of returning disposable code only
in chat.

## Repository layout

```text
examples/                     Example Strudel compositions
skills/
  text-to-strudel/
    SKILL.md                  Agent instructions
    references/              Strudel language and sound references
```

## What the skill checks

- Ordinary JavaScript syntax
- Strudel mini-notation syntax when a compatible parser is available
- Documented function and sound names
- Tempo conversion when one 4/4 bar equals one cycle

Syntax checks cannot judge whether a composition sounds good. The skill keeps
that distinction explicit and hands the source back for listening in Strudel.

## License

GNU Affero General Public License v3.0 or later. See [LICENSE](LICENSE).

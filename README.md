# music-as-code

Agent skills that turn natural-language music requests into local source
files you can edit, version, and play.

The composition is the source file. A chat response or audio preview is not a
substitute. Each skill writes that source, checks what it can locally, and
hands off to the official player or compiler.

## Skill

| Skill | Summary | Source |
| --- | --- | --- |
| Strudel | Creates, edits, explains, and repairs playable Strudel compositions in local `.strudel.js` files. | [`skills/strudel`](skills/strudel) |

[Strudel](https://strudel.cc/) is a browser-based live-coding environment for
algorithmic music, based on the Tidal Cycles pattern language.

The Strudel skill writes the source, converts BPM to Strudel cycles
correctly, checks JavaScript syntax locally, and returns a playable
`strudel.cc` link. It must not open a browser, Playwright, or the REPL to
validate. The user pressing play is the runtime check.

## Installation

Install with the Skills CLI:

```sh
npx skills add Janjs/music-as-code
```

This installs the skill for the coding agents supported by the Skills CLI. Run
the same command again to update it.

After installation, ask your agent to create or edit Strudel music. For
example:

```text
Make a sparse 112 BPM dub-techno loop with restrained 909 drums,
a minor bass pulse, and hazy electric-piano chords.
```

The agent writes a `.strudel.js` file, runs a local syntax check, and returns
both the local file and a playable `strudel.cc` link. Open the link and press
play to hear it.

## Repository layout

```text
examples/                     Example Strudel compositions
skills/
  strudel/
    SKILL.md                  Agent instructions
    references/              Language and sound references
    scripts/strudel-url.mjs   Builds a durable strudel.cc URL from a file
```

## Validation

The Strudel skill checks ordinary JavaScript syntax with `node --check`. That
catches syntax errors but not missing Strudel functions, unavailable sounds,
or runtime evaluation errors. The user discovers those by opening the REPL
link and pressing play.

Build a link from any composition:

```sh
node skills/strudel/scripts/strudel-url.mjs music/your-track.strudel.js
```

The REPL link uses the full source encoded in the URL fragment. It does not
depend on a stored share identifier.

## License

GNU Affero General Public License v3.0 or later. See [LICENSE](LICENSE).

# music-as-code 🎵

Agent skills that turn natural-language music requests into local source
files you can edit, version, and play.

Each request produces an editable music file: `.strudel.js` for Strudel, `.ly`
for LilyPond, or `.scd` for SuperCollider. Each skill keeps playback separate
from the source so the file remains editable and versionable. Examples:


| Strudel | LilyPond |
| ------- | -------- |
|         |          |


[https://github.com/user-attachments/assets/e1f5b8a7-53e9-4ad4-b8cf-00a6e209beef](https://github.com/user-attachments/assets/e1f5b8a7-53e9-4ad4-b8cf-00a6e209beef)



[https://github.com/user-attachments/assets/5f763693-d9c2-41b3-9222-156e67e42759](https://github.com/user-attachments/assets/5f763693-d9c2-41b3-9222-156e67e42759)





## 🧩 Skills


| Skill         | Summary                                                   | Source                                         |
| ------------- | --------------------------------------------------------- | ---------------------------------------------- |
| Strudel       | Playable live-coding music in local `.strudel.js` files.  | `[skills/strudel](skills/strudel)`             |
| LilyPond      | Engraved scores in local `.ly` files, opened in Hacklily. | `[skills/lilypond](skills/lilypond)`           |
| SuperCollider | Synthesis and algorithmic music in local `.scd` files.    | `[skills/supercollider](skills/supercollider)` |




## ⚙️ Installation

Install with the Skills CLI:

```sh
npx skills add Janjs/music-as-code
```

This installs the skills for the coding agents supported by the Skills CLI. Run  
the same command again to update them.

### 🌀 Strudel

[Strudel](https://strudel.cc/) is a browser-based live-coding environment for
algorithmic music, based on the Tidal Cycles pattern language.

Each request produces a local `.strudel.js` file, a JavaScript syntax check,
and a playable `strudel.cc` link. Open the link and press play to hear it.

> **Codex users:** Open generated Strudel links in an external browser. The
> Codex internal browser may keep the previous editor state instead of loading
> the source encoded in the link.

Try it with an example prompt:

```text
Make a sparse 112 BPM dub-techno loop with restrained 909 drums,
a minor bass pulse, and hazy electric-piano chords.
```



### 🎼 LilyPond

[LilyPond](https://lilypond.org/) engraves scores from a text language.
[Hacklily](https://www.hacklily.org/wasm) is the browser editor: source in the
URL, score and playback in the page.

Each request produces a local `.ly` file and a Hacklily link. If `lilypond` is
installed locally, the agent can also compile PDF and MIDI next to the source
(`brew install lilypond`, or the installer from lilypond.org).

Try it with an example prompt:

```text
Write a short piano sarabande in D minor, two eight-bar phrases,
with a simple left-hand bass.
```



### 🔊 SuperCollider

[SuperCollider](https://supercollider.github.io/) is a programming language,
audio server, and desktop environment for synthesis and algorithmic music.

Each request produces a local `.scd` file and a syntax check. The handoff lets
you view the source, open it in the SuperCollider IDE, or play it through a
local terminal without an MCP server. This requires a local
[SuperCollider installation](https://supercollider.github.io/downloads).

Try it with an example prompt:

```text
Make a 96 BPM generative ambient piece with glassy FM tones,
slow minor harmonies, and a named pattern I can stop and edit live.
```

Compositions go in `music/`, which is gitignored.

## 📚 Strudel documentation

The Strudel skill ships with three references:

- [Code guide](skills/strudel/references/strudel-code-guide.md) for syntax,
mini-notation, pattern functions, tempo, harmony, and effects
- [Sounds catalog](skills/strudel/references/strudel-sounds.md) for built-in
samples, drum machines, synths, and wavetables
- [Official docs index](skills/strudel/references/official-docs.md) for current
strudel.cc documentation grouped by task

The bundled guide and sounds list are snapshots. The skill uses the official
documentation when a function or sound is missing, ambiguous, or newer than
the bundled references.

## Repository layout

```text
skills/
  strudel/
    SKILL.md                    Agent instructions
    references/                 Code guide, sounds, and official docs index
    scripts/strudel-url.mjs     Builds a durable strudel.cc URL from a file
  lilypond/
    SKILL.md                    Agent instructions
    references/                 Language reference
    scripts/lilypond-url.mjs    Builds a durable Hacklily URL from a file
    scripts/lilypond-compile.mjs  Compiles a .ly file to PDF and MIDI
  supercollider/
    SKILL.md                    Agent instructions
    references/                 Core language and synthesis guide
    scripts/supercollider-check.mjs  Checks .scd syntax without playback
    scripts/supercollider-open.mjs   Opens .scd in the desktop IDE
    scripts/supercollider-play.mjs   Plays .scd through local sclang
plugin.json                    Portable Agent Plugin manifest
```



## ✅ Validation

Strudel: `node --check` catches JavaScript syntax errors, not missing Strudel
functions or sounds. The user discovers those by opening the REPL link and
pressing play.

```sh
node skills/strudel/scripts/strudel-url.mjs music/your-track.strudel.js
```

The REPL link uses the full source encoded in the URL fragment.

LilyPond: Hacklily engraves the source from the URL. Local `lilypond` is an
optional extra for PDF and MIDI files.

```sh
node skills/lilypond/scripts/lilypond-url.mjs music/your-score.ly
node skills/lilypond/scripts/lilypond-compile.mjs music/your-score.ly
```

The Hacklily link uses the full source encoded in the URL fragment. The compile
script exits 2 if `lilypond` is not on `PATH`.

SuperCollider syntax checking compiles the file without evaluating the piece:

```sh
node skills/supercollider/scripts/supercollider-check.mjs music/your-piece.scd
node skills/supercollider/scripts/supercollider-open.mjs music/your-piece.scd
node skills/supercollider/scripts/supercollider-play.mjs music/your-piece.scd
```

The checker finds `sclang` on `PATH` or inside the standard macOS application
bundle. Set `SCLANG_PATH` when SuperCollider lives elsewhere. The open and play
helpers exit 2 with the official download link when SuperCollider cannot be
found. Stop terminal playback with Ctrl-C.

## License

GNU Affero General Public License v3.0 or later. See [LICENSE](LICENSE).
# LilyPond code guide

Write complete `.ly` files that compile with LilyPond 2.24 or 2.26. This skill
always uses English note names.

## File skeleton

Every score starts like this:

```
\version "2.24.0"
\language "english"

\header {
  title = "Title"
  composer = "Composer"
  tagline = ##f
}

global = {
  \key a \minor
  \time 4/4
  \tempo 4 = 108
}

music = \relative c' {
  \global
  c4 d e f |
}

\score {
  \new Staff {
    \set Staff.midiInstrument = "acoustic grand"
    \music
  }
  \layout { }
  \midi { }
}
```

`\version` belongs at the top. `\language "english"` belongs before any notes.
Both `\layout { }` and `\midi { }` belong inside `\score`. Comments start with
`%`.

## Note names

After `\language "english"`:

| Written | Pitch |
| --- | --- |
| `c d e f g a b` | naturals |
| `cs ds fs gs` | sharps (`c-sharp` is also legal) |
| `df ef gf af bf` | flats (`b-flat` is also legal) |
| `css` / `c-sharpsharp` | double sharp |
| `bff` / `b-flatflat` | double flat |

Never write `c#`, `c♯`, `cis`, `bes`, or `gis`. Those are other languages or
not LilyPond.

Default LilyPond (Dutch) uses `cis` and `bes`. This skill does not. If you omit
`\language "english"`, English names will fail to compile.

## Durations

`1` whole, `2` half, `4` quarter, `8` eighth, `16` sixteenth, `32` thirty-second.
A dot lengthens by half: `4.` is a dotted quarter. `4..` is double-dotted.

**Duration persists until you write another one.** `c4 d e f8 g a4` is quarter,
quarter, quarter, eighth, eighth, quarter. This is the usual cause of a bar
check warning.

Tied notes: `c4 ~ c4` or `c4~ 4`. The second form reuses the pitch.

Rests: `r4` is a rest on the staff. `R1` is a full-measure rest (use the
measure's full duration, so `R2.` in 3/4). `s4` is an invisible spacer.

Pickup: `\partial 4` before the first incomplete bar.

Tuplets: `\tuplet 3/2 { c8 d e }` is a triplet of eighths in the time of two.
Do not use the old `\times 2/3 { }` form.

## Octaves

Absolute: `c` is C below middle C, `c'` is middle C, `c''` is the octave above,
`c,` is the octave below `c`.

`\relative c'' { ... }` places each note as close as possible to the previous
one (interval of a fourth or less, ignoring accidentals). `'` forces an octave
up from that guess, `,` forces an octave down. The first pitch is relative to
the start pitch.

If one leap is wrong, every later note in that `\relative` block may be wrong.
Fix the first bad octave mark and recompile. Nested `\relative` blocks each
start from their own start pitch.

`\fixed c'' { c d e }` writes in that octave unless a note has its own `'` or
`,`. Use `\fixed` when the music leaps and `\relative` is fighting you.

## Bar checks

End every complete bar with `|`. LilyPond warns when the durations in that bar
do not add up to the time signature. Treat those warnings as errors and fix the
rhythm. Do not delete the `|` to silence them.

## Simultaneous music

`<< ... >>` means simultaneous. `{ ... }` means sequential.

Chords as notes: `<c e g>4`. Duration goes after the `>`.

Two voices on one staff:

```
\new Staff <<
  \new Voice { \voiceOne c''4 d'' e''2 }
  \new Voice { \voiceTwo c'4 b c'2 }
>>
```

`\voiceOne` / `\voiceTwo` set stem direction. For a solo line, one Voice is
enough.

## Staves

Solo: `\new Staff { ... }`.

Piano:

```
\new PianoStaff \with { instrumentName = "Piano" } <<
  \new Staff { \clef treble \global \rightHand }
  \new Staff { \clef bass \global \leftHand }
>>
```

Choir:

```
\new ChoirStaff <<
  \new Staff \with { instrumentName = "Soprano" } { \clef treble ... }
  \new Staff \with { instrumentName = "Alto" } { \clef treble ... }
  \new Staff \with { instrumentName = "Tenor" } { \clef "treble_8" ... }
  \new Staff \with { instrumentName = "Bass" } { \clef bass ... }
>>
```

String quartet: `\new StaffGroup` with violin I, violin II, viola (`\clef alto`),
cello (`\clef bass`).

Other clefs: `treble`, `bass`, `alto`, `tenor`, `"treble_8"`.

`\transpose c d { ... }` transposes written music. MIDI follows the transposed
pitches. For a B-flat clarinet part, transpose from concert pitch with
`\transpose bf c`.

## Articulation, dynamics, slurs

Attach to the note: `c4-.` staccato, `c4--` tenuto, `c4->` accent,
`c4\fermata`.

Slurs: `c4( d e f)`. Phrasing slurs: `c4\( d e f\)`. Ties are `~`, slurs are
`()`. Do not use a slur where the pitch repeats; that is a tie.

Dynamics: `c4\p`, `\mp`, `\mf`, `\f`, `\ff`, `\fp`. Hairpins:
`c4\< d e f\!` or `c4\> d e f\p`.

Markup above a note: `c4^"solo"`. Below: `c4_"pizz."`.

## Repeats

```
\repeat volta 2 {
  c4 d e f |
}
\alternative {
  { g4 f e d | }
  { g2 c | }
}
```

`\repeat unfold 2 { ... }` writes the music out twice on the page (useful when
MIDI should play a repeat that volta does not expand the way you want). For
ordinary scored repeats, `volta` is enough; LilyPond's MIDI plays volta
repeats.

## Lyrics

```
melody = \relative c'' { c4 d e f | g1 | }
words = \lyricmode { Hel -- lo world. }

\score {
  <<
    \new Voice = "tune" { \melody }
    \new Lyrics \lyricsto "tune" { \words }
  >>
  \layout { }
  \midi { }
}
```

`--` splits a syllable across notes. `_` extends a syllable. `\addlyrics { ... }`
is a shorter form for a single verse under a single voice.

## Lead sheet

```
harmonies = \chordmode { a1:m | d:m | e:7 | a:m | }
melody = \relative c'' { a4 b c d | e2 a | }

\score {
  <<
    \new ChordNames { \harmonies }
    \new Staff { \melody }
  >>
  \layout { }
  \midi { }
}
```

`\chordmode` uses durations like notes. `:m` minor, `:7` dominant, `:maj7`
major seventh, `:dim` diminished, `:aug` augmented, `:m7.5-` half-diminished.
`\chordmode` ignores `\relative`.

## MIDI

Set an instrument on each staff with a General MIDI name:

```
\set Staff.midiInstrument = "violin"
```

The piano is `"acoustic grand"`, not `"piano"`. Other names this skill uses often:

```
acoustic grand, harpsichord, church organ, violin, viola, cello, contrabass,
pizzicato strings, orchestral harp, timpani, string ensemble 1, choir aahs,
trumpet, trombone, french horn, oboe, english horn, bassoon, clarinet,
flute, piccolo, recorder, acoustic guitar (nylon), acoustic bass
```

Use only names from LilyPond's MIDI instruments table. Do not invent
`"strings"`, `"piano"`, `"horn"`, or `"soprano"`.

`\tempo 4 = 120` before the music sets MIDI playback speed. Without it, MIDI
is quarter = 60.

Dynamics affect MIDI volume. `\midi { }` inside `\score` is what writes the
`.midi` file.

## Common compile failures

| Symptom | Usual cause |
| --- | --- |
| `unknown escaped string` | Invented command, or Dutch name with `\language "english"` missing |
| `not a note name` | `c#`, `cis` under English, or a typo |
| bar check warning | Duration did not fill the bar; last duration persisted |
| `unfinished slur` / `unterminated tie` | Missing `)` or `~` partner |
| PDF exists, no MIDI | `\midi { }` missing from `\score` |
| MIDI exists, no PDF | `\layout { }` missing from `\score` |
| notes in the wrong octave | First bad `\relative` leap |
| `error: cannot find` an include | Do not `\include` files this skill did not write |

LilyPond often still writes a PDF when it only warns. Fix warnings anyway.

## What not to write

- Scheme: `#` procedures, `#(define ...)`, `\override` chains, unless the user
  asked for layout work that needs them.
- `\include` of anything except a file you just wrote in this project.
- Frescobaldi, Python (Abjad), or music21 as a substitute for `.ly`.
- A fragment without `\score`. It will not produce MIDI.

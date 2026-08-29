# Strudel code guide

This is a compact working reference for writing Strudel code. It is not a
complete API contract and may lag behind Strudel. For current documentation and
topic-specific links, use [official-docs.md](official-docs.md). If the two
disagree, follow the official documentation.

Last reviewed against strudel.cc: 2026-08-29.

## What Strudel Is
- Strudel is a browser-based live coding environment based on Tidal Cycles.
- Patterns are expressed as functions chained together in JavaScript.
- Time is organized into repeating **cycles** (default 1 cycle/second = 60 cpm via `setcps(1)`).

## Tempo (CPM vs BPM)
- `.cpm(n)` sets **cycles per minute**, not beats per minute. Never pass a BPM value directly to `.cpm()`.
- For standard 4/4 patterns where one cycle = one bar (4 beats), convert BPM to CPM: **`.cpm(bpm/4)`**
  - 120 BPM → `.cpm(30)`
  - 140 BPM → `.cpm(35)`
  - 150 BPM → `.cpm(37.5)`
- Structure drum patterns so one cycle equals one bar for predictable tempo, e.g. `s("bd*4, ~ sd*2, hh*8")`.
- `.cpm(120)` does **not** mean 120 BPM — in 4/4 it plays at ~480 BPM. This is the most common tempo mistake.
- When the user does not specify a tempo, omit `.cpm()` and rely on the default (~60 cpm), matching the examples.

## Core Syntax
- Functions take arguments in parentheses and can be chained with dots:
  `note("c a f e").s("piano").lpf(800)`
- Double quotes `"..."` and backticks `` `...` `` define pattern strings (mini-notation).
- Single quotes `'...'` are plain strings, not parsed as mini-notation.
- Comments: `//` for line comments, `/* ... */` for block comments.
- Order matters: `note("c a f e").s("piano")` works; `s("piano").note("c a f e")` plays only the first note because `s` creates a one-event pattern.
- Custom reusable chained functions via `register`:
  ```
  const myFx = register('myFx', (pat) => pat.s("sawtooth").cutoff(500).room(0.5))
  note("a3 c#4 e4 a4").myFx()
  ```

## Multiple Patterns with $:
- Use `$:` to define multiple concurrent patterns (each on its own line):
  ```
  $: s("bd sd [~ bd] sd, hh*8")
  $: note("c3 e3 g3 c4").s("sawtooth").lpf(800)
  ```
- Each `$:` line is an independent pattern that plays simultaneously.

## Mini-Notation Essentials
- A pattern string is a sequence of events inside quotes.
- Events share the cycle duration; more events = shorter durations per event.
- Rests: `~` or `-` create silence.
- Brackets:
  - `[]` group events to subdivide time within one slot: `"e5 [b4 c5] d5 [c5 b4]"` — bracketed pairs share one slot.
  - `<>` alternate groups across cycles: `"<a b c>"` plays `a` in cycle 1, `b` in cycle 2, etc. Equivalent to `"[a b c]/3"`.
- Speed and length:
  - `*n` speeds up (more events per cycle): `"[c d e]*2"` plays the group twice per cycle. Supports decimals: `*2.75`.
  - `/n` slows down (spread across n cycles): `"[c d e]/2"` takes 2 cycles to complete. Supports decimals.
  - `!n` repeats without speeding up: `"a!3"` is `"a a a"` (3 slots).
  - `@n` elongation — gives an event proportional weight: `"a@2 b c"` means `a` takes 2/4, `b` takes 1/4, `c` takes 1/4.
- Parallel / polyphony with commas:
  - `"c3,e3,g3"` plays all three simultaneously (a chord).
  - `"[g3,b3,e4] [a3,c3,e4]"` sequences chords.
- Randomness:
  - `?` drops events with 50% chance. `?0.3` = 30% drop chance.
  - `|` chooses randomly from alternatives: `"a | b | c"`.
- Euclidean rhythms: `bd(3,8)` = 3 beats distributed over 8 segments.
  - With offset: `bd(3,8,2)` rotates the pattern by 2 steps.
  - Beats param controls density, segments param controls grid size.
- Sample variant selection with `:` — `"hh:0 hh:1 hh:2"` selects specific samples.

## Pattern Constructors (JavaScript equivalents of mini-notation)

| Function | Mini-notation |
|---|---|
| `seq(x, y)` | `"x y"` |
| `cat(x, y)` | `"<x y>"` |
| `stack(x, y)` | `"x,y"` |
| `stepcat([3,x],[2,y])` | `"x@3 y@2"` |
| `polymeter([a,b,c],[x,y])` | `"{a b c, x y}"` |
| `polymeterSteps(2, x, y, z)` | `"{x y z}%2"` |
| `silence` | `"~"` |
| `arrange([4, "bd sd"], [2, "hh*4"])` | plays first part for 4 cycles, then second for 2 |
| `run(n)` | generates `0` to `n-1` |
| `binary(n)` | converts number to binary rhythm |
| `binaryN(n, length)` | binary rhythm with fixed length |

## Pitch and Notes
- Note names: `note("a3 c#4 e4 a4")` — letter + optional sharp `#` or flat `b` + octave.
- MIDI numbers: `note("57 61 64 69")` — integer or decimal for microtonal.
- Frequency: `freq("220 275 330 440")` — Hz directly.
- Scale steps: `n("0 2 4 6").scale("C:minor")` — index into a named scale.
- Default sound when only `note` is set: `triangle` waveform.

### Scales
- `n("0 1 2 3 4 5 6 7").scale("C4:minor")` — many scales available.
- Scale format: `"<root><octave>:<scale_name>"` e.g. `"A1:minor:pentatonic"`, `"C4:bebop major"`.
- Use single quotes for scale names with spaces: `.scale('C minor')`.

### Chords and Voicings
- `chord("<C^7 A7b13 Dm7 G7>")` sets chord symbols.
- `.voicing()` turns chord symbols into voiced notes.
- `.dict('ireal')` selects chord dictionary.
- `.mode("root:g2")` sets voicing mode/root.
- `.voicings('lefthand')` is an older syntax for voicing style.
- `.rootNotes(octave)` extracts root notes from chord symbols.

### Transposition
- `.transpose(semitones)` — transposes by semitones: `.transpose("<0 -2 5 3>")`.
- `.transpose("<1P -2M 4P 3m>")` — scientific interval notation.
- `.scaleTranspose(steps)` — transpose within current scale.
- `.add(note(12))` — add an octave (12 semitones).
- `.sub(12)` — subtract from note value.

## Sounds: Samples and Synths
- `s("bd sd hh")` plays samples from the default sample map.
- `s("sawtooth square")` plays synth waveforms.
- Combine pitch and sound: `note("c3 e3 g3").s("sawtooth")`.

### Default Sample Names

| Drum | Abbreviation |
|---|---|
| Bass drum / Kick | `bd` |
| Snare drum | `sd` |
| Rimshot | `rim` |
| Clap | `cp` |
| Closed hi-hat | `hh` |
| Open hi-hat | `oh` |
| Crash | `cr` |
| Ride | `rd` |
| High tom | `ht` |
| Medium tom | `mt` |
| Low tom | `lt` |
| Shaker | `sh` |
| Cowbell | `cb` |
| Tambourine | `tb` |
| Other percussion | `perc` |
| Miscellaneous | `misc` |
| Effects | `fx` |

### Sound Banks
- `bank("RolandTR808")` prefixes drum names with a machine name.
- Pattern the bank: `.bank("<RolandTR808 RolandTR909>")`.

### Sample Selection
- `n("0 1 2 3")` selects sample variants (0-indexed). Numbers wrap if too high.
- In mini-notation: `"hh:0 hh:1 hh:2 hh:3"`.

### Loading Custom Samples
- From URLs:
  ```
  samples({
    bassdrum: 'bd/BT0AADA.wav',
    snaredrum: ['sd/rytm-01-classic.wav', 'sd/rytm-00-hard.wav'],
  }, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/')
  s("bassdrum snaredrum:0 bassdrum snaredrum:1")
  ```
- From strudel.json: `samples('https://example.com/strudel.json')`
- GitHub shortcut: `samples('github:user/repo')` (expects `strudel.json` at root).
- Shabda (freesound): `samples('shabda:bass:4,hihat:4,rimshot:2')`
- Pitched samples with note-mapped regions:
  ```
  samples({
    'moog': {
      'g2': 'moog/004_Mighty%20Moog%20G2.wav',
      'g3': 'moog/005_Mighty%20Moog%20G3.wav',
    }
  }, 'github:tidalcycles/dirt-samples')
  ```
- `soundAlias('RolandTR808_bd', 'kick')` — create aliases.

### Sampler Effects (sample playback control)
- `begin(0.25)` / `end(0.75)` — play portion of sample (0 to 1).
- `loop(1)` — loop the sample.
- `loopBegin(0.2)` / `loopEnd(0.8)` — set loop region.
- `cut(1)` — cut group; new sound in same group cuts the old one.
- `clip(1)` / `legato(1)` — fit sample to event duration.
- `loopAt(n)` — loop sample over n cycles.
- `fit(1)` — time-stretch sample to fit event.
- `chop(n)` — slice sample into n pieces played in order.
- `striate(n)` — like chop but interleaves slices.
- `slice(n, pat)` — slice into n pieces, play by index pattern.
- `splice(n, pat)` — like slice but time-stretched.
- `speed(2)` — playback speed (negative = reverse). `speed(-1)` plays backwards.
- `scrub(signal)` — scrub through a sample with a signal.

### Synths (built-in synthesizers)
- Basic waveforms: `sine`, `sawtooth`, `square`, `triangle` — via `s()`.
- `supersaw` — a detuned sawtooth synth.
- Noise sources: `white`, `pink`, `brown` — use as `s("white")`.
- `crackle` — subtle noise crackles, controlled by `.density(0.2)`.
- Adding noise to oscillators: `.noise(0.5)` mixes pink noise.
- Default waveform when only `note` is used: `triangle`.

#### Additive Synthesis
- `partials([1, 0, 0.3, 0, 0.1])` — set harmonic magnitudes.
- `phases([...])` — set harmonic phases.
- `sound("user").partials([...])` — construct custom waveforms.
- Supports pattern arrays: `.partials([1, 0, "0 1", rand])`.
- Works with list generators: `.partials(randL(10))`.

#### Vibrato
- `vib(speed)` — vibrato speed (e.g. `vib(4)` or `vib("4:.1")` for speed:depth).
- `vibmod(depth)` — vibrato modulation depth.

#### FM Synthesis
- `fm(amount)` — FM modulation amount.
- `fmh(ratio)` — modulator frequency ratio (e.g. `fmh(2)` = 2x carrier freq).
- `fmattack`, `fmdecay`, `fmsustain` — FM envelope.
- `fmenv(depth)` — FM envelope depth.

#### Wavetable Synthesis
- Samples with `wt_` prefix are loaded as wavetables: `s('wt_flute')`.
- Uses the AKWF default wavetable set (1000+ tables).
- `loopBegin`/`loopEnd` scan over the wavetable.

#### ZZFX Synths (Zuper Zmall Zound Zynth)
- Waveforms: `z_sawtooth`, `z_tan`, `z_noise`, `z_sine`, `z_square`.
- Special params: `curve(1-3)`, `slide`, `deltaSlide`, `zmod` (FM speed), `zcrush` (bit crush 0-1), `zdelay`, `pitchJump`, `pitchJumpTime`, `lfo`, `zrand` (randomization).

## Effects and Modulation

### Signal Chain (order of processing)
1. Sound generated (sample or oscillator)
2. Detune-based effects (`detune`, `penv`)
3. Phase vocoder (`stretch`)
4. Gain (main ADSR envelope applies here)
5. Lowpass filter (`lpf`)
6. Highpass filter (`hpf`)
7. Bandpass filter (`bpf` / `bandpass`)
8. Vowel filter (`vowel`)
9. Sample rate reduction (`coarse`)
10. Bit crushing (`crush`)
11. Waveshape distortion (`shape`)
12. Distortion (`distort`)
13. Tremolo
14. Compressor
15. Panning (`pan`)
16. Phaser
17. Postgain (`postgain` / `post`)
18. Split to: dry output, delay send, reverb send
19. All mixed in orbit → master output

Effects are single-use: you cannot chain the same effect twice (the second overrides the first).

### Filters
- `lpf(cutoff)` — lowpass filter. `lpq(resonance)` — Q value.
- `hpf(cutoff)` — highpass filter. `hpq(resonance)`.
- `bpf(cutoff)` — bandpass filter. `bpq(resonance)`.
- `ftype('24db')` — filter type (steeper rolloff).
- `vowel("a e i o u")` — vowel formant filter.

### Amplitude Envelope (ADSR)
- `attack(seconds)` — fade in time (default ~0.001).
- `decay(seconds)` — time to fall from peak to sustain level.
- `sustain(level)` — sustain level 0–1 (default 1).
- `release(seconds)` — fade out time after event ends.
- `adsr("a:d:s:r")` — shorthand for all four.

### Filter Envelopes
Each filter has its own ADSR envelope controlling the cutoff dynamically:
- Lowpass: `lpenv(depth)`, `lpa(attack)`, `lpd(decay)`, `lps(sustain)`, `lpr(release)`.
  - Long forms: `lpattack`, `lpdecay`, `lpsustain`, `lprelease`.
- Highpass: `hpenv`, `hpa`, `hpd`, `hps`, `hpr`.
- Bandpass: `bpenv`, `bpa`, `bpd`, `bps`, `bpr`.

### Pitch Envelope
- `penv(depth)` — pitch envelope depth in semitones.
- `pattack` / `patt` — pitch attack time.
- `pdecay` / `pdec` — pitch decay time.
- `prelease` — pitch release time.
- `pcurve` — pitch envelope curve shape.
- `panchor(0)` — pitch anchor point (0 = start from shifted pitch to normal).

### Dynamics
- `gain(level)` — volume 0–1+ (default ~0.8).
- `velocity(level)` — note velocity 0–1.
- `compressor(threshold)` — dynamic compression (e.g. `compressor(-20)`).
- `postgain(level)` — gain applied after effects chain.
- `xfade(amount)` — crossfade between patterns.

### Panning
- `pan(position)` — 0 = left, 0.5 = center, 1 = right.
- `jux(fn)` — apply `fn` to a copy panned right, original panned left: `.jux(rev)`.
- `juxBy(amount, fn)` — `jux` with controllable stereo width (0–1).

### Waveshaping / Distortion
- `distort(amount)` — distortion (0 = none, higher = more).
- `shape(amount)` — waveshape distortion.
- `crush(bits)` — bit crusher (lower = more crushed).
- `coarse(rate)` — sample rate reduction.

### Global Effects (shared per orbit)
- `orbit(n)` — assign to orbit group (default 1). Different orbits get separate delay/reverb.

#### Delay
- `delay(amount)` — delay send amount (0–1).
- `delaytime(seconds)` — delay time.
- `delayfeedback(amount)` — feedback amount (0–1).

#### Reverb
- `room(amount)` — reverb send amount (0–1).
- `roomsize(size)` — reverb size.
- `roomfade(seconds)` — reverb decay time.
- `roomlp(freq)` — reverb lowpass.
- `roomdim(freq)` — reverb damping.
- `iresponse(url)` — convolution reverb from impulse response.

#### Phaser
- `phaser(speed)` — phaser rate.
- `phaserdepth(amount)` — modulation depth.
- `phasercenter(freq)` — center frequency.
- `phasersweep(amount)` — sweep width.

#### Ducking (sidechain-like)
- `duckorbit(n)` — duck against orbit n.
- `duckattack(seconds)` — duck attack time.
- `duckdepth(amount)` — duck amount.

### Amplitude Modulation
- `am(speed)` — amplitude modulation.
- `tremolodepth(amount)`, `tremolosync(rate)`, `tremoloskew`, `tremolophase`, `tremoloshape`.

### Continuous Parameter Changes
Parameters are only sampled when a sound event triggers. For smooth changes, use `seg(n)` to generate `n` events per cycle:
```
s("supersaw").seg(16).lpf(tri.range(100, 5000).slow(2))
```
Truly continuous parameters: ADSR curves, pitch envelope, FM envelope, filter envelopes, tremolo, phaser, vibrato, ducking.

## Time Modifiers

| Function | Mini equivalent | Description |
|---|---|---|
| `.slow(n)` | `"x/n"` | Slow down by factor n |
| `.fast(n)` | `"x*n"` | Speed up by factor n |
| `.euclid(beats,segs)` | `"x(3,8)"` | Euclidean rhythm |
| `.euclidRot(b,s,rot)` | `"x(3,8,1)"` | Euclidean with rotation |

- `rev` — reverse pattern.
- `palindrome` — play forward then backward.
- `iter(n)` — shift pattern left by 1/n each cycle. `iterBack` shifts right.
- `ply(n)` — repeat each event n times.
- `segment(n)` — quantize to n equal steps per cycle.
- `compress(start, end)` — squeeze pattern into time range (0–1).
- `zoom(start, end)` — zoom into time range.
- `linger(fraction)` — repeat only the first fraction of the pattern.
- `fastGap(n)` — speed up leaving a gap.
- `early(time)` / `late(time)` — shift timing forward/backward.
- `inside(n, fn)` — apply fn as if the pattern were n times faster.
- `outside(n, fn)` — apply fn as if the pattern were n times slower.
- `clip(n)` / `legato(n)` — set note length relative to event (1 = full, <1 = staccato, >1 = overlap).
- `euclidLegato(beats, segs)` — euclidean with legato notes.
- `cpm(n)` — set cycles per minute (not BPM; use `bpm/4` for 4/4 bar-per-cycle patterns).
- `setcpm(n)` — global cycles per minute (e.g. `setcpm(140/4)` for 140 BPM in 4/4).
- `swing(amount)` — add swing feel.
- `swingBy(amount, division)` — swing with specific subdivision.
- `ribbon` — treat pattern as a continuous ribbon of events.

## Continuous Signals (LFOs)
Signals are continuous value streams sampled at event times.

| Signal | Range | Description |
|---|---|---|
| `sine` | 0 to 1 | Sine wave |
| `cosine` | 0 to 1 | Cosine wave |
| `saw` | 0 to 1 | Sawtooth wave |
| `tri` | 0 to 1 | Triangle wave |
| `square` | 0 to 1 | Square wave |
| `rand` | 0 to 1 | Random values |
| `perlin` | 0 to 1 | Smooth noise |
| `sine2` / `cosine2` / `saw2` / `tri2` / `square2` / `rand2` | -1 to 1 | Bipolar versions |

- `.range(min, max)` — remap signal: `sine.range(200, 2000)`.
- `.slow(n)` / `.fast(n)` on signals to control LFO speed.
- `irand(n)` — random integer from 0 to n-1.
- `brand` — binary random (0 or 1). `brandBy(prob)` — with probability.
- `mouseX` / `mouseY` — mouse position signals (0–1).
- `run(n)` — generates sequence 0 to n-1.

## Random Modifiers
- `degrade` — randomly drop 50% of events. `degradeBy(prob)` — set probability.
- `undegrade` / `undegradeBy(prob)` — randomly *add* events.
- `sometimes(fn)` — apply fn ~50% of the time.
- `sometimesBy(prob, fn)` — apply fn with probability.
- `often(fn)` — apply ~75%. `rarely(fn)` — apply ~25%.
- `almostAlways(fn)` — apply ~90%. `almostNever(fn)` — apply ~10%.
- `always(fn)` / `never(fn)` — apply 100% / 0%.
- `someCycles(fn)` — apply fn to ~50% of cycles. `someCyclesBy(prob, fn)`.
- `choose(a, b, c)` — pick randomly from values each event.
- `wchoose([a, 0.5], [b, 0.3], [c, 0.2])` — weighted random choice.
- `chooseCycles(a, b, c)` — pick randomly each cycle.
- `wchooseCycles(...)` — weighted choice per cycle.

## Conditional Modifiers
- `when(condFn, fn)` — apply fn when condition is true.
- `firstOf(n, fn)` — apply fn on the first of every n cycles.
- `lastOf(n, fn)` — apply fn on the last of every n cycles.
- `chunk(n, fn)` — apply fn to a different 1/n chunk each cycle. `chunkBack` reverses direction.
- `struct("t f t f")` — impose a boolean rhythmic structure.
- `mask("t f t f")` — remove events where the mask is false.
- `reset(pat)` — restart the pattern on each event of pat.
- `restart(pat)` — like reset but also restarts the cycle.
- `hush` — silence the pattern.
- `invert` — swap active/silent parts.
- `arp("up")` — arpeggiate chords. Modes: `"up"`, `"down"`, `"updown"`, `"downup"`, `"converge"`, `"diverge"`, `"random"`.
- `pick(index, ...patterns)` — select pattern by index.
- `inhabit({name: pattern, ...})` — select pattern by name.
- `squeeze(pat, ...patterns)` — fit patterns into the structure of pat.

## Accumulation Modifiers (layering)
- `superimpose(fn)` — play original + transformed copy: `.superimpose(x => x.add(note(12)))`.
- `layer(fn1, fn2, ...)` — apply multiple transforms and stack results.
- `off(time, fn)` — superimpose with a time offset: `.off(1/8, x => x.add(12))`.
- `echo(n, time, feedback)` — repeat with delay and feedback.
- `echoWith(n, time, fn)` — echo applying fn to each repetition.
- `stut(n, feedback, time)` — stutter effect.

## Value Modifiers (arithmetic on patterns)
- `.add(value)` — add to pattern values: `note("c3").add(7)`.
- `.sub(value)` — subtract.
- `.mul(value)` — multiply.
- `.div(value)` — divide.
- `.set(pat)` — combine control patterns.
- `.add(note(12))` — add 12 semitones (one octave).
- These accept pattern arguments: `.add("<0 7 12>")`.

## Tonal Functions
- `scale("C:minor")` — constrain `n` values to a scale.
- `chord("<C^7 Dm7 G7>")` — define chord progression.
- `voicing()` — voice chords automatically.
- `dict('ireal')` — select chord dictionary (ireal, lefthand, etc.).
- `mode("root:g2")` — set voicing root/mode.
- `rootNotes(octave)` — extract chord roots.
- `transpose(semitones)` — chromatic transposition.
- `scaleTranspose(steps)` — diatonic transposition.

## Stepwise Patterning (Experimental)
Step-based functions use "step count" rather than cycle time:
- `stepcat(patA, patB)` — concatenate by step count (not cycle count).
- `stepalt(patA, patB)` — alternate by steps.
- `expand(n)` — make steps n times longer.
- `contract(n)` — make steps n times shorter.
- `pace(n)` — set steps per cycle.
- `extend(n)` — repeat pattern n times.
- `take(n)` — take first n steps.
- `drop(n)` — drop first n steps.
- `polymeter([a,b,c],[x,y])` — polymetric patterns.
- `shrink(n)` / `grow(n)` — modify step size.
- `tour` — sequential arrangement.
- `zip` — interleave step patterns.
- `^` in mini-notation changes step counting level: `"a [^b c] d e"` counts b and c as individual steps.

## Mondo Notation (Alternative Syntax)
Mondo uses `#` for chaining instead of `.`:
```
mondo`n 0..7 # scale C:minor # jux rev # dec .2 # delay .5`
```
is equivalent to:
```
n("0 1 2 3 4 5 6 7").scale("C:minor").jux(rev).dec(.2).delay(.5)
```
- Functions called with spaces instead of parentheses: `s hh*8` = `s("hh*8")`.
- `#` chains functions: `s bd # bank tr909` = `s("bd").bank("tr909")`.
- Local application with parens: `s [bd hh bd (cp # delay .6)]`.
- Lambda shorthand: `# sometimes (# dec .1)` = `.sometimes(x => x.dec(.1))`.
- `$` separates multiple patterns.
- `def varName pattern` defines variables.
- Operators: `*` fast, `/` slow, `!` extend, `@` expand, `%` pace, `?` degrade, `:` tail/list, `..` range, `,` stack, `|` choose.

## Xenharmonic Functions (Experimental)
For non-standard tuning systems:
- `i("0 1 2 3 4 5").tune("hexany15").mul(220).freq()` — index into a named tuning.
- Available tunings: `hexany1`, `hexany15`, `iraq`, `gumbeng`, `gunkali`, `tranh3`, `sanza`, and more from tunejs.
- `getFreq('c3')` — get frequency for a note name.
- `.mul("<c3 d3>".fmap(getFreq))` — map note names to frequencies.
- `.xen(ratios)` — define custom scales via ratios or EDO.
- Full list: http://abbernie.github.io/tune/scales.html

## Visual Feedback
- `punchcard()`, `pianoroll()`, `scope()`, `spectrum()`, `spiral()`, `pitchwheel()`.
- Prefix with `_` for inline visuals: `._punchcard()`, `._scope()`.
- `punchcard` shows post-transform state; `pianoroll` shows pre-transform.
- `color("cyan magenta")` styles visuals and mini-notation highlights.
- `markcss(cssString)` — custom CSS for highlight marks.

## Input and Output
### MIDI
- `.midi()` or `.midi('IAC Driver')` — send to MIDI output.
- `.midichan(n)` — select MIDI channel (1–16).
- `.ccn(74).ccv(sine.slow(4))` — send CC messages.
- `.control([74, sine.slow(4)])` — alternative CC syntax.
- `.midibend(amount)` — pitch bend (-1 to 1).
- `.miditouch(amount)` — aftertouch (0 to 1).
- `.progNum(n)` — program change (0–127).
- `.midiport('name')` — select MIDI device.
- `midin()` / `midikeys()` — receive MIDI input.

### OSC
- `.osc()` — send to SuperDirt/SuperCollider via OSC bridge.

### MQTT
- `.mqtt(user, pass, topic, url, clientId, latency)` — send to MQTT broker.

## Music Metadata
Optional tags in comments:
```
// @title My Song
// @by Author Name
// @license CC-BY-SA-4.0
```
Tags: `@title`, `@by`, `@license`, `@details`, `@url`, `@genre`, `@album`, `@tag`.

## Complete Example Patterns

### Drum Beat
```
$: s("bd sd [~ bd] sd, hh*8").bank("RolandTR909")
```

### Melodic Pattern with Effects
```
$: note("a3 c#4 e4 a4")
  .s("sawtooth")
  .cutoff(500)
  .room(0.5)
  .delay(0.25)
```

### Chord Progression with Bass
```
$: chord("<C^7 A7b13 Dm7 G7>*2").voicing()
  .s("sawtooth").cutoff(800).gain(0.3)
$: "<C2 A1 D2 G1>*2".note()
  .s("sawtooth").cutoff(400).gain(0.4)
```

### Layered Pattern with Accumulation
```
$: n("<0 2 4 [3 1] -1>*4")
  .scale("C4:minor")
  .off(1/8, x => x.add(12).degradeBy(0.5))
  .superimpose(x => x.add(0.05))
  .s("sawtooth")
  .decay(0.15).sustain(0)
  .cutoff(sine.slow(7).range(300, 5000))
  .jux(rev)
```

### Full Track Structure
```
$: s("bd, [~ <sd!3 sd(3,4,2)>], hh*8")
  .speed(perlin.range(0.7, 0.9))

$: note("<a1 b1*2 a1(3,8) e2>")
  .off(1/8, x => x.add(12).degradeBy(0.5))
  .add(perlin.range(0, 0.5))
  .superimpose(add(0.05))
  .s("sawtooth").decay(0.15).sustain(0)
  .gain(0.4).cutoff(sine.slow(7).range(300, 5000))

$: chord("<Am7!3 <Em7 E7b13 Em7 Ebm7b5>>")
  .voicings('lefthand')
  .superimpose(x => x.add(0.04))
  .add(perlin.range(0, 0.5))
  .note().s("sawtooth").gain(0.16)
  .cutoff(500).attack(1)
```

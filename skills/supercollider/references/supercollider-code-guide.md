# SuperCollider code guide

Use this compact guide for core SuperCollider 3.14 patterns. Consult the
[official help](https://docs.supercollider.online/) when a class, method, or
argument is absent or uncertain.

## Complete file shape

Wrap a whole piece in parentheses so the IDE can evaluate it as one expression.
Wait for the audio server before adding SynthDefs or starting patterns.

```supercollider
(
s.waitForBoot {
    SynthDef(\voice, { |out = 0, freq = 220, amp = 0.1, gate = 1|
        var env = EnvGen.kr(Env.adsr, gate, doneAction: 2);
        var sig = LPF.ar(Saw.ar(freq), 1800) * env * amp;
        Out.ar(out, Pan2.ar(sig));
    }).add;

    s.sync;

    Pdef(\music, Pbind(
        \instrument, \voice,
        \scale, Scale.minor,
        \degree, Pseq([0, 2, 4, 7], inf),
        \dur, 0.25,
        \amp, 0.08
    )).play(TempoClock.default);
};
)
```

Use `s = Server.default` only when a file needs a local alias. The interpreter
already defines `s` conventionally, but explicit assignment can make a
standalone file clearer.

## Tempo

`TempoClock` measures beats per second, not beats per minute.

```supercollider
TempoClock.default.tempo = 112 / 60;
```

Patterns usually express `\dur` in beats. Use `Ppar` for simultaneous pattern
parts and `Pseq` for ordered sections.

## SynthDefs

- Use `doneAction: 2` on a finite envelope to free its synth.
- Use `Out.ar` for audio and `Out.kr` for control buses.
- Return stereo with `Pan2`, `Splay`, or an intentional two-channel signal.
- Keep ordinary voice amplitudes near `0.05` to `0.2` before summing.
- Call `s.sync` after `.add` when playback starts immediately afterward.
- Use `Lag`, `VarLag`, or envelopes for abrupt controls that would click.

Avoid third-party UGens unless the user asked for them. Core choices include
`SinOsc`, `Saw`, `Pulse`, `WhiteNoise`, `PinkNoise`, `BPF`, `LPF`, `RLPF`,
`CombC`, `AllpassC`, `FreeVerb`, `DelayC`, `EnvGen`, and `Demand`.

## Patterns

Use named `Pdef` objects for pieces designed for reevaluation.

```supercollider
Pdef(\bass, Pbind(
    \instrument, \bass,
    \midinote, Pseq([36, 36, 43, 39], inf),
    \dur, Pseq([0.5, 0.25, 0.5, 0.75], inf),
    \legato, 0.8,
    \amp, 0.1
));

Pdef(\bass).play;
Pdef(\bass).stop;
```

Use `Pwhite` or `Prand` only when randomness is part of the request. Prefer a
seeded `Pseed` when the user wants repeatable output.

## Routines and cleanup

Store long-lived objects in named environment variables and stop them before
replacing them.

```supercollider
~pulseRoutine.tryPerform(\stop);
~pulseRoutine = Routine({
    loop {
        Synth(\tick);
        0.5.wait;
    }
}).play;
```

Useful cleanup calls:

```supercollider
Pdef(\music).stop;
~pulseRoutine.tryPerform(\stop);
~buffer.tryPerform(\free);
MIDIdef(\controller).free;
OSCdef(\listener).free;
```

## Recording

Use SuperCollider's built-in recorder:

```supercollider
s.record(path: "/absolute/path/take.wav", numChannels: 2);
s.stopRecording;
```

Always stop recording so SuperCollider closes the sound file correctly.

## Common failures

- `Message ... not understood` usually means a misspelled method or wrong
  receiver type.
- `UGen ... not installed` indicates a missing plugin, not a syntax error.
- `SynthDef ... not found` often means playback started before `.add` completed.
  Add `s.sync`.
- A synth that never frees usually lacks a finite envelope with
  `doneAction: 2`, or its gate never closes.
- Silence after clean language output often means the audio server is not
  booted, the output bus is wrong, or amplitude is zero.
- `late` messages point to scheduling or server load, not parsing.

# text-to-strudel

An agent skill for creating, editing, explaining, and repairing Strudel
live-coding music as local `.strudel.js` files.

The skill turns a musical brief into readable Strudel source, checks ordinary
JavaScript and mini-notation syntax, and hands the file back for playback in a
Strudel REPL. It does not generate rendered audio or replace listening with a
syntactic check.

## Repository layout

```text
skills/text-to-strudel/
  SKILL.md
  agents/openai.yaml
  references/
examples/
  dub-at-dawn.strudel.js
```

## Local development

Link the skill into Codex while working on it:

```sh
ln -s /absolute/path/to/text-to-strudel/skills/text-to-strudel \
  ~/.codex/skills/text-to-strudel
```

Then ask Codex to use `$text-to-strudel`, or describe a Strudel composition
request that matches the skill description.

## License

GNU Affero General Public License v3.0 or later. See [LICENSE](LICENSE).

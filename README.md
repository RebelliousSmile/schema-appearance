# Schema Appearance

Open, versioned schemas for cross-game presentation packs. A `game-pack`
describes how a game dresses a reader: CSS custom-property values, supported
light/dark polarities, asset roles, fonts, and per-block zone overrides.

It contains no game mechanics. In particular, it is unrelated to
`schema-pbta`'s `game-definition`, which describes how a game is played.

## Canonical schema

- Zod source: `src/zod/appearance/game-pack.ts`
- JSON Schema Draft 7: `schemas/appearance/game-pack.schema.json`
- Raw URL: <https://raw.githubusercontent.com/RebelliousSmile/schema-appearance/main/schemas/appearance/game-pack.schema.json>

The initial contract reconciles two earlier implementations from
`RebelliousSmile/schema-in-the-mist`: main commit `9535e94` and issue-backed
commit `00669b8`. It preserves the current pack structure while including the
`polarities` and `shapes` fields already consumed by Handbook.

## Development

```sh
npm ci
npm run check
```

The check typechecks the Zod source, regenerates the JSON Schema, and validates
every example with Ajv. Generated output must be committed.

## Fixture provenance and trademarks

The Adrenaline fixture is extracted from
[`RebelliousSmile/schema-adrenaline`](https://github.com/RebelliousSmile/schema-adrenaline).
The City of Mist, :Otherscape, and Legend in the Mist fixtures originate from
[`RebelliousSmile/schema-in-the-mist`](https://github.com/RebelliousSmile/schema-in-the-mist).

City of Mist, :Otherscape, Legend in the Mist, and their logos are trademarks
of Son of Oak Game Studio LLC. Their setting material, art, and trade dress are
the property of Son of Oak Game Studio LLC and/or their respective authors.
The fixtures are retained for schema interoperability and validation.

## License

- Code and generated schemas: MIT — see `LICENSES/CODE-LICENSE.md`.
- Documentation: CC BY 4.0 — see `LICENSES/DOCS-LICENSE.md`.

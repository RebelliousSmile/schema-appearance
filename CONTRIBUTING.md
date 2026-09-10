# Contributing

The Zod source is canonical. Every contract change must include:

1. an update to `src/zod/appearance/game-pack.ts`;
2. regenerated output from `npm run gen`;
3. at least one representative JSON fixture;
4. a passing `npm run check`.

Avoid breaking fields already accepted by the published schema. Discuss
breaking changes in an issue before implementation and document migrations in
the changelog.

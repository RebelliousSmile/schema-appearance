---
objective: "Game appearance packs can optionally declare an ordered, safe, relative stylesheet list while existing token-only packs remain valid."
status: in-progress
---

# Plan: Support stylesheet resources in game appearance packs

## Overview

| Field      | Value                   |
| ---------- | ----------------------- |
| **Goal**   | Add the optional `assets.stylesheets` contract to the canonical game-pack schema, its generated Draft 7 output, and validation coverage.      |
| **Source** | GitHub issue [RebelliousSmile/schema-appearance#1](https://github.com/RebelliousSmile/schema-appearance/issues/1) |

## Phases

| #   | Phase        | File                         |
| --- | ------------ | ---------------------------- |
| 1   | Define the stylesheet resource contract | [`phase-1.md`](./phase-1.md) |
| 2   | Prove compatibility and rejection behavior | [`phase-2.md`](./phase-2.md) |

## Resources

| Source | Verified          |
| ------ | ----------------- |
| [Issue #1](https://github.com/RebelliousSmile/schema-appearance/issues/1) | `assets.stylesheets` must be optional and ordered, accept only safe relative paths, reject duplicates and malformed paths, and preserve token-only packs. |
| [Parent issue schema-in-the-mist#11](https://github.com/RebelliousSmile/schema-in-the-mist/issues/11) | Consumer loading, injection order, removal, and CSS scoping are follow-up responsibilities, outside this schema-only change. |

## Decisions

| Decision   | Why   |
| ---------- | ----- |
| Make stylesheet paths pack-root-relative POSIX paths and validate them in the reusable Zod contract. | A single exported path rule keeps runtime parsing and generated JSON Schema aligned while rejecting traversal and absolute filesystem or URL-like paths before consumers resolve them. |

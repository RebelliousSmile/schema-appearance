# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-09-15

### Deprecated

- Archive this repository as a frozen compatibility record. The active GamePack
  contract, its fixtures, and its validation now belong to Handbook v2.15.0.
- Keep the former raw URL available as a historical snapshot; it is not a
  redirect and no longer receives contract updates.

## [0.2.0] - 2026-09-14

### Added

- Support optional, ordered stylesheet resources in game appearance packs, with
  safe relative-path and duplicate validation in both the Zod and JSON Schema
  contracts.

## [0.1.0] - 2026-09-10

### Added

- Extract the cross-game `game-pack` appearance contract from
  `RebelliousSmile/schema-in-the-mist`.
- Reconcile the contract published on `main` at `9535e94` with the
  issue-backed `polarities` and `shapes` implementation at `00669b8`.
- Validate five fixtures covering Mist Engine packs, named shape overrides,
  and the non-Son-of-Oak Adrenaline pack.

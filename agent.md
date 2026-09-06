# Agent Guide — SVG Downloader

> **Machine-facing repository contract for AI coding agents, autonomous agents, and automation tools.**
>
> Read this file before modifying the repository. The goal is to preserve canonical SVG integrity, deterministic resolution, source provenance, generated-artifact consistency, and the existing product architecture.

## 1. Repository Mission

This repository is a **Verified Multi-Source Brand & Technology SVG Asset Registry**. It is not merely a logo downloader and it is not a collection of AI-generated SVG illustrations.

The system is intended to:

1. Resolve a user query to a canonical brand/technology identity.
2. Discover assets from multiple source adapters.
3. Keep multiple source records and asset variants when available.
4. Select a canonical asset through configurable source policies.
5. Validate SVG/XML structure and integrity.
6. Preserve source provenance, version, license, and hashes.
7. Expose assets through the React UI and download/export workflows.
8. Generate deterministic registry artifacts for engineering use.

**Highest-priority rule: Correctness > Completeness.** If a trustworthy asset cannot be found, the correct result is `unresolved` — never a fabricated logo, placeholder SVG, AI reconstruction, or silently substituted asset.

## 2. Technology Stack

Inspect `package.json` before assuming versions. The current project uses React, TypeScript, Vite, Tailwind CSS, Lucide React, Motion, JSZip, Fast XML Parser, Node.js ESM scripts, Simple Icons, Devicon, and Iconify SVG Logos (`@iconify-json/logos`).

Prefer the existing lockfile/package-manager workflow. Do not casually replace dependency versions or the lockfile.

## 3. High-Level Architecture

```text
User Query
    ↓
Query Normalization
    ↓
Alias Resolution
    ↓
Identity Resolution
    ↓
Asset Family Discovery
    ↓
Role / Context / Variant Matching
    ↓
Source Policy
    ↓
Canonical Asset Selection
    ↓
SVG/XML Validation
    ↓
SHA-256 Integrity
    ↓
Registry + Provenance
    ↓
public/icons + generated artifacts
    ↓
React UI / Download / Export
```

Keep these stages conceptually separate. Do not move source-specific logic into React components merely to fix a data or display problem.

## 4. Repository Areas

Important locations include:

```text
src/App.tsx
src/components/
src/utils/
src/types.ts

scripts/icon-sync.mjs
scripts/icon-doctor.mjs
scripts/lib/
scripts/lib/adapters/

config/aliases.json
config/collections.json
config/source-policies.json

generated/
public/icons/
public/*.json
```

Before editing a file, inspect the current implementation. Do not rely on an old description of the repository when the code disagrees with it.

## 5. Source-of-Truth Rules

When changing behavior, modify the appropriate source-of-truth first.

### Source code

```text
src/
scripts/
```

### Configuration

```text
config/aliases.json
config/collections.json
config/source-policies.json
```

### Generated/runtime artifacts

```text
generated/
public/icons/
public/catalog.json
public/manifest.json
public/conflicts.json
public/sources.json
```

Generated files are outputs of the synchronization pipeline. Do not manually patch generated files as the primary fix.

If a generated artifact is wrong:

1. Identify the upstream cause.
2. Fix the source-of-truth.
3. Regenerate.
4. Verify the result.

## 6. Data Model

Do not model the system as:

```text
brand → one filename → one SVG
```

The intended conceptual model is:

```text
Identity
 ├── canonical asset
 ├── asset family
 │    ├── asset
 │    ├── asset
 │    └── asset
 └── source records
```

An asset should preserve concepts such as:

```text
identityId
assetId
sourceProvider
sourceCollection
sourceId
sourceVersion
sourceUrl
role
context
graphicVariant
file
rawSha256
license
verificationStatus
trustState
```

Important distinctions:

- **Identity** = logical brand or technology.
- **Asset Family** = all trusted assets belonging to that identity.
- **Asset** = a concrete SVG representation.
- **Source Record** = provenance/evidence from a provider.
- **Canonical Asset** = asset selected for a policy/use case.
- **Derived Asset** = generated JSX/Vue/monochrome/etc. representation.

Do not collapse these concepts for convenience.

## 7. Source Providers

The current adapter architecture includes:

```text
scripts/lib/adapters/
├── simpleIconsAdapter.mjs
├── deviconAdapter.mjs
├── svgLogosAdapter.mjs
├── officialAdapter.mjs
└── wikimediaAdapter.mjs
```

When adding a provider:

1. Implement an adapter.
2. Keep provider-specific parsing inside the adapter.
3. Preserve provider/version/source identifiers.
4. Normalize output into the common asset model.
5. Add or update source-policy behavior only where necessary.
6. Add verification/audit coverage.

Do not add provider-specific branches throughout the UI.

### Source semantics

A source provider is not automatically an authority on brand ownership.

Never convert `Wikimedia`, `Iconify`, `Devicon`, or `Simple Icons` into an `Official` UI claim merely because an asset looks correct. Keep source identity, trust, and official authorship semantically separate.

## 8. Canonical Resolution

The resolver should conceptually perform:

```text
normalize
 → alias
 → identity
 → asset family
 → criteria
 → source policy
 → canonical selection
```

Source priority belongs in:

```text
config/source-policies.json
```

Current policy concepts include `brand`, `technology`, `monochrome`, and `official`.

Identity-specific exceptions should normally be configuration-driven rather than hard-coded in the resolver.

Do not add brand-specific resolver branches when the behavior is actually a source preference, variant preference, or identity override.

## 9. Identity, Role, Context, and Variant

These dimensions must not be confused.

### Identity

```text
instagram
github
react
microsoft
```

### Asset role

```text
symbol
logo
wordmark
app-icon
favicon
badge
mark
```

### Usage context

```text
web
desktop
mobile
app-store
social
avatar
favicon
general
```

### Graphic variant

```text
original
plain
line
original-wordmark
plain-wordmark
```

Do not overload one `variant` field with role, platform, and visual treatment. Do not invent a mobile/app/icon variant when the source provides no evidence for it.

## 10. Canonical SVG Integrity

Canonical SVG files are immutable source assets.

### MUST

- Preserve raw source content.
- Preserve provenance.
- Record source version when available.
- Compute and verify SHA-256.
- Validate SVG/XML structure.
- Keep raw and derived representations separate.
- Make failures explicit.

### MUST NOT

- Generate AI brand logos.
- Hand-draw replacement brand paths.
- Create fake fallback SVGs.
- Use `-2.svg`, `-3.svg`, etc. to hide collisions.
- Recolor canonical SVGs with regex.
- Rewrite canonical geometry for presentation.
- Treat brand-color metadata as permission to change SVG fills.
- Replace a failed source with an unverified substitute while reporting success.

## 11. SVG Transformation Rules

Inspect `src/utils/svgHelpers.ts` before changing preview, copy, or download behavior.

### Raw canonical

These operations should originate from the same canonical raw bytes:

```text
raw preview
raw copy
raw download
raw ZIP export
```

### Derived representation

May include:

- React JSX
- Vue SFC
- explicitly requested monochrome output
- engineering wrappers

Derived output must never overwrite or masquerade as the raw canonical asset.

Do not use regex to parse or rewrite arbitrary SVG structure. If transformation is required, use SVG/XML-aware parsing and isolate the transformation from canonical storage.

## 12. Multi-Color Rules

Do not infer SVG correctness from a metadata color field.

A logo can have a `brandColor` value while its canonical SVG is monochrome. Conversely, a multi-color source SVG must remain multi-color unless the user explicitly requests a derived transformation.

Do not accidentally flatten fills, strokes, CSS styles, gradients, masks, or defs. Multi-color detection should be XML/AST-aware rather than based on fragile string counting.

## 13. Collision and Deduplication Rules

Never solve source collisions by renaming files to:

```text
foo-2.svg
foo-3.svg
```

Use deterministic asset identity, source metadata, role, and variant information.

Where multiple source records contain identical bytes, compare SHA-256 values. Identical content may have multiple provenance records without requiring multiple physical copies.

If candidates conflict materially, preserve the conflict in registry/audit data instead of silently discarding evidence.

## 14. Verification Semantics

Never equate valid XML with a correct brand logo.

Keep these concepts separate where supported:

```text
xmlValid
svgRenderable
sourceTrusted
canonicalResolved
integrityVerified
variantVerified
verificationStatus
trustState
```

Suggested semantics:

| Field | Meaning |
|---|---|
| `xmlValid` | SVG/XML document structure is valid |
| `svgRenderable` | Asset can be rendered as SVG |
| `sourceTrusted` | Source satisfies the project's trust model |
| `canonicalResolved` | A canonical candidate was resolved |
| `integrityVerified` | Stored content matches its expected hash |
| `variantVerified` | Variant metadata is supported |
| `verificationStatus` | Overall asset state |
| `trustState` | Trust classification of source/asset |

Never show `Official` merely because `xmlValid === true`.

## 15. Failure Handling

Failures must be explicit.

Preferred states include:

```text
unresolved
warning
conflict
invalid
```

Do not introduce placeholder SVGs such as circles, stars, gray logos, or empty SVGs as canonical fallbacks.

A UI error placeholder is acceptable only as a visual error state. It must never become a downloadable canonical asset.

## 16. Download and Export Rules

Download operations should use the canonical asset record rather than reconstructing paths independently.

Expected workflows include:

```text
Download Raw SVG
Copy Raw SVG
Copy Asset URL
Download Selection
Download Asset Family
Download Brand Pack
Download Engineering Bundle
```

Raw download must preserve canonical SVG content.

Asset Family and Brand Pack exports must preserve provenance metadata. If identical bytes appear multiple times, use SHA-256 content deduplication where appropriate and record provenance rather than silently losing source information.

## 17. Configuration Rules

### `config/aliases.json`

Aliases map user language to canonical identities. They must not create duplicate physical identities.

When adding an alias:

1. Confirm the target identity exists.
2. Check case-insensitive collisions.
3. Run `npm run doctor`.

### `config/collections.json`

Collections are curated views. They do not define the complete source catalog.

The `mainstream` collection is a curated subset, not the complete registry.

### `config/source-policies.json`

Contains source priorities and identity overrides. Prefer configuration over hard-coded source rules.

## 18. Generated Artifacts

The synchronization pipeline can generate:

```text
generated/catalog.json
generated/manifest.json
generated/conflicts.json
generated/sources.json
generated/audit-report.json
generated/index.ts
generated/react.tsx
generated/vue.ts
```

Runtime copies may include:

```text
public/catalog.json
public/manifest.json
public/conflicts.json
public/sources.json
public/icons/*.svg
```

If a task changes source data, resolver behavior, adapters, or policies, regenerate these artifacts rather than editing them manually.

## 19. CLI Contract

Before changing command behavior, inspect the current `package.json` and CLI implementation.

Current package scripts include:

```bash
npm run dev
npm run build
npm run preview
npm run clean
npm run download-icons
npm run sync
npm run doctor
npm run verify
npm run audit
npm run lint
```

Common synchronization commands include:

```bash
npm run sync
npm run sync -- --scope mainstream
npm run sync -- --all
npm run sync -- github react docker
npm run sync -- search github
```

Do not document or implement a CLI flag unless the current CLI actually supports it. If a new flag is added, update both implementation and documentation.

## 20. Doctor / Audit

`npm run doctor` is the repository health check. Use it after changing source adapters, source policies, aliases, catalog generation, SVG validation, file cleanup, hashing, or provenance.

Relevant checks include:

```text
source coverage
alias collisions
catalog completeness
XML validity
renderability
missing viewBox
SHA-256 mismatch
duplicate content
stale files
catalog freshness
```

Do not weaken doctor checks merely to make a build pass. Fix the underlying problem or explicitly classify the case as warning/unresolved.

## 21. Validation Workflow

### UI-only change

```bash
npm run lint
npm run build
```

### Source / resolver / adapter / configuration change

Prefer:

```bash
npm run sync
npm run verify
npm run doctor
npm run lint
npm run build
```

For risky synchronization changes, use a dry-run mode only if the current CLI implementation exposes one. Inspect the current CLI rather than assuming an old flag exists.

## 22. Debugging Order

When an icon is wrong, debug from the data pipeline downward:

```text
1. Query normalization
2. Alias mapping
3. Identity resolution
4. Adapter availability
5. Asset-family discovery
6. Source candidates
7. Role/context/variant matching
8. Source policy
9. Raw SVG retrieval
10. SVG/XML validation
11. SHA-256 integrity
12. Generated catalog
13. Public file path
14. UI rendering
```

Do not immediately patch the React component when the underlying asset record or resolver is wrong.

## 23. Common User Reports

### "This logo is the wrong color"

Check:

1. Actual SVG content.
2. Source record.
3. Selected variant.
4. Brand-color metadata.
5. Whether a derived transformation was applied.

Do not inject metadata colors into canonical SVGs.

### "This brand has multiple logos"

Determine whether the difference is:

- separate source assets
- graphic variants
- roles
- usage contexts
- historical assets

Represent the difference in the asset family rather than creating arbitrary duplicate identities.

### "This logo cannot be found"

Do not invent it. Check aliases, all enabled adapters, source collections, and unresolved state.

### "The download is different from the preview"

Trace both operations to the same canonical raw bytes. Do not maintain separate ad-hoc transformation paths.

### "There are duplicate files"

Compare SHA-256 values and provenance before deleting anything.

## 24. Comparison / Fidelity Lab

The comparison UI demonstrates asset fidelity and provenance.

Canonical assets must come from the real registry. Do not hard-code a canonical SVG path or SVG string into a React comparison component when the same asset already exists in the registry.

Synthetic AI examples are allowed only as clearly labeled demonstration fixtures. They must never enter the canonical asset catalog.

Useful measurable comparison metadata includes:

```text
source
source version
role
context
variant
viewBox
file size
SHA-256
verification status
```

Do not make unsupported claims such as "pixel-perfect" without a measurable basis.

## 25. Performance Rules

The catalog is expected to scale from hundreds to thousands of identities and potentially many more assets.

Do not render the entire catalog as an uncontrolled DOM tree. Prefer virtualization, pagination, incremental loading, and lazy SVG preview loading where appropriate.

Do not reduce catalog completeness merely to make a small curated list fast.

## 26. UI Data Flow

The UI should consume registry data.

Avoid a second independent source of truth such as manually embedded SVG strings or manually synchronized icon lists.

When an icon appears incorrectly, determine whether the problem is:

```text
registry data
resolver selection
asset path
SVG transformation
rendering
```

Then fix the lowest correct layer.

## 27. Adding a New Icon / Brand

When asked to add an icon, first classify the request:

```text
new identity
new source asset
new alias
new role
new context
new graphic variant
new collection membership
new source adapter
```

Then modify the corresponding source-of-truth and regenerate as required.

Do not simply copy an SVG into `public/icons` and call the task complete.

## 28. Adding a New Source

A new source should provide as much provenance as possible:

```text
provider
collection
source id
source version
source URL
license
raw SVG
```

The adapter should normalize source data into the common model.

Add coverage for at least:

- one monochrome asset
- one multi-color asset
- one variant-rich asset
- one unresolved case
- one collision/duplicate case where applicable

## 29. Do Not Over-Engineer

Unless explicitly requested, do not:

- replace the framework
- rewrite the entire application
- introduce a new state-management system without need
- replace all source providers
- redesign the UI solely to solve a data bug
- add a remote backend for a problem solvable by the existing build pipeline
- weaken validation because a third-party source is inconvenient
- duplicate generated data in another manually maintained file

Prefer the smallest architectural change that solves the actual problem and preserves determinism.

## 30. Change Safety Checklist

Before finishing a non-trivial change:

- [ ] I inspected the current implementation before editing.
- [ ] I modified the correct source-of-truth.
- [ ] I did not use generated output as the primary fix.
- [ ] I preserved raw canonical SVG bytes.
- [ ] I preserved provenance.
- [ ] I avoided fake SVG fallbacks.
- [ ] I avoided AI-generated brand geometry.
- [ ] I avoided `-2.svg` collision files.
- [ ] I avoided unsafe regex SVG rewriting.
- [ ] I distinguished source from trust/authorship.
- [ ] I distinguished role, context, and graphic variant.
- [ ] I preserved multi-color assets.
- [ ] I kept brand-color metadata separate from SVG content.
- [ ] I considered duplicate content by SHA-256.
- [ ] I used configuration rather than unnecessary hard-coded exceptions.
- [ ] I regenerated generated artifacts when required.
- [ ] I ran the relevant validation commands.

## 31. Required Final Agent Report

After making a repository change, report:

1. What changed.
2. Which source-of-truth files changed.
3. Which generated artifacts changed.
4. Any source/catalog implications.
5. Any unresolved/conflict cases.
6. Validation commands executed.
7. Whether lint/build/verify/doctor passed.
8. Any remaining limitations.

Never claim that an asset is "official", "verified", or "correct" unless the repository's actual provenance and verification model supports that claim.

## 32. Final Agent Principle

```text
REAL SOURCE
    +
CORRECT IDENTITY
    +
CORRECT ASSET ROLE
    +
CORRECT VARIANT / CONTEXT
    +
PRESERVED PROVENANCE
    +
VALID SVG
    +
VERIFIED INTEGRITY
    =
TRUSTWORTHY ASSET
```

**The system should fail explicitly rather than fabricate confidence. Never manufacture a brand asset when the repository cannot establish a trustworthy source.**

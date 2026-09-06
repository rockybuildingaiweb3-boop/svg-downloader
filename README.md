# SVG Downloader

> **Verified Multi-Source Brand & Technology SVG Asset Registry** for designers, frontend engineers, developers, and AI agents.
>
> Search, compare, verify, inspect, and download trustworthy SVG assets without relying on AI-generated logo geometry.

---

## Why this project exists

AI coding tools are very good at generating UI, but they are not a trustworthy source for real brand/logo SVG geometry. A visually plausible SVG can still be the wrong mark, the wrong variant, the wrong color treatment, or an invented path.

SVG Downloader takes the opposite approach:

```text
User query
   ↓
Identity resolution
   ↓
Multiple trusted source catalogs
   ↓
Asset / variant discovery
   ↓
Source policy selection
   ↓
XML / SVG validation
   ↓
SHA-256 integrity
   ↓
Canonical asset
   ↓
Preview / Copy / Download / Export
```

The project treats **asset correctness and provenance as first-class data**.

## Core principles

1. **Correctness > Completeness**  
   An unresolved icon is better than a fabricated icon.

2. **Canonical raw SVGs are immutable**  
   Canonical assets are not recolored or rewritten before storage.

3. **Source provenance is preserved**  
   Each asset records its source, source version, source ID, variant, license, URL, and SHA-256 where available.

4. **Identity ≠ file**  
   One brand/technology identity can have multiple trusted assets, sources, roles, contexts, and variants.

5. **Source platform ≠ official authorship**  
   Wikimedia, Iconify, Simple Icons, and Devicon are source systems; they should not automatically be presented as the brand owner.

---

## What it can do

### 1. Multi-source icon discovery

The registry is designed around source adapters rather than a manually maintained list.

Current source ecosystem:

- **Simple Icons** — large brand/logo catalog, especially useful for clean monochrome brand glyphs.
- **Devicon** — developer tools, programming languages, frameworks, and multiple graphic variants.
- **SVG Logos / Iconify** — additional logo assets, including many multi-color representations.
- **Official Vendor** — controlled official/vendor assets where available.
- **Wikimedia Commons** — controlled archival fallback with explicit provenance.

Source adapters are isolated so additional providers can be introduced without rewriting the UI.

### 2. Canonical asset resolution

The resolver separates the concepts of:

```text
query
identity
asset family
source record
variant
canonical asset
```

Resolution follows the general flow:

```text
query
 → normalize
 → alias resolution
 → identity resolution
 → asset-family discovery
 → role/context/variant matching
 → source policy
 → canonical selection
```

Source policies are configurable in:

```text
config/source-policies.json
```

Current policy profiles include:

| Policy | Intended use |
|---|---|
| `brand` | High-fidelity brand assets |
| `technology` | Developer / framework / tooling assets |
| `monochrome` | Single-color UI glyphs |
| `official` | Strict official/vendor-oriented selection |

Identity-specific overrides are supported for cases where a generic source priority is not sufficient.

### 3. Asset families and variants

A real brand does not always have one usable SVG.

The data model is designed to support assets such as:

```text
Instagram
├── symbol
├── logo
├── wordmark
├── app-icon
└── favicon
```

And graphic variants such as:

```text
original
plain
line
original-wordmark
plain-wordmark
```

Only variants actually present in trusted source data should be exposed. Missing variants are not invented.

Usage context can be modeled separately from graphic variant, for example:

```text
web
mobile
desktop
app-store
social
favicon
avatar
general
```

### 4. SVG validation and integrity

Before an asset becomes a canonical output, the pipeline can validate:

- XML syntax
- SVG root structure
- viewBox / dimensions
- presence of vector graphics
- obvious HTML/error responses
- multi-color characteristics
- SHA-256 integrity

Verification is deliberately more granular than simply saying "the XML parses".

The system distinguishes concepts such as:

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

### 5. Safe raw assets

Canonical SVGs are kept raw.

The system explicitly avoids:

- AI-generated brand paths
- hand-redrawn logos
- fake placeholder SVGs
- `-2.svg` collision tricks
- regex-based canonical recoloring
- silently replacing failed downloads with a fake icon

Metadata such as a brand color is not treated as permission to rewrite SVG fills.

### 6. Web interface

The current app provides a browsing and inspection UI with:

- icon search
- category filters
- source filters
- verification/trust information
- selection and batch operations
- asset inspector
- source / variant information
- SVG preview
- SVG code copy
- download actions
- ZIP / engineering bundle export
- comparison / fidelity lab
- script / CLI guidance

The UI is designed to consume the canonical registry instead of maintaining a second independent SVG database.

### 7. User-friendly download workflow

The project supports the concept of:

```text
Download Raw SVG
Copy Raw SVG
Copy Asset URL
Download Selection
Download Asset Family
Download Brand Pack
Download Engineering Bundle
```

A brand-oriented bundle can be structured as:

```text
brand-name/
├── assets/
├── manifest.json
├── sources.json
└── README.md
```

Raw export should preserve the canonical SVG content. Derived representations must be treated separately.

### 8. Registry output

The synchronization pipeline generates structured artifacts such as:

```text
generated/
├── icons / assets
├── catalog.json
├── manifest.json
├── conflicts.json
├── sources.json
├── audit-report.json
├── index.ts
├── react.tsx
├── vue.ts
└── README.md
```

The runtime application can consume the generated metadata and public SVG assets.

---

## Quick start

### Install

```bash
npm install
```

### Start the web app

```bash
npm run dev
```

The Vite development server is configured to use port `3000` and listen on `0.0.0.0`.

### Build

```bash
npm run build
```

The build pipeline includes a catalog freshness check before the Vite production build.

---

## CLI

The canonical synchronization entry point is:

```text
scripts/icon-sync.mjs
```

### Sync

```bash
npm run sync
```

### Sync the mainstream collection

```bash
npm run sync -- --scope mainstream
```

### Sync all discovered identities

```bash
npm run sync -- --all
```

### Sync specific identities

```bash
npm run sync -- github react docker
```

or:

```bash
npm run sync -- github,react,docker
```

### Search

```bash
npm run sync -- search github
```

### Verify generated SVGs

```bash
npm run verify
```

### Health / compliance check

```bash
npm run doctor
```

### Audit

```bash
npm run audit
```

### TypeScript check

```bash
npm run lint
```

### Dry run

The synchronization pipeline supports a dry-run concept for reporting changes without committing them to the managed asset set. Use the current CLI help output as the authoritative syntax when invoking this mode.

---

## Configuration

### Aliases

`config/aliases.json` maps user-facing terms to canonical identities.

Examples include:

```json
{
  "node": "nodedotjs",
  "nodejs": "nodedotjs",
  "nextjs": "nextdotjs",
  "vuejs": "vuedotjs",
  "aws": "amazonwebservices",
  "gcp": "googlecloud",
  "cpp": "cplusplus",
  "k8s": "kubernetes"
}
```

Aliases resolve identity; they must not create duplicate physical assets.

### Collections

`config/collections.json` defines curated collections such as `mainstream` and category groupings.

Collections are **views**, not the definition of what icons exist.

### Source policies

`config/source-policies.json` defines source selection priorities and identity overrides.

Example concept:

```json
{
  "identityOverrides": {
    "react": {
      "preferredSource": "devicon",
      "preferredVariant": "original"
    }
  }
}
```

Do not hard-code brand-specific source rules inside the resolver when the behavior belongs in configuration.

---

## Repository architecture

```text
React UI
   ↓
Canonical / Asset Resolver
   ↓
Source Adapters
   ├── Official
   ├── Wikimedia
   ├── SVG Logos / Iconify
   ├── Simple Icons
   └── Devicon
   ↓
Validation + Integrity
   ↓
Canonical Catalog
   ↓
Registry / Manifest / Provenance
   ↓
Raw SVG assets + UI runtime metadata
```

Important areas:

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
public/catalog.json
public/manifest.json
```

---

## Generated vs source-of-truth files

Treat generated outputs as products of the pipeline, not as primary authoring locations.

Typical generated outputs include:

```text
generated/**
public/icons/**
public/catalog.json
public/manifest.json
public/conflicts.json
public/sources.json
```

When behavior is wrong, fix the source-of-truth code/config first and regenerate.

Do not manually patch generated SVGs or generated registries and expect the change to survive the next synchronization.

---

## Accuracy model

A successful asset should be thought of as:

```text
Trusted source
+ correct identity
+ correct asset role
+ correct variant
+ correct provenance
+ valid SVG
+ matching SHA-256
= usable canonical asset
```

A syntactically valid SVG is not automatically the correct logo.

Likewise:

```text
brandColor metadata ≠ SVG fill
source platform ≠ official authorship
AI approximation ≠ canonical asset
```

---

## Comparison / Fidelity Lab

The comparison area exists to demonstrate why canonical source assets are preferable to synthetic logo recreation.

It should compare:

- canonical vs synthetic approximation
- source A vs source B
- variant A vs variant B

The canonical side must always reference the real registry asset rather than a manually duplicated SVG path.

Synthetic examples must be clearly labeled as illustrative.

---

## Using the generated React / Vue registry

Generated registries are intended to make the asset catalog consumable from application code.

Example React usage:

```tsx
import Icon from './generated/react';

<Icon name="github" size={24} />
```

The exact generated API is controlled by the current registry generator. Prefer generated types and metadata over manually recreating icon maps in application code.

---

## Third-party assets and trademarks

This repository combines multiple third-party icon ecosystems.

A source library's license does not automatically grant trademark rights for a brand represented by an icon.

Before redistributing brand assets commercially, review the asset's:

- source provider
- source URL
- source version
- license metadata
- brand / trademark guidelines

The generated provenance metadata exists partly to make this review possible.

---

## Development rules

For AI agents and coding agents, read [`agent.md`](./agent.md) before changing the repository.

The agent guide defines:

- architectural boundaries
- source-of-truth rules
- canonical asset rules
- resolver behavior
- generated file policy
- verification semantics
- safe debugging workflow
- required validation steps

---

## Project status

The repository is actively evolving toward a broader multi-source asset registry. Source coverage, asset-family metadata, context classification, and comparison tooling are designed to grow independently of the UI.

For the authoritative current implementation, always inspect the current source code, package manifest, configuration, and generated metadata rather than relying on an old icon count in documentation.

---

## License

The repository's own code license and the licenses / usage requirements of third-party assets are separate concerns. Consult the repository license and each asset's provenance metadata before redistribution.

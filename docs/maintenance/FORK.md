# IEatCodeDaily Olympus Fork

This repository is the IEatCodeDaily-maintained standalone branch of Olympus.

## Policy

- `IEatCodeDaily/olympus` is the canonical maintenance repository for our deployments.
- Upstream `EKKOLearnAI/hermes-studio` is no longer treated as an auto-sync source.
- Upstream changes may be cherry-picked manually, but only after review and local verification.
- Local fixes should land here first. Do not patch the global npm install in place without also porting the change back into this repository.

## Package identity

The package name is scoped as `@ieatcodedaily/olympus` so it can be published and installed independently from upstream's `hermes-web-ui` package. The primary CLI binary names are:

- `olympus`
- `olympus-mcp`

The legacy compatibility aliases remain available for now:

- `hermes-web-ui`
- `hermes-web-ui-mcp`
- `hermes-studio-mcp`

## Local development

```bash
npm ci --ignore-scripts
npm run harness:check
npm run test
npm run build
```

Use targeted tests while iterating. Run the full validation set before release.

## Release baseline

This fork starts from the pre-divergence `0.6.18` line in our existing fork, intentionally not fast-forwarded to the newer upstream direction.

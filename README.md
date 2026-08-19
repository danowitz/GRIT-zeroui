# GRIT ZeroUI

[![Tests](https://img.shields.io/endpoint?url=https%3A%2F%2Fgritautomation.cloud%2Fapi%2Fbuild-status%2FGRIT-zeroui%2Ftests)](https://gritautomation.cloud/build-status)
[![Coverage](https://img.shields.io/endpoint?url=https%3A%2F%2Fgritautomation.cloud%2Fapi%2Fbuild-status%2FGRIT-zeroui%2Fcoverage)](https://gritautomation.cloud/build-status)

GRIT-maintained fork of ZeroUI, the administrative web interface for the self-hosted ZeroTier controller used by GRIT Cloud. This repository owns the forked frontend/backend and GRIT-specific embedding behavior. Production controller configuration, backups, and host deployment are owned by GRIT-cloud.

The upstream baseline commit is recorded in `.grit-upstream-baseline`. Preserve that reference when reviewing or importing upstream changes.

## Repository map

| Path | Responsibility |
| --- | --- |
| `frontend/` | React/Vite administrative UI and GRIT embedding behavior |
| `backend/` | Express controller proxy, authentication, and persisted UI data |
| `docker/` | Image build definitions |
| `docs/` | Upstream and fork documentation |
| `.github/workflows/publish-ghcr.yml` | GRIT container publication |
| `docker-compose.yml` | Development/reference stack, not production configuration |

## Development

The repository uses Yarn workspaces.

```bash
corepack enable
yarn install --immutable
yarn lint
yarn workspace backend typecheck
yarn workspace frontend typecheck
yarn build
```

There is currently no automated unit-test suite. Linting, type checking, building, CodeQL, and image publication are separate checks; none should be reported as unit tests or coverage.

## Build status

The badges are tied to the latest verified `develop` commit. They explicitly show **not configured** for unit tests and coverage until real instrumentation exists. Detailed status is available to GRIT administrators at [gritautomation.cloud/build-status](https://gritautomation.cloud/build-status).

## Containers and deployment

Build the fork image locally with:

```bash
yarn docker:build
```

Production uses the pinned GRIT image and compose definition maintained under `GRIT-cloud/service-files/zerotier/`. Do not deploy the reference `docker-compose.yml` unchanged: it contains upstream development defaults and is not the production source of truth.

Container publication, production image selection, controller restart, identity preservation, backup verification, and UI acceptance are separate gates. Never regenerate or overwrite a production ZeroTier controller identity.

## Ownership

Internal GRIT Automation engineering repository. The default branch is `develop`. Upstream licensing files remain authoritative for inherited code; GRIT-specific operations remain private.

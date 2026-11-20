# Compact Zero Tier network list

Authority: user's 2026-11-20 screenshot and request to condense narrow/mobile tiles.
The repository's GitHub issues are disabled (`gh issue list` verified this session).
Repository/branch: GRIT-zeroui / fix/compact-network-list.

Objective: show more networks in the available height without removing data or actions.
Owned scope: HomeLoggedIn layout and NetworkButton presentation.
Preserved scope: network APIs, sorting/filtering, support commands, authentication,
other screens, Cloud navigation and deployment configuration.
Acceptance: compact rows at 320, 390, 768, 907 and 1440 CSS pixels; no horizontal
overflow; names, IDs, IPs, access times and all four actions remain available;
search, sort, copy and network navigation continue working. Missing Hub IPs must
not create empty grid rows. Long names remain available to assistive technology.
Validation: production frontend build, existing frontend tests/lint/typecheck,
browser render with disposable mocked network data and interaction checks.
No hardware or live remote-support execution is needed for a presentation change.
Production boundary: none — repository change only.
Rollback: revert the scoped presentation changes; no persisted data changes.
Stop conditions: unresolved authority, essential missing evidence, conflicting
checkout edits, scope expansion or a required live/destructive action.
Deliverables: scoped layout change and local browser evidence.
Design assurance: existing React/MUI components own rendering; network identity,
data flow, lazy IP loading, states, retries and authorization remain unchanged.
No new dependency, model, protocol or architecture decision; no ADR needed.

## Validation and review — 2026-11-20

- `npm run build --workspace frontend`: passed.
- `npm run lint --workspace frontend`: passed.
- `node --test <explicit frontend/src/utils/*.test.mjs paths>`: 11/11 passed.
  The package test command's wildcard is not expanded by Windows cmd.exe.
- Chromium, local app embedded in an iframe with mocked network/member APIs:
  320, 390, 600, 768, 907, 1024 and 1440px inner widths have no horizontal overflow.
  Network row heights with mouse input: 180px at 320, 151px at 390,
  129px at 600–907 and 99px at 1024–1440. Long names and missing IPs rendered.
- Browser interactions passed: search and clearing, alphabetical sorting, empty
  results, copy feedback, network navigation, support-button fallback outside
  Cloud, and disabled SSH/Open Hub with no IP. No real support command executed.
- Chromium touch emulation at 320/390px: no overflow; all support actions 44px high.
  Physical phones and Safari were not tested.
- `tsc --noEmit --pretty false -p frontend/tsconfig.json`: fails with 44 errors.
  Repeating against unchanged HEAD produced the exact same 44 diagnostic lines.
  No type errors were introduced by this diff.
- Impeccable mechanical detector: `[]` (no findings).
- Manual complete-diff review: presentation only; named grid areas preserve
  placement when Hub IP is absent, controls retain their stacking order and
  handlers, all API/auth/support logic unchanged. Hostile review not performed
  for this scoped presentation change.
- Branch base matched freshly fetched `origin/develop`; `git diff --check` passed.

Release assessment: READY FOR INDEPENDENT REVIEW. Production boundary remains
none — repository change only. Local screenshot evidence and disposable browser
scripts are in ignored `output/playwright/`; they are not shipped assets.

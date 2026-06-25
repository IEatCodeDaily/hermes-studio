---
date: 2026-06-25
feature: Chat list model pill + resizable session sidebar
commit: pending
---

Ported from the `fix/session-model-persistence` working tree (previously only
deployed as an uncommitted dist build, which got overwritten on every rebuild).

Changes:
- SessionListItem shows a model pill (`session-item-model-pill`) with the
  session's model label; provider pill not shown.
- ChatPanel session/sidebar list is resizable on desktop via a drag handle
  (`session-list-resize-handle`); width persists in localStorage under
  `hermes.chat.sessionListWidth` (clamped), disabled on mobile.
- Added i18n key `models.selectingModel` across all locales.

Behavior impact: purely client-side chat sidebar UX. No server/runtime/chat-chain
protocol change. The session-scoped model-selection loading-state feature from the
same source branch was intentionally NOT ported (depends on scaffolding absent in
this 0.6.20 base); it can be ported separately.

---
description: "Use when a task references multiple workspace folders, when it is unclear whether work belongs in case-admin, case-admin-old, or case-backend, or when more information about architecture, logic, and data structures is needed. Explains that active development belongs in case-admin and the other folders are an older version of this project and reference-only."
---

# Workspace Roles

- `case-admin`: The active project and the default target for new work. It is the new Next.js-based admin application, talks directly to MongoDB, and contains both client and server code.
- `case-admin-old`: The legacy admin application. Use it for reference when you need to understand previous behavior, data structures, or migration intent, but do not add new features here and do not copy its architecture or UI design into the new app.
- `case-backend`: The legacy backend. Use it only as historical reference for older APIs or business logic. Do not integrate with it or edit it for current work.

If a request mentions "case-admin" without further qualification, assume the target is `case-admin`. Use `case-admin-old` and `case-backend` only to inform work in `case-admin`, unless the user explicitly asks otherwise.
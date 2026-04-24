# Agent Instructions for case-admin

This document provides context for AI agents working on the `case-admin` codebase.

<!-- BEGIN:nextjs-agent-rules -->

## Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

## 🏗 Project Architecture

**Tech Stack**

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **State/Data:** tRPC v11 (Server) + TanStack Query v5 (Client) + MongoDB (Native Driver)
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **Auth:** Better Auth
- **Package Manager:** pnpm

**Key Architectural Layers**

1. **UI Components** (`components/`)
    - **Installation:** ALWAYS install UI primitives via the shadcn CLI (`pnpm dlx shadcn@latest add <component>`) before considering a manual implementation. Check whether a component already exists in `components/ui/` before writing any code. Only implement a component from scratch if it is genuinely unavailable in the shadcn registry or from custom registries (e.g. `c-ui`) and no suitable alternative exists.
    - `ui/`: Primitives (Shadcn-based). Do not modify unless changing design system.
    - `c-ui/`: Custom shared components (e.g., `ConfirmDialog`, `LoadingButton`). Prefer these over raw `ui` components for common patterns.
    - `features/`: Domain-specific components grouped by feature (e.g., `features/user-management`).
2. **Data Access Hook Layer** (`hooks/`)
    - We wrap tRPC logic in custom hooks (e.g., `useUserManagementRouter`).
    - **Pattern:** Components should rarely use `trpc.useQuery` directly. Instead, import a named hook from `hooks/`.
3. **API Layer** (`trpc/`)
    - Routers located in `trpc/routers`.
    - Procedures are defined from `router`, `authenticatedProcedure`, `adminProcedure`, or `accessProcedure` in `trpc/init`.
    - When a router must enforce permissions, prefer `accessProcedure` and the shared access utilities in `lib/types/access` or `lib/auth/access` instead of fetching permissions ad hoc inside each procedure.
4. **Service Layer** (`lib/db/service`)
    - Business logic and direct DB access live here.
    - Files must import `server-only`.
    - Services are instantiated classes (e.g., `userService`) that access `db` collections directly.

## 🛠 Critical Conventions

### Data Fetching (tRPC v11 + React Query)

- **Query Syntax:** We use the specific v11 `queryOptions` pattern for type-safety and query client integration.

  ```typescript
  // CORRECT
  const { data } = useQuery(trpc.userManagement.getUsers.queryOptions({ page: 1 }));

  // WRONG (Older tRPC style)
  const { data } = trpc.userManagement.getUsers.useQuery({ page: 1 });
  ```

### UI & Interaction

- **Async Actions:** Use `<LoadingButton />` (from `@/components/c-ui/loading-button`) for any button triggering a mutation/Promise. Pass `isLoading={isPending}`.
- **Confirmations:** Use `useConfirm` hook (from `@/components/c-ui/confirm-provider`) for confirmation dialogs. Avoid rendering `<ConfirmDialog />` directly unless `useConfirm` is not suitable.
- **Toasts:** Use `toast` from `sonner` for success/error notifications.
- **Effects:** Use `useEffectEvent` for side effects within `useEffect` that should not be dependencies (e.g. logging, reading latest props without re-triggering).
- **Visual Direction:** When creating or updating UI, aim for a clean, polished style similar to Linear or Notion: restrained color use, strong spacing rhythm, clear typography, subtle hierarchy, and minimal visual noise.
- **UI Cleanliness:** Keep markup and class lists minimal. Do not add wrapper `div`s, layout containers, or Tailwind classes unless they have a clear visible, structural, semantic, or interaction effect in the current implementation.
- **No Inert Styling:** Avoid no-op or barely perceptible utilities such as redundant background layers, duplicate border utilities, inactive state selectors that are not used, or effect classes whose visual impact is negligible. If a class exists only for a future state, keep it only when that future state is a concrete near-term requirement and the intent is obvious.
- **Localization:** Every user-facing string in the UI **must** be localized. Never hard-code English (or any other language) text in components. Use `useTranslations` (client components) or `getTranslations` (server components) from `next-intl`. When adding or updating strings, always update both `i18n/messages/en.json` and `i18n/messages/nl.json`, and keep `case-admin.babel` in sync. See `.agents/skills/localization.md` for the full workflow.

### Database & Services

- **structure:** Services (e.g. `UserService`) take a `Db` instance in constructor.
- **collections:** Typed via `UserDoc`, `PermissionDoc` generic types in `collection<T>()`.

### Formatting & Diff Hygiene

- **Indentation:** Follow `.editorconfig` exactly. Use spaces, not tabs, with an indent size of 4 in touched files unless the file already uses a different established style.
- **Whitespace-only churn:** Do not introduce whitespace-only diffs unless the task is explicitly a formatting cleanup. Preserve existing final newline behavior and line endings when editing.

## 🗂 Page Definition System

All application pages are defined in a central registry at `lib/config/pages.ts`. This drives sidebar navigation, breadcrumbs, page titles/descriptions, and tab metadata from a single source of truth. **When adding a new page, register it here first.**

The registry distinguishes between global (top-level) pages and study sub-pages. Each entry carries a translation key (from the `Pages` i18n namespace), an icon, and an optional access requirement. Study sub-pages are identified by their URL segment; global pages by their full path.

Helper functions (`globalNavSection`, `studyNavSection`) return resolved nav items for a given sidebar section. Lookup maps (`globalPagesBySegment`, `studyPagesBySegment`) let page files and the breadcrumb component resolve a `PageDef` from the current URL without duplicating data.

### Page patterns

**Global page** (`app/(app)/[segment]/page.tsx`):
```tsx
import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["participants"]!;

export const generateMetadata = () => generatePageMetadata(pageDef);

export default function ParticipantsPage() {
    return <PageLayout page={pageDef} />;
}
```

**Study sub-page** (`app/(app)/studies/[studyKey]/[segment]/page.tsx`):
```tsx
import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { studyPagesBySegment } from "@/lib/config/pages";

const pageDef = studyPagesBySegment["rules"]!;

export const generateMetadata = () => generatePageMetadata(pageDef);

export default function StudyRulesPage() {
    return <PageLayout page={pageDef} />;
}
```

`PageLayout` (`components/common/page-layout.tsx`) is an async Server Component that renders the page title and optional description. Pass `children` for page content below the header. `generatePageMetadata` builds Next.js `Metadata` from the same `PageDef`. Translation keys live in the `Pages` namespace in both locale files.

## 📂 File Structure Guide

- `app/(auth)/` - Authentication pages (login, logic).
- `components/features/[feature]/` - Feature-specific UI logic.
- `lib/types/` - Shared Zod schemas and TypeScript interfaces.
- `trpc/routers/` - Backend procedures.

## 🔄 Instruction Maintenance

- **Continuous Improvement:** Whenever an agent performs or discovers relevant architectural changes, updates to this `AGENTS.md` file should be proposed to ensure the context remains accurate.
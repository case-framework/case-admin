# Copilot Instructions for case-admin

This document provides context for AI agents working on the `case-admin` codebase.

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
    - **Installation:** Prefer installing components from the official shadcn registry or from custom registries (e.g. `c-ui`) instead of implementing them anew. Only implement custom components if no suitable option exists.
    - `ui/`: Primitives (Shadcn-based). Do not modify unless changing design system.
    - `c-ui/`: Custom shared components (e.g., `ConfirmDialog`, `LoadingButton`). Prefer these over raw `ui` components for common patterns.
    - `features/`: Domain-specific components grouped by feature (e.g., `features/user-management`).
2. **Data Access Hook Layer** (`hooks/`)
    - We wrap tRPC logic in custom hooks (e.g., `useUserManagementRouter`).
    - **Pattern:** Components should rarely use `trpc.useQuery` directly. Instead, import a named hook from `hooks/`.
3. **API Layer** (`trpc/`)
    - Routers located in `trpc/routers`.
    - Procedures defined using `adminProcedure` or `router` from `trpc/init`.
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

### Database & Services

- **structure:** Services (e.g. `UserService`) take a `Db` instance in constructor.
- **collections:** Typed via `UserDoc`, `PermissionDoc` generic types in `collection<T>()`.

## 📂 File Structure Guide

- `app/(auth)/` - Authentication pages (login, logic).
- `components/features/[feature]/` - Feature-specific UI logic.
- `lib/types/` - Shared Zod schemas and TypeScript interfaces.
- `trpc/routers/` - Backend procedures.

## 🔄 Instruction Maintenance

- **Continuous Improvement:** Whenever an agent performs or discovers relevant architectural changes, updates to this `copilot-instructions.md` file should be proposed to ensure the context remains accurate.

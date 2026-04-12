---
name: localization
description: >
  Localization skill for case-admin. Covers adding/updating translated strings
  using next-intl, keeping JSON message files in sync, and updating the
  BabelEdit project file. Use this skill whenever you need to add, change, or
  audit user-facing strings.
---

# Localization in case-admin

## Stack

- **Library:** `next-intl`
- **Message files:** `i18n/messages/en.json` (English) and `i18n/messages/nl.json` (Dutch)
- **BabelEdit project:** `case-admin.babel` — must stay in sync with the JSON files
- **Supported locales:** defined in `i18n/locales.ts` (`en`, `nl`)

## Message file structure

Messages are organized as a **namespaced JSON** object. Each top-level key is
a namespace (e.g. `"Sidebar"`), and its value is a flat map of
translation keys to strings.

```jsonc
// i18n/messages/en.json
{
  "MyNamespace": {
    "myKey": "My English string"
  }
}
```

```jsonc
// i18n/messages/nl.json
{
  "MyNamespace": {
    "myKey": "Mijn Nederlandse tekst"
  }
}
```

**Rules:**
- Always add the key to **both** `en.json` and `nl.json`.
- Keep namespaces sorted alphabetically in the JSON file.
- Use `camelCase` for key names.
- Provide a genuine Dutch translation — do not copy the English string.

## Using translations in components

### Client components (`"use client"`)

```tsx
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("MyNamespace");
  return <p>{t("myKey")}</p>;
}
```

### Server components (async RSC)

```tsx
import { getTranslations } from "next-intl/server";

export default async function MyPage() {
  const t = await getTranslations("MyNamespace");
  return <p>{t("myKey")}</p>;
}
```

### Interpolation

```tsx
// en.json: "greeting": "Hello, {name}!"
t("greeting", { name: user.name })
```

## Updating the BabelEdit project file

Every new key must also be added to `case-admin.babel` so BabelEdit stays in
sync. Follow the existing XML structure exactly.

### Adding a new namespace

Insert a new `<folder_node>` inside the `<children>` of the `<package_node>`
named `main`. Keep folder nodes in **alphabetical order**.

```xml
<folder_node>
  <name>MyNamespace</name>
  <children>
    <!-- concept nodes go here -->
  </children>
</folder_node>
```

### Adding a key inside a namespace

Insert a `<concept_node>` inside the appropriate `<folder_node>`. Nodes should
be kept in **alphabetical order** within their folder.

```xml
<concept_node>
  <name>myKey</name>
  <description/>
  <comment/>
  <default_text/>
  <translations>
    <translation>
      <language>en-US</language>
      <approved>false</approved>
    </translation>
    <translation>
      <language>nl-NL</language>
      <approved>false</approved>
    </translation>
  </translations>
</concept_node>
```

> **Important:** The `<translation>` nodes only store metadata (approval
> status). The actual translated strings live in the JSON files — do not add
> text content to the `<translation>` nodes in the `.babel` file.

## Checklist when adding or changing a string

1. [ ] Identify (or create) the appropriate namespace for the component.
2. [ ] Add the key + English string to `i18n/messages/en.json`.
3. [ ] Add the key + Dutch string to `i18n/messages/nl.json`.
4. [ ] Add the corresponding `<concept_node>` (and `<folder_node>` if new
       namespace) to `case-admin.babel`.
5. [ ] Use `useTranslations` (client) or `getTranslations` (server) in the
       component — never hard-code user-facing strings.
6. [ ] Remove any hard-coded English string that was replaced.

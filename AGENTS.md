<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# case-admin and its platform copies

Platforms run their own copy of this repo (for example the infectieradar and flusurvey admin apps). A copy is not a GitHub fork: it merges this repo's `main` to take changes, and adds only files of its own (deployment files, icons). This file and `sync-script.sh` come from case-admin, so they are the same in every copy.

- A change that is useful to every platform goes into case-admin first, as its own pull request. It reaches the copies when they next sync.
- A feature only one platform needs now, but another might want later, also goes into case-admin, behind a setting (an environment variable, like `NEXT_PUBLIC_APP_NAME`) that only that platform turns on.
- In a copy, change only what is for that platform alone, and add new files instead of editing files that came from case-admin, so syncs stay conflict-free. If a feature needs a hook in a shared file, add the hook to case-admin first.

To sync a copy with case-admin (in the copy's checkout; `git remote -v` shows `origin` is not case-framework/case-admin):

```sh
git remote get-url upstream >/dev/null 2>&1 || git remote add upstream https://github.com/case-framework/case-admin.git
git fetch origin && git fetch upstream
git switch -c sync/case-admin-$(date +%Y%m%d) origin/main
git merge upstream/main          # resolve conflicts, keeping the copy's own files
```

Then push the branch and open a pull request into `main`. It must be merged with a merge commit, not squash or rebase, so the next sync only brings what is new. `./sync-script.sh` does the same merge for people working on `main` directly.

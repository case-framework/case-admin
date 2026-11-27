<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# case-admin and its platform copies

Platforms run their own copy of this repo (for example the infectieradar and flusurvey admin apps). A copy is not a GitHub fork: it merges this repo's `main` to take changes. This file and `sync-script.sh` come from case-admin, so they are the same in every copy.

## Share first, diverge only when you must

Every change in a copy makes the next sync harder, and every improvement made in case-admin helps all platforms. So:

- Build new behavior in case-admin and make it configurable for the platforms that need it (an environment variable, like `NEXT_PUBLIC_APP_NAME`, or a setting), even when only one platform uses it today.
- If a platform needs to plug something in, add a hook or extension point to case-admin, then add the platform's part in the copy as new files.
- In a copy, prefer adding files of its own (deployment files, icons, platform-only pages) over editing files that came from case-admin.
- Edit a file from case-admin in a copy only when none of the above works. Record every such edit in the copy's `FORK.md`: the file, what was changed, and why it couldn't be shared. `FORK.md` exists only in copies, so it never conflicts. Remove the entry when the edit goes away.

## Syncing a copy

In the copy's checkout (`git remote -v` shows `origin` is not case-framework/case-admin):

```sh
git remote get-url upstream >/dev/null 2>&1 || git remote add upstream https://github.com/case-framework/case-admin.git
git fetch origin && git fetch upstream
git switch -c sync/case-admin-$(date +%Y%m%d) origin/main
# Files changed both in this copy and upstream since the last sync:
base=$(git merge-base HEAD upstream/main)
comm -12 <(git diff --name-only "$base" HEAD | sort) <(git diff --name-only "$base" upstream/main | sort)
git merge upstream/main
```

Git merges changes in different parts of a file by itself, but a file both sides changed needs a decision even when git reports no conflict. For each file in that list, check `FORK.md` for why the copy changed it, then choose one:

- keep the copy's version,
- take case-admin's version, because the copy's change is no longer needed (or case-admin now covers it; remove its `FORK.md` entry),
- or apply the copy's change again on top of case-admin's new code.

Write the decision for each file in the pull request, and ask when the right choice isn't clear. Then push the branch and open a pull request into `main`. Merge it with a merge commit, not squash or rebase, so the next sync only brings what is new. `./sync-script.sh` does the same merge for people working on `main` directly and lists the same files.

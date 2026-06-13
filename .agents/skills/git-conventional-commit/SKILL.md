---
name: git-conventional-commit
description: Generate conventional commit messages from staged or unstaged changes following @commitlint/config-conventional rules. Use when user wants to commit, write a commit message, or mentions conventional commits, commitlint, or semantic commits.
---

# Git Conventional Commit

## Quick start

Run `.agents/skills/git-conventional-commit/scripts/diff-context.sh` to get changes. Generate a message in this format:

```
type(scope): subject

body
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`

## Rules

- Header max length: 100 characters
- Body/footer line max length: 100 characters
- Type must be lowercase, subject must not be empty
- Use imperative mood ("add" not "added")
- Scope is optional; derive from changed directory/module if obvious
- Subject must describe the change, never mention file names
- If multiple files or changes are present, summarize the overall intent across all of them

## Subject guidelines
- State what changed functionally (e.g., "add dark mode toggle", "handle null response")
- Never include file names, paths, or file counts (e.g., avoid "update foo.ts", "fix files in src/")
- For broad changes, capture the common theme (e.g., "reorder imports across components", "remove resume page and exports")

## Examples

- `feat(ui): add dark mode toggle`
- `fix(api): handle null response in user endpoint`
- `docs(readme): update installation instructions`

## Workflow

1. Run `.agents/skills/git-conventional-commit/scripts/diff-context.sh` to read staged (or all unstaged) changes
2. Analyze changes to pick type and scope
3. Write header: `type(scope): concise description`
4. Add body if changes need explanation; use clean, precise bullet points — one point per logical change
5. Wrap body lines at 100 characters
6. Add `BREAKING CHANGE:` footer or `!` after type/scope if applicable
7. Commit with `git commit -m "type(scope): subject" -m "body"`

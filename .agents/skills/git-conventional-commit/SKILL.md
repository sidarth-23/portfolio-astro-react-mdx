---
name: git-conventional-commit
description: Generate conventional commit messages from staged or unstaged changes following @commitlint/config-conventional rules. Use when user wants to commit, write a commit message, or mentions conventional commits, commitlint, or semantic commits.
---

# Git Conventional Commit

## Quick start

Run `scripts/diff-context.sh` to get changes. Generate a message in this format:

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

## Examples

- `feat(ui): add dark mode toggle`
- `fix(api): handle null response in user endpoint`
- `docs(readme): update installation instructions`

## Workflow

1. Run `scripts/diff-context.sh` to read staged (or all unstaged) changes
2. Analyze changes to pick type and scope
3. Write header: `type(scope): concise description`
4. Add body if changes need explanation (wrap lines at 100 chars)
5. Add `BREAKING CHANGE:` footer or `!` after type/scope if applicable
6. Commit with `git commit -m "type(scope): subject" -m "body"`

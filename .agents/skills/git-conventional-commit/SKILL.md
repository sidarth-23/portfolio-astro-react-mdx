---
name: git-conventional-commit
description: Generate conventional commit messages from staged or unstaged changes following @commitlint/config-conventional rules. Use when user wants to commit, write a commit message, or mentions conventional commits, commitlint, or semantic commits.
---

# Git Conventional Commit

## Quick start

Inspect the changes first, then write a conventional commit message in this format:

```
type(scope): subject

body
```

Prefer staged changes when they exist. If the index has staged changes, generate the message from
`git diff --cached`. If nothing is staged, inspect the full working tree changes instead, including
unstaged modifications and untracked files.

Allowed types are: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`,
`build`, `revert`

## Rules

- Header max length: 100 characters
- Body is mandatory
- Type must be lowercase, subject must not be empty
- Use imperative mood ("add" not "added")
- Scope is optional; derive from the changed area/module if obvious
- Subject must describe the change, not the files touched
- If multiple files or changes are present, summarize the overall intent across all of them
- Body must be descriptive, clear, and specific about what changed and why
- Keep the message clean and easy to scan; favor concise sentences or bullets over vague summaries
- Do not add `Co-authored-by` trailers unless the user explicitly asks for them

## Subject guidelines
- State what changed functionally (e.g., "add dark mode toggle", "handle null response")
- Never include file names, paths, or file counts (e.g., avoid "update foo.ts", "fix files in src/")
- For broad changes, capture the common theme (e.g., "reorder imports across components", "remove resume page and exports")
- Prefer an outcome-focused summary over an implementation-focused one

## Body guidelines
- Explain the meaningful changes, tradeoffs, or behavioral impact
- Mention the main areas affected when that helps clarify the scope
- Use bullets when there are several related changes
- Avoid restating the subject; add detail the subject cannot convey on its own
- Write the body as if it will be read in a commit log without additional context
- Do not include co-author trailers by default

## Examples

- `feat(ui): add dark mode toggle`
  
  ```
  - Add a theme toggle to the settings panel
  - Persist the selected mode across sessions
  - Update the app shell to use the active theme
  ```
- `fix(api): handle null response in user endpoint`
  
  ```
  - Return a 404 when the user lookup does not find a record
  - Avoid dereferencing the empty result before validation
  ```
- `docs(readme): update installation instructions`
  
  ```
  - Clarify the required Node.js version
  - Add the missing setup step for environment variables
  ```

## Workflow

1. Check whether there are staged changes; if yes, inspect `git diff --cached`
2. If nothing is staged, inspect the working tree changes, including unstaged and untracked files
3. Analyze the changes to pick type and scope
4. Write header: `type(scope): concise description`
5. Write a mandatory body that describes the changes clearly and specifically
6. Use clean, precise bullets or short paragraphs; include one logical point per line when useful
7. Add `BREAKING CHANGE:` footer or `!` after type/scope if applicable
8. Commit with `git commit -m "type(scope): subject" -m "body"`

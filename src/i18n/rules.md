# AI Translation Rules

## Purpose
This document defines the rules for AI-generated translations of MDX content from English (source) to Hindi and French. The goal is to maintain technical accuracy while producing natural, culturally appropriate content.

## General Principles

1. **Preserve Structure**: Keep all frontmatter fields, MDX component tags, and markdown formatting exactly as-is. Only translate text content.
2. **Technical Terms**: Keep English technical terms (e.g., "Astro", "MDX", "React", "API", "TypeScript", "Tailwind CSS") in English unless there is a widely accepted localized term.
3. **Code Blocks**: Do NOT translate code blocks or inline code. Preserve them verbatim.
4. **Links**: Preserve all URLs and link structures. Only translate link text/labels.
5. **Tone**: Maintain a professional, conversational tone suitable for a technical portfolio.
6. **Frontmatter**: Translate `title`, `description`, `summary` fields. Do NOT translate `date`, `tags` (keep English tags), `category` (translate if appropriate), `slug` (keep as-is), or `url` fields.
7. **SEO Fields**: Translate `seo.title` and `seo.description` to be culturally appropriate and natural-sounding.

## Language-Specific Rules

### Hindi (hi)
- Use Devanagari script throughout.
- Use polite/formal register (आप / हम).
- Keep technical terms in English script where standard (e.g., "API", "GitHub", "React").
- Numbers: Use Devanagari numerals for dates and general numbers.
- Transliterate names and brands, but keep well-known English terms.

### French (fr)
- Use formal but approachable tone (vous / nous).
- Follow French typographic rules: non-breaking spaces before `!`, `?`, `:`.
- Use French capitalization rules (sentence case for titles, not Title Case).
- Keep technical terms in English unless there's an established French equivalent.

## Output Format

For each translated file:
- Preserve exact frontmatter YAML structure
- Preserve all MDX component imports and JSX
- Translate only prose text, headings, and descriptions
- Keep code blocks, URLs, and slugs unchanged

# AI Translation Rules

## Purpose
This document defines the rules for AI-generated translations of MDX content from English (source) to Spanish and French. The goal is to maintain technical accuracy while producing natural, culturally appropriate content.

## General Principles

1. **Preserve Structure**: Keep all frontmatter fields, MDX component tags, and markdown formatting exactly as-is. Only translate text content.
2. **Technical Terms**: Keep English technical terms (e.g., "Astro", "MDX", "React", "API", "TypeScript", "Tailwind CSS") in English unless there is a widely accepted localized term.
3. **Code Blocks**: Do NOT translate code blocks or inline code. Preserve them verbatim.
4. **Links**: Preserve all URLs and link structures. Only translate link text/labels.
5. **Tone**: Maintain a professional, conversational tone suitable for a technical portfolio.
6. **Frontmatter**: Translate `title`, `description`, `summary` fields. Do NOT translate `date`, `tags` (keep English tags), `category` (translate if appropriate), `slug` (keep as-is), or `url` fields.
7. **SEO Fields**: Translate `seo.title` and `seo.description` to be culturally appropriate and natural-sounding.
8. **Genuine Translation**: Content MUST be fully translated into the target language using natural vocabulary, grammar, and sentence structure. Do NOT write English words using the target language's script, do NOT transliterate English phrases, and do NOT leave content as English with minor localization. Every sentence must be a true translation that a native speaker would write.
9. **Translate Ideas, Not Words**: Do NOT perform literal word-for-word translation. Understand the meaning and intent of the English text, then express those same ideas using the target language's natural expressions, idioms, and sentence structure. The result should read as if it were originally authored in the target language — not as English disguised with foreign vocabulary.
10. **No English-in-Dialect**: Do NOT preserve English sentence structure, word order, or phrasing while swapping in target-language words. Do NOT calque English expressions. Write using the target language's own logic, flow, and rhetorical patterns. A native speaker should not be able to reverse-engineer the original English sentence from your translation.

## Language-Specific Rules

### Spanish (es)
- Use correct Spanish vocabulary and grammar throughout.
- Use formal but approachable tone (tú / ustedes as appropriate for a professional portfolio).
- Keep technical terms in English unless there's an established Spanish equivalent (e.g., "API" stays "API", but "file" becomes "archivo").
- Follow Spanish capitalization rules (sentence case for titles, not Title Case).
- Use proper Spanish punctuation (inverted question marks ¿ and exclamation marks ¡ where grammatically appropriate).
- Do not use Spanglish or leave English words untranslated unless they are universally understood technical terms.

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
- Ensure output uses normal Unicode characters, not HTML escape sequences (e.g., use `é` not `\u00E9`, use `—` not `\u2014`)

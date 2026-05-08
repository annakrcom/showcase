cl# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository..

## Project

Static portfolio site for a photo retoucher (Anna Kryzhanivska). Plain HTML/CSS/JS, **no build step, no dependencies, no tests**. Deployed via GitHub Pages.

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Architecture

- `index.html` (root) redirects to a language folder based on browser language, defaulting to `/en/`.
- Four parallel language directories: `en/`, `de/`, `fr/`, `it/`. Each contains the **same 6 pages**: `index.html`, `services.html`, `portfolio.html`, `experience.html`, `faq.html`, `contact.html`. Pages share identical structure (header / content / footer) — only the translated copy differs.
- Shared assets live at the root: `assets/css/style.css` (single dark-theme stylesheet, CSS variables `--bg`, `--text`, `--accent` at the top of `:root`) and `assets/js/main.js` (mobile nav toggle only). Language pages reference these via `../assets/...`.
- Images go in `assets/images/` (e.g. `assets/images/portfolio/`).

## Editing conventions
## Language & File Handling
- **English Only:** Apply all updates and logic changes ONLY to the English version files.
- **Ignore Existing Translations:** Do not update, modify, or analyze existing non-English pages/files (e.g., German, French, etc.), even if they are outdated.
- **No Syncing:** Do not attempt to sync changes between languages. We will handle other versions only after the English version is finalized..
- **Content changes must be replicated across all 4 language folders** to keep the site in sync. Translate appropriately for `de`/`fr`/`it`.
- Keep the header/footer/nav markup identical across pages within a language so the shared CSS/JS keeps working.
- Portfolio items follow the pattern in README.md:
  ```html
  <a class="portfolio-item" href="../assets/images/portfolio/x.jpg">
    <img src="../assets/images/portfolio/x.jpg" alt="...">
  </a>
  ```

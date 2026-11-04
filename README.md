# Ksenia Spitsina (Pepina) — psychologist website

A static, responsive website in Russian. HTML, CSS and browser JavaScript; no dependencies or build step.

## Project structure

```text
website/
├── index.html                 # Main landing page
├── pages/
│   ├── documents.html         # Education and document gallery
│   └── contract.html          # Psychotherapy contract
├── assets/
│   ├── css/                   # Shared and page-specific styles
│   ├── js/                    # Navigation, motion and page interactions
│   ├── images/                # Original logo and portraits
│   └── documents/             # 27 original document scans
├── content/
│   ├── documents.json         # Scan labels, groups and source URLs
│   └── contract.txt           # Original contract text
├── docs/
│   ├── design-notes.md        # Design decisions and motion references
│   └── audits/2026-11-01/     # Original website audit
├── .gitignore
└── README.md
```

## Local preview

Run from the `website` directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

- Main page: http://localhost:4173/
- Education: http://localhost:4173/pages/documents.html
- Contract: http://localhost:4173/pages/contract.html

Keep the server root at `website`, not `pages`. All links use relative paths so the same files work under a GitHub Pages repository URL.

## Editing

- Main page copy: `index.html`.
- Education labels and cards: `pages/documents.html`. `content/documents.json` records source metadata; it is not dynamically rendered.
- Contract display: `pages/contract.html`; preserve the original numbered clauses. `content/contract.txt` keeps the source transcription.
- Shared styles: `assets/css/main.css`; secondary-page styles: `assets/css/documents.css` and `assets/css/contract.css`.
- Shared navigation and motion: `assets/js/main.js`. Gallery filters, zoom and viewer: `assets/js/documents.js`. Contract contents navigation: `assets/js/contract.js`.

## Publishing

Publish this directory as the repository root. GitHub Pages settings: deploy from your source branch, folder `/ (root)`. No build command is needed. Commit and push the moved files and deletions together. The secondary-page URLs now use the `pages/` prefix.

The design retains the original planet logo, portraits, cream/navy palette and verified source content. Motion respects reduced-motion settings. Document viewing supports keyboard navigation and zoom. The contract has a responsive table of contents. This site does not provide an editor, payment processing or a client database.

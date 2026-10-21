# University of Aberdeen Mumbai – Placement Profile Book 2026–27 (flipbook)

Contents are exactly as in the COO-approved PDF of 19 October 2026.

## Folders
- `index.html` – the flipbook
- `text.html` – accessible text-only version (headings, alt text, links)
- `css/` – styles
- `js/` – page-turn engine (StPageFlip, MIT licence) and flipbook controls
- `images/` – page images and student photos
- `assets/` – the downloadable PDF

## Accessibility
- Every page carries the real text behind the page image, so text can be selected and read by screen readers.
- `text.html` gives the full book as plain, structured HTML.
- Keyboard: Left/Right arrow keys turn pages; Home/End jump to the covers; Tab reaches all links and buttons.

## Publish on GitHub Pages
1. Create a new public repository, e.g. `uoam-placement-book`.
2. Upload everything in this folder (keep the folder structure; include `.nojekyll`).
3. Settings → Pages → Source: "Deploy from a branch" → Branch: `main` / root → Save.
4. After a minute the book is live at `https://YOUR-GITHUB-USERNAME.github.io/uoam-placement-book/`

## Iframe embed code
```html
<iframe
  src="https://YOUR-GITHUB-USERNAME.github.io/uoam-placement-book/"
  title="University of Aberdeen Mumbai – Placement Profile Book 2026–27"
  width="100%" height="760"
  style="border:0; max-width:1200px; display:block; margin:0 auto;"
  loading="lazy" allow="fullscreen" allowfullscreen>
</iframe>
<p><a href="https://YOUR-GITHUB-USERNAME.github.io/uoam-placement-book/text.html">Accessible text version of the Placement Profile Book</a></p>
```

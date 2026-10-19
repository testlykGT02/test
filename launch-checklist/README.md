# Team Launch Checklist

A tiny static web app for tracking a product or feature launch across four sections:
**Planning**, **Content**, **Approvals**, and **Launch day**.

## Features

- Four sections with pre-filled launch tasks, each with its own completed count
- Check off tasks; progress bar shows overall completion
- Filter to show all tasks, open only, or completed only
- Progress is saved in your browser's `localStorage`, so it survives a page refresh
- "Reset checklist" clears all checkmarks

## How to open it locally

No build step, no dependencies, no server required.

1. Clone or download this repository.
2. Open `launch-checklist/index.html` in any modern browser.

From the repository root you can open it directly from a terminal:

```bash
# macOS
open launch-checklist/index.html

# Windows
start launch-checklist\index.html

# Linux
xdg-open launch-checklist/index.html
```

### Optional: serve it over HTTP

Some browsers restrict `localStorage` on `file://` URLs. If checkmarks don't persist
after a refresh, serve the folder instead:

```bash
cd launch-checklist
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Customizing the tasks

All content lives in the `checklist` array at the top of `app.js`. Each section has an
`id`, a `title`, and a list of tasks with a unique `id` and a `label`. Add, remove, or
reword tasks there and refresh the page.

> Task `id` values are the keys used for saved progress — renaming an `id` resets that
> task's saved state.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell, progress bar, filter control |
| `styles.css` | Styling |
| `app.js` | Checklist data, rendering, filtering, and persistence |

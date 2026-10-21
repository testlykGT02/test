# Team Launch Checklist

A simple, static checklist app for coordinating a team launch. Tasks are grouped into four sections:

- **Planning** – goals, audience, timeline, owners
- **Content** – announcement, social posts, docs, media
- **Approvals** – legal, security/privacy, leadership, go/no-go
- **Launch Day** – ship, publish, notify, monitor

## Features

- Check off tasks and see progress per section and overall
- Add your own tasks to any section, or remove ones you don't need
- Progress is saved automatically in your browser (`localStorage`)
- **Reset checklist** restores the default tasks

No build step, server, or dependencies — just HTML, CSS, and JavaScript.

## Open it locally

1. Clone the repo (or download it as a ZIP from GitHub and unzip it):

   ```sh
   git clone https://github.com/testlykGT02/test.git
   cd test/launch-checklist
   ```

2. Open `index.html` in your browser:
   - **Double-click** `index.html` in Finder / File Explorer, or
   - From a terminal: `open index.html` (macOS), `start index.html` (Windows), or `xdg-open index.html` (Linux).

### Optional: serve it over HTTP

Some browsers restrict `localStorage` for `file://` pages. If your progress isn't being saved, serve the folder instead:

```sh
cd launch-checklist
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page layout |
| `styles.css` | Styling |
| `app.js` | Default tasks, rendering, and saved progress |

To change the default tasks, edit `DEFAULT_SECTIONS` at the top of `app.js`, then click **Reset checklist** in the app.

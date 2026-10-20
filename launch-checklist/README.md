# Team Launch Checklist

A simple, static checklist app for coordinating a team launch. Tasks are grouped into four sections:

- **Planning** – goals, timeline, owners, risks
- **Content** – announcement, social posts, docs, assets
- **Approvals** – product, legal, marketing, go/no-go
- **Launch Day** – deploy, publish, monitor, recap

## Features

- Check off tasks and see progress per section and overall
- Add your own tasks to any section, or remove ones you don't need
- Progress is saved automatically in your browser (`localStorage`)
- **Reset checklist** restores the default tasks

No build step, no dependencies, no server required.

## Open it locally

1. Clone the repo (or download it as a ZIP from GitHub and unzip it):

   ```sh
   git clone https://github.com/testlykGT02/test.git
   cd test/launch-checklist
   ```

2. Open `index.html` in your browser:
   - **Double-click** `index.html` in your file explorer, or
   - From a terminal: `open index.html` (macOS), `start index.html` (Windows), or `xdg-open index.html` (Linux).

### Optional: serve it over HTTP

If you prefer a local web server, run one from the `launch-checklist` folder:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page layout and section template |
| `styles.css` | Styling |
| `app.js` | Default tasks, rendering, and saved progress |

To change the default tasks, edit `DEFAULT_SECTIONS` at the top of `app.js`, then click **Reset checklist** in the app.

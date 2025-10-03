# README for project: dyno8426@know-me-cli

Two ways to run:

## 1) **Zero-setup** (CDN-based, great for GitHub Pages)
- Upload the contents of `cdn-static/` to your `{username}.github.io` repo (or a `/docs` folder on any repo and enable Pages).
- Open the site — it should work immediately. Tailwind/React are loaded via CDNs.

npm run preview

## 2) **Local dev with Vite + Tailwind + Netlify Functions**

This project uses Netlify Functions for dynamic commands (e.g., the `books` command fetches from a serverless endpoint). To test all features locally, you must use Netlify Dev.

### Local development (Vite + Netlify Dev)

```bash
cd vite-project
npm install
# Start local dev server with Netlify Functions support
netlify dev
# open http://localhost:8888
```

**Note:**
- `npm run dev` (Vite only) will NOT serve Netlify functions. Use `netlify dev` for full local testing.
- If you don't have Netlify CLI, install it globally: `npm install -g netlify-cli` (use `sudo` if needed).

### Build for production

```bash
cd vite-project
npm run build
# output: vite-project/dist
```

Important: do NOT open `vite-project/dist/index.html` directly in your browser using the `file://` protocol. Modern browsers block loading bundled JS/CSS from the filesystem for security reasons (CORS), which will result in a blank page and console errors.

To preview the production build locally over HTTP you can either use Vite's preview server or the tiny static server included in this repo:

```bash
cd vite-project
# recommended: vite's preview (serves from dist)
npm run preview

# or use the included static server which sets CORS headers
npm run serve-dist

# open http://localhost:5173 (or the printed port)
```


## Netlify Integration (Dynamic Commands)

This project uses Netlify Functions for dynamic features (e.g., fetching Goodreads reviews for the `books` command). The function code lives in `vite-project/netlify/functions/`.

### Local testing
- Use `netlify dev` to run both the frontend and serverless functions locally.
- The books command and any other dynamic features will work exactly as in production.

### Production deployment
- Netlify will automatically detect and deploy functions from `vite-project/netlify/functions`.
- The deployed function will be available at `https://<yoursite>.netlify.app/.netlify/functions/goodreads`.
- The frontend is configured to use the correct endpoint for local, Netlify, and GitHub Pages deployments.

## Deploying to GitHub Pages (user site)

This project is configured for easy deployment to your GitHub user page (`dyno8426.github.io`).

**Recommended:** Use the included GitHub Actions workflow (`deploy-to-user-pages.yml`) to automatically build and publish the site to the `docs/` folder in your `dyno8426.github.io` repo on every push to `main`.

Manual alternative:
- After building (`npm run build`), copy the contents of `vite-project/dist` to the `docs/` folder in your `dyno8426.github.io` repo and push to `main`.

```bash
# from repo root
cp -a vite-project/dist/. ../dyno8426.github.io/docs/
cd ../dyno8426.github.io
git add docs
git commit -m "chore: update docs for GitHub Pages"
git push
```

Once pushed, GitHub Pages will serve the files at https://dyno8426.github.io/.

**Notes:**
- The workflow uses a secret `DEPLOY_TOKEN` for authentication.
- Only the `deploy-to-user-pages.yml` workflow is needed; the old `deploy-pages.yml` workflow for project pages has been removed.
- The site title is now "Adarsh Chauhan's DYNφTRON 2000" (see `vite-project/index.html`).
```

---

## Project overview

- `vite-project/` — main development app. Uses TypeScript + React + Tailwind.
- `cdn-static/` — quick static preview containing a similar UI.

The Vite project contains the primary source code you will probably edit.

## Key files and components

- `vite-project/src/TerminalPortfolio.tsx`
    - Core interactive terminal component.
    - Implements: command registry, input handling, command history, typing/animation for output, theme switching, and integration with background effects.
    - To add commands, extend the `commands` object. Each entry follows the `Command` shape `{ desc, usage, run }`.

- `vite-project/src/MatrixBackground.tsx` and `vite-project/src/matrix.css`
    - Decorative falling binary "rain" effect rendered behind the monitor.
    - `matrix.css` contains the animation keyframes and character styling.

- `vite-project/src/GridBackground.tsx`
    - Grid of 0/1 values covering the entire viewport. Individual cells flip randomly and some glow briefly.

- `vite-project/src/BackgroundSwitcher.tsx`
    - A floating button that toggles the background shown behind the monitor between Grid and Matrix modes. The button itself does not interfere with terminal interactions.

- `vite-project/src/index.css`
    - Tailwind base and project-level CSS utilities. Use this file for global style overrides.

- `vite-project/tailwind.config.js`
    - Tailwind configuration; contains custom box-shadow and background utilities used to get the CRT/monitor look.

## How the terminal works (brief)

- The command registry is a `Record<string, Command>` where each `Command` contains a `run` function returning lines of output or performing side effects.
- User input is handled with a controlled `<input>` and `onKeyDown` for history navigation and tab completion.
- `printLines` simulates typing by appending characters to the `history` state over time (this creates the typewriter effect).

## Customization notes

- Change the prompt text: edit `PROMPT_USER` and `PROMPT_HOST` in `TerminalPortfolio.tsx`.
- Default background: change the `background` state initial value in `TerminalPortfolio.tsx`.
- Typing speed: tweak the `cps` value passed to `printLines` inside `TerminalPortfolio.tsx`.
- Add a command: add an entry to the `commands` object. Keep `run` asynchronous if you want typing delays.

## Development tips

- Keep background components `pointer-events: none` so clicks pass through to the terminal.
- Use `npm run build` before deploying the Vite app to ensure all assets are bundled locally.
- When adjusting CRT appearance, edit `tailwind.config.js` (boxShadow entries) and `index.css`.

## Troubleshooting

- If terminal input is unresponsive, ensure no element is accidentally overlaying the input (backgrounds should be non-interactive).
- If styles don't update, confirm Tailwind JIT is watching `vite-project/src/**/*` and `index.html` per `tailwind.config.js` content paths.

## Project status & next tasks

- TODO: Improve dynamic monitor sizing to better fit very tall or very wide screens.
- TODO: Optionally expose command registry as separate module for unit testing and easier extension.

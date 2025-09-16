# README for project: dyno8426@know-me-cli

Two ways to run:

## 1) **Zero-setup** (CDN-based, great for GitHub Pages)
- Upload the contents of `cdn-static/` to your `{username}.github.io` repo (or a `/docs` folder on any repo and enable Pages).
- Open the site — it should work immediately. Tailwind/React are loaded via CDNs.

## 2) **Local dev with Vite + Tailwind**
```bash
cd vite-project
npm install
# Terminal Portfolio (Vite + CDN versions)

A retro-style terminal portfolio UI built with React + TypeScript + Tailwind. This repository contains both a quick CDN preview and a full local development project powered by Vite.

This README documents the project's components, how to run it, where the important source files live, and tips for customization.

---

## Quick start

### 1) CDN preview (zero setup)
- Copy the contents of `cdn-static/` to any static host (GitHub Pages `docs/` or a static CDN) and open `index.html`.
- This preview uses CDN-hosted React and Tailwind for a fast demo.

### 2) Local development (Vite)

```bash
cd vite-project
npm install
npm run dev
# build for production
npm run build
# output: vite-project/dist
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

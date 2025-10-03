# DEVELOPING for project: dyno8426@know-me-cli

Development notes for contributors and maintainers.

1) Project layout

- `vite-project/` — main app; TypeScript + React + Tailwind.
- `vite-project/src/TerminalPortfolio.tsx` — core interactive terminal component and command registry.
- `vite-project/src/MatrixBackground.tsx` and `vite-project/src/matrix.css` — decorative Matrix binary rain background.
- `vite-project/src/GridBackground.tsx` — alternative full-screen binary grid background.

2) Adding a command

Commands are defined in `TerminalPortfolio.tsx` as entries in the `commands` object. Each command follows this shape:

```ts
type Command = {
  desc: string; // short description
  usage: string; // usage string
  run: (cmd?: string, args?: string[]) => Promise<string[] | void>;
}

// Example:
commands['hello'] = {
  desc: 'Say hello',
  usage: 'hello [name]',
  run: async (_cmd, args=[]) => {
    const name = args[0] || 'world';
    return [`Hello, ${name}!`];
  }
}
```

Notes:
- Commands that return `string[]` will be printed line-by-line via the existing `printLines` typing simulation.
- If a command performs side effects (e.g., opens a URL or modifies state), it can return `void`.

3) Testing commands

- There are no formal unit tests in this repo yet. To test commands manually:
  - Run `npm run dev` in `vite-project`.
  - Open the site and type your new command to confirm behavior.

4) Styling and Tailwind

- Global styles and CSS utilities live in `vite-project/src/index.css`.
- Tailwind configuration is in `vite-project/tailwind.config.js`.



5) Netlify Integration & Local Testing

- Dynamic commands (like `books`) use Netlify Functions. To test these locally, use `netlify dev` instead of `npm run dev`.
- Install Netlify CLI globally if needed: `npm install -g netlify-cli` (use `sudo` if needed).
- Run `netlify dev` from the project root to serve both frontend and serverless functions.
- See README.md for more details.

6) Build and deploy

- `npm run build` in `vite-project` creates a production bundle in `vite-project/dist`.
- For GitHub Pages user site deployment, use the included GitHub Actions workflow (`deploy-to-user-pages.yml`) to publish to the `docs/` folder in your `dyno8426.github.io` repo. Manual copy is also supported.
- The site title is now "Adarsh Chauhan's DYNφTRON 2000" (see `vite-project/index.html`).

6) Future improvements

- Add unit tests for commands (suggestion: extract command registry to a separate module for easier unit testing).
- Add E2E tests for UI interactions using Playwright or Cypress.

7) Unit testing (Vitest)

This project includes a small unit test example for the terminal logic.

To run tests locally:

```bash
cd vite-project
npm install
npm run test
```

Notes:
- The test runner used is `vitest`. Tests live under `vite-project/src/__tests__`.
- If you modify or add tests, run `npm run test` to execute them in watch mode (Vitest defaults to a watch run in interactive terminals).


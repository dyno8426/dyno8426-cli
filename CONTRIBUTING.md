# CONTRIBUTING for project: dyno8426@know-me-cli

Thanks for contributing! A few simple guidelines to keep the project consistent.

1) Code style
- Use TypeScript types where appropriate.
- Keep React components focused and small. Prefer extracting helper logic or UI bits into separate files under `vite-project/src/`.
- Use Tailwind utility classes for layout and styling; add new tokens to `tailwind.config.js` only when necessary.

2) Adding commands
- Follow the `Command` shape described in `DEVELOPING.md`.
- Keep command implementations fast and non-blocking. If a command needs long-running work, show progress or messages to the terminal.

3) Pull requests
- Describe the change and the reason for it.
- If adding new UI behavior, include a short GIF or screenshots.

4) Tests
- There are no tests yet; small, focused units are encouraged. Consider adding tests under a `tests/` folder and a test runner (Jest/Playwright) if you add behavior worth regression testing.


5) Issues and discussions
- Open an issue for larger scope work (e.g., extracting the command registry, accessibility improvements, or production deployment tasks).

6) Deployment
- The recommended deployment workflow is `deploy-to-user-pages.yml`, which publishes the site to the `docs/` folder in your `dyno8426.github.io` repo.
- The site title is now "Adarsh Chauhan's DYNφTRON 2000" (see `vite-project/index.html`).

Thank you — contributions make the project better!

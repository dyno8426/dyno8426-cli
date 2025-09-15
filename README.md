# Terminal Portfolio (Checkpoint2, fixed)

Two ways to run:

## 1) **Zero-setup** (CDN-based, great for GitHub Pages)
- Upload the contents of `cdn-static/` to your `{username}.github.io` repo (or a `/docs` folder on any repo and enable Pages).
- Open the site — it should work immediately. Tailwind/React are loaded via CDNs.

## 2) **Local dev with Vite + Tailwind**
```bash
cd vite-project
npm install
npm run dev
# build when ready:
npm run build
# output folder: dist/
```
Then deploy the `dist/` folder to GitHub Pages.

---

### Notes
- The CDN version is perfect for quick hosting, but if you need **full offline** with no CDNs,
  build via Vite so everything is bundled locally.
- The main terminal UI is in `src/TerminalPortfolio.tsx` (Vite project).
- The CDN version contains the same UI embedded in `index.html` under a `<script type="text/babel">` block.
- Command set: `help`, `about`, `resume`, `projects`, `books`, `photos`, `contact`, `content`, `clear`, `theme`, `banner`, `echo`, `whoami`, `date`, `open`, `sudo`, `test`.
- To change the prompt name/host, update `PROMPT_USER` and `PROMPT_HOST`.

Generated: 2025-09-15T18:03:04.978185Z

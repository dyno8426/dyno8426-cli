'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MatrixBackground } from './MatrixBackground';
import { GridBackground } from './GridBackground';
import { BackgroundSwitcher } from './BackgroundSwitcher';

const PROMPT_USER = "dyno8426";
const PROMPT_HOST = "know-me-cli";

const THEMES = {
  green: { text: "text-green-400", accent: "text-green-300", caret: "bg-green-400" },
  amber: { text: "text-amber-300", accent: "text-amber-200", caret: "bg-amber-300" },
  mono:  { text: "text-neutral-200", accent: "text-neutral-100", caret: "bg-neutral-200" },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const nowString = () => new Date().toLocaleString();

type HistoryItem = { type: 'input' | 'output'; text: string };

type Command = {
  desc: string;
  usage: string;
  run: (cmd?: string, args?: string[]) => Promise<string[] | void>;
};

export default function TerminalPortfolio() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState<keyof typeof THEMES>("green");
  const [background, setBackground] = useState<'matrix' | 'grid'>('grid');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const typingRef = useRef(false);

  useEffect(() => { inputRef.current?.focus(); }, []);
  const scrollToEnd = () => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); };
  useEffect(() => { scrollToEnd(); }, [history, busy]);

  const commands: Record<string, Command> = useMemo(() => ({
    help: { desc: "Show available commands", usage: "help", run: async () => [
      "COMMANDS:",
      "  help        → Show available commands",
      "  about       → Who I am",
      "  resume      → Professional background",
      "  projects    → Selected projects",
      "  books       → Recent book notes",
      "  photos      → Photo journal info",
      "  contact     → Reach me",
      "  content txt → Append arbitrary content (e.g., content Hello world)",
      "  clear       → Clear the screen",
      "  theme name  → Switch theme [green|amber|mono]",
      "  banner      → Show ASCII banner",
      "  echo txt    → Print text",
      "  whoami      → Print current user",
      "  date        → Print date/time",
      "  open <url>  → Hint to open a URL",
      "  sudo hire-me→ 😉",
      "  test        → Run built-in self-checks",
    ] },
    about: { desc: "Who I am", usage: "about", run: async () => [
      "Hi, I'm Adarsh Chauhan (he/him).",
      "Senior Software Engineer (9+ yrs ML & large-scale systems).",
      "Currently exploring the intersection of data science and public health (health equity, cancer prevention, epidemiology).",
      "Outside code: photography, book notes, and creative projects.",
    ] },
    resume: { desc: "Professional background", usage: "resume", run: async () => [
      "Experience:",
      "- Microsoft · Applied Scientist / Data Scientist — user modeling, click prediction, large-scale ML",
      "Education:",
      "- MTech CS/ML | BTech CS",
      "Skills:",
      "- Python, PyTorch, Spark, Airflow, SQL, Typescript/React, Next.js, Tailwind",
      "- Causal inference, time-series, epidemiological modeling (in progress)",
      "Tip: try 'projects' or 'contact'.",
    ] },
    projects: { desc: "Selected projects", usage: "projects", run: async () => [
      "1) COVID-19 Misinformation & Behavior Signals — WA state time-series (search trends × cases)",
      "2) Smart ICU Monitoring — ML-assisted signals exploration (prototype)",
      "3) Photography Portfolio — curation & generative experiments",
      "Use 'open https://github.com/yeshi' to see GitHub (or your link).",
    ] },
    books: { desc: "Recent book notes", usage: "books", run: async () => [
      "- Being Mortal — Atul Gawande (notes pending)",
      "- Invisible Women — Caroline Criado Perez (bias × data)",
      "- The Emperor of All Maladies — Siddhartha Mukherjee",
      "Use 'content <your text>' to append your own notes live.",
    ] },
    photos: { desc: "Photo journal info", usage: "photos", run: async () => [
      "Photography journal available in gallery view (GUI mode WIP).",
      "For now, use 'open https://your-domain.com/photos' to view.",
    ] },
    contact: { desc: "How to reach me", usage: "contact", run: async () => [
      "Email   : yeshi@example.com",
      "LinkedIn: https://linkedin.com/in/yeshidolma",
      "GitHub  : https://github.com/yeshi",
    ] },
    clear: { desc: "Clear the screen", usage: "clear", run: async () => { setHistory([]); return []; } },
    theme: { desc: "Switch theme", usage: "theme [green|amber|mono]", run: async (_cmd, args=[]) => {
      const next = (args[0] || "").toLowerCase();
      if (!Object.keys(THEMES).includes(next)) return [`Unknown theme '${next}'. Available: ${Object.keys(THEMES).join(", ")}`];
      setTheme(next as keyof typeof THEMES); return [`Theme set to ${next}.`];
    } },
    banner: { desc: "ASCII banner", usage: "banner", run: async () => {
      const art = String.raw`
 _   _           _     _     
| | | |_   _ ___| |__ (_)___ 
| |_| | | | / __| '_ \| / __|
|  _  | |_| \__ \ | | | \\__ \
|_| |_|\__,_|___/_| |_|_|___/ 
   Adarsh Chauhan · Engineer of systems & stories`;
      return art.split("\n");
    } },
    echo: { desc: "Print text", usage: "echo <text>", run: async (_cmd, args=[]) => [args.length ? args.join(" ") : ""] },
    content: { desc: "Append arbitrary content", usage: "content <text>", run: async (_cmd, args=[]) => {
      if (!args.length) return ["Usage: content <text>"]; return [args.join(" ")];
    } },
    whoami: { desc: "Print user", usage: "whoami", run: async () => [PROMPT_USER] },
    date: { desc: "Date/time", usage: "date", run: async () => [nowString()] },
    open: { desc: "Hint to open URL", usage: "open <url>", run: async (_cmd, args=[]) => {
      if (!args.length) return ["Usage: open <url>"]; const url=args[0]; return [`Open this URL in a new tab: ${url}`];
    } },
    sudo: { desc: "Fun easter egg", usage: "sudo hire-me", run: async (_cmd, args=[]) => {
      if (args.join(" ") === "hire-me") return ["Permission granted ✔️","Attaching resume... (pretend)","Email me if you want the PDF link."]; 
      return ["sudo: permission denied 😅"];
    } },
    test: { desc: "Run self-checks", usage: "test", run: async () => {
      const lines: string[] = ["Running self-checks..."]; 
      const assert = (name: string, ok: boolean) => { lines.push(`${ok ? '✔' : '✖'} ${name}`); };
      const expected = ['help','about','resume','projects','books','photos','contact','clear','theme','banner','echo','whoami','date','open','sudo','content','test'];
      assert('command registry present', !!expected.every((k) => k in commands));
      const themeOut = await commands.theme.run('theme', ['purple']) as string[];
      assert('theme invalid yields error', Array.isArray(themeOut) && themeOut[0].startsWith('Unknown theme'));
      const b = await commands.banner.run('banner', []) as string[];
      assert('banner returns > 3 lines', Array.isArray(b) && b.length > 3);
      assert('banner contains \\__', b.join('\\n').includes('\\__'));
      const e = await commands.echo.run('echo', ['hello', 'world']) as string[];
      assert('echo join works', Array.isArray(e) && e[0] === 'hello world');
      lines.push('Self-checks complete.');
      return lines;
    } }
  }), []);

  const commandNames = useMemo(() => Object.keys(commands), [commands]);

  const printLines = useCallback(async (lines: string[], cps=3000) => {
    const delay = 1000 / cps;
    const batchSize = 3; // Process characters in batches for speed
    
    for (const line of lines) {
      setHistory((prev) => [...prev, { type: "output", text: "" }]);
      let acc = "";
      const chars = Array.from(line);
      
      for (let i = 0; i < chars.length; i += batchSize) {
        const batch = chars.slice(i, i + batchSize).join('');
        acc += batch;
        setHistory((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], text: acc };
          return next;
        });
        // Only delay if not at a space and not processing a big chunk of text
        if (!batch.match(/^\s+$/) && line.length < 100) await sleep(delay);
      }
      await sleep(5); // Reduced line delay
    }
  }, []);

  const pushInputEcho = useCallback((text: string) => {
    setHistory((prev) => [...prev, { type: "input", text }]);
  }, []);

  const execute = useCallback(async (raw: string) => {
    const line = raw.trim();
    if (!line) return;
    pushInputEcho(renderPrompt() + line);
    setBusy(true); typingRef.current = true;
    const parts = line.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    if (!commands[cmd]) {
      await printLines([`Command not found: ${cmd}. Type 'help'.`]);
      setBusy(false); typingRef.current = false; return;
    }
    try {
      const out = await commands[cmd].run(cmd, args);
      if (Array.isArray(out) && out.length) await printLines(out);
    } catch (err: any) {
      await printLines([`Error: ${err?.message || String(err)}`]);
    } finally {
      setBusy(false); typingRef.current = false;
    }
  }, [commands, printLines, pushInputEcho]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = input;
    if (!value.trim()) return;
    setCmdHistory((p) => [value, ...p]);
    setCmdIndex(-1);
    setInput("");
    await execute(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (!input.trim()) return;
      const parts = input.trim().split(/\s+/);
      if (parts.length > 1) return;
      const matches = commandNames.filter((c) => c.startsWith(parts[0].toLowerCase()));
      if (matches.length === 1) setInput(matches[0] + " ");
      else if (matches.length > 1) {
        if (!busy && !typingRef.current) {
          setBusy(true);
          (async () => {
            pushInputEcho(renderPrompt() + input.trim());
            await printLines([`Suggestions: ${matches.join("  ")}`]);
            setInput("");
            setBusy(false);
          })();
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCmdIndex((idx) => {
        const next = Math.min(idx + 1, cmdHistory.length - 1);
        setInput(cmdHistory[next] || input);
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCmdIndex((idx) => {
        const next = Math.max(idx - 1, -1);
        setInput(next === -1 ? "" : (cmdHistory[next] || ""));
        return next;
      });
    } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (busy) {
        setBusy(false);
        typingRef.current = false;
        setHistory((prev) => [...prev, { type: "output", text: "^C" }]);
      }
    }
  };

  const renderPrompt = () => `${PROMPT_USER}@${PROMPT_HOST}:~$ `;
  const themeClasses = THEMES[theme] || THEMES.green;

  return (
    <div className="relative min-h-screen w-full bg-neutral-900 p-4 md:p-8 flex items-center justify-center overflow-hidden">
      {background === 'matrix' ? <MatrixBackground /> : <GridBackground />}
      <BackgroundSwitcher current={background} onChange={setBackground} />
      {/* Monitor Frame */}
      <div className="w-[95vw] h-[85vh] max-w-[1400px] bg-neutral-800 rounded-[2.5rem] p-6 md:p-8 lg:p-12 relative shadow-monitor
                    before:content-[''] before:absolute before:inset-0 before:rounded-[2.5rem] before:border-t-4 before:border-neutral-600/30
                    after:content-[''] after:absolute after:inset-0 after:rounded-[2.5rem] after:shadow-inner-strong">
        {/* Monitor Brand Label */}
        <div className="absolute -top-3 left-12 px-4 py-1 bg-neutral-700 rounded-b-lg text-neutral-400 text-xs font-mono tracking-wider">
          DYNØ·TRON 2000
        </div>

        {/* Control Panel */}
        <div className="absolute -right-3 top-8 w-8 flex flex-col gap-6">
          {/* LED Indicators with Labels */}
          <div className="bg-neutral-700 rounded-r-lg p-2 space-y-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse shadow-glow-red" />
              <span className="text-[8px] text-neutral-400 rotate-90 translate-y-3">PWR</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-glow-green" />
              <span className="text-[8px] text-neutral-400 rotate-90 translate-y-3">HDD</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-glow-amber" />
              <span className="text-[8px] text-neutral-400 rotate-90 translate-y-3">NET</span>
            </div>
          </div>

          {/* Brightness/Contrast Knobs */}
          <div className="bg-neutral-700 rounded-r-lg p-2 space-y-4">
            <div className="w-4 h-4 rounded-full bg-neutral-900 ring-1 ring-neutral-600 shadow-inner" />
            <div className="w-4 h-4 rounded-full bg-neutral-900 ring-1 ring-neutral-600 shadow-inner" />
          </div>
        </div>

        {/* Left Side Controls */}
        <div className="absolute -left-4 flex flex-col gap-6 top-8">
          {/* Power Button */}
          <div className="w-10 h-10 bg-neutral-700 rounded-l-lg p-1.5">
            <div className="w-full h-full rounded-full bg-neutral-900 ring-2 ring-neutral-600 flex items-center justify-center shadow-inner-strong">
              <div className="w-5 h-5 rounded-full bg-green-500/30 animate-pulse shadow-glow-green" />
            </div>
          </div>
          
          {/* Connection Ports Panel */}
          <div className="w-10 bg-neutral-700 rounded-l-lg p-1.5 space-y-3">
            <div className="h-6 bg-neutral-900/80 rounded-sm flex items-center justify-center text-[8px] text-neutral-500">USB</div>
            <div className="h-6 bg-neutral-900/80 rounded-sm flex items-center justify-center text-[8px] text-neutral-500">COM</div>
          </div>

          {/* Disk Drives */}
          <div className="w-10 bg-neutral-700 rounded-l-lg p-1.5 space-y-3">
            <div className="relative h-8 bg-neutral-900/80 rounded-sm px-1 flex items-center">
              <div className="absolute right-1 w-1 h-1 rounded-full bg-green-500/50" />
              <span className="text-[8px] text-neutral-500 rotate-90 translate-y-3">A:</span>
            </div>
            <div className="relative h-8 bg-neutral-900/80 rounded-sm px-1 flex items-center">
              <div className="absolute right-1 w-1 h-1 rounded-full bg-amber-500/50" />
              <span className="text-[8px] text-neutral-500 rotate-90 translate-y-3">B:</span>
            </div>
          </div>
        </div>

        {/* Monitor Stand */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 bg-neutral-700 rounded-lg
                      before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 
                      before:w-64 before:h-2 before:bg-neutral-600 before:rounded-full" />
        {/* Screen Inner */}
        <div 
          className={`crt-monitor w-full h-full bg-black rounded-xl ${themeClasses.text} font-mono 
                    selection:bg-white/10 selection:text-white border-b-8 border-neutral-900/50
                    shadow-inner-screen overflow-hidden`}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Screen Content Container */}
          <div className="relative h-full z-10 crt-pixels">
            {/* Screen Overlay Effects - Fixed */}
            <div className="absolute inset-0 pointer-events-none select-none">
              <div className="absolute inset-0 bg-screen-vignette opacity-50" />
              <div className="absolute inset-0 bg-screen-glow opacity-30" />
            </div>

            {/* Scrollable Content Area with Fade Effect */}
            <div className="relative z-10 h-full overflow-auto scrollbar-none" 
                 style={{ 
                   maskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
                   WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)'
                 }}>
              {/* Content Wrapper */}
              <div className="relative p-4 min-h-full flex flex-col"
                style={{
                  background: 'linear-gradient(rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.25) 50%)',
                  backgroundSize: '100% 4px',
                }}
              >
                <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
                  <div className="flex flex-col min-h-full">
                    <div className="flex-1">
                      {history.length === 0 && (
                        <div className="mb-6 text-sm opacity-80">
                          <pre className="whitespace-pre-wrap leading-relaxed">{`Booting terminal... done
Welcome to ${PROMPT_USER}@${PROMPT_HOST}. Type 'help' to begin.`}</pre>
                        </div>
                      )}

                      <div className="space-y-1">
                        {history.map((item, idx) => (
                          <div key={idx} className="leading-relaxed">
                            {item.type === "input" ? (
                              <pre className="whitespace-pre-wrap"><span className="text-white">{item.text}</span></pre>
                            ) : (
                              <pre className="whitespace-pre-wrap">{item.text}</pre>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <form onSubmit={onSubmit} className="mt-2 flex items-baseline gap-2">
                        <span className={`shrink-0 ${themeClasses.accent}`}>{renderPrompt()}</span>
                        <div className="relative grow">
                          <input
                            ref={inputRef}
                            type="text"
                            aria-label="Terminal input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            disabled={false}
                            className={`w-full bg-transparent outline-none caret-transparent ${themeClasses.text}`}
                            autoComplete="off"
                            spellCheck={false}
                          />
                          <span className={`pointer-events-none absolute -bottom-0.5 left-[calc(var(--caret-x,0)*1ch)] h-4 w-2 animate-pulse ${themeClasses.caret}`} style={{opacity: 0.8}} />
                        </div>
                        <button type="submit" disabled={busy} className="sr-only">run</button>
                      </form>

                      <div className="mt-4 text-xs opacity-60">
                        <p>Hints: TAB = autocomplete · ↑/↓ = history · Ctrl+C = cancel typing · try 'help', 'banner', 'theme amber', 'test'</p>
                      </div>
                    </div>

                    <div ref={endRef} className="h-12" />
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

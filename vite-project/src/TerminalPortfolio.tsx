'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MatrixBackground } from './MatrixBackground';
import { GridBackground } from './GridBackground';
import { BackgroundSwitcher } from './BackgroundSwitcher';
import RetroMonitor from './RetroMonitor';
// Static terminal content separated for readability and easy edits
import {
  PROMPT_USER as PC_PROMPT_USER,
  PROMPT_HOST as PC_PROMPT_HOST,
  HELP_LINES,
  ABOUT_LINES,
  WORK_LINES,
  PROJECTS_LINES,
  BOOKS_LINES,
  PHOTOS_LINES,
  CONTACT_LINES,
  BANNER_ART,
  SUDO_HIRE_ME_LINES,
} from './terminalContent';

// Use the static prompt values from the content module
const PROMPT_USER = PC_PROMPT_USER;
const PROMPT_HOST = PC_PROMPT_HOST;

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
  // Cancellation flag used to abort in-progress printing (Ctrl-C)
  const cancelRef = useRef(false);

  useEffect(() => { inputRef.current?.focus(); }, []);
  const scrollToEnd = () => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); };
  useEffect(() => { scrollToEnd(); }, [history, busy]);

  // Commands registry: map text commands to handlers. Keep logic separate from static content.
  const commands: Record<string, Command> = useMemo(() => ({
    help: { desc: 'Show available commands', usage: 'help', run: async () => HELP_LINES },
    about: { desc: 'Who I am', usage: 'about', run: async () => ABOUT_LINES },
  work: { desc: 'Professional background', usage: 'work', run: async () => WORK_LINES },
    projects: { desc: 'Selected projects', usage: 'projects', run: async () => PROJECTS_LINES },
    books: { desc: 'Recent book notes', usage: 'books', run: async () => BOOKS_LINES },
    photos: { desc: 'Photo journal info', usage: 'photos', run: async () => PHOTOS_LINES },
    contact: { desc: 'How to reach me', usage: 'contact', run: async () => CONTACT_LINES },
    clear: { desc: 'Clear the screen', usage: 'clear', run: async () => { setHistory([]); return []; } },
    theme: { desc: 'Switch theme', usage: 'theme [green|amber|mono]', run: async (_cmd, args=[]) => {
      const next = (args[0] || '').toLowerCase();
      if (!Object.keys(THEMES).includes(next)) return [`Unknown theme '${next}'. Available: ${Object.keys(THEMES).join(', ')}`];
      setTheme(next as keyof typeof THEMES); return [`Theme set to ${next}.`];
    } },
    banner: { desc: 'ASCII banner', usage: 'banner', run: async () => BANNER_ART.split('\n') },
    echo: { desc: 'Print text', usage: 'echo <text>', run: async (_cmd, args=[]) => [args.length ? args.join(' ') : ''] },
    content: { desc: 'Append arbitrary content', usage: 'content <text>', run: async (_cmd, args=[]) => {
      if (!args.length) return ['Usage: content <text>']; return [args.join(' ')];
    } },
    whoami: { desc: 'Print user', usage: 'whoami', run: async () => [PROMPT_USER] },
    date: { desc: 'Date/time', usage: 'date', run: async () => [nowString()] },
    open: { desc: 'Hint to open URL', usage: 'open <url>', run: async (_cmd, args=[]) => {
      if (!args.length) return ['Usage: open <url>']; const url = args[0]; return [`Open this URL in a new tab: ${url}`];
    } },
    sudo: { desc: 'Fun easter egg', usage: 'sudo hire-me', run: async (_cmd, args=[]) => {
      if (args.join(' ') === 'hire-me') return SUDO_HIRE_ME_LINES; return ['sudo: permission denied 😅'];
    } },
    test: { desc: 'Run self-checks', usage: 'test', run: async () => {
      const lines: string[] = ['Running self-checks...'];
      const assert = (name: string, ok: boolean) => { lines.push(`${ok ? '✔' : '✖'} ${name}`); };
  const expected = ['help','about','work','projects','books','photos','contact','clear','theme','banner','echo','whoami','date','open','sudo','content','test'];
      assert('command registry present', !!expected.every((k) => k in commands));
      const themeOut = await commands.theme.run('theme', ['purple']) as string[];
      assert('theme invalid yields error', Array.isArray(themeOut) && themeOut[0].startsWith('Unknown theme'));
      const b = await commands.banner.run('banner', []) as string[];
      assert('banner returns > 3 lines', Array.isArray(b) && b.length > 3);
      assert('banner contains \\__', b.join('\n').includes('\\__'));
      const e = await commands.echo.run('echo', ['hello', 'world']) as string[];
      assert('echo join works', Array.isArray(e) && e[0] === 'hello world');
      lines.push('Self-checks complete.');
      return lines;
    } },
  }), []);

  const commandNames = useMemo(() => Object.keys(commands), [commands]);

  /**
   * Append output lines to the terminal, printing them with a typewriter-like
   * effect. The function batches characters for performance but preserves
   * per-line flush semantics so long-running outputs still appear progressively.
   *
   * @param lines - array of strings to print as output lines
   * @param cps - characters-per-second throttle (higher = faster)
   */
  const printLines = useCallback(async (lines: string[], cps = 3000) => {
    const delay = 1000 / cps;
    const batchSize = 3; // Render characters in small batches for smoother updates

    for (const line of lines) {
      // Respect cancellation: if set, abort printing immediately
      if (cancelRef.current) return;
      // Add a placeholder output entry which we'll progressively fill
      setHistory((prev) => [...prev, { type: 'output', text: '' }]);
      let acc = '';
      const chars = Array.from(line);

      for (let i = 0; i < chars.length; i += batchSize) {
        const batch = chars.slice(i, i + batchSize).join('');
        acc += batch;
        // Mutate only the last history entry to avoid triggering unrelated renders
        setHistory((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], text: acc };
          return next;
        });

        // Allow an in-flight Ctrl-C to interrupt printing mid-line
        if (cancelRef.current) return;

        // Throttle printing to create a readable typing effect for short lines
        if (!batch.match(/^\s+$/) && line.length < 100) await sleep(delay);
      }
      // Small pause between lines so multi-line outputs feel natural
      await sleep(5);
    }
  }, []);

  /**
   * Add an item to the terminal history. This abstracts the state update and
   * makes intent explicit when components need to append input or output.
   */
  const addHistoryItem = useCallback((item: HistoryItem) => {
    setHistory((prev) => [...prev, item]);
  }, []);

  /**
   * Clear the terminal history (used by the `clear` command). Kept as a
   * separate helper to make command handlers concise and testable.
   */
  const clearHistory = useCallback(() => setHistory([]), []);

  /**
   * Focus helper to set focus on the input. Exported via callbacks to children
   * (RetroMonitor) so clicking the monitor focuses the terminal input.
   */
  const focusInput = useCallback(() => { inputRef.current?.focus(); }, []);

  const pushInputEcho = useCallback((text: string) => {
    // Use the addHistoryItem helper to make intent explicit
    addHistoryItem({ type: 'input', text });
  }, []);

  /**
   * Parse a raw command line into its command and args. Kept as a small pure
   * function so it can be unit tested and reused where needed.
   */
  const parseCommand = useCallback((raw: string) => {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0]?.toLowerCase() || '';
    const args = parts.slice(1);
    return { cmd, args } as { cmd: string; args: string[] };
  }, []);

  /**
   * Execute a raw command line string. This coordinates echoing the input,
   * toggling busy/typing state, locating the command handler, and printing
   * any results or error messages. Side-effects (history updates, theme
   * changes) are performed by command handlers themselves to keep execute
   * focused on orchestration.
   */
  const execute = useCallback(async (raw: string) => {
    const line = raw.trim();
    if (!line) return;

    // Echo the typed command in the terminal history
    pushInputEcho(renderPrompt() + line);

    // Reset cancellation state and mark the terminal busy while command runs
    cancelRef.current = false;
    setBusy(true);
    typingRef.current = true;

    const { cmd, args } = parseCommand(line);

    if (!commands[cmd]) {
      await printLines([`Command not found: ${cmd}. Type 'help'.`]);
      setBusy(false);
      typingRef.current = false;
      return;
    }

    try {
      const out = await commands[cmd].run(cmd, args);
      if (Array.isArray(out) && out.length) await printLines(out);
    } catch (err: any) {
      await printLines([`Error: ${err?.message || String(err)}`]);
    } finally {
      setBusy(false);
      typingRef.current = false;
    }
  }, [commands, printLines, pushInputEcho, parseCommand]);

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
    // Handle Tab completion, history navigation and Ctrl+C cancellation
    if (e.key === 'Tab') {
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
            // Push suggestions as an echoed input then print a suggestion list
            pushInputEcho(renderPrompt() + input.trim());
            await printLines([`Suggestions: ${matches.join('  ')}`]);
            // Clear the input to indicate suggestions were printed
            setInput('');
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
        // Signal any in-progress printing to abort
        cancelRef.current = true;
        setBusy(false);
        typingRef.current = false;
        // Show cancellation feedback and a short termination message
        addHistoryItem({ type: 'output', text: '^C' });
        addHistoryItem({ type: 'output', text: 'Command terminated by user.' });
      }
    }
  };

  // Global key handler: capture Ctrl-C even when the input is not focused (e.g.,
  // when the prompt is hidden while a command is running). This ensures the
  // user can abort long-running output by pressing Ctrl-C at any time.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'c' || e.key === 'C') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (busy) {
          cancelRef.current = true;
          setBusy(false);
          typingRef.current = false;
          addHistoryItem({ type: 'output', text: '^C' });
          addHistoryItem({ type: 'output', text: 'Command terminated by user.' });
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [busy, addHistoryItem]);

  // When a command finishes (busy -> false) ensure the input is focused so the
  // user can immediately start typing the next command without clicking.
  useEffect(() => {
    if (!busy) {
      // Delay to the next tick so the input is mounted/rendered before focusing.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [busy]);

  const renderPrompt = () => `${PROMPT_USER}@${PROMPT_HOST}:~$ `;
  const themeClasses = THEMES[theme] || THEMES.green;

  return (
    <div className="relative min-h-screen w-full bg-neutral-900 p-4 md:p-8 flex items-center justify-center overflow-hidden">
      {background === 'matrix' ? <MatrixBackground /> : <GridBackground />}
      <BackgroundSwitcher current={background} onChange={setBackground} />
      {/* Monitor Frame (moved to RetroMonitor for clarity) */}
      <RetroMonitor onClick={() => inputRef.current?.focus()} themeClasses={themeClasses}>
        {/* Screen Content Container (passed as children to RetroMonitor) */}
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
                            <pre className="whitespace-pre-wrap">
                              {item.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                                part.match(/^https?:\/\//)
                                  ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">{part}</a>
                                  : part
                              )}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    {/* While a command is running (busy) we hide the prompt/input so the user
                        cannot enter a new command until the previous one completes. The
                        Ctrl-C handler uses `cancelRef` to abort in-progress printing. */}
                    {!busy ? (
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
                            className={`w-full bg-transparent outline-none ${themeClasses.text} input-mono-caret fallback-caret`}
                            style={{ caretColor: 'currentColor' }}
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </div>
                        <button type="submit" disabled={busy} className="sr-only">run</button>
                      </form>
                    ) : (
                      <div className="mt-2 text-sm opacity-70">Processing command... (press Ctrl+C to cancel)</div>
                    )}

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
      </RetroMonitor>
    </div>
  );
}

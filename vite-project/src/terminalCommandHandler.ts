// Static terminal content imports
import {
	PROMPT_USER as PC_PROMPT_USER,
	PROMPT_HOST as PC_PROMPT_HOST,
	HELP_LINES,
	ABOUT_LINES,
	WORK_LINES,
	ACADS_LINES,
	PUBLICATIONS_LINES,
	PROJECTS_LINES,
	BOOKS_LINES,
	PHOTOS_LINES,
	CONTACT_LINES,
	BANNER_ART,
	SUDO_HIRE_ME_LINES,
	INTERESTS_LINES,
} from './terminalContent';

const PROMPT_USER = PC_PROMPT_USER;
const PROMPT_HOST = PC_PROMPT_HOST;

const THEMES = {
	green: { text: "text-green-400", accent: "text-green-300", caret: "bg-green-400" },
	amber: { text: "text-amber-300", accent: "text-amber-200", caret: "bg-amber-300" },
	mono:  { text: "text-neutral-200", accent: "text-neutral-100", caret: "bg-neutral-200" },
};

const nowString = () => new Date().toLocaleString();

export type Command = {
	desc: string;
	usage: string;
	run: (cmd?: string, args?: string[], helpers?: any) => Promise<string[] | void>;
};

export const commands: Record<string, Command> = {
	interests: {
		desc: 'Show or explain a specific hobby',
		usage: 'interests [all|reading|photography|art|music|misc]',
		   run: async (_cmd, args=[]) => {
			   // Define the line ranges for each hobby
			   const reading = INTERESTS_LINES.slice(0, 3);
			   const photography = INTERESTS_LINES.slice(4, 6);
			   const art = INTERESTS_LINES.slice(7, 9);
			   const music = INTERESTS_LINES.slice(10, 12);
			   // Miscellaneous hobbies: strength training, mixology, gardening, chess
			   const misc = INTERESTS_LINES.slice(13);
			   // Help text
			   const help = [
				   'Usage: interests [all|reading|photography|art|music|misc]',
				   'Options:',
				   '  all          Show all hobbies',
				   '  reading      About reading/books',
				   '  photography  About photography',
				   '  art          About art',
				   '  music        About music',
				   '  misc         Miscellaneous hobbies (strength, mixology, gardening, chess)',
				   '',
				   'Type "interests all" to see everything or "interests reading" for just reading.'
			   ];
			   const opt = (args[0] || '').toLowerCase();
			   if (!opt || opt === 'help') return [...help];
			   if (opt === 'all') return [...INTERESTS_LINES];
			   if (opt === 'reading') return [...reading];
			   if (opt === 'photography') return [...photography];
			   if (opt === 'art') return [...art];
			   if (opt === 'music') return [...music];
			   if (opt === 'misc') return [...misc];
			   return ['Unknown option for interests. Type "interests help" for usage.'];
		   }
	},
	help: { desc: 'Show available commands', usage: 'help', run: async () => HELP_LINES },
	about: { desc: 'Who I am', usage: 'about', run: async () => ABOUT_LINES },
	work: { desc: 'Professional background', usage: 'work', run: async () => WORK_LINES },
	acads: { desc: 'Education background', usage: 'acads', run: async () => ACADS_LINES },
	publications: { desc: 'Research papers & patents', usage: 'publications', run: async () => PUBLICATIONS_LINES },
	projects: { desc: 'Selected projects', usage: 'projects', run: async () => PROJECTS_LINES },
	books: { desc: 'Recent book notes', usage: 'books', run: async () => BOOKS_LINES },
	photos: { desc: 'Photo journal info', usage: 'photos', run: async () => PHOTOS_LINES },
	contact: { desc: 'How to reach me', usage: 'contact', run: async () => CONTACT_LINES },
	clear: { desc: 'Clear the screen', usage: 'clear', run: async (_cmd, _args, helpers) => { helpers?.clearHistory(); return []; } },
	theme: { desc: 'Switch theme', usage: 'theme [green|amber|mono]', run: async (_cmd, args=[], helpers) => {
		const next = (args[0] || '').toLowerCase();
		if (!Object.keys(THEMES).includes(next)) return [`Unknown theme '${next}'. Available: ${Object.keys(THEMES).join(', ')}`];
		helpers?.setTheme(next);
		return [`Theme set to ${next}.`];
	} },
	banner: { desc: 'ASCII banner', usage: 'banner', run: async () => BANNER_ART.split('\n') },
	echo: { desc: 'Print text', usage: 'echo <text>', run: async (_cmd, args=[]) => [args.length ? args.join(' ') : ''] },
	content: { desc: 'Append arbitrary content', usage: 'content <text>', run: async (_cmd, args=[]) => {
		if (!args.length) return ['Usage: content <text>']; return [args.join(' ')];
	} },
	whoami: { desc: 'Print user', usage: 'whoami', run: async () => [PROMPT_USER] },
	date: { desc: 'Date/time', usage: 'date', run: async () => [nowString()] },
	open: { desc: 'Open a URL', usage: 'open <url>', run: async (_cmd, args=[]) => {
		if (!args.length) return ['Usage: open <url>'];
		const url = args[0];
		const isValidUrl = /^https?:\/\/.+\..+/.test(url);
		if (isValidUrl) {
			if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
			return [`Opened URL: ${url}`];
		} else {
			return ['Invalid URL format. Use http(s)://...'];
		}
	} },
	sudo: { desc: 'Fun easter egg', usage: 'sudo hire-me', run: async (_cmd, args=[]) => {
		if (args.join(' ') === 'hire-me') return SUDO_HIRE_ME_LINES; return ['sudo: permission denied 😅'];
	} },
	test: { desc: 'Run self-checks', usage: 'test', run: async (_cmd, _args, helpers) => {
		const lines: string[] = ['Running self-checks...'];
		const assert = (name: string, ok: boolean) => { lines.push(`${ok ? '✔' : '✖'} ${name}`); };
		const expected = [
			'help','about','work','acads','publications','projects','books','photos','contact','clear','theme','banner','echo','whoami','date','open','sudo','content','test'
		];
		assert('command registry present', !!expected.every((k) => k in commands));
		// Check outputs for new commands
		const acadsOut = await commands.acads.run('acads', []) as string[];
		assert('acads returns > 3 lines', Array.isArray(acadsOut) && acadsOut.length > 3);
		const pubsOut = await commands.publications.run('publications', []) as string[];
		assert('publications returns > 3 lines', Array.isArray(pubsOut) && pubsOut.length > 3);
		const themeOut = await commands.theme.run('theme', ['purple']) as string[];
		assert('theme invalid yields error', Array.isArray(themeOut) && themeOut[0].startsWith('Unknown theme'));
		const b = await commands.banner.run('banner', []) as string[];
		assert('banner returns > 3 lines', Array.isArray(b) && b.length > 3);
		assert('banner contains quote', b.join('\n').includes('Upward, not Northward'));
		const e = await commands.echo.run('echo', ['hello', 'world']) as string[];
		assert('echo join works', Array.isArray(e) && e[0] === 'hello world');
		lines.push('Self-checks complete.');
		return lines;
	} },
};

export async function executeCommand(raw: string, helpers?: any) {
	const { cmd, args } = parseCommand(raw);
	if (!commands[cmd]) return [`Command not found: ${cmd}. Type 'help'.`];
	try {
		const out = await commands[cmd].run(cmd, args, helpers);
		return Array.isArray(out) ? out : [];
	} catch (err: any) {
		return [`Error: ${err?.message || String(err)}`];
	}
}

export function parseCommand(raw: string) {
	const parts = raw.trim().split(/\s+/);
	const cmd = parts[0]?.toLowerCase() || '';
	const args = parts.slice(1);
	return { cmd, args } as { cmd: string; args: string[] };
}

export function renderPrompt(user = 'dyno8426', host = 'know-me-cli') {
	return `${user}@${host}:~$ `;
}
// Renamed from terminalLogic.ts
// ...existing code will be pasted here...

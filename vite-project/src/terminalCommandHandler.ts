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
	INTERESTS_READING,
	INTERESTS_PHOTOGRAPHY,
	INTERESTS_ART,
	INTERESTS_MUSIC,
	INTERESTS_MISC,
} from './terminalContent';

const PROMPT_USER = PC_PROMPT_USER;
const PROMPT_HOST = PC_PROMPT_HOST;

const THEMES = {
	green: { text: "text-green-400", accent: "text-green-300", caret: "bg-green-400" },
	amber: { text: "text-amber-300", accent: "text-amber-200", caret: "bg-amber-300" },
	mono:  { text: "text-neutral-200", accent: "text-neutral-100", caret: "bg-neutral-200" },
	blue:  { text: "text-blue-400", accent: "text-blue-300", caret: "bg-blue-400" },
	red:   { text: "text-red-400", accent: "text-red-300", caret: "bg-red-400" },
};

const nowString = () => new Date().toLocaleString();


export type Command = {
	desc: string;
	usage: string;
	run: (cmd?: string, args?: string[], helpers?: any) => Promise<string[] | void>;
};

export const commands: Record<string, Command> = {
	ndice: {
		desc: 'Roll the dice and generate a random number between 0 and N',
		usage: 'ndice &lt;positive integer&gt;',
		run: async (_cmd, args=[]) => {
			const n = parseInt(args[0], 10);
			if (isNaN(n) || n < 1) {
				return ['Usage: ndice [positive integer]'];
			}
			const rand = Math.floor(Math.random() * (n + 1));
			return [`Random number between 0 and ${n}: ${rand}`];
		}
	},
	interests: {
		desc: 'Show or explain a specific hobby',
		usage: 'interests [all|reading|photography|art|music|misc]',
		run: async (_cmd, args=[]) => {
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
			if (opt === 'all') {
				return [
					...INTERESTS_READING,
					'',
					...INTERESTS_PHOTOGRAPHY,
					'',
					...INTERESTS_ART,
					'',
					...INTERESTS_MUSIC,
					'',
					...INTERESTS_MISC,
				];
			}
			if (opt === 'reading') return [...INTERESTS_READING];
			if (opt === 'photography') return [...INTERESTS_PHOTOGRAPHY];
			if (opt === 'art') return [...INTERESTS_ART];
			if (opt === 'music') return [...INTERESTS_MUSIC];
			if (opt === 'misc') return [...INTERESTS_MISC];
			return ['Unknown option for interests. Type "interests help" for usage.'];
		}
	},
	help: { desc: 'Show available commands', usage: 'help', run: async () => HELP_LINES },
	about: { desc: 'Who I am', usage: 'about', run: async () => ABOUT_LINES },
	work: { desc: 'Professional background', usage: 'work', run: async () => WORK_LINES },
	acads: { desc: 'Education background', usage: 'acads', run: async () => ACADS_LINES },
	publications: { desc: 'Research papers & patents', usage: 'publications', run: async () => PUBLICATIONS_LINES },
	projects: { desc: 'Selected projects', usage: 'projects', run: async () => PROJECTS_LINES },
		booksuggestion: {
			desc: 'Randomly recommend a book from my Goodreads read shelf',
			usage: 'booksuggestion',
			run: async () => {
				try {
					let endpoint = '/.netlify/functions/goodreads';
					const NETLIFY_URL = 'https://dyno8426-cli.netlify.app/.netlify/functions/goodreads';
					if (
						typeof import.meta !== 'undefined' &&
						typeof import.meta.env !== 'undefined' &&
						import.meta.env.VITE_GOODREADS_PROXY_URL
					) {
						endpoint = import.meta.env.VITE_GOODREADS_PROXY_URL;
					} else if (
						typeof window !== 'undefined' &&
						(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
					) {
						endpoint = 'http://localhost:8888/.netlify/functions/goodreads';
					} else if (
						typeof window !== 'undefined' &&
						window.location.hostname.endsWith('github.io')
					) {
						endpoint = NETLIFY_URL;
					}
					const res = await fetch(endpoint);
					if (!res.ok) throw new Error('Failed to fetch review');
					const data = await res.json();
					if (!data || !data.title) throw new Error('No review data received');
					// Format the review for terminal output, handle missing fields gracefully
					const lines = [
						'Here is a random suggestion from my Goodreads read shelf:',
						`**${data.title}**${data.author ? ' by ' + data.author : ''}`,
						data.book ? `Book: ${data.book}` : '',
						data.rating ? `Your rating: ${data.rating}` : '',
						data.pubDate ? `Date: ${data.pubDate}` : '',
						'',
						data.description ? data.description.replace(/<[^>]+>/g, '').trim() : '',
						'',
						data.link ? `[Read on Goodreads](${data.link})` : ''
					].filter(Boolean);
					return lines.length ? lines : ['No review found.'];
				} catch (err: any) {
					if (err && err.name === 'TypeError' && /Failed to fetch/i.test(err.message)) {
						return ['Could not fetch a random book review.', 'Network error: Unable to reach the server.'];
					}
					return ['Could not fetch a random book review.', err?.message || String(err)];
				}
			}
		},
	photosuggestion: {
		desc: 'Randomly recommend a photo from my Unsplash account',
		usage: 'photosuggestion',
		run: async () => {
			try {
				let endpoint = '/.netlify/functions/unsplash';
				const NETLIFY_URL = 'https://dyno8426-cli.netlify.app/.netlify/functions/unsplash';
				if (
					typeof import.meta !== 'undefined' &&
					typeof import.meta.env !== 'undefined' &&
					import.meta.env.VITE_UNSPLASH_PROXY_URL
				) {
					endpoint = import.meta.env.VITE_UNSPLASH_PROXY_URL;
				} else if (
					typeof window !== 'undefined' &&
					(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
				) {
					endpoint = 'http://localhost:8888/.netlify/functions/unsplash';
				} else if (
					typeof window !== 'undefined' &&
					window.location.hostname.endsWith('github.io')
				) {
					endpoint = NETLIFY_URL;
				}
				const res = await fetch(endpoint);
				if (!res.ok) throw new Error('Failed to fetch photo');
				const data = await res.json();
				if (!data || !data.url) throw new Error('No photo data received');
				const lines = [
					'Here is a random photo suggestion from my Unsplash account:',
					data.description ? `*${data.description}*` : '',
					data.url ? `![Unsplash Photo](${data.url})` : '',
					data.link ? `[View on Unsplash](${data.link})` : '',
					data.author ? `By: ${data.author} (@${data.author_username})` : '',
					data.created_at ? `Date: ${data.created_at}` : ''
				].filter(Boolean);
				return lines.length ? lines : ['No photo found.'];
			} catch (err: any) {
				if (err && err.name === 'TypeError' && /Failed to fetch/i.test(err.message)) {
					return ['Could not fetch a random photo.', 'Network error: Unable to reach the server.'];
				}
				return ['Could not fetch a random photo.', err?.message || String(err)];
			}
		}
	},
	contact: { desc: 'How to reach me', usage: 'contact', run: async () => CONTACT_LINES },
	clear: { desc: 'Clear the screen', usage: 'clear', run: async (_cmd, _args, helpers) => { helpers?.clearHistory(); return []; } },
	theme: {
		desc: 'Switch theme',
		usage: 'theme [green|amber|mono|blue|red]',
		run: async (_cmd, args = [], helpers) => {
			const next = (args[0] || '').toLowerCase();
			if (!Object.keys(THEMES).includes(next)) return [`Unknown theme '${next}'. Available: ${Object.keys(THEMES).join(', ')}`];
			helpers?.setTheme(next);
			// Also update background color if helper exists
			if (helpers?.setBgTheme) helpers.setBgTheme(next);
			return [`Theme set to ${next}.`];
		}
	},
	banner: { desc: 'ASCII banner', usage: 'banner', run: async () => BANNER_ART.split('\n') },
	echo: { desc: 'Print text', usage: 'echo <text>', run: async (_cmd, args=[]) => [args.length ? args.join(' ') : ''] },
	whoami: { desc: 'Print user', usage: 'whoami', run: async () => [PROMPT_USER] },
	date: { desc: 'Date/time', usage: 'date', run: async () => [nowString()] },
	open: { desc: 'Open a URL', usage: 'open [url]', run: async (_cmd, args=[]) => {
		if (!args.length) return ['Usage: open [url]'];
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
	const assert = (name: string, ok: boolean) => { lines.push(`${ok ? '✅' : '❌'} ${name}`); };
		const expected = [
			'help','about','work','acads','publications','projects','booksuggestion','photosuggestion','contact','clear','theme','banner','echo','whoami','date','open','sudo','test','ndice','interests','visitors'
		];
		assert('command registry present', expected.every((k) => k in commands));
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
		// Test interests command
		const interestsHelp = await commands.interests.run('interests', ['help']) as string[];
		assert('interests help returns usage', Array.isArray(interestsHelp) && interestsHelp[0].includes('Usage: interests'));
		const interestsAll = await commands.interests.run('interests', ['all']) as string[];
		assert('interests all returns > 5 lines', Array.isArray(interestsAll) && interestsAll.length > 5);

		// Test ndice command
		const ndiceInvalid = await commands.ndice.run('ndice', ['foo']) as string[];
		assert('ndice invalid yields usage', Array.isArray(ndiceInvalid) && ndiceInvalid[0].includes('Usage: ndice'));
		const ndiceValid = await commands.ndice.run('ndice', ['10']) as string[];
		assert('ndice valid returns number', Array.isArray(ndiceValid) && /^Random number between 0 and 10: \d+$/.test(ndiceValid[0]));

		// Test open command (invalid URL)
		const openInvalid = await commands.open.run('open', ['not_a_url']) as string[];
		assert('open invalid yields error', Array.isArray(openInvalid) && openInvalid[0].includes('Invalid URL format'));

		// Test clear command (side effect, should return empty array)
		const clearOut = await commands.clear.run('clear', [], { clearHistory: () => {} }) as string[];
		assert('clear returns empty array', Array.isArray(clearOut) && clearOut.length === 0);

		// Test whoami command
		const whoamiOut = await commands.whoami.run('whoami', []) as string[];
		assert('whoami returns user', Array.isArray(whoamiOut) && whoamiOut[0] === PROMPT_USER);

		// Test booksuggestion command
		if ('booksuggestion' in commands) {
			const bookOut = await commands.booksuggestion.run('booksuggestion', []) as string[];
			assert('booksuggestion returns at least 1 line', Array.isArray(bookOut) && bookOut.length > 0);
		}

		// Test photosuggestion command
		if ('photosuggestion' in commands) {
			const photoOut = await commands.photosuggestion.run('photosuggestion', []) as string[];
			assert('photosuggestion returns at least 1 line', Array.isArray(photoOut) && photoOut.length > 0);
		}

		lines.push('Self-checks complete.');
		return lines;
	} },
	visitors: {
		desc: 'Show current website visitor count',
		usage: 'visitors',
		run: async () => {
			try {
				// Check local storage for visitor data
				const storageKey = 'dyno8426-portfolio-visits';
				const storedData = localStorage.getItem(storageKey);
				const data = storedData ? JSON.parse(storedData) : { count: 0, sessions: [] };
				
				const sessionKey = 'dyno8426-session-id';
				const currentSession = sessionStorage.getItem(sessionKey);
				
				const lines = [
					'Website Visit Statistics:',
					`Total visits: ${data.count.toLocaleString()}`,
					`Session ID: ${currentSession || 'New session'}`,
					'',
					'Statistics Details:',
					`• Unique sessions tracked: ${data.sessions?.length || 0}`,
					`• Current session: ${currentSession ? 'Returning' : 'New visitor'}`,
					'',
					'Notes:',
					'• Counter tracks unique browser sessions',
					'• Data stored locally (privacy-friendly)',
					'• Visit count increments once per session',
					'• Asterisk (*) in footer indicates local counter'
				];
				
				if (data.sessions && data.sessions.length > 0) {
					const lastSession = data.sessions[data.sessions.length - 1];
					const lastVisit = new Date(lastSession.timestamp);
					lines.push(`• Last visit: ${lastVisit.toLocaleString()}`);
				}
				
				return lines;
			} catch (err: any) {
				return [
					'Visitor Counter Information:',
					'Status: Local storage counter active',
					'',
					'The visitor counter uses browser local storage to track visits.',
					'This provides a privacy-friendly way to count sessions without',
					'requiring external services or tracking cookies.',
					'',
					'Each new browser session increments the counter once.',
					`Error details: ${err?.message || 'Unknown error'}`
				];
			}
		}
	},
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

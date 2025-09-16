export function parseCommand(raw: string) {
  const parts = raw.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase() || '';
  const args = parts.slice(1);
  return { cmd, args } as { cmd: string; args: string[] };
}

export function renderPrompt(user = 'dyno8426', host = 'know-me-cli') {
  return `${user}@${host}:~$ `;
}

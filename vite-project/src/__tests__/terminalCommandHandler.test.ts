import { describe, it, expect } from 'vitest';
import { parseCommand, renderPrompt } from '../terminalCommandHandler';

describe('terminalCommandHandler', () => {
  it('parses simple command', () => {
    const { cmd, args } = parseCommand('help');
    expect(cmd).toBe('help');
    expect(args).toEqual([]);
  });

  it('parses command with args', () => {
    const { cmd, args } = parseCommand('open https://example.com more');
    expect(cmd).toBe('open');
    expect(args).toEqual(['https://example.com', 'more']);
  });

  it('handles extra whitespace', () => {
    const { cmd, args } = parseCommand('   ECHO   hello   world  ');
    expect(cmd).toBe('echo');
    expect(args).toEqual(['hello', 'world']);
  });

  it('handles empty input', () => {
    const { cmd, args } = parseCommand('    ');
    expect(cmd).toBe('');
    expect(args).toEqual([]);
  });

  it('renders prompt', () => {
    const p = renderPrompt('alice', 'host1');
    expect(p).toBe('alice@host1:~$ ');
  });
});

export type Status = 'live' | 'in progress' | 'design' | 'study';

export const statusTone = (s: Status) => (s === 'live' ? 'c-ok' : s === 'in progress' ? 'c-accent' : 'c-soft');

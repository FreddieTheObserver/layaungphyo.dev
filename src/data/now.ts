export interface NowEntry {
  text: string;
  date: string;
  lane: 'main' | 'side';
  refs?: string;
}

export const now: {
  updated: string;
  entries: NowEntry[];
  // The side lane leaves main after entry `from` and merges back at entry `to`.
  branch: { from: number; to: number };
} = {
  updated: '2026-10-08',
  entries: [
    { text: 'design the domain model for Sakha', date: 'oct 2026', lane: 'main', refs: 'HEAD -> main' },
    { text: 'curate practice sets for CSC102 juniors as a CS mentor', date: 'sep 2026', lane: 'side' },
    { text: 'send my first open-source PR: setup docs for unishare', date: 'sep 2026', lane: 'main' },
    { text: 'keep floodwatch running through the Bangkok floods', date: 'sep 2026', lane: 'main' },
  ],
  branch: { from: 0, to: 3 },
};

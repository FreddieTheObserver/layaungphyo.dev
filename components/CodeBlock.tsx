'use client';

import { useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ children, ...props }: React.ComponentProps<'pre'>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div data-code-block className="group/code relative">
      <pre ref={ref} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-md border bg-card text-muted-foreground transition-all hover:bg-accent hover:text-foreground focus-visible:opacity-100 active:scale-90 group-hover/code:opacity-100 [@media(hover:hover)]:opacity-0"
      >
        {copied ? <Check className="size-4 text-live" /> : <Copy className="size-4" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  );
}

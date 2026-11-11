import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-24">
      <h1 className="mb-3 text-4xl font-semibold">Page not found</h1>
      <p className="mb-6 text-lg text-muted-foreground">That page does not exist.</p>
      <Button asChild size="lg" className="rounded-full">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}

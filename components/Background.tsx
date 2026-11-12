import { FloatingLines } from './FloatingLines';

export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <FloatingLines />
    </div>
  );
}

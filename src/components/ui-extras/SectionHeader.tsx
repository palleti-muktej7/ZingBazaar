import { type ReactNode } from "react";

export function SectionHeader({
  eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</div>}
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

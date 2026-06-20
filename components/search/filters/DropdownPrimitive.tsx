"use client";

/**
 * Placeholder filter primitive for InstantSearch refinement lists.
 * Replace with design-system or shadcn dropdown when building browse UX.
 */
export function DropdownPrimitive({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

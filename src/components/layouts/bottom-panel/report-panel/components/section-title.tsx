export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--gl-text-muted)">
      {children}
    </h4>
  );
}

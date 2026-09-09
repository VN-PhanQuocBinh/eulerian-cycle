export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 text-xs text-(--gl-blue-dark) font-semibold uppercase tracking-wide">
      {children}
    </h4>
  );
}

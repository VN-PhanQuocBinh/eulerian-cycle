export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-(--od-border) py-1.5 text-sm last:border-0">
      <span className="text-(--od-fg-1)">{label}</span>
      <span className="font-medium text-(--od-fg-0)">{value}</span>
    </div>
  );
}

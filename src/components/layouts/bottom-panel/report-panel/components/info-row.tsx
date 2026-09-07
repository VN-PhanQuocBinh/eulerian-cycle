export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-(--gl-border) py-1.5 text-sm last:border-0">
      <span className="text-(--gl-text-main)">{label}</span>
      <span className="font-medium text-(--gl-text-main)">{value}</span>
    </div>
  );
}

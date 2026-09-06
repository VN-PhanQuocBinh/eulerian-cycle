function NodeElement({ label }: { label: string }) {
  return (
    <span className="rounded border border-(--od-border) bg-(--od-bg-2) px-2 py-0.5 font-medium text-(--od-fg-0)">
      {label}
    </span>
  );
}

export default NodeElement;

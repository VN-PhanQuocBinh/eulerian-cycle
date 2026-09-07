function NodeElement({ label }: { label: string }) {
  return (
    <span className="rounded border border-(--gl-border) bg-(--gl-bg-subtle) px-2 py-0.5 font-medium text-(--gl-text-main)">
      {label}
    </span>
  );
}

export default NodeElement;

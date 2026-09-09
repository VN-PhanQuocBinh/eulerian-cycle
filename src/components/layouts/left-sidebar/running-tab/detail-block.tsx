function DetailBlock({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="col-span-2 rounded-md ">
      <div className="mb-1.5 font-semibold uppercase tracking-wide text-(--gl-blue-dark)">
        {title}
      </div>
      <div className="space-y-1 text-(--gl-text-main)">{children}</div>
    </section>
  );
}

export default DetailBlock;
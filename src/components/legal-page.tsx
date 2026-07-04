export function LegalPage({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">{kicker}</p>
        <h1 className="mt-2 font-heading text-4xl">{title}</h1>
      </div>
      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:font-heading [&_h2]:text-lg [&_h2]:text-foreground [&_h2]:mb-2 [&_p+h2]:mt-8 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}

export function LegalShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-background">
      <div className="mx-auto w-full max-w-3xl px-5 pb-12 pt-24 md:px-8 md:pt-28">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </header>

        <article className="space-y-8 text-sm leading-relaxed text-muted-foreground [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </article>

        <footer className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            Have a question or concern? You can reach the founder of Prepnova
            directly at{" "}
            <a href="mailto:mrityunjaytiwari1873@gmail.com">
              mrityunjaytiwari1873@gmail.com
            </a>{" "}
            — a real person who will personally read and respond.
          </p>
          <p className="mt-3">
            This document is provided for transparency and does not constitute
            legal advice.
          </p>
        </footer>
      </div>
    </main>
  );
}

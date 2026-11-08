import Link from "next/link";

export function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50">
      <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <svg viewBox="0 0 32 32" className="size-5" aria-hidden>
          <path d="M9 10h14v3h-5.5v12h-3V13H9z" fill="currentColor" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-sidebar-accent-foreground">
        TaskFlow
      </span>
    </Link>
  );
}

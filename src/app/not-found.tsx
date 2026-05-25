import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--surface)] text-[var(--text-high)] p-6">
      <div className="glass-card p-8 max-w-md w-full text-center flex flex-col items-center gap-6 border-green-500/20 glow-green">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-cyan-600 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--primary)] glow-text font-mono">
            404
          </h2>
          <h3 className="text-lg font-semibold text-[var(--text-high)]">
            Signal Lost / Protocol Not Found
          </h3>
          <p className="text-xs text-[var(--text-low)] font-mono leading-relaxed">
            The requested emergency clinical database route does not exist. Ensure local ONNX schemas are pre-seeded.
          </p>
        </div>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg font-mono text-xs bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30 hover:bg-[var(--primary)]/20 transition-all duration-200"
        >
          RETURN TO TRIAGE CONSOLE
        </Link>
      </div>
    </div>
  );
}

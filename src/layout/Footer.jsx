
export default function Footer() {
  return (
    <footer className="w-full border-t border-border-subtle bg-bg-secondary/40 backdrop-blur-md py-6 px-4 z-10 relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-ui text-xs text-text-muted">
        <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
          <span className="font-semibold text-text-secondary">Quantum Cyber Fortress</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5" aria-label="Network Status: Online">
            <span className="w-2 h-2 rounded-full bg-status-success shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
            Sentinel Network Online
          </span>
        </div>

        <div className="text-center md:text-right">
          <span>&copy; {new Date().getFullYear()} Saad Shah. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}


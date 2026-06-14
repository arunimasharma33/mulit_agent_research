import { useAuth } from "../context/AuthContext";
import { LogoIcon } from "./LogoIcon";

type View = "research" | "history" | "login";

interface HeaderProps {
  isRunning: boolean;
  view: View;
  onViewChange: (view: View) => void;
}

export function Header({ isRunning, view, onViewChange }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-gold/20 bg-obsidian/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
        <button
          onClick={() => onViewChange("research")}
          className="flex items-center gap-4 text-left hover:opacity-90 transition-opacity"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-lg border border-gold/40 bg-charcoal flex items-center justify-center text-gold-bright">
              <LogoIcon />
            </div>
            {isRunning && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold animate-pulse-ring" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gold-bright">
              Research Nexus
            </h1>
            <p className="text-sm text-gold-dim hidden sm:block">
              Multi-agent search · read · write · critique
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <button
                onClick={() => onViewChange("history")}
                className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${
                  view === "history"
                    ? "border-gold/50 bg-gold/10 text-gold-bright"
                    : "border-gold/20 text-gold-dim hover:border-gold/40 hover:text-gold"
                }`}
              >
                History
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-gold-dim border border-gold/20 rounded-full px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-gold/60" />
                {user.name}
              </div>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 rounded-lg border border-gold/20 text-gold-dim hover:text-gold-bright hover:border-gold/40 transition-all"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => onViewChange("login")}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${
                view === "login"
                  ? "border-gold/50 bg-gold/10 text-gold-bright"
                  : "border-gold/20 text-gold-dim hover:border-gold/40 hover:text-gold"
              }`}
            >
              Sign in
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gold-dim border border-gold/20 rounded-full px-3 py-1.5">
            <span
              className={`w-2 h-2 rounded-full ${isRunning ? "bg-gold animate-pulse" : "bg-gold/40"}`}
            />
            {isRunning ? "Active" : "Ready"}
          </div>
        </div>
      </div>
    </header>
  );
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-gold/30 rounded-2xl bg-charcoal/60 p-6 sm:p-8 max-w-md w-full">
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
            mode === "login"
              ? "border-gold/50 bg-gold/10 text-gold-bright"
              : "border-gold/15 text-gold-dim hover:border-gold/30"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
            mode === "register"
              ? "border-gold/50 bg-gold/10 text-gold-bright"
              : "border-gold/15 text-gold-dim hover:border-gold/30"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-xs uppercase tracking-wide text-gold-dim mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-obsidian border border-gold/35 rounded-xl px-4 py-3 text-gold-bright focus:outline-none focus:border-gold/70 focus:ring-1 focus:ring-gold/30"
              placeholder="Your name"
            />
          </div>
        )}
        <div>
          <label className="block text-xs uppercase tracking-wide text-gold-dim mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-obsidian border border-gold/35 rounded-xl px-4 py-3 text-gold-bright focus:outline-none focus:border-gold/70 focus:ring-1 focus:ring-gold/30"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gold-dim mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-obsidian border border-gold/35 rounded-xl px-4 py-3 text-gold-bright focus:outline-none focus:border-gold/70 focus:ring-1 focus:ring-gold/30"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400/90 border border-red-400/30 rounded-lg px-4 py-2.5 bg-red-950/20">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl border border-gold/50 bg-graphite text-gold-bright font-medium hover:bg-gold/10 hover:border-gold/70 disabled:opacity-40 transition-all"
        >
          {submitting ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}

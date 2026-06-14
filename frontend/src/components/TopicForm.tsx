interface TopicFormProps {
  topic: string;
  onTopicChange: (value: string) => void;
  onSubmit: () => void;
  isRunning: boolean;
  error: string | null;
}

export function TopicForm({
  topic,
  onTopicChange,
  onSubmit,
  isRunning,
  error,
}: TopicFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRunning && topic.trim().length >= 3) onSubmit();
  };

  return (
    <section className="animate-fade-up">
      <div className="border border-gold/30 rounded-2xl bg-charcoal/60 p-6 sm:p-8 shadow-[0_0_60px_rgba(212,175,55,0.08)]">
        <label
          htmlFor="topic"
          className="block text-sm font-medium text-gold mb-3 tracking-wide uppercase"
        >
          Research Topic
        </label>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => onTopicChange(e.target.value)}
              disabled={isRunning}
              placeholder="e.g. Advances in solid-state battery technology"
              className="w-full bg-obsidian border border-gold/35 rounded-xl px-4 py-3.5 text-gold-bright placeholder:text-gold-dim/60 focus:outline-none focus:border-gold/70 focus:ring-1 focus:ring-gold/30 transition-all disabled:opacity-50 font-light"
            />
          </div>
          <button
            type="submit"
            disabled={isRunning || topic.trim().length < 3}
            className="shrink-0 px-8 py-3.5 rounded-xl border border-gold/50 bg-graphite text-gold-bright font-medium tracking-wide hover:bg-gold/10 hover:border-gold/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Running
              </span>
            ) : (
              "Launch Pipeline"
            )}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-sm text-red-400/90 border border-red-400/30 rounded-lg px-4 py-2.5 bg-red-950/20">
            {error}
          </p>
        )}
        <p className="mt-4 text-xs text-gold-dim">
          Four coordinated agents will search the web, scrape sources, draft a report, and critique the result.
        </p>
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

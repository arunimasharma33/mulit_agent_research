import { useEffect, useState } from "react";
import { fetchHistory, fetchHistoryItem, type HistoryDetail, type HistorySummary } from "../api/history";
import { ContentPanel } from "./ContentPanel";

interface HistoryPanelProps {
  onBack: () => void;
  onSelectTopic?: (topic: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryPanel({ onBack, onSelectTopic }: HistoryPanelProps) {
  const [items, setItems] = useState<HistorySummary[]>([]);
  const [selected, setSelected] = useState<HistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load history."))
      .finally(() => setLoading(false));
  }, []);

  const openItem = async (id: number) => {
    setError(null);
    try {
      const detail = await fetchHistoryItem(id);
      setSelected(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load search.");
    }
  };

  if (selected) {
    return (
      <div className="space-y-6 animate-fade-up">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setSelected(null)}
            className="text-sm text-gold-dim hover:text-gold-bright border border-gold/20 rounded-lg px-3 py-1.5 transition-colors"
          >
            ← Back to history
          </button>
          {onSelectTopic && (
            <button
              onClick={() => onSelectTopic(selected.topic)}
              className="text-sm text-gold-bright border border-gold/35 rounded-lg px-3 py-1.5 hover:bg-gold/10 transition-colors"
            >
              Re-run this topic
            </button>
          )}
        </div>

        <div className="border border-gold/30 rounded-2xl bg-charcoal/40 px-6 py-5">
          <p className="text-xs uppercase tracking-widest text-gold-dim mb-2">Saved search</p>
          <h2 className="text-xl font-semibold text-gold-bright">{selected.topic}</h2>
          <p className="text-sm text-gold-dim mt-1">{formatDate(selected.created_at)}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {selected.search_results && (
            <ContentPanel
              title="Search Intelligence"
              subtitle="Web results from this session"
              content={selected.search_results}
            />
          )}
          {selected.report && (
            <ContentPanel
              title="Research Report"
              subtitle="Report from this session"
              content={selected.report}
            />
          )}
          {selected.feedback && (
            <div className={selected.report && selected.search_results ? "lg:col-span-2" : ""}>
              <ContentPanel
                title="Critic Evaluation"
                subtitle="Review from this session"
                content={selected.feedback}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold-dim mb-1">Your account</p>
          <h2 className="text-2xl font-semibold text-gold-bright">Search History</h2>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-gold-dim hover:text-gold-bright border border-gold/20 rounded-lg px-3 py-1.5 transition-colors"
        >
          ← New search
        </button>
      </div>

      {loading && (
        <p className="text-gold-dim text-sm border border-gold/20 rounded-xl px-4 py-8 text-center">
          Loading history…
        </p>
      )}

      {error && (
        <p className="text-sm text-red-400/90 border border-red-400/30 rounded-lg px-4 py-2.5 bg-red-950/20">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="border border-gold/25 rounded-2xl bg-charcoal/40 px-6 py-12 text-center">
          <p className="text-gold-bright font-medium">No searches yet</p>
          <p className="text-gold-dim text-sm mt-2">
            Run a research pipeline while signed in and it will appear here.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="border border-gold/25 rounded-2xl overflow-hidden divide-y divide-gold/10">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => openItem(item.id)}
              className="w-full text-left px-6 py-4 hover:bg-gold/5 transition-colors group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-gold-bright font-medium truncate group-hover:text-white transition-colors">
                    {item.topic}
                  </p>
                  <p className="text-xs text-gold-dim mt-1">{formatDate(item.created_at)}</p>
                </div>
                <span className="text-gold-dim group-hover:text-gold transition-colors">→</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

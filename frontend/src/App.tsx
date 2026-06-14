import { useCallback, useMemo, useRef, useState } from "react";
import {
  PIPELINE_STEPS,
  type ProgressEvent,
  type StepState,
  streamResearch,
} from "./api/research";
import { AuthForm } from "./components/AuthForm";
import { ContentPanel } from "./components/ContentPanel";
import { Header } from "./components/Header";
import { HistoryPanel } from "./components/HistoryPanel";
import { PipelineProgress } from "./components/PipelineProgress";
import { TopicForm } from "./components/TopicForm";
import { useAuth } from "./context/AuthContext";

type View = "research" | "history" | "login";

function initialSteps(): StepState[] {
  return PIPELINE_STEPS.map((s) => ({ ...s, status: "idle" as const }));
}

export default function App() {
  const { user } = useAuth();
  const [view, setView] = useState<View>("research");
  const [topic, setTopic] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [steps, setSteps] = useState<StepState[]>(initialSteps);
  const [report, setReport] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [searchPreview, setSearchPreview] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const hasResults = useMemo(
    () => Boolean(report || feedback || searchPreview),
    [report, feedback, searchPreview],
  );

  const handleEvent = useCallback((event: ProgressEvent) => {
    if (event.step === "error") {
      setError(event.message ?? "Pipeline failed.");
      setIsRunning(false);
      return;
    }

    if (event.step === "saved") {
      setSavedNotice("Search saved to your history.");
      return;
    }

    if (event.step === "done") {
      setIsRunning(false);
      if (event.result) {
        setReport(event.result.report);
        setFeedback(event.result.feedback);
      }
      return;
    }

    if (event.step === "search" || event.step === "reader" || event.step === "writer" || event.step === "critic") {
      setSteps((prev) =>
        prev.map((s) => {
          if (s.id !== event.step) return s;
          if (event.status === "started") return { ...s, status: "running" };
          if (event.status === "completed") {
            return { ...s, status: "done", content: event.content };
          }
          return s;
        }),
      );

      if (event.status === "completed" && event.content) {
        if (event.step === "search") setSearchPreview(event.content);
        if (event.step === "writer") setReport(event.content);
        if (event.step === "critic") setFeedback(event.content);
      }
    }
  }, []);

  const runPipeline = useCallback(async () => {
    const trimmed = topic.trim();
    if (trimmed.length < 3) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsRunning(true);
    setError(null);
    setSavedNotice(null);
    setSteps(initialSteps());
    setReport(null);
    setFeedback(null);
    setSearchPreview(null);
    setView("research");

    try {
      await streamResearch(trimmed, handleEvent, abortRef.current.signal);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Unexpected error.");
      setIsRunning(false);
    }
  }, [topic, handleEvent]);

  const handleRerunFromHistory = (historyTopic: string) => {
    setTopic(historyTopic);
    setView("research");
  };

  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.14), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(212,175,55,0.06), transparent)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <Header isRunning={isRunning} view={view} onViewChange={setView} />

      <main className="relative max-w-6xl mx-auto px-6 py-10 space-y-10">
        {view === "login" && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gold-bright">Welcome back</h2>
              <p className="text-gold-dim text-sm mt-2">
                Sign in to save and revisit your research history.
              </p>
            </div>
            <AuthForm onSuccess={() => setView("research")} />
          </div>
        )}

        {view === "history" && user && (
          <HistoryPanel onBack={() => setView("research")} onSelectTopic={handleRerunFromHistory} />
        )}

        {view === "history" && !user && (
          <div className="text-center border border-gold/25 rounded-2xl px-6 py-12">
            <p className="text-gold-bright">Sign in to view your search history.</p>
            <button
              onClick={() => setView("login")}
              className="mt-4 text-sm px-4 py-2 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
            >
              Sign in
            </button>
          </div>
        )}

        {view === "research" && (
          <>
            <div className="text-center max-w-2xl mx-auto mb-2">
              <p className="text-gold-dim text-sm tracking-[0.2em] uppercase mb-3">
                AI Research Orchestration
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gold-bright leading-tight">
                From question to{" "}
                <span className="text-gold">critiqued report</span>
              </h2>
              {!user && (
                <p className="text-gold-dim text-sm mt-3">
                  Sign in to automatically save every search to your history.
                </p>
              )}
            </div>

            <TopicForm
              topic={topic}
              onTopicChange={setTopic}
              onSubmit={runPipeline}
              isRunning={isRunning}
              error={error}
            />

            {savedNotice && (
              <p className="text-sm text-gold border border-gold/30 rounded-lg px-4 py-2.5 bg-gold/5 text-center">
                {savedNotice}
              </p>
            )}

            <PipelineProgress steps={steps} />

            {hasResults && (
              <div className="grid lg:grid-cols-2 gap-6">
                {searchPreview && (
                  <ContentPanel
                    title="Search Intelligence"
                    subtitle="Web results gathered by the search agent"
                    content={searchPreview}
                    delay="0.15s"
                  />
                )}
                {report && (
                  <ContentPanel
                    title="Research Report"
                    subtitle="Structured report drafted by the writer agent"
                    content={report}
                    delay="0.2s"
                  />
                )}
                {feedback && (
                  <div className={report && searchPreview ? "lg:col-span-2" : ""}>
                    <ContentPanel
                      title="Critic Evaluation"
                      subtitle="Quality review and score from the critic agent"
                      content={feedback}
                      delay="0.25s"
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="relative border-t border-gold/10 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-gold-dim">
          Powered by Mistral AI · Tavily Search · LangChain Agents
        </div>
      </footer>
    </div>
  );
}

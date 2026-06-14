import type { StepState } from "../api/research";

interface PipelineProgressProps {
  steps: StepState[];
}

const statusStyles: Record<StepState["status"], string> = {
  idle: "border-gold/15 text-gold-dim",
  running: "border-gold/50 text-gold-bright bg-gold/5",
  done: "border-gold/35 text-gold",
  error: "border-red-400/40 text-red-300",
};

const statusIcon: Record<StepState["status"], React.ReactNode> = {
  idle: <span className="w-2 h-2 rounded-full bg-gold/20" />,
  running: <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />,
  done: (
    <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

export function PipelineProgress({ steps }: PipelineProgressProps) {
  const hasActivity = steps.some((s) => s.status !== "idle");
  if (!hasActivity) return null;

  return (
    <section className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
      <h2 className="text-sm font-medium text-gold-dim uppercase tracking-widest mb-4">
        Pipeline Progress
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={`relative border rounded-xl px-4 py-4 transition-all duration-500 ${statusStyles[step.status]}`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-center gap-2 mb-2">
              {statusIcon[step.status]}
              <span className="text-xs font-mono text-gold-dim">0{i + 1}</span>
            </div>
            <p className="text-sm font-medium">{step.label}</p>
            <p className="text-xs mt-1 capitalize opacity-70">{step.status}</p>
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gold/20" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

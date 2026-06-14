import ReactMarkdown from "react-markdown";

interface ContentPanelProps {
  title: string;
  subtitle: string;
  content: string;
  delay?: string;
}

export function ContentPanel({ title, subtitle, content, delay = "0s" }: ContentPanelProps) {
  return (
    <section className="animate-fade-up" style={{ animationDelay: delay }}>
      <div className="border border-gold/30 rounded-2xl bg-charcoal/40 overflow-hidden">
        <div className="border-b border-gold/20 px-6 py-4 bg-obsidian/50">
          <h2 className="text-base font-semibold text-gold-bright">{title}</h2>
          <p className="text-xs text-gold-dim mt-0.5">{subtitle}</p>
        </div>
        <div className="px-6 py-5 max-h-[480px] overflow-y-auto">
          <div className="markdown-body text-sm">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
}

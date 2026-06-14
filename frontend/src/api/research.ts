export type PipelineStep = "search" | "reader" | "writer" | "critic" | "done" | "saved" | "error";

export interface ProgressEvent {
  step: PipelineStep;
  status: "started" | "completed" | "failed";
  label?: string;
  content?: string;
  message?: string;
  history_id?: number;
  result?: {
    search_results: string;
    scraped_content: string;
    report: string;
    feedback: string;
  };
}

export type StepStatus = "idle" | "running" | "done" | "error";

export interface StepState {
  id: PipelineStep;
  label: string;
  status: StepStatus;
  content?: string;
}

export const PIPELINE_STEPS: Omit<StepState, "status">[] = [
  { id: "search", label: "Search Agent" },
  { id: "reader", label: "Reader Agent" },
  { id: "writer", label: "Writer" },
  { id: "critic", label: "Critic" },
];

import { authHeaders } from "./auth";

export async function streamResearch(
  topic: string,
  onEvent: (event: ProgressEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch("/api/research/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ topic }),
    signal,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed (${response.status})`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response stream available.");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (!payload) continue;
      onEvent(JSON.parse(payload) as ProgressEvent);
    }
  }
}

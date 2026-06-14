import { authHeaders } from "./auth";

export interface HistorySummary {
  id: number;
  topic: string;
  created_at: string;
}

export interface HistoryDetail extends HistorySummary {
  search_results: string | null;
  scraped_content: string | null;
  report: string | null;
  feedback: string | null;
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.detail ?? "Request failed.";
  } catch {
    return `Request failed (${response.status}).`;
  }
}

export async function fetchHistory(): Promise<HistorySummary[]> {
  const response = await fetch("/api/history", { headers: authHeaders() });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function fetchHistoryItem(id: number): Promise<HistoryDetail> {
  const response = await fetch(`/api/history/${id}`, { headers: authHeaders() });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

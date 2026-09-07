export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, { credentials: "include", headers: { "Content-Type": "application/json", ...options.headers }, ...options });
  if (response.status === 204) return undefined as T;
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.detail || "Request failed"); }
  return response.json();
}
export async function download(path: string, filename: string) {
  const response = await fetch(`${API}${path}`, { credentials: "include" });
  if (!response.ok) throw new Error("Export failed");
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}

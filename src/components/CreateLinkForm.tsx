"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLinkForm() {
  const [longUrl, setLongUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longUrl }),
    });

    const body = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(body.error ?? "Something went wrong");
      return;
    }

    setLongUrl("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="https://example.com/very/long/link"
          required
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Shortening…" : "Shorten"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}

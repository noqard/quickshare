"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpgrade() {
    setLoading(true);
    const supabase = createClient();
    // No real payment here — this just flips a flag on the account so you
    // can see how tier-gating logic works without wiring up billing.
    await supabase.auth.updateUser({ data: { is_pro: true } });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="rounded border border-black px-3 py-1 text-sm disabled:opacity-50"
    >
      {loading ? "Upgrading…" : "Upgrade to Pro"}
    </button>
  );
}

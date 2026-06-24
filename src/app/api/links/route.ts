import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function randomCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const FREE_TIER_LINK_LIMIT = 5;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { longUrl } = await request.json();

  if (typeof longUrl !== "string" || !longUrl.startsWith("http")) {
    return NextResponse.json({ error: "Please enter a valid URL starting with http(s)" }, { status: 400 });
  }

  const isPro = userData.user.user_metadata?.is_pro === true;

  if (!isPro) {
    const { count } = await supabase
      .from("links")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userData.user.id);

    if ((count ?? 0) >= FREE_TIER_LINK_LIMIT) {
      return NextResponse.json(
        { error: `Free plan is limited to ${FREE_TIER_LINK_LIMIT} links. Upgrade to Pro for unlimited links.` },
        { status: 403 }
      );
    }
  }

  // Try a few times in case of a (rare) short-code collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    const { data, error } = await supabase
      .from("links")
      .insert({ user_id: userData.user.id, code, long_url: longUrl })
      .select()
      .single();

    if (!error) {
      return NextResponse.json({ link: data });
    }

    // 23505 = unique_violation in Postgres; retry with a new code.
    if (error.code !== "23505") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Could not generate a unique code, try again" }, { status: 500 });
}

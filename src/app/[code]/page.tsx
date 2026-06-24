import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ShortLinkRedirect({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: longUrl } = await supabase.rpc("get_long_url_and_increment", {
    p_code: code,
  });

  if (!longUrl) {
    notFound();
  }

  redirect(longUrl);
}

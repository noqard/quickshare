import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateLinkForm from "@/components/CreateLinkForm";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    redirect("/login");
  }

  const { data: links } = await supabase
    .from("links")
    .select("id, code, long_url, click_count, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8">
      <div className="flex w-full max-w-md flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-600">Signed in as {userData.user.email}</p>
      </div>

      <CreateLinkForm />

      <ul className="flex w-full max-w-md flex-col gap-3">
        {links?.length === 0 && (
          <li className="text-sm text-gray-500">No links yet — create your first one above.</li>
        )}
        {links?.map((link) => (
          <li key={link.id} className="rounded border p-3">
            <div className="flex items-center justify-between">
              <a
                href={`/${link.code}`}
                target="_blank"
                className="font-medium text-blue-600 underline"
              >
                /{link.code}
              </a>
              <span className="text-sm text-gray-500">{link.click_count} clicks</span>
            </div>
            <p className="truncate text-sm text-gray-600">{link.long_url}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

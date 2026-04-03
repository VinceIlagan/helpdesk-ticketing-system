import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import TicketCard from "@/components/tickets/TicketCard";
import { Ticket } from "@/types";

export const dynamic = "force-dynamic";

export default async function UserDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect("/dashboard/admin");

  // Fetch user's tickets
    const { data: tickets, error } = await supabase
  .from("tickets")
  .select("*, profiles!tickets_created_by_fkey(full_name, email)")
  .eq("created_by", user.id)
  .order("created_at", { ascending: false });

  // Count by status
  const counts = {
    total: tickets?.length ?? 0,
    open: tickets?.filter((t) => t.status === "open").length ?? 0,
    in_progress: tickets?.filter((t) => t.status === "in_progress").length ?? 0,
    resolved: tickets?.filter((t) => t.status === "resolved").length ?? 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">HelpDesk</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {profile?.full_name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Tickets
            </h1>
            <p className="text-gray-500 mt-1">
              Track and manage your support requests
            </p>
          </div>
          <Link href="/tickets/new">
            <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Ticket
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: counts.total, color: "bg-gray-100 text-gray-800" },
            { label: "Open", value: counts.open, color: "bg-blue-100 text-blue-800" },
            { label: "In Progress", value: counts.in_progress, color: "bg-yellow-100 text-yellow-800" },
            { label: "Resolved", value: counts.resolved, color: "bg-green-100 text-green-800" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Ticket List */}
        {tickets && tickets.length > 0 ? (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket as Ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No tickets yet</h3>
            <p className="text-gray-500 mb-4">Create your first support ticket to get started</p>
            <Link href="/tickets/new">
              <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Create Ticket
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Logout button (client component)
function LogoutButton() {
  return (
    <form action="/auth/logout" method="POST">
      <button
        type="submit"
        className="text-sm text-gray-500 hover:text-red-600 transition-colors"
      >
        Sign out
      </button>
    </form>
  );
}
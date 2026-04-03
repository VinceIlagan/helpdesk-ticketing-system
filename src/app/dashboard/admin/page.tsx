import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StatusBadge, PriorityBadge } from "@/components/tickets/TicketStatusBadge";
import { formatDistanceToNow } from "date-fns";
import AdminTicketFilters from "../../../components/tickets/AdminTicketFilters";
import NotificationBell from "@/components/layout/NotificationBell";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard/user");

  // Get filter params
  const { status, priority } = await searchParams;

  // Build query with filters
  let query = supabase
    .from("tickets")
    .select("*, profiles!tickets_created_by_fkey(full_name, email)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (priority && priority !== "all") {
    query = query.eq("priority", priority);
  }

  const { data: tickets } = await query;

  // Stats
  const { data: allTickets } = await supabase
    .from("tickets")
    .select("status");

  const counts = {
    total: allTickets?.length ?? 0,
    open: allTickets?.filter((t) => t.status === "open").length ?? 0,
    in_progress: allTickets?.filter((t) => t.status === "in_progress").length ?? 0,
    resolved: allTickets?.filter((t) => t.status === "resolved").length ?? 0,
    closed: allTickets?.filter((t) => t.status === "closed").length ?? 0,
  };

  // Get all admins for assignment
  const { data: admins } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "admin");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">HelpDesk</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{profile?.full_name}</span>
            <NotificationBell userId={user.id} />
            <form action="/auth/logout" method="POST">
              <button className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and resolve all support tickets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total", value: counts.total, color: "border-l-gray-400" },
            { label: "Open", value: counts.open, color: "border-l-blue-500" },
            { label: "In Progress", value: counts.in_progress, color: "border-l-yellow-500" },
            { label: "Resolved", value: counts.resolved, color: "border-l-green-500" },
            { label: "Closed", value: counts.closed, color: "border-l-gray-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-white rounded-xl border border-gray-200 border-l-4 ${stat.color} p-4`}
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <AdminTicketFilters currentStatus={status} currentPriority={priority} />

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mt-4">
          {tickets && tickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">
                      Ticket
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">
                      User
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">
                      Priority
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">
                      Created
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                          {ticket.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">
                          {ticket.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-700">
                              {ticket.profiles?.full_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700">
                              {ticket.profiles?.full_name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {ticket.profiles?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(ticket.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/tickets/${ticket.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No tickets found</h3>
              <p className="text-gray-500">
                {status || priority ? "Try adjusting your filters" : "No tickets have been submitted yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
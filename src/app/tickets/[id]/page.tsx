import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge, PriorityBadge } from "@/components/tickets/TicketStatusBadge";
import { formatDistanceToNow, format } from "date-fns";
import AdminTicketActions from "@/components/tickets/AdminTicketActions";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: ticket } = await supabase
    .from("tickets")
    .select("*, profiles!tickets_created_by_fkey(full_name, email)")
    .eq("id", id)
    .single();

  if (!ticket) notFound();

  // Only allow access to own tickets (unless admin)
  if (profile?.role !== "admin" && ticket.created_by !== user.id) {
    redirect("/dashboard/user");
  }

  const { data: comments } = await supabase
    .from("comments")
    .select("*, profiles(full_name, role)")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  const { data: attachments } = await supabase
    .from("attachments")
    .select("*")
    .eq("ticket_id", id);

    // Fetch all admins (for assignment dropdown)
    const { data: admins } = await supabase
  .from("profiles")
  .select("*")
  .eq("role", "admin");

  const backHref =
    profile?.role === "admin" ? "/dashboard/admin" : "/dashboard/user";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">HelpDesk</span>
          </div>
          <Link
            href={backHref}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>

              {/* Attachments */}
              {attachments && attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">ATTACHMENTS</p>
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {attachment.file_name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Comments ({comments?.length ?? 0})
              </h2>

              {comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-blue-700">
                          {comment.profiles?.full_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.profiles?.full_name}
                          </span>
                          {comment.profiles?.role === "admin" && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                              Support
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(comment.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  No comments yet.
                </p>
              )}

              {/* Add Comment Form - placeholder for Phase 7 */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  Comment feature coming in Phase 7
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Admin Actions — only visible to admins */}
            {profile?.role === "admin" && (
                <AdminTicketActions
                ticketId={ticket.id}
                currentStatus={ticket.status}
                currentAssignedTo={ticket.assigned_to}
                admins={admins ?? []}
                />
            )}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Ticket Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
                  <StatusBadge status={ticket.status} className="mt-1" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Priority</p>
                  <PriorityBadge priority={ticket.priority} className="mt-1" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Submitted by</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {ticket.profiles?.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Created</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {format(new Date(ticket.created_at), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Last Updated</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {formatDistanceToNow(new Date(ticket.updated_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
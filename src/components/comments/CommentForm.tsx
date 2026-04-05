"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface CommentFormProps {
  ticketId: string;
  isAdmin: boolean;
}

export default function CommentForm({ ticketId, isAdmin }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get current user's profile
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

      // Insert the comment
      const { error } = await supabase.from("comments").insert({
        ticket_id: ticketId,
        author_id: user.id,
        content: content.trim(),
        is_internal: isAdmin ? isInternal : false,
      });

      if (error) throw error;

      // Get ticket details
      const { data: ticket } = await supabase
        .from("tickets")
        .select("created_by, title")
        .eq("id", ticketId)
        .single();

      if (ticket) {
        if (currentProfile?.role === "admin") {
          // Admin replied → notify the ticket owner (user)
          if (ticket.created_by !== user.id) {
            await supabase.from("notifications").insert({
              user_id: ticket.created_by,
              message: `Support replied on your ticket: "${ticket.title}"`,
              ticket_id: ticketId,
            });
          }
        } else {
          // User replied → notify all admins
          const { data: admins } = await supabase
            .from("profiles")
            .select("id")
            .eq("role", "admin");

          if (admins && admins.length > 0) {
            await supabase.from("notifications").insert(
              admins.map((admin) => ({
                user_id: admin.id,
                message: `${currentProfile?.full_name ?? "A user"} replied on ticket: "${ticket.title}"`,
                ticket_id: ticketId,
              }))
            );
          }
        }
      }

      toast.success("Comment added!");
      setContent("");
      setIsInternal(false);
      window.location.reload();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to add comment";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Add a Reply
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            isAdmin
              ? "Write a reply or internal note..."
              : "Write your reply..."
          }
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
            placeholder:text-gray-400 focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200 resize-none"
        />
      </div>

      {/* Internal Note Toggle — Admin Only */}
      {isAdmin && (
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <div
            onClick={() => setIsInternal(!isInternal)}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
              isInternal ? "bg-purple-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full
                shadow transition-transform duration-200 ${
                  isInternal ? "translate-x-4" : "translate-x-0"
                }`}
            />
          </div>
          <span className="text-sm text-gray-600">
            Internal note{" "}
            <span className="text-xs text-gray-400">
              (only visible to admins)
            </span>
          </span>
        </label>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm
            font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            ${isInternal
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {loading ? "Posting..." : isInternal ? "Add Internal Note" : "Post Reply"}
        </button>
      </div>
    </form>
  );
}
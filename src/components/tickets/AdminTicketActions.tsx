"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { TicketStatus, Profile } from "@/types";

interface AdminTicketActionsProps {
  ticketId: string;
  currentStatus: TicketStatus;
  currentAssignedTo: string | null;
  admins: Profile[];
}

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function AdminTicketActions({
  ticketId,
  currentStatus,
  currentAssignedTo,
  admins,
}: AdminTicketActionsProps) {
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const [assignedTo, setAssignedTo] = useState<string>(
    currentAssignedTo ?? ""
  );
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tickets")
        .update({
          status,
          assigned_to: assignedTo || null,
        })
        .eq("id", ticketId);

      if (error) throw error;

      toast.success("Ticket updated successfully!");
      window.location.reload();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update ticket";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Admin Actions</h3>

      {/* Status Update */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Update Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TicketStatus)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Assign To */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Assign To
        </label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Unassigned</option>
          {admins.map((admin) => (
            <option key={admin.id} value={admin.id}>
              {admin.full_name}
            </option>
          ))}
        </select>
      </div>

      {/* Save Button */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm
          font-medium hover:bg-blue-700 transition-colors disabled:opacity-50
          disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
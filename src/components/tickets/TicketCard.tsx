import Link from "next/link";
import { Ticket } from "@/types";
import { StatusBadge, PriorityBadge } from "./TicketStatusBadge";
import { formatDistanceToNow } from "date-fns";

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link href={`/tickets/${ticket.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {ticket.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {ticket.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-700">
                {ticket.profiles?.full_name?.charAt(0).toUpperCase() ?? "U"}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {ticket.profiles?.full_name ?? "Unknown"}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(ticket.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
import { TicketStatus, TicketPriority } from "@/types";
import { STATUS_COLORS, PRIORITY_COLORS, TICKET_STATUS, TICKET_PRIORITY } from "@/utils/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        STATUS_COLORS[status],
        className
      )}
    >
      {TICKET_STATUS[status]}
    </span>
  );
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        PRIORITY_COLORS[priority],
        className
      )}
    >
      {TICKET_PRIORITY[priority]}
    </span>
  );
}
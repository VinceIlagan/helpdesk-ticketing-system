"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface AdminTicketFiltersProps {
  currentStatus?: string;
  currentPriority?: string;
}

export default function AdminTicketFilters({
  currentStatus,
  currentPriority,
}: AdminTicketFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/dashboard/admin?${params.toString()}`);
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Filter */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => updateFilter("status", option.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              (option.value === "all" && !currentStatus) ||
              currentStatus === option.value
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Priority Filter */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
        {priorityOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => updateFilter("priority", option.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              (option.value === "all" && !currentPriority) ||
              currentPriority === option.value
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
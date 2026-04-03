import { Comment } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface CommentListProps {
  comments: Comment[];
  isAdmin: boolean;
}

export default function CommentList({ comments, isAdmin }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="w-10 h-10 text-gray-200 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-sm text-gray-400">
          No replies yet. Be the first to respond.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isInternalNote = comment.is_internal;
        const isSupport = comment.profiles?.role === "admin";

        // Hide internal notes from regular users
        if (isInternalNote && !isAdmin) return null;

        return (
          <div
            key={comment.id}
            className={`flex gap-3 ${isInternalNote ? "opacity-90" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isSupport ? "bg-purple-100" : "bg-blue-100"
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  isSupport ? "text-purple-700" : "text-blue-700"
                }`}
              >
                {comment.profiles?.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-medium text-gray-900">
                  {comment.profiles?.full_name}
                </span>

                {isSupport && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">
                    Support
                  </span>
                )}

                {isInternalNote && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">
                    Internal Note
                  </span>
                )}

                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div
                className={`text-sm rounded-lg p-3 ${
                  isInternalNote
                    ? "bg-yellow-50 border border-yellow-200 text-yellow-900"
                    : isSupport
                    ? "bg-purple-50 border border-purple-100 text-gray-700"
                    : "bg-gray-50 border border-gray-100 text-gray-700"
                }`}
              >
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
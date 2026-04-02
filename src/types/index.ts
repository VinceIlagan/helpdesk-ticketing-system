export type Role = "admin" | "user";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  created_at: string;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_by: string;           // user id
  assigned_to: string | null;   // admin id
  created_at: string;
  updated_at: string;
  profiles?: Profile;           // joined user info
};

export type Comment = {
  id: string;
  ticket_id: string;
  author_id: string;
  content: string;
  is_internal: boolean;         // admin-only notes
  created_at: string;
  profiles?: Profile;
};

export type Attachment = {
  id: string;
  ticket_id: string;
  file_name: string;
  file_url: string;
  uploaded_by: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  ticket_id: string | null;
  created_at: string;
};
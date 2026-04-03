"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { TicketPriority } from "@/types";

const ticketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const priorityOptions: { value: TicketPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { value: "medium", label: "Medium", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "high", label: "High", color: "bg-red-100 text-red-700 border-red-200" },
  { value: "urgent", label: "Urgent", color: "bg-red-600 text-white border-red-600" },
];

export default function TicketForm() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: "medium" },
  });

  const selectedPriority = watch("priority");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (ticketId: string, userId: string) => {
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${ticketId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(fileName, file);

      if (uploadError) {
        console.error("File upload error:", uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("attachments")
        .getPublicUrl(fileName);

      await supabase.from("attachments").insert({
        ticket_id: ticketId,
        file_name: file.name,
        file_url: publicUrl,
        uploaded_by: userId,
      });
    }
  };

  const onSubmit = async (data: TicketFormData) => {
  setLoading(true);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: ticket, error } = await supabase
      .from("tickets")
      .insert({
        title: data.title,
        description: data.description,
        priority: data.priority,
        created_by: user.id,
        status: "open",
      })
      .select()
      .single();

    if (error) throw error;

    if (files.length > 0) {
      await uploadFiles(ticket.id, user.id);
    }

    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin");

    if (admins && admins.length > 0) {
      await supabase.from("notifications").insert(
        admins.map((admin) => ({
          user_id: admin.id,
          message: `New ticket: "${data.title}"`,
          ticket_id: ticket.id,
        }))
      );
    }

    toast.success("Ticket created successfully!");
    window.location.href = "/dashboard/user";
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create ticket";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <Input
        id="title"
        label="Ticket Title"
        placeholder="Brief summary of your issue..."
        error={errors.title?.message}
        {...register("title")}
      />

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          placeholder="Describe your issue in detail. Include steps to reproduce, expected behavior, etc."
          rows={5}
          className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200 resize-none
            ${errors.description ? "border-red-500" : "border-gray-300"}`}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Priority */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Priority</label>
        <div className="grid grid-cols-4 gap-2">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("priority", option.value)}
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all duration-200
                ${selectedPriority === option.value
                  ? option.color + " ring-2 ring-offset-1 ring-blue-400"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.priority && (
          <p className="text-xs text-red-600">{errors.priority.message}</p>
        )}
      </div>

      {/* File Upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Attachments{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200
            ${dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
            }`}
        >
          <svg
            className="w-8 h-8 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm text-gray-500 mb-1">
            Drag & drop files here, or{" "}
            <label className="text-blue-600 cursor-pointer hover:underline">
              browse
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, PDF, DOC up to 10MB each
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2 mt-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading} size="lg">
          Submit Ticket
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
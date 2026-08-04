import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const OwnerInput = z.object({ ownerKey: z.string().min(8).max(64) });

export type ChatThreadRow = {
  id: string;
  title: string;
  updated_at: string;
};

export type ChatMessageRow = {
  id: string;
  role: "user" | "assistant" | "system";
  parts: Array<{ type: string; text?: string }>;
};

export const listThreads = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => OwnerInput.parse(input))
  .handler(async ({ data }): Promise<ChatThreadRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("chat_threads")
      .select("id, title, updated_at")
      .eq("owner_key", data.ownerKey)
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return (rows ?? []) as ChatThreadRow[];
  });

export const createThread = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    OwnerInput.extend({ title: z.string().trim().max(120).optional() }).parse(input),
  )
  .handler(async ({ data }): Promise<ChatThreadRow> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("chat_threads")
      .insert({
        owner_key: data.ownerKey,
        ...(data.title ? { title: data.title } : {}),
      })
      .select("id, title, updated_at")
      .single();
    if (error) throw new Error(error.message);
    return row as ChatThreadRow;
  });

export const getThreadMessages = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    OwnerInput.extend({ threadId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }): Promise<{ thread: ChatThreadRow | null; messages: ChatMessageRow[] }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: thread } = await supabaseAdmin
      .from("chat_threads")
      .select("id, title, updated_at")
      .eq("owner_key", data.ownerKey)
      .eq("id", data.threadId)
      .maybeSingle();
    if (!thread) return { thread: null, messages: [] };

    const { data: rows, error } = await supabaseAdmin
      .from("chat_messages")
      .select("id, role, parts")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    return { thread: thread as ChatThreadRow, messages: (rows ?? []) as unknown as ChatMessageRow[] };
  });

export const renameThread = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    OwnerInput.extend({ threadId: z.string().uuid(), title: z.string().trim().min(1).max(120) }).parse(
      input,
    ),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("chat_threads")
      .update({ title: data.title, updated_at: new Date().toISOString() })
      .eq("owner_key", data.ownerKey)
      .eq("id", data.threadId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteThread = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    OwnerInput.extend({ threadId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("chat_threads")
      .delete()
      .eq("owner_key", data.ownerKey)
      .eq("id", data.threadId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

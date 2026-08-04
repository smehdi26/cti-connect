CREATE TABLE public.chat_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_key TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Nouvelle conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  parts JSONB NOT NULL DEFAULT '[]'::jsonb,
  client_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX chat_threads_owner_idx ON public.chat_threads (owner_key, updated_at DESC);
CREATE INDEX chat_messages_thread_idx ON public.chat_messages (thread_id, created_at);

GRANT ALL ON public.chat_threads TO service_role;
GRANT ALL ON public.chat_messages TO service_role;

ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
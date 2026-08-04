const KEY = "cti-chat-owner";

/** Stable per-browser key used to scope chat threads server-side. */
export function getChatOwnerKey(): string {
  if (typeof window === "undefined") return "";
  let value = localStorage.getItem(KEY);
  if (!value) {
    value = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem(KEY, value);
  }
  return value;
}

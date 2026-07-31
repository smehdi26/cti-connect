import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { baseTickets, ticketPlannedDate } from "@/lib/tickets-data";

export default defineTool({
  name: "list_tickets",
  title: "List support tickets",
  description:
    "List CTI Connect support tickets with their client, priority, status, assignee and planned date. Filter by status, priority, client or free text.",
  inputSchema: {
    status: z.enum(["Ouvert", "En cours", "En attente", "Résolu"]).optional(),
    priority: z.enum(["Urgent", "Élevée", "Normale", "Faible"]).optional(),
    client: z.string().optional().describe("Filter on the client company name."),
    search: z.string().optional().describe("Free-text filter on the ticket subject or id."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status, priority, client, search }) => {
    const q = search?.trim().toLowerCase();
    const c = client?.trim().toLowerCase();
    const rows = baseTickets
      .filter(
        (t) =>
          (!status || t.status === status) &&
          (!priority || t.priority === priority) &&
          (!c || t.client.toLowerCase().includes(c)) &&
          (!q || t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)),
      )
      .map(({ dayOffset, ...t }) => ({ ...t, plannedDate: ticketPlannedDate(dayOffset) }));

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, tickets: rows },
    };
  },
});

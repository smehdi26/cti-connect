import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { initialClients, slugifyClient } from "@/lib/clients-data";

export default defineTool({
  name: "list_clients",
  title: "List clients",
  description:
    "List the corporate clients of CTI Connect, optionally filtered by status or a free-text search on name, sector or city.",
  inputSchema: {
    status: z
      .enum(["Actif", "Maintenance", "En attente"])
      .optional()
      .describe("Only return clients with this status."),
    search: z.string().optional().describe("Free-text filter on name, sector or city."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status, search }) => {
    const q = search?.trim().toLowerCase();
    const rows = initialClients
      .filter((c) => (!status || c.status === status) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)))
      .map((c) => ({ ...c, slug: slugifyClient(c.name) }));

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, clients: rows },
    };
  },
});

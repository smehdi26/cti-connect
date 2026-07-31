import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { initialEquipments } from "@/lib/equipment-data";

export default defineTool({
  name: "list_equipements",
  title: "List equipment",
  description:
    "List the telecom and security equipment installed at CTI Connect clients (IP-PBX, DECT, IP cameras, access control), with status and last check.",
  inputSchema: {
    status: z.enum(["En service", "Alerte", "Maintenance"]).optional(),
    client: z.string().optional().describe("Filter on the client company name."),
    ref: z.string().optional().describe("Return a single equipment by its exact reference."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status, client, ref }) => {
    if (ref) {
      const one = initialEquipments.find((e) => e.ref.toLowerCase() === ref.toLowerCase());
      if (!one) throw new ToolError(`No equipment found with reference "${ref}".`);
      return {
        content: [{ type: "text", text: JSON.stringify(one, null, 2) }],
        structuredContent: { count: 1, equipements: [one] },
      };
    }

    const c = client?.trim().toLowerCase();
    const rows = initialEquipments.filter(
      (e) => (!status || e.status === status) && (!c || e.client.toLowerCase().includes(c)),
    );

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, equipements: rows },
    };
  },
});

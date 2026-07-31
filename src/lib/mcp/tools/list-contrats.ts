import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { initialContracts } from "@/lib/contracts-data";

export default defineTool({
  name: "list_contrats",
  title: "List maintenance contracts",
  description:
    "List CTI Connect maintenance contracts: client id, company, fee type (Annuelle/Semestrielle), signature date, number of yearly visits and the planned visit months.",
  inputSchema: {
    redevance: z.enum(["Annuelle", "Semestrielle"]).optional(),
    clientId: z.string().optional().describe("Return a single contract by its exact client id, e.g. CLI-001."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ redevance, clientId }) => {
    if (clientId) {
      const one = initialContracts.find((c) => c.clientId.toLowerCase() === clientId.toLowerCase());
      if (!one) throw new ToolError(`No contract found for client id "${clientId}".`);
      return {
        content: [{ type: "text", text: JSON.stringify(one, null, 2) }],
        structuredContent: { count: 1, contrats: [one] },
      };
    }

    const rows = initialContracts.filter((c) => !redevance || c.redevance === redevance);
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, contrats: rows },
    };
  },
});

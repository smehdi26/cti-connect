import { defineMcp } from "@lovable.dev/mcp-js";
import listClientsTool from "./tools/list-clients";
import listTicketsTool from "./tools/list-tickets";
import listEquipementsTool from "./tools/list-equipements";
import listContratsTool from "./tools/list-contrats";

export default defineMcp({
  name: "cti-connect",
  title: "CTI Connect",
  version: "0.1.0",
  instructions:
    "Read-only tools over the CTI Connect operations dashboard (Tunisian telecom & security integrator). Use `list_clients` for corporate clients, `list_tickets` for support tickets, `list_equipements` for installed hardware, and `list_contrats` for maintenance contracts.",
  tools: [listClientsTool, listTicketsTool, listEquipementsTool, listContratsTool],
});

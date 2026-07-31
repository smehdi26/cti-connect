export type TicketPriority = "Urgent" | "Élevée" | "Normale" | "Faible";
export type TicketStatus = "Ouvert" | "En cours" | "En attente" | "Résolu";

export type BaseTicket = {
  id: string;
  subject: string;
  client: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: string;
  age: string;
  /** offset in days from today for the planned date */
  dayOffset: number;
};

export const baseTickets: BaseTicket[] = [
  { id: "#4832", subject: "Coupure ligne DECT — Bureau 3ème étage", client: "Société Générale Tunisie", priority: "Urgent", status: "Ouvert", assignee: "Karim H.", age: "il y a 25 min", dayOffset: 0 },
  { id: "#4831", subject: "Configuration IVR pour service client", client: "Ooredoo Tunisie", priority: "Élevée", status: "En cours", assignee: "Sami B.", age: "il y a 2 h", dayOffset: 1 },
  { id: "#4830", subject: "Caméra IP hors ligne — Site Sfax", client: "Délice Danone", priority: "Élevée", status: "En cours", assignee: "Aya M.", age: "il y a 3 h", dayOffset: 2 },
  { id: "#4829", subject: "Ajout de 12 postes Gigaset", client: "Groupe Poulina", priority: "Normale", status: "Ouvert", assignee: "—", age: "il y a 5 h", dayOffset: 3 },
  { id: "#4828", subject: "Migration standard vers VOIP", client: "Hôtel Laico", priority: "Normale", status: "En attente", assignee: "Karim H.", age: "hier", dayOffset: 5 },
  { id: "#4827", subject: "Fax to mail — erreur de routage", client: "Tunisair", priority: "Faible", status: "Résolu", assignee: "Sami B.", age: "hier", dayOffset: -1 },
  { id: "#4826", subject: "Contrat maintenance annuel", client: "STEG", priority: "Normale", status: "Résolu", assignee: "Aya M.", age: "il y a 2 j", dayOffset: -2 },
];

export function ticketPlannedDate(dayOffset: number, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().slice(0, 10);
}

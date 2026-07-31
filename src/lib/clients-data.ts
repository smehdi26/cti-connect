export type Client = {
  name: string;
  sector: string;
  city: string;
  contact: string;
  sites: number;
  status: "Actif" | "Maintenance" | "En attente";
};

export const initialClients: Client[] = [
  { name: "Société Générale Tunisie", sector: "Banque", city: "Tunis", contact: "+216 71 123 456", sites: 12, status: "Actif" },
  { name: "Groupe Poulina", sector: "Industrie", city: "Ben Arous", contact: "+216 71 789 012", sites: 24, status: "Actif" },
  { name: "Tunisair", sector: "Aéronautique", city: "Tunis-Carthage", contact: "+216 70 837 000", sites: 8, status: "Actif" },
  { name: "Délice Danone", sector: "Agroalimentaire", city: "Sfax", contact: "+216 74 402 100", sites: 6, status: "Maintenance" },
  { name: "Ooredoo Tunisie", sector: "Télécom", city: "Les Berges du Lac", contact: "+216 31 300 100", sites: 15, status: "Actif" },
  { name: "STEG", sector: "Énergie", city: "Tunis", contact: "+216 71 341 311", sites: 32, status: "Actif" },
  { name: "Carthage Cement", sector: "Industrie", city: "Bizerte", contact: "+216 72 456 789", sites: 4, status: "En attente" },
  { name: "Hôtel Laico", sector: "Hôtellerie", city: "Hammamet", contact: "+216 72 288 000", sites: 3, status: "Actif" },
];

export function slugifyClient(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

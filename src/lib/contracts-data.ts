export type Redevance = "Annuelle" | "Semestrielle";

export type Contract = {
  clientId: string;
  contract: string; // company name
  redevance: Redevance;
  signedAt: string; // YYYY-MM-DD
  visits: 4 | 6;
  visitMonths: string[];
};

export const MONTHS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
];

export const initialContracts: Contract[] = [
  {
    clientId: "CLI-001",
    contract: "Société Générale Tunisie",
    redevance: "Annuelle",
    signedAt: "2024-02-14",
    visits: 6,
    visitMonths: ["Fév", "Avr", "Juin", "Août", "Oct", "Déc"],
  },
  {
    clientId: "CLI-002",
    contract: "Groupe Poulina",
    redevance: "Semestrielle",
    signedAt: "2023-09-03",
    visits: 4,
    visitMonths: ["Mar", "Juin", "Sep", "Déc"],
  },
  {
    clientId: "CLI-003",
    contract: "Tunisair",
    redevance: "Annuelle",
    signedAt: "2024-06-21",
    visits: 6,
    visitMonths: ["Jan", "Mar", "Mai", "Juil", "Sep", "Nov"],
  },
  {
    clientId: "CLI-004",
    contract: "Délice Danone",
    redevance: "Semestrielle",
    signedAt: "2025-01-12",
    visits: 4,
    visitMonths: ["Fév", "Mai", "Août", "Nov"],
  },
  {
    clientId: "CLI-006",
    contract: "STEG",
    redevance: "Annuelle",
    signedAt: "2022-11-08",
    visits: 6,
    visitMonths: ["Fév", "Avr", "Juin", "Août", "Oct", "Déc"],
  },
];

export const clientSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

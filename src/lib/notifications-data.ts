export type NotifType = "ok" | "warn" | "info";

export type Notification = {
  id: number;
  type: NotifType;
  title: string;
  desc: string;
  time: string;
  category: "Tickets" | "Interventions" | "Contrats" | "Équipements";
  read: boolean;
};

export const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "warn",
    title: "Alerte fibre optique",
    desc: "Site Sfax B — perte de signal détectée sur le lien principal.",
    time: "il y a 12 min",
    category: "Interventions",
    read: false,
  },
  {
    id: 2,
    type: "ok",
    title: "Installation VOIP finalisée",
    desc: "Société Générale — Tunis Centre : 42 postes IP mis en service.",
    time: "il y a 2 h",
    category: "Équipements",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Nouveau ticket #4832",
    desc: "Coupure ligne DECT — 3ème étage, priorité haute.",
    time: "il y a 3 h",
    category: "Tickets",
    read: false,
  },
  {
    id: 4,
    type: "ok",
    title: "Maintenance préventive terminée",
    desc: "STEG — Poste analogique lot 12, rapport disponible.",
    time: "hier",
    category: "Interventions",
    read: false,
  },
  {
    id: 5,
    type: "info",
    title: "Contrat à renouveler",
    desc: "Hôtel Laico — échéance du contrat de maintenance dans 30 jours.",
    time: "il y a 2 j",
    category: "Contrats",
    read: true,
  },
  {
    id: 6,
    type: "warn",
    title: "Caméra IP hors ligne",
    desc: "Délice Danone — Sfax : caméra CAM-014 injoignable.",
    time: "il y a 3 j",
    category: "Équipements",
    read: true,
  },
  {
    id: 7,
    type: "ok",
    title: "Ticket #4821 résolu",
    desc: "Configuration DECT validée par le client.",
    time: "il y a 4 j",
    category: "Tickets",
    read: true,
  },
];

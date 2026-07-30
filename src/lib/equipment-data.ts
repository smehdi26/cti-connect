export type Equipment = {
  ref: string;
  model: string;
  type: string;
  client: string;
  site: string;
  status: "En service" | "Alerte" | "Maintenance";
  lastCheck: string;
};

export const initialEquipments: Equipment[] = [
  { ref: "GIG-N870-014", model: "Gigaset N870 IP PRO", type: "DECT Multicellulaire", client: "Groupe Poulina", site: "Ben Arous", status: "En service", lastCheck: "12 juil." },
  { ref: "NEC-SV9100-002", model: "NEC SV9100", type: "IP-PBX", client: "Société Générale", site: "Tunis Centre", status: "En service", lastCheck: "10 juil." },
  { ref: "UNF-OS-018", model: "Unify OpenScape Business", type: "Standard IP", client: "Ooredoo Tunisie", site: "Les Berges du Lac", status: "En service", lastCheck: "08 juil." },
  { ref: "MTX-SATATYA-041", model: "Matrix SATATYA CIDR20FL", type: "Caméra IP", client: "Délice Danone", site: "Sfax", status: "Alerte", lastCheck: "14 juil." },
  { ref: "MTX-COSEC-007", model: "Matrix COSEC DOOR", type: "Contrôle d'accès", client: "STEG", site: "Tunis", status: "En service", lastCheck: "05 juil." },
  { ref: "GIG-DE900-055", model: "Gigaset DE900 IP PRO", type: "Téléphone IP", client: "Hôtel Laico", site: "Hammamet", status: "Maintenance", lastCheck: "01 juil." },
  { ref: "MYF-500-003", model: "MyFax Server 500", type: "Fax to Mail", client: "Tunisair", site: "Tunis-Carthage", status: "En service", lastCheck: "15 juil." },
];

export const equipmentStatusColor: Record<string, string> = {
  "En service": "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  Alerte: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30",
  Maintenance: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
};

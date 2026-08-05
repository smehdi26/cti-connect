import { MONTHS, initialContracts, type Contract } from "@/lib/contracts-data";

export const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export const TECHNICIENS = [
  "Amine Ben Salah",
  "Sonia Khemiri",
  "Karim Haddad",
  "Aya Mansouri",
  "Sami Boughanmi",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000;
  return h;
}

export type PlannedVisit = {
  /** 1-based visit number from the original contract */
  index: number;
  monthIndex: number; // 0-11
  /** DD/MM/YYYY */
  date: string;
  technicien: string;
};

/** Visits of a contract for a given year, ordered by the contract's own visit sequence. */
export function contractVisits(c: Contract, year: number): PlannedVisit[] {
  return c.visitMonths.map((m, i) => {
    const monthIndex = MONTHS.indexOf(m);
    const h = hash(`${c.clientId}-${monthIndex}`);
    const day = 3 + (h % 24);
    const dd = String(day).padStart(2, "0");
    const mm = String(monthIndex + 1).padStart(2, "0");
    return {
      index: i + 1,
      monthIndex,
      date: `${dd}/${mm}/${year}`,
      technicien: TECHNICIENS[(h + i) % TECHNICIENS.length],
    };
  });
}

export type MonthlyRow = {
  clientId: string;
  contract: string;
  redevance: Contract["redevance"];
  visits: number;
  /** the visit that falls in the requested month */
  current: PlannedVisit;
  all: PlannedVisit[];
};

/** All contracts having a visit in the given month (0-11) of the given year. */
export function monthlyVisits(year: number, monthIndex: number): MonthlyRow[] {
  const rows: MonthlyRow[] = [];
  for (const c of initialContracts) {
    const all = contractVisits(c, year);
    const current = all.find((v) => v.monthIndex === monthIndex);
    if (!current) continue;
    rows.push({
      clientId: c.clientId,
      contract: c.contract,
      redevance: c.redevance,
      visits: c.visits,
      current,
      all,
    });
  }
  return rows.sort((a, b) => a.current.date.localeCompare(b.current.date));
}

export function isPast(date: string, today = new Date()) {
  const [d, m, y] = date.split("/").map(Number);
  return new Date(y, m - 1, d).getTime() < today.getTime();
}

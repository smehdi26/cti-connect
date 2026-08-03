/** Client-side export helpers (CSV / JSON / PDF via print). */

function download(filename: string, content: string, mime: string) {
  const blob = new Blob(["\uFEFF" + content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const esc = (v: unknown) => {
  const s = v == null ? "" : Array.isArray(v) ? v.join(" / ") : String(v);
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function exportCsv<T extends Record<string, unknown>>(
  filename: string,
  columns: { key: keyof T & string; label: string }[],
  rows: T[],
) {
  const head = columns.map((c) => esc(c.label)).join(";");
  const body = rows.map((r) => columns.map((c) => esc(r[c.key])).join(";"));
  download(`${filename}.csv`, [head, ...body].join("\r\n"), "text/csv");
}

export function exportJson(filename: string, data: unknown) {
  download(`${filename}.json`, JSON.stringify(data, null, 2), "application/json");
}

function printHtml(title: string, body: string) {
  const w = window.open("", "_blank", "width=900,height=1000");
  if (!w) return false;
  w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>${title}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:'DM Sans',system-ui,sans-serif;color:#0f1c2e;margin:36px}
  h1{font-size:22px;margin:0 0 4px}
  .sub{color:#64748b;font-size:12px;margin-bottom:24px}
  h2{font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin:26px 0 8px}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;background:#f1f5f9;color:#475569;text-transform:uppercase;font-size:10px;letter-spacing:.06em;padding:8px}
  td{padding:8px;border-top:1px solid #e2e8f0}
  .kv{display:grid;grid-template-columns:180px 1fr;font-size:12px;gap:6px 12px}
  .kv dt{color:#64748b}
  .brand{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #0f1c2e;padding-bottom:10px;margin-bottom:18px}
  .brand span{font-weight:700;letter-spacing:.04em}
  footer{margin-top:32px;color:#94a3b8;font-size:10px}
</style></head><body>
<div class="brand"><span>CTI-NETWORK</span><small>${new Date().toLocaleString("fr-FR")}</small></div>
${body}
<footer>Document généré depuis l'espace CTI-Network — usage interne.</footer>
</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
  return true;
}

export function exportPdfTable(
  title: string,
  subtitle: string,
  columns: { label: string }[],
  rows: (string | number)[][],
) {
  return printHtml(
    title,
    `<h1>${title}</h1><div class="sub">${subtitle}</div>
     <table><thead><tr>${columns.map((c) => `<th>${c.label}</th>`).join("")}</tr></thead>
     <tbody>${rows
       .map((r) => `<tr>${r.map((c) => `<td>${c ?? ""}</td>`).join("")}</tr>`)
       .join("")}</tbody></table>`,
  );
}

export function exportPdfSections(
  title: string,
  subtitle: string,
  sections: { heading: string; pairs?: [string, string][]; table?: { columns: string[]; rows: (string | number)[][] } }[],
) {
  const body = sections
    .map((s) => {
      const inner = s.pairs
        ? `<dl class="kv">${s.pairs.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>`
        : s.table
          ? `<table><thead><tr>${s.table.columns.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${s.table.rows
              .map((r) => `<tr>${r.map((c) => `<td>${c ?? ""}</td>`).join("")}</tr>`)
              .join("")}</tbody></table>`
          : "";
      return `<h2>${s.heading}</h2>${inner}`;
    })
    .join("");
  return printHtml(title, `<h1>${title}</h1><div class="sub">${subtitle}</div>${body}`);
}

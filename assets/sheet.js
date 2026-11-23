/* Shared helpers for the CISAAD pages that read a Google Sheet.
   Used by: pages/publications, pages/us-policies-laws, pages/us-policies-laws/heatmap
   Each page loads it with a <script src="…/assets/sheet.js"> tag before its own script. */

/* Turns CSV text into a list of rows, one object per row: [{ "Column name": "value", … }, …]
   Handles quoted cells (commas, "" and line breaks inside quotes). Empty rows are skipped. */
function parseCSV(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  const head = rows.shift().map(h => h.trim());
  return rows.filter(r => r.some(v => v.trim() !== ""))
    .map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
}

/* Makes text safe to put inside HTML (so a "<" in the sheet can't break the page). */
function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

/* First line of a CSV file (the column names), without the invisible BOM character some files start with. */
function headerOf(text) {
  return text.replace(/^﻿/, "").split(/\r?\n/, 1)[0];
}

/* Loads a page's data in two steps:
     1) fast:  the saved copy next to the page (updated every hour by a GitHub workflow)
     2) fresh: the live Google Sheet; the page is redrawn only if the data changed
   Options:
     snapshot: file names of the saved copies, e.g. ["publications.csv"]
     live:     "Publish to web" CSV links of the same tabs, in the same order
     check(texts): gets the downloaded texts; returns the data to draw,
                   or throws if a download doesn't look like the sheet (e.g. an error page)
     show(data):   draws the page
     fail():       called only if neither the saved copy nor the live sheet could be loaded */
async function loadSheets({ snapshot, live, check, show, fail }) {
  let shown = null;
  async function get(urls) {
    const texts = await Promise.all(urls.map(async url => {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(url + ": " + res.status);
      return res.text();
    }));
    return check(texts);
  }
  function draw(data) {
    const key = JSON.stringify(data);
    if (key === shown) return;
    shown = key; show(data);
  }
  try { draw(await get(snapshot)); } catch (e) { }
  try { draw(await get(live)); }
  catch (e) { if (shown === null) fail(); }
}

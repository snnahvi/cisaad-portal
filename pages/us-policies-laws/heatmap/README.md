# US AI & Deepfake Legislation Heat Map

An interactive map showing how many **AI laws** and **deepfake laws** each U.S. state has enacted.
It appears on the CISAAD **US Policies & Laws** page.

| | |
|---|---|
| **Live page** | <https://snnahvi.github.io/cisaad-portal/pages/us-policies-laws/heatmap/> |
| **Data source** | [NCSL](https://www.ncsl.org) legislative database, last updated **Sept 1, 2026** |
| **Dataset & original map** | Henry Sonti |
| **Web version** | Sana Nahvi |

---

## At a glance

| | |
|---|---|
| 🏛️ AI laws enacted | **256** across 47 states |
| 🎭 Deepfake laws (part of the AI laws) | **115** |
| 📅 Years covered | 2024 (2), 2025 (135), 2026 (118) |
| 🥇 Most AI laws | California and Utah (17 each), Texas and Virginia (12), Maryland (11) |
| 🥇 Most deepfake laws | Louisiana (8), Utah (6), Montana (5) |
| ⬜ No AI laws yet | Alaska, Massachusetts, Ohio |

---

## Files in this folder

| File | What it is |
|---|---|
| `index.html` | The page: map, buttons, and the "How to read a bill" guide |
| `heatmap-data.csv` | The dataset, one row per law |
| `plotly.min.js` | Map library (stored here so the page doesn't depend on outside servers) |
| `usa_110m.json` | US state shapes used by the map |
| `README.md` | This file |

---

## The dataset: `heatmap-data.csv`

Each row is **one enacted law**. Rows are grouped by state, newest first.

| Column | Example | Meaning |
|---|---|---|
| `State` | `MD` | Two-letter state code |
| `State Name` | `Maryland` | Full state name |
| `Bill` | `MD H 820` | Bill code: state, chamber, number |
| `Chamber` | `House` | Where the bill started (see below) |
| `Bill Number` | `820` | Number given when the bill was introduced |
| `Year` | `2025` | Year it became law |
| `Date Enacted` | `2025-05-20` | Date it became law |
| `Deepfake` | `No` | `Yes` if it is also a deepfake law |
| `Notes` | | Anything that still needs checking |

### Reading a bill code

```
MD   H   820
│    │    └── bill number
│    └─────── chamber
└──────────── state
```
**MD H 820** = Maryland House Bill 820

| Letter | Chamber | Note |
|:---:|---|---|
| **S** | Senate | |
| **H** | House | |
| **A** | Assembly | What CA, NV, NJ and NY call their House |
| **L** | Legislature | Nebraska has only one chamber |

> **Heads-up:** bill numbers restart every legislative session, so the same code can mean different laws in different years. Always read the code together with its year.

---

## How to update the data

1. Edit `heatmap-data.csv` (Excel or Google Sheets work fine; save as **CSV, UTF-8**).
2. Add one row per new law. Keep the `Bill` format `ST X 123`.
3. Commit and push to **both** remotes:
   ```
   git add pages/us-policies-laws/heatmap
   git commit -m "Update heat map data"
   git push cisaad main
   git push origin main
   ```

> The map in `index.html` currently has the data built in. Connecting it to read this CSV directly is the next step.

---

## Corrections made to the original dataset

These changes were made to Henry's "Heat Map Dataset" so the counts match the bills listed.

| What | Before | After |
|---|---|---|
| State name | Conneticut, Deleware, Rhose Island | Connecticut, Delaware, Rhode Island |
| Utah AI count | 16 | 17 (17 bills are listed) |
| Michigan deepfake bills | count 2, names missing | MI H 4047, MI H 4048 |
| New Hampshire deepfake bill | count 1, name missing | NH S 300 |
| Bill code format | `KY HB 207`, extra spaces (`HI H  2137`) | `KY H 207`, `HI H 2137` |

### Still open (marked in the `Notes` column)

- [ ] `CA A 2148`: enactment date is missing
- [ ] `RI 7538`: chamber letter (H or S) is missing
- [ ] `MD H 782`: a study on detecting weapons in schools; its text does not mention AI. Should it be included?

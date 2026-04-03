<div align="center">

<br/>

<img src="public/favicon.svg" width="64" height="64" alt="VaultIQ Logo" />

<h1>VaultIQ</h1>

<p><strong>A personal finance dashboard built for clarity, not complexity.</strong><br/>
Track income, visualize spending patterns, and forecast your balance — all in one place.</p>

<p>
  <a href="https://vaultiq.imandatta.com" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-vaultiq.imandatta.com-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  &nbsp;
  <a href="https://github.com/Iman-Datta/VaultIQ" target="_blank">
    <img src="https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Redux%20Toolkit-2.0-764abc?style=flat-square&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.0-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-2.x-22c55e?style=flat-square" />
  <img src="https://img.shields.io/badge/Vite-5.0-646cff?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-WIP-f59e0b?style=flat-square" />
</p>

<br/>

</div>

---

## What is VaultIQ?

VaultIQ is a frontend finance dashboard that lets you explore, filter, and understand 16 months of personal transaction data — from salary credits to daily Swiggy orders. Built as a college frontend assignment, it goes beyond the requirements with real chart interactivity, a synthetic dataset of 1,457 transactions, role-based UI, dark mode, and localStorage persistence.

> **No backend. No auth. Just a fast, clean, data-rich frontend.**

---

## Preview

| Page | Description |
|------|-------------|
| **Dashboard** | Balance trend chart with zoom + pan, 4 KPI cards, spending donut, insights strip |
| **Analytics** | Monthly income vs expense bars, budget tracker, 3-month balance forecast |
| **Transactions** | 1,457 rows · search · filter · sort · paginated (122 pages) |
| **Cards** | Coming soon |

---

## Feature Breakdown

###  Dashboard

- **4 Summary Cards** — Total Balance, Total Income, Total Expenses, Net Savings — each with a month-over-month percentage delta
- **Balance Trend Chart** — Area chart with range buttons `7D · 30D · 3M · 6M · 1Y · All` and **mouse-wheel zoom + pan**
- **Spending by Category** — Donut chart with hover-to-center detail (no tooltip noise). Hovered slice highlights; others fade.
- **Financial Insights Strip** — Highest spending category · MoM change · Savings rate · Smart tip

###  Analytics

- **Monthly Comparison** — Grouped bar + line chart: income (green) vs expenses (red) vs running balance (blue line) across all 16 months
- **Budget vs Actual** — Month-by-month bars that turn **red when over budget**, **blue when under** — you can see problem months at a glance
- **Balance Forecast** — Projects the next 3 months using recent growth trend; actual line in blue, forecast dashed in green
- **Spending Breakdown** — Full category donut, synced with all-time data

###  Transactions

- 1,457 records spanning **Jan 2025 → Apr 2026**
- **Search** by description or category
- **Filter** by type — All / Income / Expense
- **Sort** by date or amount (ascending / descending toggle)
- Paginated — 122 pages, 12 rows each

###  Role-Based UI

No backend needed — roles are simulated on the frontend via a sidebar dropdown.

| Role | Permissions |
|------|-------------|
| `Viewer` | Read-only — browse all data, charts, transactions |
| `Admin` | Full access — add, edit, and delete transactions |

Switch between roles live to see the UI adapt in real time.

###  Other

- **Dark / Light mode** with persistent preference
- **localStorage sync** — transactions survive hard refresh
- **Pure SVG logo** — no image files, pixel-perfect at any size
- **Fully responsive** — sidebar collapses on mobile, charts reflow

---

## Tech Stack

| Layer | Tool |
|-------|------|
| UI Framework | React 18 |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Build Tool | Vite |
| Persistence | localStorage |
| Data | Synthetic CSV (1,457 rows) |

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Iman-Datta/VaultIQ.git
cd VaultIQ

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
VaultIQ/
├── public/
│   └── favicon.svg                  # Pure SVG logo
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── BalanceTrend.jsx     # Zoom/pan area chart with range selector
│   │   │   ├── BalanceForecast.jsx  # 3-month projection line chart
│   │   │   ├── BudgetVsActual.jsx   # Over/under budget bar chart
│   │   │   ├── MonthlyCompare.jsx   # Income vs expense grouped bars + balance line
│   │   │   └── SpendingDonut.jsx    # Category donut with hover center detail
│   │   ├── dashboard/
│   │   │   ├── SummaryCards.jsx     # 4 KPI cards with MoM delta
│   │   │   └── FinancialInsights.jsx
│   │   ├── transactions/
│   │   │   └── TransactionTable.jsx # Search · filter · sort · paginate
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx          # Nav + role switcher
│   │   │   └── Topbar.jsx           # Dark mode toggle + user info
│   │   └── VaultLogo.jsx            # Inline SVG logo (no image file)
│   ├── store/
│   │   ├── slices/
│   │   │   ├── transactionSlice.js  # CRUD actions + localStorage sync
│   │   │   ├── filterSlice.js       # Search, type, sort state
│   │   │   └── roleSlice.js         # Viewer / Admin
│   │   └── selectors.js             # Memoized derived selectors
│   ├── data/
│   │   ├── mockData.js              # CSV parser + CATEGORY_COLORS map
│   │   └── transactions.csv         # 1,457 synthetic transaction rows
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Analytics.jsx
│   │   ├── Transactions.jsx
│   │   └── Cards.jsx
│   └── utils/
│       └── formatCurrency.js        # ₹ INR formatter
└── README.md
```

---

## The Dataset

Transactions are synthetically generated in Python to simulate a realistic working-professional / student-freelancer finance history.

- **Period:** 1 January 2025 → 30 April 2026 (16 months)
- **Volume:** 1,457 transactions, 2–5 per day, no missing dates
- **Timestamps:** Spread across morning · afternoon · evening · night slots
- **Income:** Monthly salary (₹52k–₹70k) + irregular freelance (₹4k–₹14k, 1–3×/month)
- **Expenses:** Rent · bills · food · travel · subscriptions · shopping · one-off spends
- **Financial realism:** Monthly income > monthly expenses every single month; running balance grows consistently over time

**Categories:** `Salary` · `Freelance` · `Food` · `Rent` · `Bills` · `Entertainment` · `Shopping` · `Travel` · `Other`

---

## Assignment Requirements Coverage

This project was built for a **Finance Dashboard UI** frontend assignment. All core and optional requirements are addressed:

**Core**

- [x] Dashboard with summary cards and at least two visualizations
- [x] Transactions section with date, amount, category, type
- [x] Filtering and sorting on transactions
- [x] Role-based UI — Viewer (read-only) and Admin (full CRUD)
- [x] Insights section — highest category, MoM comparison, savings rate, smart tip
- [x] State management with Redux Toolkit (transactions, filters, role)
- [x] Responsive design across mobile, tablet, desktop

**Optional (all implemented)**

- [x] Dark mode
- [x] localStorage persistence
- [x] Animations and transitions on charts and hover states
- [x] Advanced filtering — by type, sort field, sort direction, and search

---

## Known Issues

| Issue | Status |
|-------|--------|
| Some rows show `Invalid Date` in the transactions table |  Investigating — likely a CSV timestamp parse edge case on the last few rows |
| Cards page is a placeholder |  Coming soon |
| Chart touch interactions on mobile not fully optimized |  Planned |

---



<div align="center">
  <sub>Built with React, Redux Toolkit, Tailwind CSS, and Recharts · MIT License</sub>
</div>

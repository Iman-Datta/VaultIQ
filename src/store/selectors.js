import { CATEGORY_COLORS } from "../data/mockData";

// Raw list
export const selectAllTransactions = (state) => state.transactions.transactions;

// Filtered + sorted list
export const selectFilteredTransactions = (state) => {
  const { transactions } = state.transactions;
  const { searchQuery, typeFilter, sortField, sortDir } = state.filter;

  let result = [...transactions];

  if (typeFilter !== "all")
    result = result.filter((t) => t.type === typeFilter);

  if (searchQuery.trim())
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  result.sort((a, b) => {
    let diff = 0;
    if (sortField === "date")
      diff = new Date(a.timestamp) - new Date(b.timestamp);
    if (sortField === "amount") diff = Math.abs(a.amount) - Math.abs(b.amount);
    return sortDir === "asc" ? diff : -diff;
  });

  return result;
};

// Summary totals
export const selectTotals = (state) => {
  const txns = state.transactions.transactions;
  const totalIncome = txns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = txns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  return {
    totalIncome,
    totalExpenses,
    totalBalance: totalIncome - totalExpenses,
    netSavings: totalIncome - totalExpenses,
  };
};

// Spending by category (for donut chart)
export const selectSpendingByCategory = (state) => {
  const txns = state.transactions.transactions.filter(
    (t) => t.type === "expense",
  );
  const map = {};
  txns.forEach((t) => {
    map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
  });
  return Object.entries(map).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
    fill: CATEGORY_COLORS[name] || "#6b7280",
  }));
};

// Insights
export const selectInsights = (state) => {
  const txns = state.transactions.transactions;
  const spending = selectSpendingByCategory(state);
  const totals = selectTotals(state);

  const topCategory = spending.sort((a, b) => b.value - a.value)[0] || {
    name: "—",
    value: 0,
  };
  const topPct =
    totals.totalExpenses > 0
      ? ((topCategory.value / totals.totalExpenses) * 100).toFixed(1)
      : 0;

  const savingsRate =
    totals.totalIncome > 0
      ? ((totals.netSavings / totals.totalIncome) * 100).toFixed(1)
      : 0;

  // Simple month-over-month: compare last 2 months by sum of expenses
  const byMonth = {};
  txns
    .filter((t) => t.type === "expense" && t.timestamp)
    .forEach((t) => {
      const m = t.timestamp.slice(0, 7);
      byMonth[m] = (byMonth[m] || 0) + Math.abs(t.amount);
    });
  const months = Object.keys(byMonth).sort();
  const lastTwo = months.slice(-2);
  const prevExp = byMonth[lastTwo[0]] || 0;
  const currExp = byMonth[lastTwo[1]] || 0;
  const momChange =
    prevExp > 0 ? (((currExp - prevExp) / prevExp) * 100).toFixed(1) : 0;

  return { topCategory, topPct, savingsRate, momChange, currExp, prevExp };
};

export const selectMonthlyComparison = (state) => {
  const txns = state.transactions.transactions;
  const monthlyMap = {};

  txns.forEach((t) => {
    if (!t.timestamp) return;

    const dateKey = t.timestamp.slice(0, 7);

    const month = new Date(t.timestamp).toLocaleString("en-IN", {
      month: "short",
    });

    if (!monthlyMap[dateKey]) {
      monthlyMap[dateKey] = {
        month,
        dateKey,
        label: new Date(t.timestamp).toLocaleString("en-IN", {
          month: "short",
          year: "2-digit",
        }),
        income: 0,
        expenses: 0,
      };
    }

    if (t.type === "income") {
      monthlyMap[dateKey].income += Math.abs(t.amount);
    } else {
      monthlyMap[dateKey].expenses += Math.abs(t.amount);
    }
  });

  const sortedData = Object.values(monthlyMap).sort((a, b) =>
    a.dateKey.localeCompare(b.dateKey),
  );

  let runningBalance = 0;

  return sortedData.map((item) => {
    runningBalance += item.income - item.expenses;

    return {
      ...item,
      balance: runningBalance,
    };
  });
};

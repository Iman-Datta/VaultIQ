import csvData from "./transactions.csv?raw";

export const mockTransactions = csvData
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => {
    const [id, timestamp, description, category, amount, type] =
      line.split(",");

    return {
      id: id.trim(),
      timestamp: timestamp.trim(),
      description: description.trim(),
      category: category.trim(),
      amount: Number(amount.trim()),
      type: type.trim(),
    };
  });

console.log("csv transactions", mockTransactions);

export const CATEGORIES = [
  "Salary",
  "Freelance",
  "Food",
  "Rent",
  "Bills",
  "Entertainment",
  "Shopping",
  "Travel",
  "Other",
];

export const CATEGORY_COLORS = {
  Food: "#22c55e",
  Travel: "#f97316",
  Bills: "#ef4444",
  Rent: "#3b82f6",
  Shopping: "#a855f7",
  Entertainment: "#ec4899",
  Salary: "#14b8a6",
  Freelance: "#eab308",
  Other: "#6b7280",
};

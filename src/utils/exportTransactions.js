export const exportAsCSV = (transactions) => {
  const headers = ["Timestamp", "Description", "Category", "Amount", "Type"];

  const rows = transactions.map((txn) => [
    txn.timestamp,
    txn.description,
    txn.category,
    txn.amount,
    txn.type,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "transactions.csv";
  link.click();

  URL.revokeObjectURL(url);
};

export const exportAsJSON = (transactions) => {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "transactions.json";
  link.click();

  URL.revokeObjectURL(url);
};

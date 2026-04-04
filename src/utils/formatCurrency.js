export const formatCurrency = (amount, showSign = false) => {
  const abs = Math.abs(amount);

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: abs % 1 === 0 ? 0 : 2,
  }).format(abs);

  if (showSign && amount > 0) return `+${formatted}`;
  if (showSign && amount < 0) return `-${formatted}`;
  return formatted;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

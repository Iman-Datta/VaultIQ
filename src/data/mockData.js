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

// export const mockTransactions = [
//   // March 2024
//   {
//     id: "1",
//     timestamp: "2024-03-15T09:00:00",
//     description: "Salary Deposit",
//     category: "Salary",
//     amount: 5200,
//     type: "income",
//   },
//   {
//     id: "2",
//     timestamp: "2024-03-15T13:20:00",
//     description: "Lunch at Cafe",
//     category: "Food",
//     amount: -18.5,
//     type: "expense",
//   },
//   {
//     id: "3",
//     timestamp: "2024-03-15T19:45:00",
//     description: "Uber Ride",
//     category: "Travel",
//     amount: -12.75,
//     type: "expense",
//   },
//   {
//     id: "4",
//     timestamp: "2024-03-14T10:15:00",
//     description: "Grocery Store",
//     category: "Food",
//     amount: -85.5,
//     type: "expense",
//   },
//   {
//     id: "5",
//     timestamp: "2024-03-13T08:30:00",
//     description: "Netflix Subscription",
//     category: "Entertainment",
//     amount: -15.99,
//     type: "expense",
//   },
//   {
//     id: "6",
//     timestamp: "2024-03-12T07:00:00",
//     description: "Rent Payment",
//     category: "Rent",
//     amount: -1200,
//     type: "expense",
//   },
//   {
//     id: "7",
//     timestamp: "2024-03-11T16:30:00",
//     description: "Freelance Project",
//     category: "Freelance",
//     amount: 800,
//     type: "income",
//   },

//   // February 2024
//   {
//     id: "8",
//     timestamp: "2024-02-28T09:00:00",
//     description: "Salary Deposit",
//     category: "Salary",
//     amount: 5200,
//     type: "income",
//   },
//   {
//     id: "9",
//     timestamp: "2024-02-26T20:15:00",
//     description: "Restaurant Dinner",
//     category: "Food",
//     amount: -45,
//     type: "expense",
//   },
//   {
//     id: "10",
//     timestamp: "2024-02-25T14:00:00",
//     description: "Amazon Purchase",
//     category: "Shopping",
//     amount: -67.4,
//     type: "expense",
//   },
//   {
//     id: "11",
//     timestamp: "2024-02-22T11:30:00",
//     description: "Electric Bill",
//     category: "Bills",
//     amount: -120,
//     type: "expense",
//   },
//   {
//     id: "12",
//     timestamp: "2024-02-20T17:45:00",
//     description: "Consulting Fee",
//     category: "Freelance",
//     amount: 1150,
//     type: "income",
//   },

//   // January 2024
//   {
//     id: "13",
//     timestamp: "2024-01-31T09:00:00",
//     description: "Salary Deposit",
//     category: "Salary",
//     amount: 5000,
//     type: "income",
//   },
//   {
//     id: "14",
//     timestamp: "2024-01-28T18:10:00",
//     description: "Flight Tickets",
//     category: "Travel",
//     amount: -380,
//     type: "expense",
//   },
//   {
//     id: "15",
//     timestamp: "2024-01-25T09:30:00",
//     description: "Gym Membership",
//     category: "Bills",
//     amount: -45,
//     type: "expense",
//   },
//   {
//     id: "16",
//     timestamp: "2024-01-20T10:00:00",
//     description: "Side Project Payment",
//     category: "Freelance",
//     amount: 500,
//     type: "income",
//   },

//   // December 2023
//   {
//     id: "17",
//     timestamp: "2023-12-30T09:00:00",
//     description: "Salary Deposit",
//     category: "Salary",
//     amount: 4800,
//     type: "income",
//   },
//   {
//     id: "18",
//     timestamp: "2023-12-24T21:00:00",
//     description: "Christmas Shopping",
//     category: "Shopping",
//     amount: -220,
//     type: "expense",
//   },
//   {
//     id: "19",
//     timestamp: "2023-12-18T13:00:00",
//     description: "Internet Bill",
//     category: "Bills",
//     amount: -60,
//     type: "expense",
//   },

//   // November 2023
//   {
//     id: "20",
//     timestamp: "2023-11-30T09:00:00",
//     description: "Salary Deposit",
//     category: "Salary",
//     amount: 4700,
//     type: "income",
//   },
//   {
//     id: "21",
//     timestamp: "2023-11-26T20:00:00",
//     description: "Movie Night",
//     category: "Entertainment",
//     amount: -25,
//     type: "expense",
//   },

//   // October 2023
//   {
//     id: "22",
//     timestamp: "2023-10-31T09:00:00",
//     description: "Salary Deposit",
//     category: "Salary",
//     amount: 4600,
//     type: "income",
//   },
//   {
//     id: "23",
//     timestamp: "2023-10-21T18:30:00",
//     description: "Weekend Trip",
//     category: "Travel",
//     amount: -300,
//     type: "expense",
//   },
// ];

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

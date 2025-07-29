import { useState, useEffect } from "react";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []); // [] = run once on component load

  return (
    <div className="card">
      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="transaction-list">
          {transactions.map((tx) => (
            <li key={tx.id} className={`transaction ${tx.type}`}>
              <div>
                <strong>{tx.title}</strong> - {tx.category}
              </div>
              <div>
                {tx.type === "expense" ? "-" : "+"}${Math.abs(tx.amount)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransactionList;
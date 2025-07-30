import Header from './components/Header';
import AddTransactionForm from './components/AddTransactionForm';
import TransactionList from './components/TransactionList';
import BudgetForm from "./components/BudgetForm";
import './index.css';

import { useState, useEffect } from "react";

function App() {
  const [showBudgetForm, setShowBudgetForm] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="App">
      <Header />

      {showBudgetForm ? (
        <BudgetForm />
      ) : (
        <button onClick={() => setShowBudgetForm(true)}>
          Edit Budget
        </button>
      )}

      <AddTransactionForm onAdd={fetchTransactions} />
      <TransactionList transactions={transactions} />
    </div>
  );
}

export default App;
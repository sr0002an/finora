import Header from './components/Header';
import AddTransactionForm from './components/AddTransactionForm';
import TransactionList from './components/TransactionList';
import BudgetForm from "./components/BudgetForm";
import './index.css';

import { useState } from "react";

function App() {
  const [showBudgetForm, setShowBudgetForm] = useState(true);

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

      <AddTransactionForm />
      <TransactionList />
    </div>
  );
}

export default App;
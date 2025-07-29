import { useState } from "react";

function AddTransactionForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = {
      title,
      amount: parseFloat(amount),
      type,
      category,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) throw new Error("Failed to add transaction");

      const result = await response.json();
      console.log("Transaction added:", result);

      // Clear form
      setTitle("");
      setAmount("");
      setType("expense");
      setCategory("");

      if (onAdd) onAdd();

    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    
    
    <div className="card">
      <h2>Add Transaction</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount (SGD)"
          className="input-field"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className="input-field"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Category"
          className="input-field"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit" className="btn-submit">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;
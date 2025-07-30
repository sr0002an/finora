import { useState } from "react";

function AddTransactionForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const expenseCategories = [
    "Food", "Transport", "Groceries", "Utilities", "Rent", "Shopping",
    "Subscriptions", "Entertainment", "Health", "Education", "Travel", "Donations", "Others"
  ];

  const incomeCategories = [
    "Salary", "Bonus", "Investment Returns", "Freelance", "Reimbursements", "Gifts", "Others"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("amount", parseFloat(amount).toString());
    formData.append("type", type);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/transactions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add transaction");

      const result = await response.json();
      console.log("Transaction added:", result);

      // Clear form
      setTitle("");
      setAmount("");
      setType("expense");
      setCategory("");
      setImage(null);

      if (onAdd) onAdd();

    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    
    
    <div className="card">
      <h2>Add Transaction</h2>
      <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
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
        <div style={{ display: "flex", marginBottom: "1rem" }}>
          {["income", "expense"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              style={{
                flex: 1,
                padding: "0.5rem",
                marginRight: t === "income" ? "0.5rem" : "0",
                backgroundColor: type === t ? "#0077ff" : "#f0f0f0",
                color: type === t ? "#fff" : "#333",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer"
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <select
          className="input-field"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {(type === "income" ? incomeCategories : expenseCategories).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="input-field"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit" className="btn-submit">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;
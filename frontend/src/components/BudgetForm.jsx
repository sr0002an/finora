import { useState, useEffect } from "react";

function BudgetForm() {
  const [income, setIncome] = useState("");
  const [needs, setNeeds] = useState(0);
  const [wants, setWants] = useState(0);
  const [savings, setSavings] = useState(0);

  // Auto calculate 50/30/20 when income changes
  useEffect(() => {
    const incomeFloat = parseFloat(income);
    if (!isNaN(incomeFloat)) {
      setNeeds((incomeFloat * 0.5).toFixed(2));
      setWants((incomeFloat * 0.3).toFixed(2));
      setSavings((incomeFloat * 0.2).toFixed(2));
    }
  }, [income]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      income: parseFloat(income),
      needs: parseFloat(needs),
      wants: parseFloat(wants),
      savings: parseFloat(savings),
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8000/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Budget saved:", data);
        alert("Budget saved successfully!");
      } else {
        console.error("❌ Server error:", response.statusText);
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Failed to reach backend.");
    }
  };

  return (
    <div className="card">
      <h2>Set Your Monthly Budget</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="Monthly Income (SGD)"
          className="input-field"
        />

        <label>Needs (50%)</label>
        <input
          type="number"
          value={needs}
          onChange={(e) => setNeeds(e.target.value)}
          className="input-field"
        />

        <label>Wants (30%)</label>
        <input
          type="number"
          value={wants}
          onChange={(e) => setWants(e.target.value)}
          className="input-field"
        />

        <label>Savings/Investing (20%)</label>
        <input
          type="number"
          value={savings}
          onChange={(e) => setSavings(e.target.value)}
          className="input-field"
        />

        <button type="submit" className="btn-submit">Save Budget</button>
      </form>
    </div>
  );
}

export default BudgetForm;
import { useState, useEffect } from "react";

function TransactionList({ refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [spendingSummary, setSpendingSummary] = useState({
    needs: 0,
    wants: 0,
    savings: 0
  });
  const [expandedBucket, setExpandedBucket] = useState(null); // NEW: track expanded section
  const [expandedCategory, setExpandedCategory] = useState(null); // NEW: track expanded category
  const [filterType, setFilterType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/transactions");
        const data = await response.json();
        const monthList = Array.from(
          new Set(data
            .filter(tx => tx.created_at)
            .map(tx => new Date(tx.created_at).toLocaleString('default', { month: 'long', year: 'numeric' }))
          )
        );
        setAvailableMonths(monthList);

        let filtered = filterType === "all" ? data : data.filter(tx => tx.type === filterType);

        if (selectedMonth !== "all") {
          filtered = filtered.filter(tx => {
            const txMonth = new Date(tx.created_at).toLocaleString('default', { month: 'long', year: 'numeric' });
            return txMonth === selectedMonth;
          });
        }

        setTransactions(filtered);
        const summary = groupSpendingByBucket(filtered);
        setSpendingSummary(summary);
        console.log("\ud83d\udcb8 Spending by bucket:", summary);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [refreshTrigger, filterType, selectedMonth]);

  const groupSpendingByBucket = (transactions) => {
    const categoryMap = {
      needs: ["food", "transport", "housing", "bills"],
      wants: ["entertainment", "subscriptions", "shopping"],
      savings: ["investments"]
    };

    const totals = {
      needs: 0,
      wants: 0,
      savings: 0
    };

    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        const cat = tx.category.toLowerCase();

        if (categoryMap.needs.includes(cat.toLowerCase())) {
          totals.needs += tx.amount;
        } else if (categoryMap.wants.includes(cat.toLowerCase())) {
          totals.wants += tx.amount;
        } else if (categoryMap.savings.includes(cat.toLowerCase())) {
          totals.savings += tx.amount;
        }
      }
    });

    return totals;
  };

  const getSubcategoryBreakdown = (bucket) => {
    const categoryMap = {
      needs: ["food", "transport", "housing", "bills"],
      wants: ["entertainment", "subscriptions", "shopping"],
      savings: ["investments"]
    };

    const subTotals = {};

    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        const cat = tx.category.toLowerCase();
        if (categoryMap[bucket].includes(cat.toLowerCase())) {
          subTotals[cat] = (subTotals[cat] || 0) + tx.amount;
        }
      }
    });

    return subTotals;
  };

  return (
    <div className="card">
      <h2>Transaction History</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="typeFilter" style={{ marginRight: "0.5rem" }}>Filter by type:</label>
        <select
          id="typeFilter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="monthFilter" style={{ marginRight: "0.5rem" }}>Filter by month:</label>
        <select
          id="monthFilter"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="all">All</option>
          {availableMonths.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <div className="summary" style={{ marginBottom: "1.5rem" }}>
        {Object.entries(spendingSummary).map(([bucket, total]) => (
          <div
            key={bucket}
            style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              background: "#f9f9f9",
              boxShadow: "4px 4px 10px #d0d0d0, -4px -4px 10px #ffffff",
              transition: "all 0.3s ease"
            }}
          >
            <p
              style={{
                cursor: "pointer",
                margin: 0,
                fontWeight: "600",
                fontSize: "1.05rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color:
                  bucket === "needs"
                    ? "crimson"
                    : bucket === "wants"
                    ? "#e67e22"
                    : "green"
              }}
              onClick={() =>
                setExpandedBucket(expandedBucket === bucket ? null : bucket)
              }
            >
              {bucket.charAt(0).toUpperCase() + bucket.slice(1)}: ${total.toFixed(2)}{" "}
              {expandedBucket === bucket ? "▼" : "▶"}
            </p>
            {expandedBucket === bucket && (
              <>
                <ul style={{ marginTop: "0.25rem", paddingLeft: "1.2rem" }}>
                  {Object.entries(getSubcategoryBreakdown(bucket)).map(([cat, amt]) => (
                    <li key={cat} style={{ fontSize: "0.9rem", cursor: "pointer" }}>
                      <div
                        style={{
                          backgroundColor: "#fff",
                          marginTop: "0.4rem",
                          padding: "0.4rem 0.75rem",
                          borderRadius: "8px",
                          boxShadow: "inset 2px 2px 6px #dcdcdc, inset -2px -2px 6px #ffffff",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          cursor: "pointer"
                        }}
                        onClick={() =>
                          setExpandedCategory(expandedCategory === cat ? null : cat)
                        }
                      >
                        <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}: ${amt.toFixed(2)}</span>
                        <span>{expandedCategory === cat ? "▼" : "▶"}</span>
                      </div>

                      {expandedCategory === cat && (
                        <ul style={{ paddingLeft: "1.5rem", marginTop: "0.25rem" }}>
                          {transactions
                            .filter(
                              (tx) =>
                                tx.type === "expense" &&
                                tx.category.toLowerCase() === cat
                            )
                            .map((tx) => (
                              <li key={tx.id} style={{ fontSize: "0.85rem" }}>
                                {tx.title} – ${Math.abs(tx.amount)} ({tx.category})
                                {tx.image_url && (
                                  <img
                                    src={`http://127.0.0.1:8000/static/${tx.image_url}`}
                                    alt="receipt"
                                    style={{
                                      width: "100px",
                                      marginTop: "0.25rem",
                                      borderRadius: "6px"
                                    }}
                                  />
                                )}
                              </li>
                            ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;
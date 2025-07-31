import React, { useEffect, useState } from 'react';
import SummaryCard from '../components/SummaryCard';
import BudgetPieChart from '../components/BudgetPieChart';
import SpendingPieChart from '../components/SpendingPieChart';

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [budget, setBudget] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/transactions');
        const data = await res.json();
        setTransactions(data);

        let incomeSum = 0;
        let expenseSum = 0;
        const categoryTotals = {};

        data.forEach((tx) => {
          if (tx.type === 'income') incomeSum += tx.amount;
          if (tx.type === 'expense') {
            expenseSum += tx.amount;
            categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
          }
        });

        setIncome(incomeSum);
        setExpense(expenseSum);

        const breakdown = Object.entries(categoryTotals).map(([name, value]) => ({
          name,
          value,
        }));
        setCategoryBreakdown(breakdown);

      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    const fetchBudget = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/budget');
        const data = await res.json();
        setBudget(data);
      } catch (err) {
        console.error('Error fetching budget:', err);
      }
    };

    fetchTransactions();
    fetchBudget();
  }, []);

  return (
    <div className="main-content">
      {budget && (
        <>
          <SummaryCard income={income} expense={expense} budget={budget} />
          <div style={{ marginTop: '2rem' }}>
            <BudgetPieChart budget={budget} />
          </div>
        </>
      )}

      {categoryBreakdown.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <SpendingPieChart data={categoryBreakdown} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
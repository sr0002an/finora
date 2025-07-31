import React from 'react';
import './SummaryCard.css';

const SummaryCard = ({ income = 0, expense = 0, budget }) => {
    const balance = income - expense;
  
    return (
      <div className="summary-card">
        <h2>Financial Summary</h2>
        <div className="summary-stats">
          <div className="stat income">
            <h3>Income</h3>
            <p>${income.toFixed(2)}</p>
          </div>
          <div className="stat expense">
            <h3>Expense</h3>
            <p>${expense.toFixed(2)}</p>
          </div>
          <div className="stat balance">
            <h3>Balance</h3>
            <p>${balance.toFixed(2)}</p>
          </div>
        </div>
  
        {budget && (
  <div className="budget-info">
    <h4>Monthly Budget</h4>
    <p>Total: ${budget.needs + budget.wants + budget.savings}</p>
    <p>
      Needs: ${budget.needs} | Wants: ${budget.wants} | Savings: ${budget.savings}
    </p>
  </div>
)}
  
        <div className="chart-placeholder">
          <p>📊 Graphs will appear once you’ve added enough transactions.</p>
        </div>
      </div>
    );
  };

export default SummaryCard;
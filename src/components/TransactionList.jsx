function TransactionList() {
  return (
    <div className="transaction-list">
      <h2 className="transaction-title">Transactions</h2>
      <ul className="transaction-items">
        <li className="transaction-item expense">
          <span role="img" aria-label="expense">💸</span> Bought groceries - $60 SGD
        </li>
        <li className="transaction-item income">
          <span role="img" aria-label="income">💰</span> Salary - $5500 SGD
        </li>
      </ul>
    </div>
  );
}

export default TransactionList;
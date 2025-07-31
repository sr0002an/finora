import React from 'react';
import TransactionList from '../components/TransactionList';

function HistoryPage() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Transaction History</h2>
      <TransactionList />
    </div>
  );
}

export default HistoryPage;
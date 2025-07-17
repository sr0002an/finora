import Header from './components/Header';
import AddTransactionForm from './components/AddTransactionForm';
import TransactionList from './components/TransactionList';
import './index.css';


function App() {
  return (
    <div className="App">
      <Header />
      <AddTransactionForm />
      <TransactionList />
    </div>
  );
}

export default App;
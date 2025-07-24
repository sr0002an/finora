const handleSubmit = (e) => {
    e.preventDefault(); // ⛔ STOP default form reload
    console.log("Form submitted!");
    // future: add transaction to state here
  };
  
function AddTransactionForm() {
  return (
    <div className="card">
      <h2>Add Transaction</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Description" className="input-field" />
        <input type="number" placeholder="Amount (SGD)" className="input-field" />
        <select className="input-field">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit" className="btn-submit">Add</button>
      </form>
    </div>
  );
}

export default AddTransactionForm;